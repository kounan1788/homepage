/**
 * Google Sheets API v4 からスプレッドシートを読み取る（サーバー専用）。
 *
 * - サービスアカウントの秘密鍵で JWT を作り、読み取り専用スコープのアクセストークンを得る
 * - 秘密鍵は環境変数からのみ読み、ブラウザへは一切送らない
 * - 取得するのは A〜B 列（date・status）だけ。C 列の社内メモは Google から受け取らない
 *
 * 外部ライブラリを増やさないため、署名は Node 標準の crypto で行う。
 */
import { createSign } from 'node:crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const DEFAULT_RANGE = "'受け入れ状況'!A2:B";
const TIMEOUT_MS = 8000;

export type SheetsConfig = {
    clientEmail: string;
    privateKey: string;
    spreadsheetId: string;
    range: string;
};

/** 環境変数から接続情報を読む。1つでも欠けていれば null */
export function readSheetsConfig(env: NodeJS.ProcessEnv = process.env): SheetsConfig | null {
    const clientEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
    // Vercel などでは改行が "\n" という2文字で保存されるため本来の改行に戻す
    const privateKey = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
    const spreadsheetId = env.SHAKEN_SHEET_ID?.trim();
    if (!clientEmail || !privateKey || !spreadsheetId) return null;
    // 範囲の指定は A〜B 列までに限る（C 列の社内メモを誤って取得しないため）
    const range = env.SHAKEN_SHEET_RANGE?.trim() || DEFAULT_RANGE;
    return { clientEmail, privateKey, spreadsheetId, range };
}

function base64url(input: string | Buffer): string {
    return Buffer.from(input).toString('base64url');
}

let tokenCache: { token: string; expiresAt: number; key: string } | null = null;

/** アクセストークンを取得する（有効期限の1分前までは使い回す） */
async function getAccessToken(config: SheetsConfig): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    if (tokenCache && tokenCache.key === config.clientEmail && tokenCache.expiresAt - 60 > now) {
        return tokenCache.token;
    }

    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claims = base64url(
        JSON.stringify({ iss: config.clientEmail, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
    );
    const signer = createSign('RSA-SHA256');
    signer.update(`${header}.${claims}`);
    const signature = signer.sign(config.privateKey).toString('base64url');

    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${header}.${claims}.${signature}`,
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`アクセストークンの取得に失敗しました（HTTP ${res.status}）`);
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) throw new Error('アクセストークンが返されませんでした');

    tokenCache = { token: json.access_token, expiresAt: now + (json.expires_in ?? 3600), key: config.clientEmail };
    return json.access_token;
}

/** シートの値を行の配列で取得する */
export async function fetchSheetRows(config: SheetsConfig): Promise<unknown[][]> {
    const token = await getAccessToken(config);
    const url = new URL(
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.spreadsheetId)}/values/${encodeURIComponent(config.range)}`,
    );
    // 日付はシリアル値、それ以外は入力値そのままで受け取る（表示形式に左右されないため）
    url.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
    url.searchParams.set('dateTimeRenderOption', 'SERIAL_NUMBER');
    url.searchParams.set('majorDimension', 'ROWS');

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`スプレッドシートの取得に失敗しました（HTTP ${res.status}）`);
    const json = (await res.json()) as { values?: unknown[][] };
    // 念のため2列目までに切り詰める（範囲指定を誤っても社内メモを扱わない）
    return (json.values ?? []).map((row) => (Array.isArray(row) ? row.slice(0, 2) : []));
}
