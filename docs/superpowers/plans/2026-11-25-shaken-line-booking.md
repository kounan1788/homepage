# 車検のLINE予約 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 車検ページのカレンダーの〇の日から、LIFFフォームで車検予約を申し込み、申込文をLINEのトークに送れるようにする。確定した予約には前日17時にLINEでお知らせを送る。

**Architecture:** フォームはリマインダー（`app/shaken-reminder/`）と同じ作り（サーバー描画のページ＋`ssr: false` のLIFFフォーム）。Server Action がIDトークンを検証し、希望日を受け入れ状況（`getAvailability()`）と照らしてから、既存のリマインダーGASへ `type: 'booking'` で中継する。GASは「bookings」シートに記録して店舗へメールし、受付番号を返す。フォームは受付番号入りの申込文を `oaMessage` URLでトークに入力済みにする。前日のお知らせはGASの別関数・別トリガー（17時台）で送る。

**Tech Stack:** Next.js 14.2（App Router, Server Actions）, TypeScript, `@line/liff` 2.31, vitest 3, Google Apps Script

**Spec:** `docs/superpowers/specs/2026-11-25-shaken-line-booking-design.md`

## Global Constraints
- コメント・docstring・TODOはすべて日本語。変数名・関数名は英語。
- 新しい依存関係は追加しない（QRコード生成ライブラリも入れない。→ Task 4 の PC 向け案内を参照）。
- 既存のコードスタイル（4スペース、シングルクォート、`'use server'`/`'use client'` の置き方）に合わせる。
- 申込の時点では「予約は確定していない」ことを画面と申込文の両方で明示する（設計書 §2 失敗条件）。
- 選べる日は「JSTで明日以降」かつ「受け入れ状況が `available`（〇）」の日だけ。△・×・定休日は選べない（設計書 §8）。
- 店舗への申込メールの宛先は `kounan.lease@gmail.com`（GAS の `OWNER_EMAIL`）。
- 前日のお知らせは前日の17時台に送る。同じ確定日に二度送らない。確定日を変えたら新しい日の前日に送り直す。
- 予約側の試運転フラグ `BOOKING_DRY_RUN` はリマインダーの `DRY_RUN` と別。
- 公開スイッチ `NEXT_PUBLIC_SHAKEN_BOOKING_ENABLED === 'true'` の間だけ、カレンダーの「LINEで予約する」が予約フォームへ行く。オフなら今まで通り `LINE_URL`。
- このフォルダはgitリポジトリではない。各タスクの「Commit」手順は行わず、代わりに `npm test` と `npx tsc --noEmit` が通ることを確認する。

## Review Focus
1. **受け入れ状況の取得に失敗したとき**（`source: 'error'` で全日△）：フォームは空のプルダウンを出さず、「現在はお電話で承っています」と電話番号を出す。→ Task 1 `getBookableDates` のテスト、Task 2 のテスト。
2. **カレンダーで押した日が、フォームを開く間に〇でなくなった**（`?date=` が選べない日）：その日は初期値に入れず、サーバーも拒否する。→ Task 1 `pickInitialDate` のテスト、Task 2 のテスト。
3. **お名前・車種に改行や長文が入る**：申込文や前日のお知らせの体裁が崩れる。改行禁止・文字数上限で弾く。ご連絡事項は改行可・200文字まで。→ Task 1 `validateBookingInput` のテスト。
4. **申込の二重送信**（連打・通信の再試行）：画面側で送信中・送信済みは押せない。サーバーは同一IP 60秒の連投制限。→ Task 2 のテスト。
5. **スタッフが確定日を日付以外で入力した／過去の日付を入れた**：送らずに飛ばし、送信結果欄にも書かない（翌日以降に直せば拾われる）。→ Task 3 の手動確認。

---

### Task 1: 予約の純粋ロジック（日付・入力検証・申込文・リンク）

**Files:**
- Create: `lib/shakenBooking/config.ts`
- Create: `lib/shakenBooking/booking.ts`
- Test: `lib/shakenBooking/booking.test.ts`

**Interfaces:**
- Consumes: `AvailabilityDay`（`lib/shakenCalendar/availability.ts`）, `addDays`・`dayOfWeek`（`lib/shakenCalendar/dateUtils.ts`）, `formatPlateNumber`（`lib/plateNumber.ts`）, `LINE_URL`（`lib/chatFlow.ts`）
- Produces:
  - `config.ts`
    - `SHAKEN_BOOKING_PUBLISHED: boolean`（`process.env.NEXT_PUBLIC_SHAKEN_BOOKING_ENABLED === 'true'`）
    - `BOOKING_LIMITS = { displayName: 100, carModel: 50, note: 200 } as const`
  - `booking.ts`
    - `type ShakenBookingInput = { firstChoice: string; secondChoice?: string; displayName: string; carModel: string; plateLast4?: string; note?: string; consent: boolean }`
    - `type ValidBooking = { firstChoice: string; secondChoice: string; displayName: string; carModel: string; plateLast4: string; note: string }`（任意項目は空文字）
    - `getBookableDates(days: AvailabilityDay[], today: string): string[]`：`status === 'available'` かつ `date > today` の日付を昇順で返す
    - `pickInitialDate(requested: string | null, bookable: string[]): string`：`requested` が `bookable` に含まれればそれ、なければ `''`
    - `validateBookingInput(input: ShakenBookingInput, bookable: string[]): { ok: true; value: ValidBooking } | { ok: false; error: string }`
    - `formatDateWithWeekday(ymd: string): string`：`'2026-12-10'` → `'12月10日（木）'`
    - `buildBookingMessage(b: ValidBooking & { bookingNumber: string }): string`
    - `buildOaMessageUrl(basicId: string, text: string): string`：`https://line.me/R/oaMessage/${encodeURIComponent(basicId)}/?${encodeURIComponent(text)}`
    - `buildBookingFormHref(date: string, liffId: string | undefined, published: boolean): string`：`published && liffId` なら `https://liff.line.me/${liffId}?date=${date}`、それ以外は `LINE_URL`

- [ ] **Step 1: 失敗するテストを書く** — `lib/shakenBooking/booking.test.ts`

```ts
const days = [
    { date: '2026-11-25', status: 'available', reason: 'sheet' },   // 今日（選べない）
    { date: '2026-11-26', status: 'available', reason: 'sheet' },
    { date: '2026-11-27', status: 'call', reason: 'default' },      // △（選べない）
    { date: '2026-11-28', status: 'unavailable', reason: 'closed' },
    { date: '2026-11-30', status: 'available', reason: 'sheet' },
] as const;
const TODAY = '2026-11-25';
const valid = { firstChoice: '2026-11-26', displayName: '港南 太郎', carModel: 'N-BOX', consent: true };

it('getBookableDates は明日以降の〇だけを返す', () =>
    expect(getBookableDates([...days], TODAY)).toEqual(['2026-11-26', '2026-11-30']));
it('受け入れ状況が全日△なら空配列', () =>
    expect(getBookableDates(days.map((d) => ({ ...d, status: 'call' as const })), TODAY)).toEqual([]));
it('pickInitialDate は選べない日を初期値にしない', () => {
    expect(pickInitialDate('2026-11-26', ['2026-11-26'])).toBe('2026-11-26');
    expect(pickInitialDate('2026-11-27', ['2026-11-26'])).toBe('');
    expect(pickInitialDate(null, ['2026-11-26'])).toBe('');
});
it('同意なしは拒否', () => expect(validateBookingInput({ ...valid, consent: false }, ['2026-11-26']).ok).toBe(false));
it('第1希望が選べない日なら拒否', () =>
    expect(validateBookingInput({ ...valid, firstChoice: '2026-11-27' }, ['2026-11-26']).ok).toBe(false));
it('第2希望が第1希望と同じなら拒否', () =>
    expect(validateBookingInput({ ...valid, secondChoice: '2026-11-26' }, ['2026-11-26', '2026-11-30']).ok).toBe(false));
it('お名前・車種の改行は拒否、ご連絡事項の改行は許可', () => {
    expect(validateBookingInput({ ...valid, displayName: '港南\n太郎' }, ['2026-11-26']).ok).toBe(false);
    expect(validateBookingInput({ ...valid, carModel: 'N-BOX\nX' }, ['2026-11-26']).ok).toBe(false);
    expect(validateBookingInput({ ...valid, note: '代車希望\n午前希望' }, ['2026-11-26']).ok).toBe(true);
});
it('文字数上限', () => {
    expect(validateBookingInput({ ...valid, note: 'あ'.repeat(201) }, ['2026-11-26']).ok).toBe(false);
    expect(validateBookingInput({ ...valid, carModel: 'あ'.repeat(51) }, ['2026-11-26']).ok).toBe(false);
});
it('車種は必須', () => expect(validateBookingInput({ ...valid, carModel: ' ' }, ['2026-11-26']).ok).toBe(false));
it('ナンバーは formatPlateNumber で整形し、数字以外は拒否', () => {
    const r = validateBookingInput({ ...valid, plateLast4: '１２３４' }, ['2026-11-26']);
    expect(r.ok && r.value.plateLast4).toBe('12-34');
    expect(validateBookingInput({ ...valid, plateLast4: 'abcd' }, ['2026-11-26']).ok).toBe(false);
});
it('formatDateWithWeekday', () => expect(formatDateWithWeekday('2026-12-10')).toBe('12月10日（木）'));
it('申込文に受付番号・希望日・未確定の注記が入る', () => {
    const text = buildBookingMessage({ ...valid, secondChoice: '2026-11-30', plateLast4: '12-34', note: '', bookingNumber: 'B-0007' });
    expect(text).toContain('【車検予約の申込】受付番号 B-0007');
    expect(text).toContain('第1希望：11月26日（木）');
    expect(text).toContain('第2希望：11月30日（月）');
    expect(text).toContain('車種：N-BOX（ナンバー 12-34）');
    expect(text).toContain('まだ予約は確定していません');
    expect(text).toContain('このまま送信してください');
});
it('第2希望・ナンバー・ご連絡事項が空なら行ごと出さない', () => {
    const text = buildBookingMessage({ ...valid, secondChoice: '', plateLast4: '', note: '', bookingNumber: 'B-0001' });
    expect(text).not.toContain('第2希望');
    expect(text).not.toContain('ナンバー');
    expect(text).not.toContain('ご連絡事項');
});
it('buildOaMessageUrl は ID と本文をエンコードする', () =>
    expect(buildOaMessageUrl('@abc123', 'a b\n')).toBe('https://line.me/R/oaMessage/%40abc123/?a%20b%0A'));
it('buildBookingFormHref は公開オフなら友だち追加リンク', () => {
    expect(buildBookingFormHref('2026-11-26', 'liff-id', false)).toBe(LINE_URL);
    expect(buildBookingFormHref('2026-11-26', undefined, true)).toBe(LINE_URL);
    expect(buildBookingFormHref('2026-11-26', 'liff-id', true)).toBe('https://liff.line.me/liff-id?date=2026-11-26');
});
```
（ナンバーのテストは、実装前に `formatPlateNumber('１２３４')` の実際の戻り値を確認して期待値を書き込む）

- [ ] **Step 2: 失敗を確認** — Run: `npx vitest run lib/shakenBooking` / Expected: FAIL（モジュールが無い）
- [ ] **Step 3: `config.ts` と `booking.ts` を実装** — 申込文は設計書 §5 の例の行順。ご連絡事項がある場合は `ご連絡事項：` の行を車種の次に入れる。最後の2行は `※まだ予約は確定していません。当店から確定のご連絡をします。` と `※このまま送信してください`（Global Constraints の「未確定の明示」）。`plateLast4` は `formatPlateNumber` が `null` を返したら「ナンバーは4桁以内の数字だけをご記入ください。」で拒否（リマインダーと同じ文言）。曜日は `dayOfWeek` を使う。
- [ ] **Step 4: 通過を確認** — Run: `npx vitest run lib/shakenBooking` / Expected: PASS
- [ ] **Step 5: 型チェック** — Run: `npx tsc --noEmit` / Expected: エラーなし

---

### Task 2: Server Action（IDトークン検証の共通化＋予約申込の中継）

**Files:**
- Create: `lib/line/verifyLineUserId.ts`（`registerShakenReminder.ts` の `verifyLineUserId` と `LINE_USER_ID`・`LINE_VERIFY_ENDPOINT`・`LINE_TIMEOUT_MS` をここへ移す）
- Modify: `app/actions/registerShakenReminder.ts`（移した関数を import して使う。挙動は変えない）
- Create: `app/actions/requestShakenBooking.ts`
- Test: `lib/line/verifyLineUserId.test.ts`, `app/actions/requestShakenBooking.test.ts`

**Interfaces:**
- Consumes: Task 1 の `getBookableDates`・`validateBookingInput`・`ShakenBookingInput`・`ValidBooking`、`getAvailability`（`lib/shakenCalendar/service.ts`）、`todayInJapan`（`lib/shakenCalendar/dateUtils.ts`）
- Produces:
  - `verifyLineUserId(idToken: string, logPrefix: string): Promise<{ ok: true; userId: string } | { ok: false; error: string }>`（エラー文言は今のまま。ログの先頭に `logPrefix` を付ける）
  - `type ShakenBookingFormData = ShakenBookingInput & { idToken: string; website?: string }`
  - `requestShakenBooking(form: ShakenBookingFormData): Promise<{ success: true; bookingNumber: string } | { success: false; error: string }>`
  - GASへ送る本文：`{ secret, type: 'booking', userId, firstChoice, secondChoice, displayName, carModel, plateLast4, note }`
  - GASの応答：`{ ok: true, bookingNumber: 'B-0001' }`（Task 3 が返す）

- [ ] **Step 1: 失敗するテストを書く**
  - `verifyLineUserId.test.ts`：`fetch` をスタブし、(a) 200＋`sub: 'U' + '0'.repeat(32)` → `{ ok: true, userId }`、(b) 400 → `ok: false`、(c) 200＋`sub: 'xxx'` → `ok: false`、(d) `LINE_LOGIN_CHANNEL_ID` 未設定 → `ok: false` で fetch を呼ばない。
  - `requestShakenBooking.test.ts`：`vi.mock('next/headers')`（`x-forwarded-for` を返す）、`vi.mock('@/lib/shakenCalendar/service')`（`getAvailability` が固定の `days` を返す）、`vi.mock('@/lib/line/verifyLineUserId')`、`fetch` スタブ。`vi.useFakeTimers({ toFake: ['Date'] })` と `vi.setSystemTime(new Date('2026-11-25T03:00:00Z'))` で今日を `2026-11-25`（JST）に固定（`AbortSignal.timeout` を止めないよう Date だけを偽装）。テストごとに別IPを使う。
    - `website` に値 → `{ success: true, bookingNumber: '' }` で GAS を呼ばない
    - 選べない第1希望 → `success: false`、GAS を呼ばない
    - `getAvailability` が全日 `call`（`source: 'error'`）→ `success: false`、エラー文に電話番号 `076-268-1788` を含む
    - 正常 → GASに `type: 'booking'` と検証済み `userId` が送られ、`{ success: true, bookingNumber: 'B-0001' }`
    - GASが `{ ok: false }` を 200 で返す → `success: false`
    - 同じIPから60秒以内に2回 → 2回目は `success: false`（「送信間隔が短すぎます」）
- [ ] **Step 2: 失敗を確認** — Run: `npx vitest run lib/line app/actions` / Expected: FAIL
- [ ] **Step 3: `lib/line/verifyLineUserId.ts` を作り、`registerShakenReminder.ts` から移す** — 呼び出しは `verifyLineUserId(token, 'registerShakenReminder')`。それ以外の行は触らない。
- [ ] **Step 4: `requestShakenBooking.ts` を実装** — 順序は `registerShakenReminder` と同じ（ハニーポット → 入力検証 → IP連投制限 → 環境変数 `GAS_WEBHOOK_URL`/`GAS_SHARED_SECRET` 確認 → IDトークン検証 → GAS中継 → 本文の `ok` 確認）。入力検証の前に `getAvailability()` → `getBookableDates(days, todayInJapan())` で選べる日を求める。選べる日が0件なら「現在、予約フォームでの受付を停止しています。お手数ですが 076-268-1788 へお電話ください。」。`getClientIp`・`isRateLimited`・`isGasSuccess` はこのファイル内に置く（リマインダーとは別の `Map`）。
- [ ] **Step 5: 通過を確認** — Run: `npm test` / Expected: 既存のテストも含めて全件 PASS
- [ ] **Step 6: 型チェック** — Run: `npx tsc --noEmit` / Expected: エラーなし

---

### Task 3: GAS（bookings シート・受付番号・店舗メール・前日のお知らせ）＋運用手順書

**Files:**
- Modify: `docs/gas/reminder.gs`
- Create: `docs/車検LINE予約運用手順書.md`

**Interfaces:**
- Consumes: Task 2 が送る本文 `{ secret, type: 'booking', userId, firstChoice, secondChoice, displayName, carModel, plateLast4, note }`
- Produces: 応答 `{ ok: true, bookingNumber: string }` / `{ ok: false, error: string }`。トリガー関数 `bookingDailyCheck()`（毎日17時台）。

**決めごと（このタスクで実装する値）:**
- 冒頭の設定に `const BOOKING_DRY_RUN = true;` を追加（`DRY_RUN` とは独立）。
- シート名 `BOOKING_SHEET_NAME = 'bookings'`。列と見出し（`BOOKING_COL` / `BOOKING_HEADERS`）は設計書 §7 の順：受付日時／受付番号／第1希望／第2希望／氏名／LINE userId／車種／ナンバー下4桁／ご連絡事項／確定日／来店時刻／前日通知日時／通知した確定日／送信結果／備考。シートの取得は `getSheet_()` と同じ見出し合わせを `getBookingSheet_()` で行う（`getSheet_` 自体は変えない）。
- 受付番号：`PropertiesService.getScriptProperties()` の `BOOKING_SEQ` を `LockService` の中で1増やし、`'B-' + 4桁ゼロ埋め`（10000以上はそのまま桁を増やす）。行を消しても番号は重ならない。
- `doPost`：`secret` 確認の直後に `if (body.type === 'booking') return handleBookingPost_(body);`。`type` の無い本文は今まで通りリマインダーとして扱う（既存の処理は1行も変えない）。
- `handleBookingPost_`：`userId` 形式・`firstChoice` の日付（`toYmd_`）を確認 → ロック内で番号採番と `appendRow`（毎回追加。上書きしない）→ ロック外で `MailApp.sendEmail(OWNER_EMAIL, '【車検予約の申込】' + 番号 + ' ' + 氏名 + '様 第1希望 ' + 日付, 本文)`。メールの失敗は `console.error` に残し、応答は `ok: true` のまま（シートには残っているため）。
- `bookingDailyCheck`：明日（`addDays_(today, 1)`）が確定日の行のうち、`通知した確定日 !== 確定日` の行を対象にする。確定日が日付として読めない行は飛ばす（何も書かない）。`BOOKING_DRY_RUN` なら一覧を店舗へ1通メールして終了。送信に成功したら「前日通知日時」と「通知した確定日」を書き、「送信結果」に `OK`。失敗したら「送信結果」に `HTTP xxx ...` を書き、まとめて1通店舗へメール（`sendFailureReport_` は満了日の文面なので使わず、予約用の `sendBookingFailureReport_` を作る）。
- 前日のお知らせの文面（`buildBookingReminderMessage_`）：
  ```
  {氏名}様
  港南自動車サービスです。
  明日 {M月D日（曜）}{ 来店時刻があれば「 {時刻}」} は車検のご予約日です。

  ■ お持ちいただくもの
  ・車検証
  ・自賠責保険証明書
  ・自動車税（種別割）納税証明書（お持ちの場合）

  ご都合が悪くなった場合は、このLINEへのご返信またはお電話でご連絡ください。
  ■ お電話 076-268-1788（平日 9:00〜18:00 ／ 土曜 9:00〜17:00）
  ```
  持ち物の行は運用手順書に「公開前にお店で確認して直す箇所」として明記する。
- `monthlyUsageReport`：前月に「前日通知日時」が入った bookings の行数を数え、メール本文に「■ 車検予約の前日のお知らせ：n件」を1行追加する（件名は変えない）。

- [ ] **Step 1: 上の決めごとどおりに `reminder.gs` を変更する**
- [ ] **Step 2: 構文確認** — Run: `node -e "new Function(require('fs').readFileSync('docs/gas/reminder.gs','utf8')); console.log('OK')"` / Expected: `OK`（`node --check` は拡張子 `.gs` を受け付けないため、この方法で確認する）
- [ ] **Step 3: 既存部分を変えていないことを確認** — 変更前の写しと差分を取り、`dailyCheck`・`buildMessage_`・既存 `doPost` のリマインダー処理に差分が無いこと（`doPost` は `type` 分岐の1行追加のみ）を目で確認する。
- [ ] **Step 4: `docs/車検LINE予約運用手順書.md` を書く** — 既存の `docs/車検カレンダー運用手順書.md` と同じ書き方で、次を含める：
  1. 管理者の準備：LINE Developers で予約用LIFFアプリを追加（エンドポイント `https://www.kounan-auto.jp/shaken-booking`、スコープ `openid` `profile`、サイズ Full）／ベーシックIDの確認／Vercel 環境変数 `NEXT_PUBLIC_BOOKING_LIFF_ID`・`NEXT_PUBLIC_LINE_BASIC_ID`・`NEXT_PUBLIC_SHAKEN_BOOKING_ENABLED`／GASの貼り替え（**設定値の行（トークン・ID・シークレット）は残し、追加部分だけを足す**。貼り替え後「デプロイを管理」→ 既存のデプロイを編集して新しいバージョンにする＝URLを変えない）／`bookingDailyCheck` のトリガー（日付ベース・午後5時〜6時）
  2. 公開前の確認：`BOOKING_DRY_RUN = true` のまま自分のLINEで申込 → シート・メール・申込文を確認 → 確定日に明日を入れて `bookingDailyCheck` を手動実行 → 一覧メールが届く → `BOOKING_DRY_RUN = false` にして再実行 → 自分のLINEにお知らせが届く → もう一度実行しても届かない（同じ確定日に二度送らない）→ 確定日を別の日に変えると対象に戻る
  3. 毎日の操作：申込メールが来たらチャットで返事 → 確定日（必要なら来店時刻）を入力／キャンセルは確定日を消す／日程変更は書き換える／17時以降に翌日の予約を確定したら、前日のお知らせは届かないのでチャットで案内／申込文がチャットに届かないお客様には電話
  4. 前日のお知らせの文面と持ち物（公開前にお店で確認して直す）
- [ ] **Step 5: GASエディタでの手動確認** — 手順書 2 の手順を管理者と一緒に行う（Review Focus 5：確定日に「あした」などの文字や過去日を入れて実行し、何も送られず、送信結果も空のままであることを含める）。

---

### Task 4: 予約フォームのページ（LIFF）

**Files:**
- Create: `app/shaken-booking/page.tsx`
- Create: `app/shaken-booking/BookingFormLoader.tsx`
- Create: `app/shaken-booking/BookingForm.tsx`
- Modify: `app/sitemap.ts`（`EXCLUDED_ROUTES` に `'/shaken-booking'` を追加）

**Interfaces:**
- Consumes: Task 1 の `getBookableDates`・`pickInitialDate`・`formatDateWithWeekday`・`buildBookingMessage`・`buildOaMessageUrl`・`BOOKING_LIMITS`、Task 2 の `requestShakenBooking`、`/api/shaken-availability`（`AvailabilityResponse`）、`todayInJapan`
- Produces: ページ `/shaken-booking`（`?date=YYYY-MM-DD` を受け取る）

**決めごと:**
- `page.tsx`：`robots: { index: false, follow: false }`。構成はリマインダーの `page.tsx` と同じ（`SiteHeader`・`Breadcrumb`・`SiteFooter`）。本文に「申込の時点では予約は確定していません。当店からLINEで確定のご連絡をします」と「△の日はお電話でご相談ください（076-268-1788）」を書く。
- `BookingFormLoader.tsx`：`ReminderFormLoader.tsx` と同じ（`dynamic(..., { ssr: false })`）。
- `BookingForm.tsx` の画面の状態：`'loading' | 'pc' | 'needFriend' | 'noDates' | 'ready' | 'done' | 'error'`
  - `liff.init({ liffId: process.env.NEXT_PUBLIC_BOOKING_LIFF_ID })` の後、`liff.getOS() === 'web'` なら `'pc'`：「スマートフォンのLINEからお申し込みください」と、`https://liff.line.me/{LIFF ID}` の文字列、電話番号を出す（QRコードは出さない。新しい依存を入れないため）。
  - 未ログインなら `liff.login()`。友だちでなければ `'needFriend'`（リマインダーと同じ案内と再確認ボタン）。
  - `fetch('/api/shaken-availability')` → `getBookableDates(days, todayInJapan())` が空、または取得失敗なら `'noDates'`（電話番号を出す。Review Focus 1）。
  - 第1希望の初期値は `pickInitialDate(new URLSearchParams(location.search).get('date'), bookable)`（Review Focus 2）。`liff.line.me/{ID}?date=...` から開くと、`?date=` は `liff.init()` の完了後にエンドポイントのURLへ戻されるため、**`location.search` は `liff.init()` の後に読む**。第1希望・第2希望は `<select>`（選べる日だけ、表示は `formatDateWithWeekday`）。第2希望は「指定しない」を先頭に置き、第1希望と同じ日は選択肢から外す。
  - お名前（初期値は LINE の表示名）・車種（必須）・ナンバー下4桁・ご連絡事項（`<textarea maxLength={200}>`）・同意チェック・ハニーポット `website`。見た目はリマインダーのフォームにそろえる（`inputClass`・`LineGuide` は複製してよい）。
  - 送信中・送信後はボタンを押せない（Review Focus 4）。成功したら `'done'`：見出し「お申し込みを受け付けました（まだ確定していません）」、説明「続けて下のボタンからLINEで申込内容を送信してください。当店から確定のご連絡をします。」、ボタン「LINEで申込内容を送信する」（`href = buildOaMessageUrl(process.env.NEXT_PUBLIC_LINE_BASIC_ID, buildBookingMessage({...value, bookingNumber}))`）。受付番号も画面に表示する。GAイベント `shaken_booking_request` を送る。
  - `NEXT_PUBLIC_BOOKING_LIFF_ID` または `NEXT_PUBLIC_LINE_BASIC_ID` が未設定なら `'error'`（電話番号を案内）。

- [ ] **Step 1: 上の決めごとどおりに3ファイルを作り、`sitemap.ts` に除外を足す**
- [ ] **Step 2: 型チェックとビルド** — Run: `npx tsc --noEmit && npm run build` / Expected: エラーなし。`/shaken-booking` がビルド結果に出る。
- [ ] **Step 3: ブラウザで表示確認** — `npm run dev`（`.env.local` に `NEXT_PUBLIC_BOOKING_LIFF_ID` を入れない状態）で `/shaken-booking` を開く。ページ本文が出て、フォーム欄は `'error'` の案内（電話番号）になることを確認する。
- [ ] **Step 4: 実機確認（LIFF ID 設定後・管理者と）** — スマートフォンのLINEで `https://liff.line.me/{ID}?date={〇の日}` を開き、第1希望に入っていること → 申込 → 完了画面 → 「LINEで申込内容を送信する」でトーク画面が開き、申込文が入力済みであることを確認する。パソコンのブラウザで開いて `'pc'` の案内になることも確認する。

---

### Task 5: カレンダーのボタン・プライバシーポリシー

**Files:**
- Modify: `components/ShakenAvailabilityCalendar.tsx`（`DayDetail` の〇の日と `ContactButtons`）
- Modify: `app/privacy/page.tsx`

**Interfaces:**
- Consumes: Task 1 の `buildBookingFormHref`・`SHAKEN_BOOKING_PUBLISHED`

- [ ] **Step 1: `ContactButtons` に `lineHref?: string` を追加** — 既定値は `LINE_URL`。〇の日の `DayDetail` は `lineHref={buildBookingFormHref(day.date, process.env.NEXT_PUBLIC_BOOKING_LIFF_ID, SHAKEN_BOOKING_PUBLISHED)}` を渡す。ボタンの文言「LINEで予約する」「24時間受付」は変えない。それ以外の表示（△・×の日）は変えない。
- [ ] **Step 2: プライバシーポリシーに追記** — 「2. 取得する個人情報」に `<Item>LINEの利用者識別子・表示名（LINEでの車検予約・車検満了日のお知らせをご利用の場合）</Item>` と `<Item>車種、車検のご希望日（LINEでの車検予約の場合）</Item>`。「3. 利用目的」に `<Item>車検のご予約の受付・確定のご連絡・前日のご案内</Item>`。
- [ ] **Step 3: 型チェック・テスト・ビルド** — Run: `npx tsc --noEmit && npm test && npm run build` / Expected: すべて成功
- [ ] **Step 4: ブラウザで確認** — `npm run dev` で `/shaken` のカレンダーを開き、〇の日を押す。公開スイッチなしでは「LINEで予約する」が `https://lin.ee/CKQM0mE` のまま。`.env.local` に `NEXT_PUBLIC_SHAKEN_BOOKING_ENABLED=true` と `NEXT_PUBLIC_BOOKING_LIFF_ID=test-id` を入れて起動し直すと、`https://liff.line.me/test-id?date=...` になる。△・×の日の表示が変わっていない。`/privacy` に追記が出ている。
