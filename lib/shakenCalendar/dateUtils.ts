/**
 * 'YYYY-MM-DD' 形式の日付文字列を扱う小さな関数群。
 * 端末やサーバーのタイムゾーンに左右されないよう、計算はすべて UTC で行う。
 */

/** 年・月(1始まり)・日から 'YYYY-MM-DD' を作る */
export function toDateStr(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** 'YYYY-MM-DD' を年・月(1始まり)・日に分ける */
export function parseDateStr(dateStr: string): { year: number; month: number; day: number } {
    const [year, month, day] = dateStr.split('-').map(Number);
    return { year, month, day };
}

/** 実在する日付かどうか（2026-02-30 などを弾く） */
export function isValidYmd(year: number, month: number, day: number): boolean {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
    if (year < 2000 || year > 2099) return false;
    const d = new Date(Date.UTC(year, month - 1, day));
    return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

/** 曜日（0=日曜〜6=土曜） */
export function dayOfWeek(dateStr: string): number {
    const { year, month, day } = parseDateStr(dateStr);
    return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** 日数を足した日付 */
export function addDays(dateStr: string, days: number): string {
    const { year, month, day } = parseDateStr(dateStr);
    const d = new Date(Date.UTC(year, month - 1, day + days));
    return toDateStr(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/** その月の日数 */
export function daysInMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** 月を足した年・月(1始まり) */
export function addMonths(year: number, month: number, months: number): { year: number; month: number } {
    const index = year * 12 + (month - 1) + months;
    return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** 日本時間での今日の日付 'YYYY-MM-DD' */
export function todayInJapan(now: Date = new Date()): string {
    // en-CA は 'YYYY-MM-DD' 形式で出力される
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);
}
