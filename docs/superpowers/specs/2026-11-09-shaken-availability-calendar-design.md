# 車検受け入れ状況カレンダー 設計メモ

依頼書（2026-11-09）の要件に対し、実装時に決めた事項を記録する。

## 目的
従業員が Google スプレッドシートの〇・△・× を変えるだけで、/shaken のカレンダーが更新される。予約機能は作らない。

## 決定事項（ユーザー確認済み）
- 休業日：既存 `lib/businessDays.ts` の年間休日表（CLOSED_DATES）に載っている日だけを休業日とする。曜日・祝日からの自動判定はしない（2027年度以降も年間休日表を提出して追加する運用。2026-11-10 変更）。トップページの営業カレンダーの判定は変えない。
- 表示：月曜始まり。定休日はグレーで「定休日」と表示。カレンダーは「受け入れ状況カレンダーを見る」ボタンで開閉し、開いたときに初めて API を呼ぶ（2026-11-10 変更）。
- /shaken の並び：受け入れ状況 → 車検費用を見積もる → 選ばれる理由（2026-11-10 変更）。
- 設置場所：/shaken のヒーロー直後（「選ばれる理由」の前）。
- テスト：vitest を devDependencies に追加し `npm test` で実行。
- 〇の日：電話ボタンと LINE ボタンを両方表示。

## 実装上の判断（こちらの判断）
- 認証：サービスアカウント＋`spreadsheets.readonly` スコープ。JWT 署名は Node 標準 `crypto` で行い、外部ライブラリを追加しない。
- 取得範囲は A〜B 列のみ（memo 列は Google から取得しない）。
- キャッシュ：`unstable_cache`（既定 180 秒、環境変数で 60〜300 秒）。取得失敗時はサーバーが最後に成功したデータを `stale: true` で返す。無ければエラー。
- 不正データ：日付が読めない行・記号が不明な行は無視（＝未設定扱い）。同じ日付が複数あれば × > △ > 〇 の厳しい方を採用。
- 判定順：シートの明示値 → 年間休日表の定休日なら ×（画面では「定休日」） → それ以外は △。取得失敗時も同じ規則で、〇は出さない。
- 電話番号・LINE URL：`lib/chatFlow.ts` の `TEL` / `LINE_URL` を使う。
- 「最終更新」はサイトがシートを最後に読み取った日時を表示する（シートの編集日時ではない）。30 分以上古い場合は注意文を出す。
- ダミーデータ：`NODE_ENV=development` かつ接続情報が未設定のときだけ使う。本番では使わない。

## 構成
- `lib/shakenCalendar/config.ts` … 表示期間・キャッシュ秒数・古さの閾値
- `lib/shakenCalendar/closedDays.ts` … 車検カレンダー用の休業日判定
- `lib/shakenCalendar/availability.ts` … 型・シート行の解析・ステータス決定（ブラウザとサーバー共通）
- `lib/shakenCalendar/sheetsClient.ts` … Google Sheets API 読み取り（サーバー専用）
- `app/api/shaken-availability/route.ts` … 公開 API（date・status・reason のみ返す）
- `components/ShakenAvailabilityCalendar.tsx` … カレンダー UI
- `docs/gas/shaken-calendar.gs` … 日付生成・プルダウン・重複表示の GAS
- `docs/車検カレンダー運用手順書.md` … 非エンジニア向け手順

## 将来拡張の余地（今回は実装しない）
`AvailabilityDay.reason` と API のレスポンス形を保ったまま、サーバー側でステータス算出元（予約件数・台数上限など）を差し替えられる。サービス種別は API のパスを分ける想定。
