/**
 * 各ページで選んだ内容（見積り条件・車両構成・応募職種）を
 * トップページの問い合わせフォームへ引き継ぐための共通の仕組み。
 *
 * 設計上の判断（docs/blueprints/ 参照）:
 * - URLではなく「人が読める要約」として運ぶ。電話・LINEでは相手がURLを開けないため
 * - 引き継いだ内容はフォーム上で編集できる。訂正の余地を残すため
 * - 引き継ぎに失敗しても送信自体はブロックしない
 */

/** 引き継ぐ内容。lines は人が読める1行ずつのテキスト */
export interface ContactHandoff {
    /** フォームのジャンル選択肢と完全に一致する文字列 */
    category: string;
    /** 「車種: 普通乗用車」のような行の配列。メール本文にそのまま載る */
    lines: string[];
}

const PARAM_CATEGORY = 'c';
const PARAM_LINES = 'd';

/**
 * 引き継ぎ先のURLを組み立てる。
 * 例: /?c=車検&d=車種%3A普通乗用車%7C総額%3A100,040円#contact
 */
export function buildContactUrl(handoff: ContactHandoff, hash = '#contact'): string {
    const params = new URLSearchParams();
    params.set(PARAM_CATEGORY, handoff.category);
    if (handoff.lines.length > 0) params.set(PARAM_LINES, handoff.lines.join('|'));
    return `/?${params.toString()}${hash}`;
}

/** URLから引き継ぎ内容を読む。マウント後に呼ぶこと */
export function readContactHandoff(): ContactHandoff | null {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams(window.location.search);
    const category = params.get(PARAM_CATEGORY);
    if (!category) return null;

    const raw = params.get(PARAM_LINES);
    return {
        category,
        lines: raw ? raw.split('|').filter(Boolean) : [],
    };
}

/** 引き継ぎ内容をメッセージ欄の初期値にする。引き継ぐ行が無ければ空文字を返す */
export function handoffToMessage(handoff: ContactHandoff): string {
    if (handoff.lines.length === 0) return '';
    return `${handoff.lines.join('\n')}\n\n`;
}

/** LINEやメモに貼り付けるための共有テキスト */
export function handoffToShareText(handoff: ContactHandoff): string {
    return `${handoff.category}のご相談\n${handoff.lines.join('\n')}`;
}
