/**
 * 車検カレンダー用の休業日判定。
 *
 * 年間休日表（lib/businessDays.ts の CLOSED_DATES）に載っている日だけを休業日とする。
 * 曜日や祝日からの自動判定はしない。表に無い期間（新年度の休日表が未登録など）は休業日にならず、
 * 未設定の日は△（電話で確認）になる。〇になることはない。
 * 新しい年度の休日表は CLOSED_DATES に日付を追加する。
 */
import { CLOSED_DATES } from '../businessDays';

/** 休業日かどうか */
export function isShakenClosedDay(dateStr: string): boolean {
    return CLOSED_DATES.has(dateStr);
}
