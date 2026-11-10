/**
 * 車検受け入れ状況カレンダー用の Google Apps Script
 *
 * 役割:
 *   - setupSheet() ............ 「受け入れ状況」シートを作り、見出し・プルダウン・色分けを設定する（初回のみ）
 *   - addDates() .............. 今日から MONTHS_AHEAD か月先の月末まで、足りない日付の行を追加する
 *   - checkInput() ............ 日付の重複や入力ミスを探して知らせる
 *   - enableMonthlyAutoAdd() .. 毎月1日の朝に addDates() を自動実行するよう設定する
 *
 * 置き場所: スプレッドシートの「拡張機能 → Apps Script」に、このファイルの中身を貼り付けて使う。
 * Webサイトはこのシートを読み取るだけで、このスクリプトはサイトと通信しない。
 */

/** シート名。Webサイト側の環境変数 SHAKEN_SHEET_RANGE と合わせること */
const SHEET_NAME = '受け入れ状況';

/** 何か月先の月末まで日付を用意するか（Webサイトの表示期間と同じ 3） */
const MONTHS_AHEAD = 3;

/** 入力できる記号 */
const STATUS_LIST = ['〇', '△', '×'];

/** スプレッドシートを開いたときにメニューを出す（パソコンのブラウザでのみ表示される） */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('車検カレンダー')
    .addItem('日付を追加する', 'addDates')
    .addItem('入力ミス・重複を確認する', 'checkInput')
    .addSeparator()
    .addItem('シートを準備する（初回のみ）', 'setupSheet')
    .addItem('毎月の日付追加を自動にする', 'enableMonthlyAutoAdd')
    .addToUi();
}

/** 「受け入れ状況」シートを用意する。何度実行しても入力済みの値は消えない */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  // 見出し（1行目）。Webサイトは2行目から読む
  sheet.getRange('A1:C1').setValues([['date', 'status', 'memo']])
    .setFontWeight('bold').setBackground('#0E6469').setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 170);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 320);

  const maxRows = sheet.getMaxRows();
  // 日付は「2026-11-10（火）」の形で表示する（中身は日付データ）
  sheet.getRange(2, 1, maxRows - 1, 1).setNumberFormat('yyyy-mm-dd（ddd）');
  sheet.getRange(2, 2, maxRows - 1, 1).setHorizontalAlignment('center').setFontSize(14);

  // status 列はプルダウンで 〇・△・× だけを選べるようにする（それ以外は入力を拒否）
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS_LIST, true)
    .setAllowInvalid(false)
    .setHelpText('〇・△・× のいずれかを選んでください。空欄の日はサイトで「△」（休業日は「×」）になります。')
    .build();
  sheet.getRange(2, 2, maxRows - 1, 1).setDataValidation(statusRule);

  // date 列は日付だけを受け付ける
  const dateRule = SpreadsheetApp.newDataValidation()
    .requireDate()
    .setAllowInvalid(false)
    .setHelpText('日付を入力してください（例：2026-11-10）')
    .build();
  sheet.getRange(2, 1, maxRows - 1, 1).setDataValidation(dateRule);

  // 色分け（上にある規則ほど優先）
  const dataRange = sheet.getRange(2, 1, maxRows - 1, 3);
  const statusRange = sheet.getRange(2, 2, maxRows - 1, 1);
  const rules = [
    // 同じ日付が2行以上ある → 赤字で警告
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"",COUNTIF($A$2:$A,$A2)>1)')
      .setBackground('#FDE2E2').setFontColor('#A0171F').setBold(true)
      .setRanges([sheet.getRange(2, 1, maxRows - 1, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('〇')
      .setBackground('#DCFCE7').setFontColor('#15803D').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('△')
      .setBackground('#FFEDD5').setFontColor('#C2410C').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('×')
      .setBackground('#FEE2E2').setFontColor('#C0202A').setRanges([statusRange]).build(),
    // 日曜日の行は灰色（目安。実際の休業日判定はWebサイト側で行う）
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($A2<>"",WEEKDAY($A2)=1)')
      .setBackground('#EDF1F0').setRanges([dataRange]).build(),
  ];
  sheet.setConditionalFormatRules(rules);

  // 見出し行は誤って消さないよう保護する（編集時に警告を出す）
  const protection = sheet.getRange('A1:C1').protect().setDescription('見出し行（変更しないでください）');
  protection.setWarningOnly(true);

  addDates();
}

/** 今日から MONTHS_AHEAD か月先の月末まで、まだ無い日付の行を末尾に追加する */
function addDates() {
  const sheet = getSheet_();
  const tz = Session.getScriptTimeZone();
  const existing = new Set(readDates_(sheet).map((d) => Utilities.formatDate(d, tz, 'yyyy-MM-dd')));

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(today.getFullYear(), today.getMonth() + MONTHS_AHEAD + 1, 0);

  const rows = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (!existing.has(Utilities.formatDate(d, tz, 'yyyy-MM-dd'))) rows.push([new Date(d), '', '']);
  }
  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 3).setValues(rows);
  }
  // 日付順に並べ直す（見出しを除く）
  if (sheet.getLastRow() > 2) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).sort({ column: 1, ascending: true });
  }
  notify_(rows.length > 0 ? `${rows.length}日分の日付を追加しました。` : '追加する日付はありませんでした。');
}

/** 日付の重複・読めない日付・〇△×以外の記号を探して知らせる */
function checkInput() {
  const sheet = getSheet_();
  const tz = Session.getScriptTimeZone();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return notify_('データがありません。');

  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  const seen = {};
  const problems = [];
  values.forEach(([date, status], i) => {
    const rowNo = i + 2;
    if (date === '' && status === '') return;
    if (!(date instanceof Date)) {
      problems.push(`${rowNo}行目：日付が読めません（${date}）`);
      return;
    }
    const key = Utilities.formatDate(date, tz, 'yyyy-MM-dd');
    if (seen[key]) problems.push(`${rowNo}行目：${key} が ${seen[key]}行目と重複しています`);
    else seen[key] = rowNo;
    if (status !== '' && STATUS_LIST.indexOf(String(status).trim()) === -1) {
      problems.push(`${rowNo}行目：status「${status}」は使えません（〇・△・× のみ）`);
    }
  });

  notify_(problems.length === 0
    ? '問題は見つかりませんでした。'
    : `${problems.length}件の問題があります。\n\n${problems.slice(0, 30).join('\n')}` +
      '\n\n※重複している日は、サイトでは厳しい方（× → △ → 〇 の順）が表示されます。');
}

/** 毎月1日の朝6時ごろに日付を自動追加する（すでに設定済みなら何もしない） */
function enableMonthlyAutoAdd() {
  const exists = ScriptApp.getProjectTriggers().some((t) => t.getHandlerFunction() === 'addDates');
  if (!exists) {
    ScriptApp.newTrigger('addDates').timeBased().onMonthDay(1).atHour(6).create();
  }
  notify_(exists ? 'すでに自動追加が設定されています。' : '毎月1日に日付を自動で追加するよう設定しました。');
}

// ───────────────────────────────────────────────
// 内部用
// ───────────────────────────────────────────────

function getSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`「${SHEET_NAME}」シートがありません。メニューの「シートを準備する」を実行してください。`);
  return sheet;
}

function readDates_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, 1).getValues().map((r) => r[0]).filter((v) => v instanceof Date);
}

/** 画面があればダイアログ、トリガー実行中ならログに出す */
function notify_(message) {
  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (e) {
    console.log(message);
  }
}
