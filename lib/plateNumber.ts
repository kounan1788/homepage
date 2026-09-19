/**
 * ナンバープレートの「一連指定番号」（大きく書かれた4桁以内の数字）の扱い。
 *
 * 当社をご利用中のお客様の車両を、問い合わせの時点で特定するために使う。
 * 問い合わせフォーム（入力欄の表示・入力チェック）と、メール送信のサーバー処理の
 * 両方がここを参照するので、判定と表示形式が食い違わない。
 *
 * 取得するのは一連指定番号だけで、地名・分類番号・ひらがなまでは求めない
 * （車両の特定には十分で、お客様に余計な情報を入力させないため）。
 */

/** ナンバー欄を出す問い合わせジャンル。トップページの select の value と一致させること */
export const VEHICLE_SERVICE_CATEGORIES: readonly string[] = ['車検', '点検', '整備・修理', '板金修理'];

/** 車検・整備など、お車をお預かりするジャンルかどうか */
export function isVehicleServiceCategory(category: string): boolean {
    return VEHICLE_SERVICE_CATEGORIES.includes(category);
}

/** 入力欄に許す最大文字数（「12-34」や「・・１２」などの表記ゆれを含めても収まる長さ） */
export const PLATE_INPUT_MAX_LENGTH = 9;

/**
 * 入力された一連指定番号を、ナンバープレートと同じ表記にそろえる。
 *
 * - 全角数字は半角に直し、数字以外（ハイフン・中黒・空白など）は無視する
 * - 4桁は「12-34」、3桁以下は先頭を「・」で埋めて「・123」「・・12」のようにする
 *
 * 戻り値: 空欄なら ''、1〜4桁の番号として読めなければ null
 */
export function formatPlateNumber(input: string): string | null {
    const halfWidth = input.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));

    // 数字と、番号の表記に使われる記号・空白以外が混じっていたら番号ではない
    if (/[^0-9\s\-－ー‐・･.．]/.test(halfWidth)) return null;

    const digits = halfWidth.replace(/\D/g, '');
    if (digits === '') return '';

    // 一連指定番号に0番はなく、先頭の0は「・」の位置にあたるので数値として扱う
    const number = Number(digits);
    if (number < 1 || number > 9999) return null;

    const text = String(number);
    return text.length === 4 ? `${text.slice(0, 2)}-${text.slice(2)}` : text.padStart(4, '・');
}

/**
 * LINEに貼り付けてもらう文面の記入欄。
 * 問い合わせの文面の先頭に置き、ご利用中のお客様に番号を書き添えてもらう
 */
export const PLATE_LINE_TEMPLATE = 'ナンバーの4桁（当社をご利用中の方）：';
