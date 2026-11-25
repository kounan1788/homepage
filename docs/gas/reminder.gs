/**
 * 車検満了日リマインダー（Google Apps Script）
 *
 * 役割:
 *   - doPost(e) ................ サイトの登録フォームから届いた満了日をスプレッドシートに保存する
 *   - dailyCheck() ............. 毎朝9時（JST）に実行し、通知予定日が今日の方へLINEを送る
 *   - monthlyUsageReport() ..... 月初に実行し、前月のLINE送信件数を店舗へ報告する
 *   - bookingDailyCheck() ...... 毎日17時（JST）に実行し、確定日が明日の車検予約へ前日のお知らせを送る
 *   - （doPost の type: 'booking'）車検予約の申込を "bookings" シートに保存し、店舗へメールする
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

/**
 * true の間は、車検予約の前日のお知らせをお客様へ送らない。
 * 代わりに「本日の送信対象一覧」を OWNER_EMAIL へ1通だけ送る。
 * リマインダーの DRY_RUN とは別に切り替えられる（リマインダーを止めずに予約側を試せる）。
 * 動作確認が済んだら false に変更すること。
 */
const BOOKING_DRY_RUN = true;

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
    noticeDate: 8, // 通知予定日（満了日の60日前）。送信に成功したら次回の日付へ進める
    lastSentAt: 9, // 最終通知日時
    result: 10, // 送信結果
    note: 11, // 備考
    intervalYears: 12, // 次回間隔（年）
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
    '最終通知日時',
    '送信結果',
    '備考',
    '次回間隔（年）',
];

/**
 * 「次回間隔（年）」が空欄のときに使う年数。
 * 自家用乗用車の2回目以降の車検が2年ごとのため
 */
const DEFAULT_INTERVAL_YEARS = 2;

/** 「次回間隔（年）」に入力してよい範囲。打ち間違いで遠い未来へ飛ばさないための歯止め */
const MIN_INTERVAL_YEARS = 1;
const MAX_INTERVAL_YEARS = 3;

/**
 * LINEのユーザーIDの形式。
 * サイト側で検証済みの値しか届かない想定だが、
 * 壊れた値がシートに入ると通知が静かに失敗するため、ここでも必ず確認する
 */
const LINE_USER_ID_PATTERN = /^U[0-9a-f]{32}$/;

const LINE_PUSH_ENDPOINT = 'https://api.line.me/v2/bot/message/push';

/** 車検予約の申込を書き込むシート */
const BOOKING_SHEET_NAME = 'bookings';

/** bookings シートの列の順番（1始まり）。BOOKING_HEADERS と必ず対応させること */
const BOOKING_COL = {
    receivedAt: 1, // 受付日時
    bookingNumber: 2, // 受付番号
    firstChoice: 3, // 第1希望
    secondChoice: 4, // 第2希望
    name: 5, // 氏名
    userId: 6, // LINE userId
    carModel: 7, // 車種
    plate: 8, // ナンバー下4桁
    note: 9, // ご連絡事項
    confirmedDate: 10, // 確定日（スタッフ入力）
    visitTime: 11, // 来店時刻（スタッフ入力・任意）
    remindedAt: 12, // 前日通知日時
    remindedDate: 13, // 通知した確定日（同じ確定日に二度送らないための印）
    result: 14, // 送信結果
    memo: 15, // 備考
};

const BOOKING_HEADERS = [
    '受付日時',
    '受付番号',
    '第1希望',
    '第2希望',
    '氏名',
    'LINE userId',
    '車種',
    'ナンバー下4桁',
    'ご連絡事項',
    '確定日',
    '来店時刻',
    '前日通知日時',
    '通知した確定日',
    '送信結果',
    '備考',
];

/** 受付番号の通し番号を保存するスクリプトプロパティの名前 */
const BOOKING_SEQ_KEY = 'BOOKING_SEQ';

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

        // 車検予約の申込（type の無い本文は、今まで通りリマインダーの登録として扱う）
        if (body.type === 'booking') return handleBookingPost_(body);

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
                sheet.getRange(existingRow, COL.lastSentAt).setValue('');
                sheet.getRange(existingRow, COL.result).setValue('');
                sheet.getRange(existingRow, COL.note).setValue(note);
                // 「次回間隔（年）」は店舗が手で入れる値なので、再登録でも消さない

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
 * 通知予定日が今日の行にLINEを送る。
 * 時間主導型トリガー（日付ベースのタイマー・午前9時〜10時）で実行する。
 *
 * 送信に成功したら、その場で満了日と通知予定日を次回の車検ぶんだけ進める。
 * こうすることで、1回登録していただければ毎回の車検で通知が届く。
 * 「同じ日に二度送らない」は、最終通知日時が今日かどうかで判定している
 * （手動で再実行しても二重送信にならない）。
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
        const lastSentAt = row[COL.lastSentAt - 1];
        // 今日すでに送っている行は飛ばす（手動で再実行したときの二重送信を防ぐ）
        const sentToday = lastSentAt instanceof Date && formatDate_(lastSentAt) === today;

        if (noticeDate === today && !sentToday) {
            targets.push({
                row: index + 2,
                userId: String(row[COL.userId - 1] || '').trim(),
                name: String(row[COL.name - 1] || '').trim(),
                expiryDate: toYmd_(row[COL.expiryDate - 1]),
                carModel: String(row[COL.carModel - 1] || '').trim(),
                plate: String(row[COL.plate - 1] || '').trim(),
                intervalYears: parseIntervalYears_(row[COL.intervalYears - 1]),
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
            stopNotifying_(sheet, target, 'userIdの形式が不正');
            failures.push({ target: target, reason: 'userIdの形式が不正' });
            return;
        }

        const result = pushLineMessage_(target);

        if (result.ok) {
            scheduleNextNotice_(sheet, target, today);
            successCount++;
            return;
        }

        // ブロック・友だち解除などで送れなかった場合。
        // 通知予定日を空にして、翌日以降に同じ行を拾わないようにする
        const reason = 'HTTP ' + result.status + ' ' + result.body;
        stopNotifying_(sheet, target, reason);
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

/**
 * 送信できた行を、次回の車検ぶんだけ先へ進める。
 *
 * 次の満了日は「今の満了日＋次回間隔」で置く。
 * 車検は満了日の1ヶ月前（指定工場は45日前）から受ければ満了日が据え置きで延びるため、
 * この計算で実際の満了日と一致することがほとんど。
 * ずれた場合は、お客様が登録し直すか、店舗が満了日と通知予定日を手で直せばよい。
 */
function scheduleNextNotice_(sheet, target, today) {
    const nextExpiry = addYears_(target.expiryDate, target.intervalYears);
    const nextNotice = addDays_(nextExpiry, -NOTICE_DAYS_BEFORE);

    sheet.getRange(target.row, COL.expiryDate).setValue(nextExpiry);
    sheet.getRange(target.row, COL.noticeDate).setValue(nextNotice);
    sheet.getRange(target.row, COL.lastSentAt).setValue(new Date());
    sheet.getRange(target.row, COL.result).setValue('成功');
    sheet.getRange(target.row, COL.note).setValue(
        today +
            ' 通知しました（満了日 ' +
            target.expiryDate +
            '）。次回の満了日を ' +
            nextExpiry +
            ' と仮置きしています。実際の満了日が違う場合はB列を直してください'
    );
}

/**
 * 送れなかった行の通知を止める。
 * 通知予定日を空にするので、翌日以降に拾われることはない。
 * 店舗にはこの後まとめてメールで知らせ、電話でフォローしていただく。
 * 再開したい場合は、通知予定日に日付を入れ直せばよい。
 */
function stopNotifying_(sheet, target, reason) {
    sheet.getRange(target.row, COL.noticeDate).setValue('');
    sheet.getRange(target.row, COL.result).setValue(reason);
    sheet.getRange(target.row, COL.note).setValue(
        formatDate_(new Date()) + ' 送信できなかったため通知を停止しました。電話でのフォローが必要です'
    );
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
    let stoppedCount = 0;

    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
        const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
        values.forEach(function (row) {
            const lastSentAt = row[COL.lastSentAt - 1];
            // 通知は1人あたり1〜3年に1回なので、最終通知日時だけで前月分を正しく数えられる
            if (lastSentAt instanceof Date && lastSentAt >= start && lastSentAt < end) {
                sentCount++;
            }
            // 送信できずに止まったままの行（通知予定日が空）は、電話フォローの積み残し
            if (toYmd_(row[COL.noticeDate - 1]) === '' && String(row[COL.result - 1] || '').trim() !== '') {
                stoppedCount++;
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
            '■ 送信できずに止まっている行（累計）：' +
            stoppedCount +
            '件\n' +
            '■ 車検予約の前日のお知らせ：' +
            countBookingRemindersBetween_(start, end) +
            '件\n\n' +
            'LINE公式アカウントのプランには月間の無料通数の上限があります。\n' +
            '上限に近づいている場合は、LINE Official Account Managerの「利用状況」で残数をご確認ください。\n' +
            '（通数はこのスクリプトからの送信のみを数えています。手動のメッセージ配信は含みません）'
    );
}

// ───────────────────────────────────────────────
// (d) 車検のLINE予約
// ───────────────────────────────────────────────

/**
 * 予約申込の受け口（doPost から type: 'booking' のときに呼ばれる）。
 * bookings シートに1行追加し、受付番号を返す。そのあとで店舗へメールで知らせる。
 *
 * 届く userId は、サイト側（app/actions/requestShakenBooking.ts）が
 * LINEのIDトークンを検証して得た sub。希望日もサイト側で受け入れ状況と照らし済み。
 * リマインダーと違い、同じお客様の申込でも上書きせず毎回追加する（複数台・日程の出し直しがあるため）。
 */
function handleBookingPost_(body) {
    const userId = String(body.userId || '').trim();
    if (!LINE_USER_ID_PATTERN.test(userId)) {
        return jsonOutput_({ ok: false, error: 'invalid userId' });
    }

    const firstChoice = toYmd_(body.firstChoice);
    if (!firstChoice) {
        return jsonOutput_({ ok: false, error: 'invalid firstChoice' });
    }
    const secondChoice = toYmd_(body.secondChoice);

    const booking = {
        firstChoice: firstChoice,
        secondChoice: secondChoice,
        name: String(body.displayName || '').trim(),
        carModel: String(body.carModel || '').trim(),
        plate: String(body.plateLast4 || '').trim(),
        note: String(body.note || '').trim(),
    };

    // 同時に申込が来ても受付番号が重ならないよう、採番と書き込みを直列化する
    const lock = LockService.getScriptLock();
    lock.waitLock(20 * 1000);
    try {
        booking.bookingNumber = nextBookingNumber_();
        getBookingSheet_().appendRow([
            new Date(),
            booking.bookingNumber,
            booking.firstChoice,
            booking.secondChoice,
            safeCell_(booking.name),
            userId,
            safeCell_(booking.carModel),
            booking.plate,
            safeCell_(booking.note),
            '',
            '',
            '',
            '',
            '',
            '',
        ]);
    } finally {
        lock.releaseLock();
    }

    // シートには残っているので、メールが送れなくても申込自体は成功として返す
    try {
        sendBookingRequestMail_(booking);
    } catch (error) {
        console.error('handleBookingPost_: メール送信に失敗 ' + booking.bookingNumber + ' ' + error);
    }

    return jsonOutput_({ ok: true, bookingNumber: booking.bookingNumber });
}

/**
 * 次の受付番号（B-0001 の形）。ロックの内側で呼ぶこと。
 * 行数ではなくスクリプトプロパティの通し番号で数えるので、行を消しても番号は重ならない。
 */
function nextBookingNumber_() {
    const properties = PropertiesService.getScriptProperties();
    const next = (Number(properties.getProperty(BOOKING_SEQ_KEY)) || 0) + 1;
    properties.setProperty(BOOKING_SEQ_KEY, String(next));
    return 'B-' + ('000' + next).slice(-Math.max(4, String(next).length));
}

/**
 * お客様が入力した文字をそのままセルに入れると、= や + で始まる値が数式として扱われてしまう。
 * 先頭にアポストロフィを付けて、必ず文字列として保存する。
 */
function safeCell_(text) {
    return /^[=+\-@]/.test(text) ? "'" + text : text;
}

/** 申込があったことを店舗へ知らせるメール */
function sendBookingRequestMail_(booking) {
    const subject =
        '【車検予約の申込】' +
        booking.bookingNumber +
        ' ' +
        (booking.name || '（氏名なし）') +
        '様 第1希望 ' +
        formatJapaneseDateWithWeekday_(booking.firstChoice);

    const body = [
        '車検予約の申込がありました。まだ確定していません。',
        '',
        '■ 受付番号：' + booking.bookingNumber,
        '■ 第1希望：' + formatJapaneseDateWithWeekday_(booking.firstChoice),
        '■ 第2希望：' + (booking.secondChoice ? formatJapaneseDateWithWeekday_(booking.secondChoice) : 'なし'),
        '■ お名前：' + (booking.name || '未記入'),
        '■ 車種：' + (booking.carModel || '未記入'),
        '■ ナンバー下4桁：' + (booking.plate || '未記入'),
        '■ ご連絡事項：' + (booking.note || 'なし'),
        '',
        'お客様には、この内容をLINEのトークで送信していただくよう案内しています。',
        'LINE公式アカウントのチャットに申込文が届いたら、そこで返事をして日程を確定してください。',
        '申込文が届かない場合は、お電話でのご連絡をお願いします。',
        '',
        '確定したら、スプレッドシート「' +
            BOOKING_SHEET_NAME +
            '」のこの行の「確定日」に日付を入れてください（必要なら「来店時刻」も）。',
        '確定日の前日17時ごろに、LINEで自動のお知らせが届きます。',
        '',
        '（このメールは店舗向けの内部連絡です。お客様には送られていません）',
    ].join('\n');

    MailApp.sendEmail(OWNER_EMAIL, subject, body);
}

/**
 * 確定日が明日の予約へ、前日のお知らせを送る。
 * 時間主導型トリガー（日付ベースのタイマー・午後5時〜6時）で実行する。
 * 9時より後に確定した翌日の予約も拾えるよう、リマインダーの dailyCheck とは別に夕方に動かす。
 *
 * 「通知した確定日」が今の確定日と同じ行は飛ばす。
 * これで同じ確定日に二度は送らず、確定日を書き換えた場合は新しい日の前日に送り直せる。
 * 確定日が日付として読めない行（「あした」などの文字）は、何も書かずに飛ばす。
 */
function bookingDailyCheck() {
    const sheet = getBookingSheet_();
    const today = formatDate_(new Date());
    const tomorrow = addDays_(today, 1);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
        console.log('bookingDailyCheck: 申込がありません（' + today + '）');
        return;
    }

    const values = sheet.getRange(2, 1, lastRow - 1, BOOKING_HEADERS.length).getValues();

    /** 送信対象。row はシート上の行番号 */
    const targets = [];
    /** 確定日の入力が怪しい行（読めない文字・受付日より前）。お知らせは送らず、店舗に確認をお願いする */
    const needsCheck = [];
    values.forEach(function (row, index) {
        const rawConfirmed = row[BOOKING_COL.confirmedDate - 1];
        const confirmedDate = toYmd_(rawConfirmed);
        const receivedAt = row[BOOKING_COL.receivedAt - 1];
        const receivedDate = receivedAt instanceof Date ? formatDate_(receivedAt) : '';

        // 年なしで「1/8」と入れると今年の日付（過去日）になり、黙って送られなくなるため、ここで拾う
        const unreadable = String(rawConfirmed || '').trim() !== '' && !confirmedDate;
        const beforeReceived = confirmedDate && receivedDate && confirmedDate < receivedDate;
        if (unreadable || beforeReceived) {
            needsCheck.push({
                bookingNumber: String(row[BOOKING_COL.bookingNumber - 1] || '').trim(),
                name: String(row[BOOKING_COL.name - 1] || '').trim(),
                value: confirmedDate || String(rawConfirmed || '').trim(),
            });
            return;
        }

        if (confirmedDate !== tomorrow) return;
        if (toYmd_(row[BOOKING_COL.remindedDate - 1]) === confirmedDate) return;

        targets.push({
            row: index + 2,
            bookingNumber: String(row[BOOKING_COL.bookingNumber - 1] || '').trim(),
            userId: String(row[BOOKING_COL.userId - 1] || '').trim(),
            name: String(row[BOOKING_COL.name - 1] || '').trim(),
            carModel: String(row[BOOKING_COL.carModel - 1] || '').trim(),
            confirmedDate: confirmedDate,
            visitTime: formatVisitTime_(row[BOOKING_COL.visitTime - 1]),
        });
    });

    // 直されるまで毎日知らせる（直せば翌日から届かなくなる）
    if (needsCheck.length > 0) {
        sendBookingDateCheckReport_(today, needsCheck);
    }

    if (targets.length === 0) {
        console.log('bookingDailyCheck: 本日の送信対象はありません（' + today + '）');
        return;
    }

    // 動作確認中は、お客様へは送らず対象一覧だけを店舗へ送る
    if (BOOKING_DRY_RUN) {
        sendBookingDryRunReport_(today, targets);
        console.log(
            'bookingDailyCheck: BOOKING_DRY_RUN のため送信しませんでした。対象 ' + targets.length + '件（' + today + '）'
        );
        return;
    }

    let successCount = 0;
    const failures = [];

    targets.forEach(function (target) {
        if (!LINE_USER_ID_PATTERN.test(target.userId)) {
            sheet.getRange(target.row, BOOKING_COL.result).setValue('userIdの形式が不正');
            failures.push({ target: target, reason: 'userIdの形式が不正' });
            return;
        }

        const result = pushLineText_(target.userId, buildBookingReminderMessage_(target));

        if (result.ok) {
            sheet.getRange(target.row, BOOKING_COL.remindedAt).setValue(new Date());
            sheet.getRange(target.row, BOOKING_COL.remindedDate).setValue(target.confirmedDate);
            sheet.getRange(target.row, BOOKING_COL.result).setValue('OK');
            successCount++;
            return;
        }

        // ブロック・友だち解除などで送れなかった場合。通知した確定日は書かないので、直せば翌日以降に再送される
        const reason = 'HTTP ' + result.status + ' ' + result.body;
        sheet.getRange(target.row, BOOKING_COL.result).setValue(reason);
        failures.push({ target: target, reason: reason });
    });

    console.log(
        'bookingDailyCheck: ' +
            today +
            ' 対象 ' +
            targets.length +
            '件／成功 ' +
            successCount +
            '件／失敗 ' +
            failures.length +
            '件'
    );

    if (failures.length > 0) {
        sendBookingFailureReport_(today, failures);
    }
}

/**
 * 前日のお知らせの文面。テキスト1通に収める。
 * ※持ち物の行は、公開前にお店で確認して直すこと（運用手順書を参照）
 */
function buildBookingReminderMessage_(target) {
    const honorific = target.name ? target.name + '様' : 'お客様';
    return (
        honorific +
        '\n' +
        '港南自動車サービスです。\n' +
        '明日 ' +
        formatJapaneseDateWithWeekday_(target.confirmedDate) +
        (target.visitTime ? ' ' + target.visitTime : '') +
        ' は車検のご予約日です。\n' +
        '\n' +
        '■ お持ちいただくもの\n' +
        '・車検証\n' +
        '・自賠責保険証明書\n' +
        '・自動車税（種別割）納税証明書（お持ちの場合）\n' +
        '\n' +
        'ご都合が悪くなった場合は、このLINEへのご返信またはお電話でご連絡ください。\n' +
        '■ お電話 076-268-1788（平日 9:00〜18:00 ／ 土曜 9:00〜17:00）'
    );
}

/** LINEへテキストを1通送る。送れたかどうかは必ずステータスコードで判断する */
function pushLineText_(userId, text) {
    const response = UrlFetchApp.fetch(LINE_PUSH_ENDPOINT, {
        method: 'post',
        contentType: 'application/json',
        headers: { Authorization: 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN },
        payload: JSON.stringify({
            to: userId,
            messages: [{ type: 'text', text: text }],
        }),
        muteHttpExceptions: true,
    });

    const status = response.getResponseCode();
    return { ok: status === 200, status: status, body: response.getContentText() };
}

/** 予約1件ぶんの、店舗向けメールの行 */
function describeBookingTarget_(target) {
    return [
        '・' + (target.name || '（氏名なし）') + '様（受付番号 ' + (target.bookingNumber || '不明') + '）',
        '  確定日：' + formatJapaneseDateWithWeekday_(target.confirmedDate) + (target.visitTime ? ' ' + target.visitTime : ''),
        '  車種：' + (target.carModel || '未記入'),
        '  userId：' + target.userId,
    ].join('\n');
}

/** BOOKING_DRY_RUN 中の確認用メール。お客様には送らず、対象一覧を店舗へ1通だけ送る */
function sendBookingDryRunReport_(today, targets) {
    MailApp.sendEmail(
        OWNER_EMAIL,
        '【車検予約／DRY_RUN】' + today + ' の前日のお知らせ対象 ' + targets.length + '件',
        'BOOKING_DRY_RUN = true のため、お客様へのLINEは送信していません。\n' +
            '以下が本日の送信対象です。内容を確認し、問題なければスクリプトの BOOKING_DRY_RUN を false に変更してください。\n\n' +
            targets.map(describeBookingTarget_).join('\n\n') +
            '\n\n（このメールは店舗の確認用です。お客様には送られていません）'
    );
}

/** 前日のお知らせを送れなかった予約の一覧。電話でフォローするための内部連絡 */
function sendBookingFailureReport_(today, failures) {
    const lines = failures.map(function (failure) {
        return describeBookingTarget_(failure.target) + '\n  失敗理由：' + failure.reason;
    });

    MailApp.sendEmail(
        OWNER_EMAIL,
        '【車検予約】前日のお知らせを送れなかったお客様 ' + failures.length + '件（' + today + '）',
        '以下のお客様へ、車検予約の前日のお知らせを送れませんでした。\n' +
            'ブロックや友だち解除が原因のことが多いため、お電話でのご連絡をお願いします。\n\n' +
            lines.join('\n\n') +
            '\n\n（このメールは店舗向けの内部連絡です。お客様には送られていません）'
    );
}

/** 確定日の入力が怪しい行の一覧。年の入れ違いなどで前日のお知らせが黙って届かなくなるのを防ぐ */
function sendBookingDateCheckReport_(today, rows) {
    const lines = rows.map(function (item) {
        return (
            '・受付番号 ' +
            (item.bookingNumber || '不明') +
            '　' +
            (item.name || '（氏名なし）') +
            '様　確定日の欄：' +
            (item.value || '（空）')
        );
    });

    MailApp.sendEmail(
        OWNER_EMAIL,
        '【車検予約】確定日の確認をお願いします ' + rows.length + '件（' + today + '）',
        'シート「' +
            BOOKING_SHEET_NAME +
            '」で、次の予約の「確定日」が日付として読めないか、申込を受けた日より前の日付になっています。\n' +
            'このままでは前日のお知らせが送られません。年から入れ直してください（例 2027/1/8）。\n\n' +
            lines.join('\n') +
            '\n\n直すまで、このメールは毎日17時ごろに届きます。\n' +
            '（このメールは店舗向けの内部連絡です。お客様には送られていません）'
    );
}

/** 期間内（start 以上 end 未満）に送った前日のお知らせの件数。月次レポート用 */
function countBookingRemindersBetween_(start, end) {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(BOOKING_SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 2) return 0;

    const values = sheet.getRange(2, BOOKING_COL.remindedAt, sheet.getLastRow() - 1, 1).getValues();
    return values.filter(function (row) {
        return row[0] instanceof Date && row[0] >= start && row[0] < end;
    }).length;
}

/**
 * 来店時刻のセルを「10:00」の形にする。
 * シートが時刻として解釈した場合（Date）と、文字列のまま入っている場合の両方に備える。
 */
function formatVisitTime_(value) {
    if (value instanceof Date) return Utilities.formatDate(value, TIME_ZONE, 'H:mm');
    return String(value || '').trim();
}

/** yyyy-MM-dd を「12月10日（木）」の形にする（予約の文面用） */
function formatJapaneseDateWithWeekday_(ymd) {
    const parts = String(ymd || '').split('-');
    if (parts.length !== 3) return String(ymd || '');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return Number(parts[1]) + '月' + Number(parts[2]) + '日（' + weekdays[date.getDay()] + '）';
}

/**
 * bookings シート。無ければ見出し付きで作る。
 * 既にあるシートの見出しが古い場合は、1行目だけを今の BOOKING_HEADERS に合わせる。
 */
function getBookingSheet_() {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(BOOKING_SHEET_NAME);

    if (!sheet) {
        sheet = spreadsheet.insertSheet(BOOKING_SHEET_NAME);
        sheet.getRange(1, 1, 1, BOOKING_HEADERS.length).setValues([BOOKING_HEADERS]).setFontWeight('bold');
        sheet.setFrozenRows(1);
        return sheet;
    }

    const current = sheet.getRange(1, 1, 1, BOOKING_HEADERS.length).getValues()[0];
    if (current.join('\t') !== BOOKING_HEADERS.join('\t')) {
        sheet.getRange(1, 1, 1, BOOKING_HEADERS.length).setValues([BOOKING_HEADERS]).setFontWeight('bold');
    }
    return sheet;
}

// ───────────────────────────────────────────────
// 共通の処理
// ───────────────────────────────────────────────

/**
 * 書き込み先のシート。無ければ見出し付きで作る。
 * 既にあるシートの見出しが古い場合は、1行目だけを今の HEADERS に合わせる
 * （列を増やしたときに、手で直さなくても済むように）。
 */
function getSheet_() {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
        sheet.setFrozenRows(1);
        return sheet;
    }

    const current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (current.join('\t') !== HEADERS.join('\t')) {
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    }
    return sheet;
}

/**
 * 「次回間隔（年）」の値を読む。
 * 空欄や読めない値は既定の2年にし、打ち間違いは許容範囲に丸める
 * （0年にすると同じ日に無限に通知してしまうため、必ず1年以上にする）。
 */
function parseIntervalYears_(value) {
    const years = Math.round(Number(value));
    if (!isFinite(years) || years <= 0) return DEFAULT_INTERVAL_YEARS;
    if (years < MIN_INTERVAL_YEARS) return MIN_INTERVAL_YEARS;
    if (years > MAX_INTERVAL_YEARS) return MAX_INTERVAL_YEARS;
    return years;
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

/**
 * yyyy-MM-dd に年を足した yyyy-MM-dd を返す。
 * 2月29日に2年足すと3月1日になるが、車検の満了日としては許容範囲
 */
function addYears_(ymd, years) {
    const parts = ymd.split('-');
    const date = new Date(Number(parts[0]) + years, Number(parts[1]) - 1, Number(parts[2]));
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
