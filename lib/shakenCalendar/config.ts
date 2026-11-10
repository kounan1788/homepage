/**
 * 車検受け入れ状況カレンダーの設定。
 *
 * 定休日はここではなく、lib/businessDays.ts の年間休日表（CLOSED_DATES）で管理する。
 */
export const SHAKEN_CALENDAR_CONFIG = {
    /** 当月から何か月先まで表示するか（3 なら 11月〜2月） */
    monthsAhead: 3,

    /** サイトがシートを最後に読んだ時刻がこれより古ければ「情報が古い」と表示する（分） */
    staleAfterMinutes: 30,

    /** キャッシュ秒数の既定値と許容範囲。環境変数 SHAKEN_CALENDAR_CACHE_SECONDS で上書きできる */
    cacheSeconds: { default: 180, min: 60, max: 300 },
} as const;

/**
 * カレンダーを公開するかどうか。false の間は「準備中」の案内だけを表示する。
 * 公開するときは Vercel の環境変数 NEXT_PUBLIC_SHAKEN_CALENDAR_ENABLED に true を設定して再デプロイする。
 * （NEXT_PUBLIC_ の値はビルド時に画面側へ埋め込まれるため、変更後は再デプロイが必要）
 */
export const SHAKEN_CALENDAR_PUBLISHED = process.env.NEXT_PUBLIC_SHAKEN_CALENDAR_ENABLED === 'true';

/** 環境変数からキャッシュ秒数を読む。不正な値なら既定値、範囲外なら範囲内に丸める */
export function resolveCacheSeconds(raw: string | undefined): number {
    const { default: def, min, max } = SHAKEN_CALENDAR_CONFIG.cacheSeconds;
    const n = Number(raw);
    if (!raw || !Number.isFinite(n)) return def;
    return Math.min(max, Math.max(min, Math.round(n)));
}
