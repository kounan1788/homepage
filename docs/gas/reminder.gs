/**
 * 車検満了日リマインダー（Google Apps Script）
 *
 * 役割:
 *   - doPost(e) ................ サイトの登録フォームから届いた満了日をスプレッドシートに保存する
 *   - dailyCheck() ............. 毎朝9時（JST）に実行し、通知予定日が今日の方へLINEを送る
 *   - monthlyUsageReport() ..... 月初に実行し、前月のLINE送信件数を店舗へ報告する
 *
 * 置き場所: このファイルの中身をGASエディタに貼り付けて使う。
 * スプレッドシートには "registrations" シートが自動で作られる。
 */

/**
 * true の間は、お客様へLINEを送らない。
 * 代わりに「本日の送信対象一覧」を OWNER_EMAIL へ1通だけ送る。
 * 動作確認が済んだら false に変更すること。
 */
const DRY_RUN = true;

// ───────────────────────────────────────────────
// 設定（GASエディタで自分の値に書き換える）
// ───────────────────────────────────────────────

/** Messaging APIチャネルの「チャネルアクセストークン（長期）」 */
const LINE_CHANNEL_ACCESS_TOKEN = '';

/** 登録を書き込むスプレッドシートのID（URLの /d/ と /edit の間） */
const SPREADSHEET_ID = '';

/** 失敗通知・使用量レポートの送信先（店舗の管理用アドレス） */
const OWNER_EMAIL = 'kounan.lease@gmail.com';

/** Vercelの環境変数 GAS_SHARED_SECRET と同じ値にする */
const SHARED_SECRET = '';

// ───────────────────────────────────────────────
// 固定値
// ───────────────────────────────────────────────

const SHEET_NAME = 'registrations';

/** 満了日の何日前に通知するか（2ヶ月前＝60日前） */
const NOTICE_DAYS_BEFORE = 60;

const TIME_ZONE = 'Asia/Tokyo';

/** 列の順番（1始まり）。シートの見出しと必ず対応させること */
const COL = {
    registeredAt: 1, // 登録日時
    expiryDate: 2, // 満了日
    name: 3, // 氏名
    userId: 4, // LINE userId
    carModel: 5, // 車種
    plate: 6, // ナンバー下4桁
    source: 7, // 流入元
    noticeDate: 8, // 通知予定日（満了日の60日前）
    sentAt: 9, // 送信済み
    result: 10, // 送信結果
    note: 11, // 備考
};

const HEADERS = [
    '登録日時',
    '満了日',
    '氏名',
    'LINE userId',
    '車種',
    'ナンバー下4桁',
    '流入元',
    '通知予定日',
    '送信済み',
    '送信結果',
    '備考',
];

/** 送信に失敗した行の「送信済み」列に入れる印。空にすると毎日再送してしまう */
const SENT_FAILED = '失敗';

/**
 * LINEのユーザーIDの形式。
 * サイト側で検証済みの値しか届かない想定だが、
 * 壊れた値がシートに入ると通知が静かに失敗するため、ここでも必ず確認する
 */
const LINE_USER_ID_PATTERN = /^U[0-9a-f]{32}$/;

const LINE_PUSH_ENDPOINT = 'https://api.line.me/v2/bot/message/push';

// ───────────────────────────────────────────────
// (a) 登録の受け口
// ───────────────────────────────────────────────

/**
 * サイトのServer Actionから呼ばれる。
 * secret が一致しない要求は何も書き込まずに拒否する。
 *
 * 同じ userId の行が既にあれば、追記せずにその行を更新する（重複通知の防止）。
 *
 * 届く userId は、サイト側（app/actions/registerShakenReminder.ts）が
 * LINEのIDトークンを https://api.line.me/oauth2/v2.1/verify で検証して得た sub。
 * ブラウザが名乗った値ではないので、本人のものであることが保証されている。
 *
 * このウェブアプリのURLを知っている人は誰でもPOSTできるため、本人性は secret が支えている。
 * secret を他人に渡したり、URLを公開の場に書いたりしないこと
 * （漏れると、他人の登録行を上書きして通知を止められてしまう）。
 */
function doPost(e) {
    try {
        const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

        if (body.secret !== SHARED_SECRET) {
            return jsonOutput_({ ok: false, error: 'forbidden' });
        }

        const userId = String(body.userId || '').trim();
        if (!LINE_USER_ID_PATTERN.test(userId)) {
            return jsonOutput_({ ok: false, error: 'invalid userId' });
        }

        const expiryDate = toYmd_(body.expiryDate);
        if (!expiryDate) {
            return jsonOutput_({ ok: false, error: 'invalid expiryDate' });
        }

        const name = String(body.displayName || '').trim();
        const carModel = String(body.carModel || '').trim();
        const plate = String(body.plateLast4 || '').trim();
        const source = String(body.source || '').trim();
        const noticeDate = addDays_(expiryDate, -NOTICE_DAYS_BEFORE);

        // 同じお客様が同時に2回送った場合に、行が二重に増えないよう直列化する
        const lock = LockService.getScriptLock();
        lock.waitLock(20 * 1000);
        try {
            const sheet = getSheet_();
            const existingRow = findRowByUserId_(sheet, userId);

            if (existingRow > 0) {
                const previousExpiry = toYmd_(sheet.getRange(existingRow, COL.expiryDate).getValue());
                const note =
                    formatDate_(new Date()) +
                    ' 再登録（前回の満了日 ' +
                    (previousExpiry || '不明') +
                    '）';

                // 1人につき1台を想定しているため、同じ userId の行は上書きする。
                // 前回の満了日は備考に残して、変更の経緯が追えるようにする
                sheet.getRange(existingRow, COL.registeredAt).setValue(new Date());
                sheet.getRange(existingRow, COL.expiryDate).setValue(expiryDate);
                sheet.getRange(existingRow, COL.name).setValue(name);
                sheet.getRange(existingRow, COL.carModel).setValue(carModel);
                sheet.getRange(existingRow, COL.plate).setValue(plate);
                sheet.getRange(existingRow, COL.source).setValue(source);
                sheet.getRange(existingRow, COL.noticeDate).setValue(noticeDate);
                // 満了日が変わったので、前回の送信状態は引き継がない
                sheet.getRange(existingRow, COL.sentAt).setValue('');
                sheet.getRange(existingRow, COL.result).setValue('');
                sheet.getRange(existingRow, COL.note).setValue(note);

                return jsonOutput_({ ok: true, updated: true });
            }

            sheet.appendRow([
                new Date(),
                expiryDate,
                name,
                userId,
                carModel,
                plate,
                source,
                noticeDate,
                '',
                '',
                '',
            ]);
            return jsonOutput_({ ok: true, updated: false });
        } finally {
            lock.releaseLock();
        }
    } catch (error) {
        console.error('doPost error: ' + error);
        return jsonOutput_({ ok: false, error: 'server error' });
    }
}

// ───────────────────────────────────────────────
// (b) 毎朝9時（JST）の通知
// ───────────────────────────────────────────────

/**
 * 通知予定日が今日で、まだ送っていない行にLINEを送る。
 * 時間主導型トリガー（日付ベースのタイマー・午前9時〜10時）で実行する。
 */
function dailyCheck() {
    const sheet = getSheet_();
    const today = formatDate_(new Date());
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
        console.log('dailyCheck: 登録がありません（' + today + '）');
        return;
    }

    const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();

    /** 送信対象。row はシート上の行番号 */
    const targets = [];
    values.forEach(function (row, index) {
        const noticeDate = toYmd_(row[COL.noticeDate - 1]);
        const sentAt = String(row[COL.sentAt - 1] || '').trim();
        // 通知予定日が今日と一致し、まだ送信していない（失敗の記録もない）行だけを拾う
        if (noticeDate === today && sentAt === '') {
            targets.push({
                row: index + 2,
                userId: String(row[COL.userId - 1] || '').trim(),
                name: String(row[COL.name - 1] || '').trim(),
                expiryDate: toYmd_(row[COL.expiryDate - 1]),
                carModel: String(row[COL.carModel - 1] || '').trim(),
                plate: String(row[COL.plate - 1] || '').trim(),
            });
        }
    });

    if (targets.length === 0) {
        console.log('dailyCheck: 本日の送信対象はありません（' + today + '）');
        return;
    }

    // 動作確認中は、お客様へは送らず対象一覧だけを店舗へ送る
    if (DRY_RUN) {
        sendDryRunReport_(today, targets);
        console.log('dailyCheck: DRY_RUN のため送信しませんでした。対象 ' + targets.length + '件（' + today + '）');
        return;
    }

    let successCount = 0;
    const failures = [];

    targets.forEach(function (target) {
        if (!LINE_USER_ID_PATTERN.test(target.userId)) {
            sheet.getRange(target.row, COL.sentAt).setValue(SENT_FAILED);
            sheet.getRange(target.row, COL.result).setValue('userIdの形式が不正');
            failures.push({ target: target, reason: 'userIdの形式が不正' });
            return;
        }

        const result = pushLineMessage_(target);

        if (result.ok) {
            sheet.getRange(target.row, COL.sentAt).setValue(new Date());
            sheet.getRange(target.row, COL.result).setValue('成功');
            successCount++;
            return;
        }

        // ブロック・友だち解除などで送れなかった場合。
        // 「送信済み」を空のままにすると毎日やり直してしまうため「失敗」と記録する
        const reason = 'HTTP ' + result.status + ' ' + result.body;
        sheet.getRange(target.row, COL.sentAt).setValue(SENT_FAILED);
        sheet.getRange(target.row, COL.result).setValue(reason);
        failures.push({ target: target, reason: reason });
    });

    // 無料プランの月間通数を管理するため、当日の件数をログに残す
    console.log(
        'dailyCheck: ' + today + ' 対象 ' + targets.length + '件／成功 ' + successCount + '件／失敗 ' + failures.length + '件'
    );

    // 失敗した方には電話でフォローする。1回の実行につきまとめて1通だけ送る（店舗向けの内部連絡）
    if (failures.length > 0) {
        sendFailureReport_(today, failures);
    }
}

/** LINEへ1通送る。送れたかどうかは必ずステータスコードで判断する */
function pushLineMessage_(target) {
    const response = UrlFetchApp.fetch(LINE_PUSH_ENDPOINT, {
        method: 'post',
        contentType: 'application/json',
        headers: { Authorization: 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN },
        payload: JSON.stringify({
            to: target.userId,
            messages: [{ type: 'text', text: buildMessage_(target) }],
        }),
        muteHttpExceptions: true,
    });

    const status = response.getResponseCode();
    return { ok: status === 200, status: status, body: response.getContentText() };
}

/**
 * お知らせの文面。テキスト1通に収める（Flex Messageは保守が難しくなるため使わない）。
 */
function buildMessage_(target) {
    const honorific = target.name ? target.name + '様' : 'お客様';
    const carLines = [];
    if (target.carModel) carLines.push('車種：' + target.carModel);
    if (target.plate) carLines.push('ナンバー：' + target.plate);

    return (
        honorific +
        '\n' +
        '港南自動車サービスです。いつもありがとうございます。\n' +
        '\n' +
        'ご登録いただいたお車の車検満了日が近づいてまいりました。\n' +
        '■ 車検満了日：' +
        formatJapaneseDate_(target.expiryDate) +
        '\n' +
        (carLines.length > 0 ? '■ ' + carLines.join('／') + '\n' : '') +
        '\n' +
        '今ご予約いただくと「早期予約割引 2,200円」が適用されます（満了日の2ヶ月前までのご予約）。\n' +
        'ご予約・ご相談は、このLINEへのご返信またはお電話で承ります。\n' +
        '\n' +
        '■ お電話\n' +
        '076-268-1788\n' +
        '平日 9:00〜18:00 ／ 土曜 9:00〜17:00\n' +
        '\n' +
        '■ 車検の料金・流れ\n' +
        'https://www.kounan-auto.jp/shaken\n' +
        '\n' +
        '※このお知らせの停止をご希望の場合は、本アカウントをブロック、または 076-268-1788 までご連絡ください。'
    );
}

/** DRY_RUN中の確認用メール。お客様には送らず、対象一覧を店舗へ1通だけ送る */
function sendDryRunReport_(today, targets) {
    const lines = targets.map(function (target) {
        return [
            '・' + (target.name || '（氏名なし）') + '様',
            '  満了日：' + formatJapaneseDate_(target.expiryDate),
            '  車種：' + (target.carModel || '未記入'),
            '  ナンバー下4桁：' + (target.plate || '未記入'),
            '  userId：' + target.userId,
        ].join('\n');
    });

    MailApp.sendEmail(
        OWNER_EMAIL,
        '【車検リマインダー／DRY_RUN】' + today + ' の送信対象 ' + targets.length + '件',
        'DRY_RUN = true のため、お客様へのLINEは送信していません。\n' +
            '以下が本日の送信対象です。内容を確認し、問題なければスクリプトの DRY_RUN を false に変更してください。\n\n' +
            lines.join('\n\n') +
            '\n\n（このメールは店舗の確認用です。お客様には送られていません）'
    );
}

/** LINEを送れなかった方の一覧。電話でフォローするための内部連絡 */
function sendFailureReport_(today, failures) {
    const lines = failures.map(function (failure) {
        const target = failure.target;
        return [
            '・' + (target.name || '（氏名なし）') + '様',
            '  満了日：' + formatJapaneseDate_(target.expiryDate),
            '  車種：' + (target.carModel || '未記入'),
            '  ナンバー下4桁：' + (target.plate || '未記入'),
            '  失敗理由：' + failure.reason,
        ].join('\n');
    });

    MailApp.sendEmail(
        OWNER_EMAIL,
        '【車検リマインダー】LINE通知できなかったお客様 ' + failures.length + '件（' + today + '）',
        '以下のお客様へLINEのお知らせを送れませんでした。\n' +
            'ブロックや友だち解除が原因のことが多いため、お電話でのフォローをお願いします。\n\n' +
            lines.join('\n\n') +
            '\n\n（このメールは店舗向けの内部連絡です。お客様には送られていません）'
    );
}

// ───────────────────────────────────────────────
// (c) 月初の使用量レポート
// ───────────────────────────────────────────────

/**
 * 前月のLINE送信件数を店舗へ報告する。
 * 無料プランの月間上限に近づいたことに気づけるようにするため。
 * 時間主導型トリガー（月ベースのタイマー・1日）で実行する。
 */
function monthlyUsageReport() {
    const sheet = getSheet_();
    const now = new Date();
    // 前月の1日0時から当月1日0時まで（JST）
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);
    const label = Utilities.formatDate(start, TIME_ZONE, 'yyyy年M月');

    let sentCount = 0;
    let failedCount = 0;

    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
        const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
        values.forEach(function (row) {
            const sentAt = row[COL.sentAt - 1];
            // 成功した行は日時が入る。失敗した行は「失敗」の文字が入るので日時の比較から外れる
            if (sentAt instanceof Date && sentAt >= start && sentAt < end) {
                sentCount++;
            } else if (String(sentAt || '').trim() === SENT_FAILED) {
                failedCount++;
            }
        });
    }

    MailApp.sendEmail(
        OWNER_EMAIL,
        '【車検リマインダー】' + label + 'のLINE送信件数 ' + sentCount + '件',
        label +
            'にお送りした車検お知らせの件数です。\n\n' +
            '■ 送信できた件数：' +
            sentCount +
            '件\n' +
            '■ 送信できなかった件数（累計）：' +
            failedCount +
            '件\n\n' +
            'LINE公式アカウントのプランには月間の無料通数の上限があります。\n' +
            '上限に近づいている場合は、LINE Official Account Managerの「利用状況」で残数をご確認ください。\n' +
            '（通数はこのスクリプトからの送信のみを数えています。手動のメッセージ配信は含みません）'
    );
}

// ───────────────────────────────────────────────
// 共通の処理
// ───────────────────────────────────────────────

/** 書き込み先のシート。無ければ見出し付きで作る */
function getSheet_() {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
        sheet.setFrozenRows(1);
    }
    return sheet;
}

/** userId が一致する行番号。見つからなければ 0 */
function findRowByUserId_(sheet, userId) {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return 0;

    const ids = sheet.getRange(2, COL.userId, lastRow - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === userId) return i + 2;
    }
    return 0;
}

/**
 * 日付を yyyy-MM-dd（JST）にする。
 * タイムゾーンのずれで通知日を取りこぼさないよう、日付の比較は必ずこの形式で行う
 */
function formatDate_(date) {
    return Utilities.formatDate(date, TIME_ZONE, 'yyyy-MM-dd');
}

/**
 * セルの値を yyyy-MM-dd にそろえる。
 * シートが日付として解釈した場合（Date）と、文字列のまま入っている場合の両方に備える。
 * 日付として読めなければ '' を返す
 */
function toYmd_(value) {
    if (value instanceof Date) return formatDate_(value);

    const text = String(value || '').trim();
    const matched = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!matched) return '';

    // 2026-02-30 のような実在しない日付を弾く
    const date = new Date(Number(matched[1]), Number(matched[2]) - 1, Number(matched[3]));
    if (
        date.getFullYear() !== Number(matched[1]) ||
        date.getMonth() !== Number(matched[2]) - 1 ||
        date.getDate() !== Number(matched[3])
    ) {
        return '';
    }
    return matched[0];
}

/** yyyy-MM-dd に日数を足した yyyy-MM-dd を返す */
function addDays_(ymd, days) {
    const parts = ymd.split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    date.setDate(date.getDate() + days);
    return formatDate_(date);
}

/** yyyy-MM-dd を「2027年1月15日」の形にする（お客様向けの文面用） */
function formatJapaneseDate_(ymd) {
    const parts = String(ymd || '').split('-');
    if (parts.length !== 3) return String(ymd || '');
    return Number(parts[0]) + '年' + Number(parts[1]) + '月' + Number(parts[2]) + '日';
}

/** doPost の戻り値 */
function jsonOutput_(payload) {
    return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
        ContentService.MimeType.JSON
    );
}
