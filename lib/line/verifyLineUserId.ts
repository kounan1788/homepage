/**
 * LINEのIDトークンを検証して、本人の userId を得る（サーバー専用）。
 *
 * 車検満了日リマインダー（app/actions/registerShakenReminder.ts）と
 * 車検のLINE予約（app/actions/requestShakenBooking.ts）で共通に使う。
 */

/**
 * LINEのユーザーID。
 * クライアントが名乗った値は使わず、IDトークンを検証して得た sub だけを使う。
 * 形式の確認は、LINEの応答が想定外だった場合に備えた二重の歯止め。
 */
const LINE_USER_ID = /^U[0-9a-f]{32}$/;

/** IDトークンの検証先。aud（＝client_id）が自社のチャネルかどうかもここで確かめられる */
const LINE_VERIFY_ENDPOINT = 'https://api.line.me/oauth2/v2.1/verify';

/** IDトークンの検証を待つ上限 */
const LINE_TIMEOUT_MS = 10 * 1000;

/**
 * IDトークンをLINEに検証してもらい、本人の userId（sub）を得る。
 *
 * 呼び出し元の処理は誰でも呼べるので、クライアントが名乗った userId は使わない。
 * LINEの verify はトークンの署名・有効期限に加え、client_id と aud が
 * 一致するか（＝当社のチャネルで発行されたトークンか）も確かめてくれる。
 *
 * @param idToken liff.getIDToken() で得たIDトークン
 * @param logPrefix サーバーログの先頭に付ける呼び出し元の名前（原因の切り分け用）
 */
export async function verifyLineUserId(
    idToken: string,
    logPrefix: string
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
    const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
    if (!channelId) {
        console.error(`${logPrefix}: LINE_LOGIN_CHANNEL_ID が未設定です`);
        return { ok: false, error: '登録先の設定が未完了です。' };
    }
    if (!idToken) {
        return { ok: false, error: 'LINEの情報を取得できませんでした。LINEアプリから開き直してください。' };
    }

    let response: Response;
    try {
        response = await fetch(LINE_VERIFY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
            cache: 'no-store',
            signal: AbortSignal.timeout(LINE_TIMEOUT_MS),
        });
    } catch (error) {
        console.error(`${logPrefix}: LINE verify fetch error`, error);
        return { ok: false, error: '通信エラーが発生しました。' };
    }

    // トークンの期限切れ・別チャネルのトークンなどはここで400が返る
    if (!response.ok) {
        console.error(`${logPrefix}: LINE verify error`, response.status, await response.text());
        return {
            ok: false,
            error: 'LINEの認証を確認できませんでした。LINEアプリから開き直してください。',
        };
    }

    const payload = (await response.json()) as { sub?: unknown };
    const userId = typeof payload.sub === 'string' ? payload.sub : '';
    if (!LINE_USER_ID.test(userId)) {
        console.error(`${logPrefix}: LINE verify returned unexpected sub`);
        return { ok: false, error: 'LINEの情報を取得できませんでした。' };
    }

    return { ok: true, userId };
}
