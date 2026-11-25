'use server';

import { headers } from 'next/headers';
import { verifyLineUserId } from '@/lib/line/verifyLineUserId';
import { getBookableDates, validateBookingInput, type ShakenBookingInput } from '@/lib/shakenBooking/booking';
import { todayInJapan } from '@/lib/shakenCalendar/dateUtils';
import { getAvailability } from '@/lib/shakenCalendar/service';

/**
 * 車検のLINE予約の申込をGoogle Apps Scriptへ中継するサーバー処理。
 *
 * 記録・店舗へのメール・受付番号の採番はGAS側で行う。ここは
 * 入力と希望日を検証し、LINEで本人を確かめ、共有シークレットを付けてGASへ渡すだけ。
 * GASのURLとシークレットはこのファイル（サーバー側）の外へは一切出さない。
 * 守り方は車検満了日リマインダー（registerShakenReminder.ts）とそろえている。
 */

export type ShakenBookingFormData = ShakenBookingInput & {
    /**
     * liff.getIDToken() のIDトークン。
     * userId を直接受け取らないのは、誰でもこの処理を呼べるため
     */
    idToken: string;
    /**
     * ハニーポット。画面には出ない項目なので、人が入力することはない。
     * 値が入っていたらボットとみなす。
     */
    website?: string;
};

type BookingResult = { success: true; bookingNumber: string } | { success: false; error: string };

const TEL = '076-268-1788';

/** 同一IPからの連続送信を抑える間隔 */
const RATE_LIMIT_INTERVAL_MS = 60 * 1000;

/**
 * IPごとの最終送信時刻。
 * サーバーレスではインスタンスごとに独立するため完全な制限にはならないが、
 * 単一インスタンスへの連投は確実に止められる。
 */
const lastSubmittedAt = new Map<string, number>();

/** GASの応答を待つ上限。待ち続けて画面が固まるのを防ぐ */
const GAS_TIMEOUT_MS = 10 * 1000;

/** 前後の空白を落として文字列にそろえる */
function clean(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

/** 送信元IPを取り出す。プロキシ経由なので x-forwarded-for の先頭を使う */
function getClientIp(): string {
    const headerList = headers();
    const forwarded = headerList.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return headerList.get('x-real-ip') ?? 'unknown';
}

/** 前回送信から60秒経っていなければ true。あわせて古い記録を捨てる */
function isRateLimited(ip: string): boolean {
    const now = Date.now();

    for (const [key, time] of lastSubmittedAt) {
        if (now - time >= RATE_LIMIT_INTERVAL_MS) lastSubmittedAt.delete(key);
    }

    const previous = lastSubmittedAt.get(ip);
    if (previous !== undefined && now - previous < RATE_LIMIT_INTERVAL_MS) return true;

    lastSubmittedAt.set(ip, now);
    return false;
}

/**
 * GASの応答本文から受付番号を取り出す。
 * GASのウェブアプリは拒否した要求にも200を返すため、ok と受付番号の両方がそろったときだけ成功とする。
 */
function readBookingNumber(body: string): string | null {
    try {
        const parsed = JSON.parse(body) as { ok?: unknown; bookingNumber?: unknown };
        if (parsed.ok !== true) return null;
        return typeof parsed.bookingNumber === 'string' && parsed.bookingNumber ? parsed.bookingNumber : null;
    } catch {
        return null;
    }
}

export async function requestShakenBooking(formData: ShakenBookingFormData): Promise<BookingResult> {
    // ハニーポットに値が入っていたらボット。成功を返して、弾いたことを気づかせない
    if (clean(formData.website)) {
        return { success: true, bookingNumber: '' };
    }

    // 希望日はブラウザの申告を信じず、サーバーで受け入れ状況を読み直して確かめる
    const availability = await getAvailability();
    const bookable = getBookableDates(availability.days, todayInJapan());
    if (bookable.length === 0) {
        return {
            success: false,
            error: `現在、予約フォームでの受付を停止しています。お手数ですが ${TEL} へお電話ください。`,
        };
    }

    const validation = validateBookingInput(formData, bookable);
    if (!validation.ok) {
        return { success: false, error: validation.error };
    }

    if (isRateLimited(getClientIp())) {
        return { success: false, error: '送信間隔が短すぎます。1分ほどおいてからお試しください。' };
    }

    const webhookUrl = process.env.GAS_WEBHOOK_URL;
    const sharedSecret = process.env.GAS_SHARED_SECRET;
    if (!webhookUrl || !sharedSecret) {
        console.error('requestShakenBooking: GAS_WEBHOOK_URL / GAS_SHARED_SECRET が未設定です');
        return { success: false, error: '受付の設定が未完了です。' };
    }

    // 誰の申込かは、クライアントの申告ではなくLINEに確認した結果だけで決める
    const verified = await verifyLineUserId(clean(formData.idToken), 'requestShakenBooking');
    if (!verified.ok) {
        return { success: false, error: verified.error };
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: sharedSecret,
                type: 'booking',
                userId: verified.userId,
                ...validation.value,
            }),
            cache: 'no-store',
            signal: AbortSignal.timeout(GAS_TIMEOUT_MS),
        });

        const body = await response.text();

        if (!response.ok) {
            // 応答本文はエラーの原因切り分けに必要なのでログに残す（お客様には見せない）
            console.error('requestShakenBooking: GAS error', response.status, body);
            return { success: false, error: '受付処理でエラーが発生しました。' };
        }

        const bookingNumber = readBookingNumber(body);
        if (!bookingNumber) {
            console.error('requestShakenBooking: GAS rejected', body);
            return { success: false, error: '受付処理でエラーが発生しました。' };
        }

        return { success: true, bookingNumber };
    } catch (error) {
        console.error('requestShakenBooking: fetch error', error);
        return { success: false, error: '通信エラーが発生しました。' };
    }
}
