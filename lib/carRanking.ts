/**
 * 新車販売ランキング（全国・最新月）。
 *
 * ── 毎月の更新手順 ──────────────────────────────
 * 1. 軽自動車：全国軽自動車協会連合会「軽自動車通称名別新車販売速報（乗用車ベスト15）」
 *    https://www.zenkeijikyo.or.jp/statistics/tusho
 * 2. 乗用車　：日本自動車販売協会連合会「乗用車ブランド通称名別順位」
 *    https://www.jada.or.jp/data/month/m-brand-ranking/
 * 3. 下の rankingMonth を集計月に書き替え、各配列の name / maker / units を
 *    1位から15位まで上書きする（配列の並び順がそのまま順位になります）。
 * route は毎月書き替える必要はありません（下の説明を参照）。
 * 画面側（components/NewCarRanking.tsx）は触らなくて構いません。
 */

export interface RankingItem {
    /** 通称名。公表資料の表記にそろえる */
    name: string;
    maker: string;
    /** 当月の販売台数 */
    units: number;
    /**
     * 自社の車種ページのパス。車名から自動で判定せず、ここに書いた分だけ直接つなぐ。
     * 省略した車種は「車種名を引き継いで相談へ」の導線になるため、
     * 新しい車種が入ってきても未指定のまま運用できます。
     */
    route?: string;
}

/** 集計月。見出しのラベルと注記に使う */
export const rankingMonth = '2026年10月';

/**
 * 集計月が基準日から2か月以上古いかを返す。
 * 月初の手動更新が止まったときに、鮮度の注記を添えるための判定です。
 */
export function isRankingStale(now: Date = new Date()): boolean {
    const matched = /^(\d+)年(\d+)月$/.exec(rankingMonth);
    // 表記を読めないときは注記を出さない（誤った警告を出さないため）
    if (!matched) return false;
    const months =
        (now.getFullYear() - Number(matched[1])) * 12 + (now.getMonth() + 1 - Number(matched[2]));
    return months >= 2;
}

/** 軽自動車 1〜15位（出典：全国軽自動車協会連合会） */
export const keiRanking: RankingItem[] = [
    { name: 'N-BOX', maker: 'ホンダ', units: 14832, route: '/kcar/nbox' },
    { name: 'スペーシア', maker: 'スズキ', units: 13474, route: '/kcar/spacia' },
    { name: 'タント', maker: 'ダイハツ', units: 12361, route: '/kcar/tantocustom' },
    { name: 'ムーヴ', maker: 'ダイハツ', units: 11713 },
    { name: 'ハスラー', maker: 'スズキ', units: 7201, route: '/kcar/hustler' },
    { name: 'ルークス', maker: '日産', units: 5663 },
    { name: 'ミラ', maker: 'ダイハツ', units: 5160 },
    { name: 'タフト', maker: 'ダイハツ', units: 4322 },
    { name: 'ワゴンR', maker: 'スズキ', units: 4227 },
    { name: 'デリカミニ／eK', maker: '三菱', units: 3877, route: '/kcar/delicamini' },
    { name: 'アルト', maker: 'スズキ', units: 3700 },
    { name: 'ジムニー', maker: 'スズキ', units: 2824, route: '/kcar/jimny' },
    { name: 'デイズ', maker: '日産', units: 2370 },
    { name: 'エブリイワゴン', maker: 'スズキ', units: 2018 },
    { name: 'N-ONE', maker: 'ホンダ', units: 1435 },
];

/** 乗用車 1〜15位（出典：日本自動車販売協会連合会／軽自動車・海外ブランド車を除く） */
export const registeredRanking: RankingItem[] = [
    { name: 'ヤリス', maker: 'トヨタ', units: 15157 },
    { name: 'シエンタ', maker: 'トヨタ', units: 10730 },
    { name: 'カローラ', maker: 'トヨタ', units: 10551 },
    { name: 'フリード', maker: 'ホンダ', units: 8634 },
    { name: 'ヴォクシー', maker: 'トヨタ', units: 7914, route: '/minivan/voxy' },
    { name: 'ルーミー', maker: 'トヨタ', units: 7755 },
    { name: 'ジムニー', maker: 'スズキ', units: 7231, route: '/suv/jimnysierra' },
    { name: 'アルファード', maker: 'トヨタ', units: 7224, route: '/minivan/alphard' },
    { name: 'ランドクルーザー', maker: 'トヨタ', units: 7154, route: '/suv/landcruiser' },
    { name: 'ヴェゼル', maker: 'ホンダ', units: 6530, route: '/suv/vezel' },
    { name: 'ノア', maker: 'トヨタ', units: 6304, route: '/minivan/noah' },
    { name: 'ステップワゴン', maker: 'ホンダ', units: 5708 },
    { name: 'アクア', maker: 'トヨタ', units: 5651 },
    { name: 'フォレスター', maker: 'SUBARU', units: 5315 },
    { name: 'RAV4', maker: 'トヨタ', units: 5296, route: '/suv/rav4' },
];
