/**
 * 開発用のダミーデータ。接続情報が未設定のローカル開発（npm run dev）でだけ使う。
 * 本番では使わない（app/api/shaken-availability/route.ts で NODE_ENV を確認している）。
 */
import { addDays } from './dateUtils';

/** 今日から約2か月分、〇・△・× と未設定が混ざった行を作る */
export function buildDummyRows(today: string): unknown[][] {
    const pattern = ['〇', '〇', '△', '×', '', '〇', '△'];
    const rows: unknown[][] = [];
    for (let i = 0; i < 60; i++) {
        const status = pattern[i % pattern.length];
        // 3列目はシートの社内メモを模したもの。API が公開しないことの確認用
        rows.push([addDays(today, i), status, '社内メモ（ダミー）']);
    }
    return rows;
}
