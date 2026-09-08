/**
 * 取扱車種の一覧を一元管理するファイル。
 * ノレタページと新車販売ページの両方がここを参照することで、
 * 車種名・写真・リンク先の不整合を防ぎます。
 *
 * 月額料金は lib/carPrices.ts の carBasePrices が単一の情報源です。
 */

import { carBasePrices } from './carPrices';

export type CarCategory = 'SUV' | 'MINIVAN' | 'KCAR';

export interface CarLineupItem {
    name: string;
    /** 車種ページのルート。carBasePrices のキーと一致する */
    route: string;
    image: string;
    /** メーカー名。新車販売ページのメーカー別の並びに使う */
    maker: string;
}

/** カテゴリの日本語表示名 */
export const categoryLabels: Record<CarCategory, string> = {
    SUV: 'SUV',
    MINIVAN: 'ミニバン',
    KCAR: '軽自動車',
};

export const carLineup: Record<CarCategory, CarLineupItem[]> = {
    SUV: [
        { name: 'ジムニーシエラ', route: '/suv/jimnysierra', image: '/cars/jimnysierra.jpg', maker: 'スズキ' },
        { name: 'ヤリスクロス', route: '/suv/yariscross', image: '/cars/yariscross.jpg', maker: 'トヨタ' },
        { name: 'クロスビー', route: '/suv/xbee', image: '/cars/xbee.jpg', maker: 'スズキ' },
        { name: 'ヴェゼル', route: '/suv/vezel', image: '/cars/vezel.jpg', maker: 'ホンダ' },
        { name: 'カローラクロス', route: '/suv/corollacross', image: '/cars/corollacross.jpg', maker: 'トヨタ' },
        { name: 'ハリアー', route: '/suv/harrier', image: '/cars/harrier.jpg', maker: 'トヨタ' },
        { name: 'RAV4', route: '/suv/rav4', image: '/cars/rav4.jpg', maker: 'トヨタ' },
        { name: 'ランクル 250', route: '/suv/landcruiser', image: '/cars/landcruiser.jpg', maker: 'トヨタ' },
        { name: 'クラウンスポーツ', route: '/suv/crown', image: '/cars/crownsport.jpg', maker: 'トヨタ' },
        { name: 'NX', route: '/suv/nx', image: '/cars/nx.jpg', maker: 'レクサス' },
    ],

    MINIVAN: [
        { name: 'ノア', route: '/minivan/noah', image: '/cars/noah.jpg', maker: 'トヨタ' },
        { name: 'ヴォクシー', route: '/minivan/voxy', image: '/cars/voxy.jpg', maker: 'トヨタ' },
        { name: 'アルファード', route: '/minivan/alphard', image: '/cars/alphard.jpg', maker: 'トヨタ' },
    ],

    KCAR: [
        { name: 'N-BOX カスタム', route: '/kcar/nbox', image: '/cars/nbox.jpg', maker: 'ホンダ' },
        { name: 'タントカスタム', route: '/kcar/tantocustom', image: '/cars/tantocustom.jpg', maker: 'ダイハツ' },
        { name: 'タントファンクロス', route: '/kcar/tantofuncross', image: '/cars/tantofuncross.jpg', maker: 'ダイハツ' },
        { name: 'デリカミニ', route: '/kcar/delicamini', image: '/cars/delicamini.jpg', maker: '三菱' },
        { name: 'スペーシアカスタム', route: '/kcar/spacia', image: '/cars/spacia.jpg', maker: 'スズキ' },
        { name: 'スペーシアギア', route: '/kcar/spaciagear', image: '/cars/spaciagear.jpg', maker: 'スズキ' },
        { name: 'ハスラー', route: '/kcar/hustler', image: '/cars/hustler.jpg', maker: 'スズキ' },
        { name: 'ジムニー', route: '/kcar/jimny', image: '/cars/jimny.jpg', maker: 'スズキ' },
    ],
};

/**
 * 一覧カードで車体の見え方を揃えるための倍率。
 * 写真ごとに車が写り込む大きさ（余白の量）も縦横比も違うため、
 * 実測した車体の幅をもとに、どのカードでも同じ大きさに見えるよう補正する。
 */
export const carImageScale: Record<string, number> = {
    '/cars/jimnysierra.jpg': 0.91,
    '/cars/yariscross.jpg': 1.29,
    '/cars/xbee.jpg': 0.99,
    '/cars/vezel.jpg': 0.89,
    '/cars/corollacross.jpg': 1.06,
    '/cars/harrier.jpg': 0.97,
    '/cars/rav4.jpg': 1.18,
    '/cars/landcruiser.jpg': 1.0,
    '/cars/crownsport.jpg': 0.96,
    '/cars/nx.jpg': 0.99,
    '/cars/noah.jpg': 0.99,
    '/cars/voxy.jpg': 0.98,
    '/cars/alphard.jpg': 0.99,
    '/cars/nbox.jpg': 1.41,
    '/cars/tantocustom.jpg': 1.04,
    '/cars/tantofuncross.jpg': 1.03,
    '/cars/delicamini.jpg': 1.12,
    '/cars/spacia.jpg': 0.93,
    '/cars/spaciagear.jpg': 1.0,
    '/cars/hustler.jpg': 1.03,
    '/cars/jimny.jpg': 0.96,
};

/** 月額の安い順に並べ替える（元の配列は変更しない） */
export function sortByPrice(cars: CarLineupItem[]): CarLineupItem[] {
    return [...cars].sort(
        (a, b) => (carBasePrices[a.route] ?? 0) - (carBasePrices[b.route] ?? 0)
    );
}

/** カテゴリごとに月額の安い順へ並べ替えた一覧 */
export const sortedCarLineup: Record<CarCategory, CarLineupItem[]> = {
    SUV: sortByPrice(carLineup.SUV),
    MINIVAN: sortByPrice(carLineup.MINIVAN),
    KCAR: sortByPrice(carLineup.KCAR),
};

/** 取扱メーカー（実際に一覧へ載せている車種のメーカー） */
export const lineupMakers: string[] = Array.from(
    new Set(
        (Object.keys(carLineup) as CarCategory[]).flatMap((cat) =>
            carLineup[cat].map((car) => car.maker)
        )
    )
);
