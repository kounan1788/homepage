/**
 * 公開API（/api/shaken-availability）が返すデータを組み立てる（サーバー専用）。
 *
 * - シートの読み取り結果は unstable_cache で数分間キャッシュし、Google へのアクセスを減らす
 * - 読み取りに失敗したら、このサーバーが最後に読めたデータを stale として返す
 * - それも無ければ source: 'error'（休業日は×、それ以外は△。〇にはしない）
 * - 接続情報が未設定のときは、ローカル開発でだけダミーデータを返す
 */
import { unstable_cache } from 'next/cache';
import {
    buildAvailability,
    getCalendarRange,
    parseSheetRows,
    type AvailabilityResponse,
    type AvailabilityStatus,
} from './availability';
import { resolveCacheSeconds } from './config';
import { todayInJapan } from './dateUtils';
import { buildDummyRows } from './dummyData';
import { fetchSheetRows, readSheetsConfig } from './sheetsClient';

/** キャッシュに保存する形（JSON にできる形にする） */
type SheetSnapshot = {
    entries: [string, AvailabilityStatus][];
    fetchedAt: string;
};

async function readSheet(): Promise<SheetSnapshot> {
    const config = readSheetsConfig();
    if (!config) throw new Error('スプレッドシートの接続情報が設定されていません');

    const rows = await fetchSheetRows(config);
    const { entries, invalidRows, duplicateDates } = parseSheetRows(rows);
    // 入力ミスはサーバーログにだけ残す（公開レスポンスには含めない）
    if (invalidRows > 0 || duplicateDates.length > 0) {
        console.warn(
            `[shaken-availability] 読み飛ばした行: ${invalidRows}件 / 重複した日付: ${duplicateDates.join(', ') || 'なし'}`,
        );
    }
    return { entries: [...entries], fetchedAt: new Date().toISOString() };
}

const getCachedSheet = unstable_cache(readSheet, ['shaken-availability-sheet-v1'], {
    revalidate: resolveCacheSeconds(process.env.SHAKEN_CALENDAR_CACHE_SECONDS),
});

/** 最後に読み取れたデータ（同じサーバーインスタンス内でのみ有効な予備） */
let lastGood: SheetSnapshot | null = null;

export async function getAvailability(now: Date = new Date()): Promise<AvailabilityResponse> {
    const range = getCalendarRange(todayInJapan(now));
    const errorResponse = (): AvailabilityResponse => ({
        source: 'error',
        fetchedAt: null,
        stale: false,
        ...range,
        days: buildAvailability(range, new Map()),
    });

    if (!readSheetsConfig()) {
        if (process.env.NODE_ENV === 'development') {
            const { entries } = parseSheetRows(buildDummyRows(range.from));
            return {
                source: 'dummy',
                fetchedAt: now.toISOString(),
                stale: false,
                ...range,
                days: buildAvailability(range, entries),
            };
        }
        console.error('[shaken-availability] 接続情報（環境変数）が未設定です');
        return errorResponse();
    }

    try {
        const snapshot = await getCachedSheet();
        lastGood = snapshot;
        return {
            source: 'sheet',
            fetchedAt: snapshot.fetchedAt,
            stale: false,
            ...range,
            days: buildAvailability(range, new Map(snapshot.entries)),
        };
    } catch (error) {
        console.error('[shaken-availability] 取得に失敗しました:', error instanceof Error ? error.message : error);
        if (lastGood) {
            return {
                source: 'sheet',
                fetchedAt: lastGood.fetchedAt,
                stale: true,
                ...range,
                days: buildAvailability(range, new Map(lastGood.entries)),
            };
        }
        return errorResponse();
    }
}
