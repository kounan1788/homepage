/**
 * 各車種の基本月額料金を一元管理するファイル。
 * 車種個別ページおよびノレタページの両方からこのデータを参照することで、
 * 価格の不整合を防ぎます。
 *
 * キーは各車種ページのルートパス（例: '/suv/jimnysierra'）に対応しています。
 */

export const carBasePrices: Record<string, number> = {
    // SUV
    '/suv/jimnysierra': 35000,
    '/suv/yariscross': 42000,
    '/suv/xbee': 42000,
    '/suv/vezel': 49000,
    '/suv/corollacross': 52000,
    '/suv/harrier': 56000,
    '/suv/rav4': 60000,
    '/suv/landcruiser': 60000,
    '/suv/crown': 80500,
    '/suv/nx': 80000,

    // MINIVAN
    '/minivan/noah': 58000,
    '/minivan/voxy': 58000,
    '/minivan/alphard': 78000,

    // KCAR
    '/kcar/nbox': 24000,
    '/kcar/tantocustom': 32000,
    '/kcar/tantofuncross': 33000,
    '/kcar/delicamini': 24000,
    '/kcar/spacia': 22000,
    '/kcar/spaciagear': 22000,
    '/kcar/hustler': 22000,
    '/kcar/jimny': 23000,
};

/**
 * 数値の価格を「XX,XXX円～」形式の文字列にフォーマットします。
 */
export function formatPrice(price: number): string {
    return `${price.toLocaleString()}円～`;
}
