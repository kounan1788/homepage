/**
 * 各車種の基本月額料金を一元管理するファイル。
 * 車種個別ページおよびノレタページの両方からこのデータを参照することで、
 * 価格の不整合を防ぎます。
 *
 * キーは各車種ページのルートパス（例: '/suv/jimnysierra'）に対応しています。
 */

export const carBasePrices: Record<string, number> = {
    // SUV
    '/suv/jimnysierra': 41000,
    '/suv/yariscross': 47000,
    '/suv/xbee': 42000,
    '/suv/vezel': 51000,
    '/suv/corollacross': 52000,
    '/suv/harrier': 56000,
    '/suv/rav4': 60000,
    '/suv/landcruiser': 70000,
    '/suv/crown': 80500,
    '/suv/nx': 80000,

    // MINIVAN
    '/minivan/noah': 58000,
    '/minivan/voxy': 58000,
    '/minivan/alphard': 78000,

    // KCAR
    '/kcar/nbox': 33000,
    '/kcar/tantocustom': 36000,
    '/kcar/tantofuncross': 37000,
    '/kcar/delicamini': 39000,
    '/kcar/spacia': 28000,
    '/kcar/spaciagear': 29000,
    '/kcar/hustler': 27000,
    '/kcar/jimny': 27000,
};

/**
 * 数値の価格を「XX,XXX円～」形式の文字列にフォーマットします。
 */
export function formatPrice(price: number): string {
    return `${price.toLocaleString()}円～`;
}

/** ノレタの実質年率。計算とページ表記の両方がここを参照します。 */
export const ANNUAL_INTEREST_RATE = 0.039;

/** 支払回数（全車種一律36回） */
export const LOAN_PAYMENTS = 36;

/** ボーナス払いの間隔（年2回＝6か月ごと） */
export const BONUS_INTERVAL_MONTHS = 6;

/**
 * ローン計算に使う車種ごとの元金（円）。
 * TODO: 現在の値は各ページのグレードに対応する車両価格の概算サンプルです。
 *       正確な金額に手動で差し替えてください。
 */
export const carLoanPrincipals: Record<string, number> = {
    // SUV
    '/suv/jimnysierra': 2800000, // JC・4WD
    '/suv/yariscross': 3500000, // ハイブリッドZ・2WD
    '/suv/xbee': 2900000, // HYBRID MZ・2WD
    '/suv/vezel': 3800000, // e:HEV Z・2WD
    '/suv/corollacross': 4200000, // ハイブリッド Z・2WD
    '/suv/harrier': 5700000, // Z GAS・2WD
    '/suv/rav4': 5400000, // Adventure OFFROAD package II・4WD
    '/suv/landcruiser': 6350000, // VZ GAS・4WD
    '/suv/crown': 6700000, // CROSSOVER RS・AWD
    '/suv/nx': 7400000, // 350h Fスポーツ・2WD

    // MINIVAN
    '/minivan/noah': 4900000, // S-Z GAS・7人
    '/minivan/voxy': 5000000, // S-Z GAS・7人
    '/minivan/alphard': 6500000, // Z GAS・2WD

    // KCAR
    '/kcar/nbox': 2500000, // カスタム・2WD
    '/kcar/tantocustom': 2400000, // カスタム RS・2WD
    '/kcar/tantofuncross': 2100000, // ファンクロス・2WD
    '/kcar/delicamini': 2900000, // T Premium・2WD
    '/kcar/spacia': 2300000, // カスタム XS・2WD
    '/kcar/spaciagear': 2300000, // ギア XZ・2WD
    '/kcar/hustler': 2200000, // タフワイルド・2WD
    '/kcar/jimny': 2500000, // XC AT・4WD
};
