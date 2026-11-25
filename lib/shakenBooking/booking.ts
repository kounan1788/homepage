/**
 * 車検のLINE予約で使う、画面とサーバーの両方で共通の処理。
 * - 選べる日の判定
 * - 入力の検証
 * - トークに送ってもらう申込文と、そのURL
 * - カレンダーから予約フォームへのリンク
 *
 * ブラウザでも動かすため、Node 専用の処理は置かない。
 */
import { LINE_URL } from '@/lib/chatFlow';
import { formatPlateNumber } from '@/lib/plateNumber';
import type { AvailabilityDay } from '@/lib/shakenCalendar/availability';
import { dayOfWeek, isValidYmd, parseDateStr } from '@/lib/shakenCalendar/dateUtils';
import { BOOKING_LIMITS } from './config';

/** フォームから届く値（検証前） */
export type ShakenBookingInput = {
    /** 第1希望日（yyyy-mm-dd・必須） */
    firstChoice: string;
    /** 第2希望日（yyyy-mm-dd・任意） */
    secondChoice?: string;
    /** お名前（必須） */
    displayName: string;
    /** 車種（必須） */
    carModel: string;
    /** ナンバー下4桁（任意） */
    plateLast4?: string;
    /** ご連絡事項（任意・改行可） */
    note?: string;
    /** 個人情報の取り扱いへの同意 */
    consent: boolean;
};

/** 検証済みの値。任意項目は未入力なら空文字 */
export type ValidBooking = {
    firstChoice: string;
    secondChoice: string;
    displayName: string;
    carModel: string;
    plateLast4: string;
    note: string;
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/** 前後の空白を落として文字列にそろえる。undefined と数値混入の両方に備える */
function clean(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

/**
 * 予約フォームで選べる日。
 * 明日以降で、受け入れ状況が〇（available）の日だけを昇順で返す。
 * △は「お電話で確認」の日なので選ばせない。
 */
export function getBookableDates(days: AvailabilityDay[], today: string): string[] {
    return days
        .filter((day) => day.status === 'available' && day.date > today)
        .map((day) => day.date)
        .sort();
}

/**
 * カレンダーで押された日を第1希望の初期値にする。
 * フォームを開くまでに〇でなくなった日は初期値にしない。
 */
export function pickInitialDate(requested: string | null, bookable: string[]): string {
    return requested && bookable.includes(requested) ? requested : '';
}

/**
 * カレンダーで押した日がフォームで選べないときの案内。
 * 今日の〇の日や、フォームを開くまでに〇でなくなった日から来た方が、理由がわからず迷わないようにする。
 * 選べる日、日付の指定が無い、日付として読めないときは空文字。
 */
export function requestedDateNotice(requested: string | null, bookable: string[]): string {
    if (!requested || !/^\d{4}-\d{2}-\d{2}$/.test(requested) || bookable.includes(requested)) return '';
    const { year, month, day } = parseDateStr(requested);
    if (!isValidYmd(year, month, day)) return '';
    return `${formatDateWithWeekday(requested)}は予約フォームではお選びいただけません。別の日をお選びいただくか、お電話でご相談ください。`;
}

/**
 * 入力値を検証する。問題なければ整形済みの値を、問題があればエラーメッセージを返す。
 * 画面とサーバーの両方で同じ判定を使う（サーバーではフォームを介さない直接送信も防ぐ）。
 */
export function validateBookingInput(
    input: ShakenBookingInput,
    bookable: string[]
): { ok: true; value: ValidBooking } | { ok: false; error: string } {
    const firstChoice = clean(input.firstChoice);
    const secondChoice = clean(input.secondChoice);
    const displayName = clean(input.displayName);
    const carModel = clean(input.carModel);
    const plateInput = clean(input.plateLast4);
    const note = clean(input.note);

    if (input.consent !== true) {
        return { ok: false, error: '個人情報の取り扱いへの同意が必要です。' };
    }

    if (!bookable.includes(firstChoice)) {
        return { ok: false, error: '第1希望日を選び直してください。' };
    }
    if (secondChoice) {
        if (!bookable.includes(secondChoice)) {
            return { ok: false, error: '第2希望日を選び直してください。' };
        }
        if (secondChoice === firstChoice) {
            return { ok: false, error: '第2希望日は第1希望日と別の日をお選びください。' };
        }
    }

    if (!displayName) {
        return { ok: false, error: 'お名前が入力されていません。' };
    }
    if (displayName.length > BOOKING_LIMITS.displayName) {
        return { ok: false, error: `お名前が長すぎます（${BOOKING_LIMITS.displayName}文字以内）。` };
    }
    if (/[\r\n]/.test(displayName)) {
        return { ok: false, error: 'お名前に改行は使用できません。' };
    }

    if (!carModel) {
        return { ok: false, error: '車種が入力されていません。' };
    }
    if (carModel.length > BOOKING_LIMITS.carModel) {
        return { ok: false, error: `車種が長すぎます（${BOOKING_LIMITS.carModel}文字以内）。` };
    }
    if (/[\r\n]/.test(carModel)) {
        return { ok: false, error: '車種に改行は使用できません。' };
    }

    // ナンバーは問い合わせフォーム・リマインダーと同じ判定・表記にそろえる
    const plateLast4 = formatPlateNumber(plateInput);
    if (plateLast4 === null) {
        return { ok: false, error: 'ナンバーは4桁以内の数字だけをご記入ください。' };
    }

    if (note.length > BOOKING_LIMITS.note) {
        return { ok: false, error: `ご連絡事項が長すぎます（${BOOKING_LIMITS.note}文字以内）。` };
    }

    return { ok: true, value: { firstChoice, secondChoice, displayName, carModel, plateLast4, note } };
}

/** yyyy-mm-dd を「12月10日（木）」の形にする */
export function formatDateWithWeekday(ymd: string): string {
    const { month, day } = parseDateStr(ymd);
    return `${month}月${day}日（${WEEKDAYS[dayOfWeek(ymd)]}）`;
}

/**
 * お客様にトークで送信してもらう申込文。
 * お店はこの受付番号でシートの行と突き合わせる。
 * 申込の時点では未確定であることを必ず書く（確定したと誤解させない）。
 */
export function buildBookingMessage(booking: ValidBooking & { bookingNumber: string }): string {
    const lines = [
        `【車検予約の申込】受付番号 ${booking.bookingNumber}`,
        `第1希望：${formatDateWithWeekday(booking.firstChoice)}`,
    ];
    if (booking.secondChoice) lines.push(`第2希望：${formatDateWithWeekday(booking.secondChoice)}`);
    lines.push(`お名前：${booking.displayName}`);
    lines.push(
        booking.plateLast4
            ? `車種：${booking.carModel}（ナンバー ${booking.plateLast4}）`
            : `車種：${booking.carModel}`
    );
    if (booking.note) lines.push(`ご連絡事項：${booking.note}`);
    lines.push('※まだ予約は確定していません。当店から確定のご連絡をします。');
    lines.push('※このまま送信してください');
    return lines.join('\n');
}

/** 公式アカウントとのトーク画面を、本文が入力済みの状態で開くURL */
export function buildOaMessageUrl(basicId: string, text: string): string {
    return `https://line.me/R/oaMessage/${encodeURIComponent(basicId)}/?${encodeURIComponent(text)}`;
}

/**
 * カレンダーの「LINEで予約する」の行き先。
 * 公開中でLIFF IDが設定されていれば、押した日付つきの予約フォーム。
 * それ以外は今まで通り友だち追加リンク。
 */
export function buildBookingFormHref(date: string, liffId: string | undefined, published: boolean): string {
    if (!published || !liffId) return LINE_URL;
    return `https://liff.line.me/${liffId}?date=${date}`;
}
