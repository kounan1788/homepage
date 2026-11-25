import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AvailabilityResponse, AvailabilityStatus } from '@/lib/shakenCalendar/availability';

const USER_ID = 'U' + '1'.repeat(32);

/** テストごとに送信元IPを変える（連投制限がテスト間で効かないように） */
let clientIp = '';
vi.mock('next/headers', () => ({
    headers: () => new Headers({ 'x-forwarded-for': clientIp }),
}));

const getAvailability = vi.fn<() => Promise<AvailabilityResponse>>();
vi.mock('@/lib/shakenCalendar/service', () => ({ getAvailability: () => getAvailability() }));

const verifyLineUserId = vi.fn();
vi.mock('@/lib/line/verifyLineUserId', () => ({
    verifyLineUserId: (...args: unknown[]) => verifyLineUserId(...args),
}));

const { requestShakenBooking } = await import('./requestShakenBooking');

/** 受け入れ状況のレスポンスを作る */
function availability(status: AvailabilityStatus, source: AvailabilityResponse['source'] = 'sheet') {
    return {
        source,
        fetchedAt: null,
        stale: false,
        from: '2026-11-01',
        to: '2027-02-28',
        days: [
            { date: '2026-11-25', status, reason: 'sheet' },
            { date: '2026-11-26', status, reason: 'sheet' },
            { date: '2026-11-30', status, reason: 'sheet' },
        ],
    } satisfies AvailabilityResponse;
}

const form = {
    idToken: 'token',
    firstChoice: '2026-11-26',
    secondChoice: '2026-11-30',
    displayName: '港南 太郎',
    carModel: 'N-BOX',
    plateLast4: '1234',
    note: '',
    consent: true,
};

let ipCounter = 0;
let gasFetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
    ipCounter += 1;
    clientIp = `203.0.113.${ipCounter}`;
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-25T03:00:00Z')); // 日本時間 2026-11-25 12:00
    vi.stubEnv('GAS_WEBHOOK_URL', 'https://script.example/exec');
    vi.stubEnv('GAS_SHARED_SECRET', 'secret');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    getAvailability.mockResolvedValue(availability('available'));
    verifyLineUserId.mockResolvedValue({ ok: true, userId: USER_ID });
    gasFetch = vi.fn(async () => new Response(JSON.stringify({ ok: true, bookingNumber: 'B-0001' })));
    vi.stubGlobal('fetch', gasFetch);
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('requestShakenBooking', () => {
    it('ハニーポットに値があれば成功を装い、GASを呼ばない', async () => {
        expect(await requestShakenBooking({ ...form, website: 'spam' })).toEqual({
            success: true,
            bookingNumber: '',
        });
        expect(gasFetch).not.toHaveBeenCalled();
    });

    it('選べない第1希望は拒否し、GASを呼ばない', async () => {
        const result = await requestShakenBooking({ ...form, firstChoice: '2026-11-25' }); // 今日
        expect(result.success).toBe(false);
        expect(gasFetch).not.toHaveBeenCalled();
    });

    it('受け入れ状況の取得に失敗（全日△）なら電話を案内して拒否', async () => {
        getAvailability.mockResolvedValue(availability('call', 'error'));
        const result = await requestShakenBooking(form);
        expect(result.success).toBe(false);
        expect(!result.success && result.error).toContain('076-268-1788');
        expect(gasFetch).not.toHaveBeenCalled();
    });

    it('正常な申込は検証済み userId を付けて type: booking でGASへ送り、受付番号を返す', async () => {
        expect(await requestShakenBooking(form)).toEqual({ success: true, bookingNumber: 'B-0001' });

        const [url, init] = gasFetch.mock.calls[0] as [string, RequestInit];
        expect(url).toBe('https://script.example/exec');
        expect(JSON.parse(String(init.body))).toEqual({
            secret: 'secret',
            type: 'booking',
            userId: USER_ID,
            firstChoice: '2026-11-26',
            secondChoice: '2026-11-30',
            displayName: '港南 太郎',
            carModel: 'N-BOX',
            plateLast4: '12-34',
            note: '',
        });
    });

    it('LINEの本人確認に失敗したら拒否し、GASを呼ばない', async () => {
        verifyLineUserId.mockResolvedValue({ ok: false, error: 'LINEの認証を確認できませんでした。' });
        expect((await requestShakenBooking(form)).success).toBe(false);
        expect(gasFetch).not.toHaveBeenCalled();
    });

    it('GASが200で ok: false を返したら失敗', async () => {
        gasFetch.mockResolvedValue(new Response(JSON.stringify({ ok: false, error: 'forbidden' })));
        expect((await requestShakenBooking(form)).success).toBe(false);
    });

    it('GASが受付番号を返さなければ失敗', async () => {
        gasFetch.mockResolvedValue(new Response(JSON.stringify({ ok: true })));
        expect((await requestShakenBooking(form)).success).toBe(false);
    });

    it('同じIPから60秒以内の2回目は拒否', async () => {
        expect((await requestShakenBooking(form)).success).toBe(true);
        const second = await requestShakenBooking(form);
        expect(second.success).toBe(false);
        expect(!second.success && second.error).toContain('送信間隔が短すぎます');
    });
});
