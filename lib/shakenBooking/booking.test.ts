import { describe, expect, it } from 'vitest';
import { LINE_URL } from '@/lib/chatFlow';
import type { AvailabilityDay } from '@/lib/shakenCalendar/availability';
import {
    buildBookingFormHref,
    buildBookingMessage,
    buildOaMessageUrl,
    formatDateWithWeekday,
    getBookableDates,
    pickInitialDate,
    requestedDateNotice,
    validateBookingInput,
} from './booking';

const days: AvailabilityDay[] = [
    { date: '2026-11-25', status: 'available', reason: 'sheet' }, // 今日（選べない）
    { date: '2026-11-26', status: 'available', reason: 'sheet' },
    { date: '2026-11-27', status: 'call', reason: 'default' }, // △（選べない）
    { date: '2026-11-28', status: 'unavailable', reason: 'closed' },
    { date: '2026-11-30', status: 'available', reason: 'sheet' },
];
const TODAY = '2026-11-25';
const valid = { firstChoice: '2026-11-26', displayName: '港南 太郎', carModel: 'N-BOX', consent: true };

describe('getBookableDates', () => {
    it('明日以降の〇だけを返す', () => {
        expect(getBookableDates(days, TODAY)).toEqual(['2026-11-26', '2026-11-30']);
    });

    it('受け入れ状況が全日△なら空配列', () => {
        const allCall = days.map((d) => ({ ...d, status: 'call' as const }));
        expect(getBookableDates(allCall, TODAY)).toEqual([]);
    });
});

describe('pickInitialDate', () => {
    it('選べない日を初期値にしない', () => {
        expect(pickInitialDate('2026-11-26', ['2026-11-26'])).toBe('2026-11-26');
        expect(pickInitialDate('2026-11-27', ['2026-11-26'])).toBe('');
        expect(pickInitialDate(null, ['2026-11-26'])).toBe('');
    });
});

describe('requestedDateNotice', () => {
    it('カレンダーで押した日が選べないときは理由を返す', () => {
        expect(requestedDateNotice('2026-11-25', ['2026-11-26'])).toBe(
            '11月25日（水）は予約フォームではお選びいただけません。別の日をお選びいただくか、お電話でご相談ください。'
        );
    });

    it('選べる日、または日付の指定が無いときは空文字', () => {
        expect(requestedDateNotice('2026-11-26', ['2026-11-26'])).toBe('');
        expect(requestedDateNotice(null, ['2026-11-26'])).toBe('');
    });

    it('日付として読めない値は案内しない', () => {
        expect(requestedDateNotice('abc', ['2026-11-26'])).toBe('');
    });
});

describe('validateBookingInput', () => {
    it('正しい入力は通り、任意項目は空文字になる', () => {
        const result = validateBookingInput(valid, ['2026-11-26']);
        expect(result).toEqual({
            ok: true,
            value: {
                firstChoice: '2026-11-26',
                secondChoice: '',
                displayName: '港南 太郎',
                carModel: 'N-BOX',
                plateLast4: '',
                note: '',
            },
        });
    });

    it('同意なしは拒否', () => {
        expect(validateBookingInput({ ...valid, consent: false }, ['2026-11-26']).ok).toBe(false);
    });

    it('第1希望が選べない日なら拒否', () => {
        expect(validateBookingInput({ ...valid, firstChoice: '2026-11-27' }, ['2026-11-26']).ok).toBe(false);
    });

    it('第2希望が選べない日なら拒否', () => {
        expect(validateBookingInput({ ...valid, secondChoice: '2026-11-27' }, ['2026-11-26']).ok).toBe(false);
    });

    it('第2希望が第1希望と同じなら拒否', () => {
        expect(
            validateBookingInput({ ...valid, secondChoice: '2026-11-26' }, ['2026-11-26', '2026-11-30']).ok
        ).toBe(false);
    });

    it('お名前・車種の改行は拒否、ご連絡事項の改行は許可', () => {
        expect(validateBookingInput({ ...valid, displayName: '港南\n太郎' }, ['2026-11-26']).ok).toBe(false);
        expect(validateBookingInput({ ...valid, carModel: 'N-BOX\nX' }, ['2026-11-26']).ok).toBe(false);
        expect(validateBookingInput({ ...valid, note: '代車希望\n午前希望' }, ['2026-11-26']).ok).toBe(true);
    });

    it('文字数上限', () => {
        expect(validateBookingInput({ ...valid, note: 'あ'.repeat(201) }, ['2026-11-26']).ok).toBe(false);
        expect(validateBookingInput({ ...valid, note: 'あ'.repeat(200) }, ['2026-11-26']).ok).toBe(true);
        expect(validateBookingInput({ ...valid, carModel: 'あ'.repeat(51) }, ['2026-11-26']).ok).toBe(false);
        expect(validateBookingInput({ ...valid, displayName: 'あ'.repeat(101) }, ['2026-11-26']).ok).toBe(false);
    });

    it('お名前・車種は必須', () => {
        expect(validateBookingInput({ ...valid, displayName: ' ' }, ['2026-11-26']).ok).toBe(false);
        expect(validateBookingInput({ ...valid, carModel: ' ' }, ['2026-11-26']).ok).toBe(false);
    });

    it('ナンバーは formatPlateNumber で整形し、数字以外は拒否', () => {
        const result = validateBookingInput({ ...valid, plateLast4: '１２３４' }, ['2026-11-26']);
        expect(result.ok && result.value.plateLast4).toBe('12-34');
        expect(validateBookingInput({ ...valid, plateLast4: 'abcd' }, ['2026-11-26']).ok).toBe(false);
    });
});

describe('formatDateWithWeekday', () => {
    it('月日と曜日にする', () => {
        expect(formatDateWithWeekday('2026-12-10')).toBe('12月10日（木）');
    });
});

describe('buildBookingMessage', () => {
    it('受付番号・希望日・未確定の注記が入る', () => {
        const text = buildBookingMessage({
            ...valid,
            secondChoice: '2026-11-30',
            plateLast4: '12-34',
            note: '',
            bookingNumber: 'B-0007',
        });
        expect(text).toContain('【車検予約の申込】受付番号 B-0007');
        expect(text).toContain('第1希望：11月26日（木）');
        expect(text).toContain('第2希望：11月30日（月）');
        expect(text).toContain('車種：N-BOX（ナンバー 12-34）');
        expect(text).toContain('まだ予約は確定していません');
        expect(text).toContain('このまま送信してください');
    });

    it('第2希望・ナンバー・ご連絡事項が空なら行ごと出さない', () => {
        const text = buildBookingMessage({
            ...valid,
            secondChoice: '',
            plateLast4: '',
            note: '',
            bookingNumber: 'B-0001',
        });
        expect(text).not.toContain('第2希望');
        expect(text).not.toContain('ナンバー');
        expect(text).not.toContain('ご連絡事項');
        expect(text).toContain('車種：N-BOX');
    });

    it('ご連絡事項があれば車種の次に入る', () => {
        const text = buildBookingMessage({
            ...valid,
            secondChoice: '',
            plateLast4: '',
            note: '代車希望',
            bookingNumber: 'B-0001',
        });
        expect(text).toContain('車種：N-BOX\nご連絡事項：代車希望');
    });
});

describe('buildOaMessageUrl', () => {
    it('ID と本文をエンコードする', () => {
        expect(buildOaMessageUrl('@abc123', 'a b\n')).toBe('https://line.me/R/oaMessage/%40abc123/?a%20b%0A');
    });
});

describe('buildBookingFormHref', () => {
    it('公開オフまたはLIFF ID未設定なら友だち追加リンク', () => {
        expect(buildBookingFormHref('2026-11-26', 'liff-id', false)).toBe(LINE_URL);
        expect(buildBookingFormHref('2026-11-26', undefined, true)).toBe(LINE_URL);
    });

    it('公開中は日付つきのLIFF URL', () => {
        expect(buildBookingFormHref('2026-11-26', 'liff-id', true)).toBe(
            'https://liff.line.me/liff-id?date=2026-11-26'
        );
    });
});
