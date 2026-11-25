import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyLineUserId } from './verifyLineUserId';

const USER_ID = 'U' + '0'.repeat(32);

describe('verifyLineUserId', () => {
    beforeEach(() => {
        vi.stubEnv('LINE_LOGIN_CHANNEL_ID', '1234567890');
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('LINEが本人と認めたら userId を返す', async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify({ sub: USER_ID })));
        vi.stubGlobal('fetch', fetchMock);

        expect(await verifyLineUserId('token', 'test')).toEqual({ ok: true, userId: USER_ID });
        // チャネルIDを付けて検証している（別チャネルのトークンを弾くため）
        const body = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as URLSearchParams;
        expect(body.get('client_id')).toBe('1234567890');
        expect(body.get('id_token')).toBe('token');
    });

    it('LINEが400を返したら失敗', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => new Response('bad', { status: 400 })));
        expect((await verifyLineUserId('token', 'test')).ok).toBe(false);
    });

    it('sub の形式が想定外なら失敗', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ sub: 'xxx' }))));
        expect((await verifyLineUserId('token', 'test')).ok).toBe(false);
    });

    it('チャネルID未設定なら LINE に問い合わせずに失敗', async () => {
        vi.stubEnv('LINE_LOGIN_CHANNEL_ID', '');
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        expect((await verifyLineUserId('token', 'test')).ok).toBe(false);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('トークンが空なら LINE に問い合わせずに失敗', async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        expect((await verifyLineUserId('', 'test')).ok).toBe(false);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
