/**
 * 画面の状態をURLのクエリに反映するための小さなヘルパー。
 *
 * next/navigation の useSearchParams は使っていない。
 * クライアントコンポーネントで使うと静的生成から外れ（CSRバイアウト）、
 * 本文が静的HTMLに含まれなくなってSEOに影響するため。
 * 代わりにマウント後に window.location から読み、history.replaceState で書き戻す。
 *
 * 履歴は積まない（replaceState）。割引のチェックのように連続して変わる状態で
 * 履歴が溢れるのを避けるため。URLの共有・ブックマーク・再読み込みでの復元が目的。
 */

/** URLクエリを1つ読む。サーバー側では null を返すので、マウント後に呼ぶこと */
export function readUrlParam(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get(key);
}

/**
 * URLクエリを書き換える。値が null / 空文字のキーは削除する
 * （既定値のときはURLに出さず、共有リンクを短く保つ）。
 */
export function writeUrlParams(entries: Record<string, string | null>): void {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(entries)) {
        if (value === null || value === '') {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    }

    const next = url.pathname + url.search + url.hash;
    const current = window.location.pathname + window.location.search + window.location.hash;
    if (next !== current) {
        window.history.replaceState(null, '', next);
    }
}
