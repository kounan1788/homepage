import { describe, expect, it } from 'vitest';
import {
    buildAvailability,
    getCalendarRange,
    normalizeDate,
    normalizeStatus,
    parseSheetRows,
    resolveDay,
} from './availability';
import { isShakenClosedDay } from './closedDays';
import { resolveCacheSeconds } from './config';

describe('休業日の判定', () => {
    it('年間休日表どおり（第1土曜 11/7 は営業、第2土曜 11/14 は休み）', () => {
        expect(isShakenClosedDay('2026-11-07')).toBe(false);
        expect(isShakenClosedDay('2026-11-14')).toBe(true);
        expect(isShakenClosedDay('2026-11-08')).toBe(true); // 日曜
        expect(isShakenClosedDay('2026-11-23')).toBe(true); // 勤労感謝の日
        expect(isShakenClosedDay('2026-12-30')).toBe(true); // 年末休業
        expect(isShakenClosedDay('2027-03-22')).toBe(true); // 振替休日
        expect(isShakenClosedDay('2026-11-10')).toBe(false); // 平日
    });

    it('年間休日表に無い期間は自動判定せず、休業日にしない', () => {
        expect(isShakenClosedDay('2027-05-02')).toBe(false); // 日曜だが表に無い
        expect(isShakenClosedDay('2027-05-03')).toBe(false); // 祝日だが表に無い
    });

    it('表に無い期間の未設定日は△（〇にも×にもならない）', () => {
        expect(resolveDay('2027-05-02', new Map())).toEqual({
            date: '2027-05-02',
            status: 'call',
            reason: 'default',
        });
    });
});

describe('入力値の正規化', () => {
    it('記号の表記ゆれを受け付け、それ以外は null', () => {
        expect(normalizeStatus('〇')).toBe('available');
        expect(normalizeStatus(' ○ ')).toBe('available');
        expect(normalizeStatus('△')).toBe('call');
        expect(normalizeStatus('×')).toBe('unavailable');
        expect(normalizeStatus('x')).toBe('unavailable');
        expect(normalizeStatus('◎')).toBeNull();
        expect(normalizeStatus('OK')).toBeNull();
        expect(normalizeStatus(1)).toBeNull();
        expect(normalizeStatus(undefined)).toBeNull();
    });

    it('シリアル値・各種文字列の日付を読み、実在しない日付は null', () => {
        expect(normalizeDate(46335)).toBe('2026-11-09'); // Google のシリアル値
        expect(normalizeDate('2026-11-10')).toBe('2026-11-10');
        expect(normalizeDate('2026/11/1')).toBe('2026-11-01');
        expect(normalizeDate('2026/11/10(火)')).toBe('2026-11-10');
        expect(normalizeDate('2026年11月10日')).toBe('2026-11-10');
        expect(normalizeDate('2026-02-30')).toBeNull();
        expect(normalizeDate('あした')).toBeNull();
        expect(normalizeDate(null)).toBeNull();
    });
});

describe('シート行の解析', () => {
    it('社内メモ（3列目）を読まず、不正な行を数えて捨てる', () => {
        const { entries, invalidRows } = parseSheetRows([
            ['2026-11-10', '〇', '受け入れ可能'],
            ['2026-11-11', '△', '作業予定を要確認'],
            ['2026-11-12', '×', '予約上限'],
            ['2026-11-13', '◎', 'typo'],
            ['いつか', '〇'],
            ['2026-11-14', ''], // ステータス空欄は未設定（不正ではない）
            [], // 空行
        ]);
        expect([...entries]).toEqual([
            ['2026-11-10', 'available'],
            ['2026-11-11', 'call'],
            ['2026-11-12', 'unavailable'],
        ]);
        expect(invalidRows).toBe(2);
    });

    it('日付の重複は厳しい方（× > △ > 〇）を採用し、重複を報告する', () => {
        const { entries, duplicateDates } = parseSheetRows([
            ['2026-11-10', '〇'],
            ['2026-11-10', '△'],
            ['2026-11-11', '×'],
            ['2026-11-11', '〇'],
        ]);
        expect(entries.get('2026-11-10')).toBe('call');
        expect(entries.get('2026-11-11')).toBe('unavailable');
        expect(duplicateDates).toEqual(['2026-11-10', '2026-11-11']);
    });

    it('配列でない行や想定外の型が混ざっても例外を出さない', () => {
        expect(() =>
            parseSheetRows([null as unknown as unknown[], [{}, []], [true, false]]),
        ).not.toThrow();
    });
});

describe('ステータスの決定', () => {
    it('シートの明示値が休業日より優先される（日曜でも〇にできる）', () => {
        const entries = new Map([['2026-11-08', 'available' as const]]);
        expect(resolveDay('2026-11-08', entries)).toEqual({
            date: '2026-11-08',
            status: 'available',
            reason: 'sheet',
        });
    });

    it('定休日にシートで×が入っていれば「定休日」扱い、△なら臨時営業として△', () => {
        const entries = new Map([
            ['2026-11-15', 'unavailable' as const], // 日曜（定休日）に×
            ['2026-11-23', 'call' as const], // 勤労感謝の日（定休日）に△
        ]);
        expect(resolveDay('2026-11-15', entries)).toEqual({
            date: '2026-11-15',
            status: 'unavailable',
            reason: 'closed',
        });
        expect(resolveDay('2026-11-23', entries)).toEqual({
            date: '2026-11-23',
            status: 'call',
            reason: 'sheet',
        });
    });

    it('臨時休業（平日に×）も反映される', () => {
        const entries = new Map([['2026-11-10', 'unavailable' as const]]);
        expect(resolveDay('2026-11-10', entries).status).toBe('unavailable');
    });

    it('未設定の休業日は×、未設定の営業日は△（〇にならない）', () => {
        expect(resolveDay('2026-11-08', new Map())).toEqual({
            date: '2026-11-08',
            status: 'unavailable',
            reason: 'closed',
        });
        expect(resolveDay('2026-11-10', new Map())).toEqual({
            date: '2026-11-10',
            status: 'call',
            reason: 'default',
        });
    });

    it('シートが空なら期間内に〇が1日も無い', () => {
        const range = getCalendarRange('2026-11-09');
        const days = buildAvailability(range, new Map());
        expect(days.some((d) => d.status === 'available')).toBe(false);
    });
});

describe('表示期間', () => {
    it('当月1日から3か月先の月末まで（年をまたぐ）', () => {
        expect(getCalendarRange('2026-11-09')).toEqual({ from: '2026-11-01', to: '2027-02-28' });
        expect(getCalendarRange('2026-12-31', 1)).toEqual({ from: '2026-12-01', to: '2027-01-31' });
    });

    it('期間内の全日を欠けなく並べる', () => {
        const days = buildAvailability({ from: '2026-11-01', to: '2027-02-28' }, new Map());
        expect(days).toHaveLength(30 + 31 + 31 + 28);
        expect(days[0].date).toBe('2026-11-01');
        expect(days.at(-1)?.date).toBe('2027-02-28');
    });
});

describe('キャッシュ秒数', () => {
    it('未設定・不正値は既定値、範囲外は 60〜300 に丸める', () => {
        expect(resolveCacheSeconds(undefined)).toBe(180);
        expect(resolveCacheSeconds('abc')).toBe(180);
        expect(resolveCacheSeconds('10')).toBe(60);
        expect(resolveCacheSeconds('120')).toBe(120);
        expect(resolveCacheSeconds('9999')).toBe(300);
    });
});
