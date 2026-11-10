/**
 * 車検受け入れ状況の型と、ステータスを決める処理。
 * サーバー（API）とブラウザ（取得失敗時の代替表示）の両方で使うため、Node 専用の処理は置かない。
 *
 * ステータスの決め方（優先順）
 *   1. スプレッドシートに明示された〇・△・×
 *   2. 休業日なら ×
 *   3. それ以外は安全のため △（未設定の日を〇にしない）
 * 年間休日表の定休日にシートで × が入っている場合も「定休日」として扱う（reason: 'closed'）。
 * 定休日に 〇・△ が入っている場合は臨時営業としてシートの記号を表示する。
 */
import { SHAKEN_CALENDAR_CONFIG } from './config';
import { addMonths, daysInMonth, isValidYmd, parseDateStr, toDateStr } from './dateUtils';
import { isShakenClosedDay } from './closedDays';

/** available=〇 受付可能 / call=△ 電話で確認 / unavailable=× 受付不可 */
export type AvailabilityStatus = 'available' | 'call' | 'unavailable';

/** なぜそのステータスになったか。sheet=シートの明示値 / closed=定休日（×のときのみ） / default=未設定 */
export type AvailabilityReason = 'sheet' | 'closed' | 'default';

/** 1日分の公開データ。社内メモは含めない */
export type AvailabilityDay = {
    date: string;
    status: AvailabilityStatus;
    reason: AvailabilityReason;
};

/**
 * 公開APIのレスポンス。
 * source: sheet=スプレッドシート / dummy=開発用ダミー / error=取得失敗（休業日以外は△）
 */
export type AvailabilityResponse = {
    source: 'sheet' | 'dummy' | 'error';
    /** サイトが最後にシートを読み取れた日時（ISO 8601）。取得失敗で一度も読めていなければ null */
    fetchedAt: string | null;
    /** 取得に失敗し、以前に読み取ったデータを返している */
    stale: boolean;
    from: string;
    to: string;
    days: AvailabilityDay[];
};

/** 表示する記号。色だけで判別させないため常に併記する */
export const STATUS_SYMBOL: Record<AvailabilityStatus, string> = {
    available: '〇',
    call: '△',
    unavailable: '×',
};

/** 重複したときに採用する厳しさの順（大きいほど厳しい） */
const STRICTNESS: Record<AvailabilityStatus, number> = { available: 0, call: 1, unavailable: 2 };

/**
 * シートに入力された記号を正規化する。
 * プルダウンで選ぶ前提だが、手入力された似た記号（○ ◯ ▲ ✕ x など）も受け付ける。
 * どれにも当てはまらなければ null（＝未設定扱い）
 */
export function normalizeStatus(raw: unknown): AvailabilityStatus | null {
    if (typeof raw !== 'string') return null;
    const s = raw.trim();
    if (['〇', '○', '◯', '⭕'].includes(s)) return 'available';
    if (['△', '▲'].includes(s)) return 'call';
    if (['×', '✕', '✖', '❌', 'x', 'X', 'ｘ', 'Ｘ'].includes(s)) return 'unavailable';
    return null;
}

/**
 * シートの日付セルを 'YYYY-MM-DD' にする。
 * 日付セルは Google のシリアル値（1899-12-30 からの日数）で届く。
 * 文字列として入力された '2026-11-10' '2026/11/10' '2026/11/10(火)' なども受け付ける。
 */
export function normalizeDate(raw: unknown): string | null {
    if (typeof raw === 'number' && Number.isFinite(raw)) {
        const d = new Date(Date.UTC(1899, 11, 30 + Math.floor(raw)));
        const y = d.getUTCFullYear();
        const m = d.getUTCMonth() + 1;
        const day = d.getUTCDate();
        return isValidYmd(y, m, day) ? toDateStr(y, m, day) : null;
    }
    if (typeof raw === 'string') {
        const match = raw.trim().match(/^(\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})/);
        if (!match) return null;
        const [y, m, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
        return isValidYmd(y, m, day) ? toDateStr(y, m, day) : null;
    }
    return null;
}

/**
 * シートの行（[date, status, ...]）を「日付 → ステータス」にまとめる。
 * 3列目以降（社内メモ）は読まない。読めない行は数えるだけで捨てる。
 * 同じ日付が複数ある場合は厳しい方（× > △ > 〇）を採用する。
 */
export function parseSheetRows(rows: unknown[][]): {
    entries: Map<string, AvailabilityStatus>;
    invalidRows: number;
    duplicateDates: string[];
} {
    const entries = new Map<string, AvailabilityStatus>();
    const duplicates = new Set<string>();
    let invalidRows = 0;

    for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [rawDate, rawStatus] = row;
        // 空行は数えない
        if (
            (rawDate === undefined || rawDate === '') &&
            (rawStatus === undefined || rawStatus === '')
        )
            continue;

        const date = normalizeDate(rawDate);
        // 日付だけあってステータス空欄は「未設定」なので不正扱いしない
        if (date && (rawStatus === undefined || rawStatus === '')) continue;
        const status = normalizeStatus(rawStatus);
        if (!date || !status) {
            invalidRows++;
            continue;
        }

        const existing = entries.get(date);
        if (existing) {
            duplicates.add(date);
            if (STRICTNESS[status] <= STRICTNESS[existing]) continue;
        }
        entries.set(date, status);
    }

    return { entries, invalidRows, duplicateDates: [...duplicates].sort() };
}

/** 1日分のステータスを決める */
export function resolveDay(
    date: string,
    entries: ReadonlyMap<string, AvailabilityStatus>,
): AvailabilityDay {
    const explicit = entries.get(date);
    const closed = isShakenClosedDay(date);
    if (explicit) {
        // 定休日に×が入っていても「定休日」と表示する（〇・△なら臨時営業として記号を出す）
        return {
            date,
            status: explicit,
            reason: explicit === 'unavailable' && closed ? 'closed' : 'sheet',
        };
    }
    if (closed) return { date, status: 'unavailable', reason: 'closed' };
    return { date, status: 'call', reason: 'default' };
}

/** 表示期間（当月1日〜monthsAhead か月先の月末） */
export function getCalendarRange(
    today: string,
    monthsAhead: number = SHAKEN_CALENDAR_CONFIG.monthsAhead,
): { from: string; to: string } {
    const { year, month } = parseDateStr(today);
    const last = addMonths(year, month, monthsAhead);
    return {
        from: toDateStr(year, month, 1),
        to: toDateStr(last.year, last.month, daysInMonth(last.year, last.month)),
    };
}

/** 期間内の全日のステータスを作る */
export function buildAvailability(
    range: { from: string; to: string },
    entries: ReadonlyMap<string, AvailabilityStatus>,
): AvailabilityDay[] {
    const days: AvailabilityDay[] = [];
    let { year, month } = parseDateStr(range.from);
    // 月ごとに日付を並べる（UTC計算でタイムゾーンの影響を受けない）
    while (toDateStr(year, month, 1) <= range.to) {
        for (let d = 1; d <= daysInMonth(year, month); d++) {
            const date = toDateStr(year, month, d);
            if (date >= range.from && date <= range.to) days.push(resolveDay(date, entries));
        }
        ({ year, month } = addMonths(year, month, 1));
    }
    return days;
}
