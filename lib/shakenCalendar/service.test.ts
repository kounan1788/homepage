import { generateKeyPairSync } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// テストではキャッシュを使わず毎回読み取る
vi.mock('next/cache', () => ({ unstable_cache: (fn: () => unknown) => fn }));

const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const PRIVATE_KEY_PEM = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
const NOW = new Date('2026-11-09T03:00:00Z'); // 日本時間 2026-11-09 12:00

/** Google のトークン発行とシート取得をまねる fetch */
function mockGoogle(values: unknown[][], { sheetStatus = 200 } = {}) {
    const calls: string[] = [];
    const fetchMock = vi.fn(async (input: string | URL) => {
        const url = String(input);
        calls.push(url);
        if (url.startsWith('https://oauth2.googleapis.com/token')) {
            return new Response(JSON.stringify({ access_token: 'test-token', expires_in: 3600 }));
        }
        if (sheetStatus !== 200) return new Response('error', { status: sheetStatus });
        return new Response(JSON.stringify({ values }));
    });
    vi.stubGlobal('fetch', fetchMock);
    return calls;
}

async function loadService() {
    vi.resetModules(); // モジュール内の「最後に読めたデータ」を毎回リセットする
    return import('./service');
}

describe('getAvailability', () => {
    beforeEach(() => {
        vi.stubEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL', 'reader@example.iam.gserviceaccount.com');
        // Vercel の画面に貼った形（改行が \n の2文字）を再現する
        vi.stubEnv('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY', PRIVATE_KEY_PEM.replace(/\n/g, '\\n'));
        vi.stubEnv('SHAKEN_SHEET_ID', 'sheet-id');
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('シートの〇・△・×を反映し、社内メモをレスポンスに含めない', async () => {
        const calls = mockGoogle([
            [46335, '〇', '社内メモA'], // 2026-11-09（シリアル値）
            ['2026-11-11', '△', '社内メモB'],
            ['2026-11-12', '×', '社内メモC'],
        ]);
        const { getAvailability } = await loadService();
        const res = await getAvailability(NOW);

        expect(res.source).toBe('sheet');
        expect(res.stale).toBe(false);
        const byDate = new Map(res.days.map((d) => [d.date, d.status]));
        expect(byDate.get('2026-11-09')).toBe('available');
        expect(byDate.get('2026-11-11')).toBe('call');
        expect(byDate.get('2026-11-12')).toBe('unavailable');
        expect(byDate.get('2026-11-10')).toBe('call'); // 未設定の平日
        expect(byDate.get('2026-11-15')).toBe('unavailable'); // 未設定の日曜

        const json = JSON.stringify(res);
        expect(json).not.toContain('社内メモ');
        expect(json).not.toContain('PRIVATE KEY');
        expect(json).not.toContain('test-token');
        expect(Object.keys(res.days[0]).sort()).toEqual(['date', 'reason', 'status']);

        // 読み取り範囲は A〜B 列、読み取り専用で値を取得している
        const sheetCall = calls.find((u) => u.includes('sheets.googleapis.com'));
        expect(decodeURIComponent(sheetCall ?? '')).toContain("'受け入れ状況'!A2:B");
    });

    it('取得失敗かつ以前のデータが無ければ error。〇は1日も出さない', async () => {
        mockGoogle([], { sheetStatus: 500 });
        const { getAvailability } = await loadService();
        const res = await getAvailability(NOW);

        expect(res.source).toBe('error');
        expect(res.fetchedAt).toBeNull();
        expect(res.days.some((d) => d.status === 'available')).toBe(false);
        expect(res.days.find((d) => d.date === '2026-11-15')?.status).toBe('unavailable');
    });

    it('取得失敗時、以前に読めたデータがあれば stale として返す', async () => {
        mockGoogle([['2026-11-10', '〇']]);
        const { getAvailability } = await loadService();
        const first = await getAvailability(NOW);

        mockGoogle([], { sheetStatus: 500 });
        const second = await getAvailability(NOW);

        expect(second.source).toBe('sheet');
        expect(second.stale).toBe(true);
        expect(second.fetchedAt).toBe(first.fetchedAt);
    });

    it('接続情報が未設定の本番環境ではダミーを出さず error にする', async () => {
        vi.stubEnv('SHAKEN_SHEET_ID', '');
        vi.stubEnv('NODE_ENV', 'production');
        const { getAvailability } = await loadService();
        const res = await getAvailability(NOW);

        expect(res.source).toBe('error');
        expect(res.days.some((d) => d.status === 'available')).toBe(false);
    });

    it('接続情報が未設定のローカル開発ではダミーを返す', async () => {
        vi.stubEnv('SHAKEN_SHEET_ID', '');
        vi.stubEnv('NODE_ENV', 'development');
        const { getAvailability } = await loadService();
        const res = await getAvailability(NOW);

        expect(res.source).toBe('dummy');
        expect(JSON.stringify(res)).not.toContain('社内メモ');
    });
});
