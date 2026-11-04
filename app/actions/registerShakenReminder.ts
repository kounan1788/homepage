'use server';

import { headers } from 'next/headers';
import { formatPlateNumber } from '@/lib/plateNumber';

/**
 * 車検満了日リマインダーの登録をGoogle Apps Scriptへ中継するサーバー処理。
 *
 * 保存と通知送信はGAS側で行う。ここはクライアントから届いた値を検証し、
 * 共有シークレットを付けてGASへ渡すだけ。
 * GASのURLとシークレットはこのファイル（サーバー側）の外へは一切出さない。
 */

/**
 * LINEのユーザーID。
 * クライアントが名乗った値は使わず、IDトークンを検証して得た sub だけを使う。
 * 形式の確認は、LINEの応答が想定外だった場合に備えた二重の歯止め。
 */
const LINE_USER_ID = /^U[0-9a-f]{32}$/;

/** IDトークンの検証先。aud（＝client_id）が自社のチャネルかどうかもここで確かめられる */
const LINE_VERIFY_ENDPOINT = 'https://api.line.me/oauth2/v2.1/verify';

/** IDトークンの検証を待つ上限 */
const LINE_TIMEOUT_MS = 10 * 1000;

/** 項目ごとの最大文字数。長文を貼り付けるスパムでシートが破綻しないようにする */
const MAX_LENGTH = {
    displayName: 100,
    carModel: 50,
    source: 40,
} as const;

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

export interface ShakenReminderFormData {
    /**
     * liff.getIDToken() のIDトークン。
     * userId を直接受け取らないのは、誰でもこの処理を呼べるため。
     * 形式だけ合った他人の userId を送られると、その方の登録を上書きできてしまう
     */
    idToken: string;
    /** 氏名（getProfile の displayName を初期値にした編集可能な項目） */
    displayName: string;
    /** 車検満了日（yyyy-mm-dd） */
    expiryDate: string;
    /** 車種（任意） */
    carModel?: string;
    /** ナンバー下4桁（任意） */
    plateLast4?: string;
    /** 流入元。店頭QRは ?src=store */
    source?: string;
    /** 個人情報の取り扱いへの同意 */
    consent: boolean;
    /**
     * ハニーポット。画面には出ない項目なので、人が入力することはない。
     * 値が入っていたらボットとみなす。
     */
    website?: string;
}

/** 前後の空白を落として文字列にそろえる。undefined と数値混入の両方に備える */
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
 * JSTでの今日を yyyy-mm-dd で返す。
 * Vercelの実行環境はUTCなので、UTCの日付で判定すると満了日の境目がずれる
 */
function todayInJst(): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

/** yyyy-mm-dd に年を足した yyyy-mm-dd を返す */
function addYears(ymd: string, years: number): string {
    const [year, month, day] = ymd.split('-').map(Number);
    return new Date(Date.UTC(year + years, month - 1, day)).toISOString().slice(0, 10);
}

/** 実在する日付の yyyy-mm-dd かどうか（2026-02-30 のような値を弾く） */
function isRealDate(ymd: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
    const date = new Date(`${ymd}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === ymd;
}

/**
 * 入力値を検証する。問題なければ整形済みの値を、問題があればエラーメッセージを返す。
 * ブラウザ側のチェックだけでは、フォームを介さない直接送信を防げないため必ず通す。
 */
function validate(formData: ShakenReminderFormData):
    | {
          ok: true;
          value: {
              displayName: string;
              expiryDate: string;
              carModel: string;
              plateLast4: string;
              source: string;
          };
      }
    | { ok: false; error: string } {
    const displayName = clean(formData.displayName);
    const expiryDate = clean(formData.expiryDate);
    const carModel = clean(formData.carModel);
    const plateInput = clean(formData.plateLast4);
    const source = clean(formData.source);

    if (formData.consent !== true) {
        return { ok: false, error: '個人情報の取り扱いへの同意が必要です。' };
    }

    if (!displayName) {
        return { ok: false, error: 'お名前が入力されていません。' };
    }
    if (displayName.length > MAX_LENGTH.displayName) {
        return { ok: false, error: `お名前が長すぎます（${MAX_LENGTH.displayName}文字以内）。` };
    }
    if (/[\r\n]/.test(displayName)) {
        return { ok: false, error: 'お名前に改行は使用できません。' };
    }

    if (!isRealDate(expiryDate)) {
        return { ok: false, error: '車検満了日をご確認ください。' };
    }
    const today = todayInJst();
    if (expiryDate <= today) {
        return { ok: false, error: '車検満了日は今日より後の日付をご指定ください。' };
    }
    if (expiryDate > addYears(today, 3)) {
        return { ok: false, error: '車検満了日は今日から3年以内の日付をご指定ください。' };
    }

    if (carModel.length > MAX_LENGTH.carModel) {
        return { ok: false, error: `車種が長すぎます（${MAX_LENGTH.carModel}文字以内）。` };
    }

    // ナンバーは問い合わせフォームと同じ判定・表記にそろえる（1〜4桁、全角可）
    const plateLast4 = formatPlateNumber(plateInput);
    if (plateLast4 === null) {
        return { ok: false, error: 'ナンバーは4桁以内の数字だけをご記入ください。' };
    }

    // 流入元はこちらが配布したQR等の値だけを想定している。想定外に長い値は捨てる
    return {
        ok: true,
        value: {
            displayName,
            expiryDate,
            carModel,
            plateLast4,
            source: source.length > MAX_LENGTH.source ? '' : source,
        },
    };
}

/**
 * IDトークンをLINEに検証してもらい、本人の userId（sub）を得る。
 *
 * この処理は誰でも呼べるので、クライアントが名乗った userId は使わない。
 * LINEの verify はトークンの署名・有効期限に加え、client_id と aud が
 * 一致するか（＝当社のチャネルで発行されたトークンか）も確かめてくれる。
 */
async function verifyLineUserId(
    idToken: string
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
    const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
    if (!channelId) {
        console.error('registerShakenReminder: LINE_LOGIN_CHANNEL_ID が未設定です');
        return { ok: false, error: '登録先の設定が未完了です。' };
    }
    if (!idToken) {
        return { ok: false, error: 'LINEの情報を取得できませんでした。LINEアプリから開き直してください。' };
    }

    let response: Response;
    try {
        response = await fetch(LINE_VERIFY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
            cache: 'no-store',
            signal: AbortSignal.timeout(LINE_TIMEOUT_MS),
        });
    } catch (error) {
        console.error('registerShakenReminder: LINE verify fetch error', error);
        return { ok: false, error: '通信エラーが発生しました。' };
    }

    // トークンの期限切れ・別チャネルのトークンなどはここで400が返る
    if (!response.ok) {
        console.error('registerShakenReminder: LINE verify error', response.status, await response.text());
        return {
            ok: false,
            error: 'LINEの認証を確認できませんでした。LINEアプリから開き直してください。',
        };
    }

    const payload = (await response.json()) as { sub?: unknown };
    const userId = typeof payload.sub === 'string' ? payload.sub : '';
    if (!LINE_USER_ID.test(userId)) {
        console.error('registerShakenReminder: LINE verify returned unexpected sub');
        return { ok: false, error: 'LINEの情報を取得できませんでした。' };
    }

    return { ok: true, userId };
}

/** GASの応答本文（JSON）が成功を示しているか */
function isGasSuccess(body: string): boolean {
    try {
        return (JSON.parse(body) as { ok?: unknown }).ok === true;
    } catch {
        return false;
    }
}

export async function registerShakenReminder(formData: ShakenReminderFormData) {
    // ハニーポットに値が入っていたらボット。成功を返して、弾いたことを気づかせない
    if (clean(formData.website)) {
        return { success: true as const };
    }

    const validation = validate(formData);
    if (!validation.ok) {
        return { success: false as const, error: validation.error };
    }

    if (isRateLimited(getClientIp())) {
        return {
            success: false as const,
            error: '送信間隔が短すぎます。1分ほどおいてからお試しください。',
        };
    }

    const webhookUrl = process.env.GAS_WEBHOOK_URL;
    const sharedSecret = process.env.GAS_SHARED_SECRET;
    if (!webhookUrl || !sharedSecret) {
        console.error('registerShakenReminder: GAS_WEBHOOK_URL / GAS_SHARED_SECRET が未設定です');
        return { success: false as const, error: '登録先の設定が未完了です。' };
    }

    // 誰の登録かは、クライアントの申告ではなくLINEに確認した結果だけで決める
    const verified = await verifyLineUserId(clean(formData.idToken));
    if (!verified.ok) {
        return { success: false as const, error: verified.error };
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: sharedSecret,
                userId: verified.userId,
                ...validation.value,
            }),
            cache: 'no-store',
            signal: AbortSignal.timeout(GAS_TIMEOUT_MS),
        });

        const body = await response.text();

        if (!response.ok) {
            // 応答本文はエラーの原因切り分けに必要なのでログに残す（お客様には見せない）
            console.error('registerShakenReminder: GAS error', response.status, body);
            return { success: false as const, error: '登録処理でエラーが発生しました。' };
        }

        // GASのウェブアプリは拒否した要求にも200を返すため、本文の ok も確認する
        // （これを見ないと、シークレット不一致でも登録できたことになってしまう）
        if (!isGasSuccess(body)) {
            console.error('registerShakenReminder: GAS rejected', body);
            return { success: false as const, error: '登録処理でエラーが発生しました。' };
        }

        return { success: true as const };
    } catch (error) {
        console.error('registerShakenReminder: fetch error', error);
        return { success: false as const, error: '通信エラーが発生しました。' };
    }
}
