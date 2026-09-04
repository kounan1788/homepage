'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 送信元アドレス。
 * 既定値の onboarding@resend.dev は Resend のテスト用共有ドメインで、
 * 迷惑メール判定されやすく送信先も制限される。
 * kounan-auto.jp を Resend で認証したうえで、環境変数 RESEND_FROM に
 * 「港南自動車サービス <noreply@kounan-auto.jp>」の形式で設定すること。
 */
const FROM_ADDRESS = process.env.RESEND_FROM ?? 'Kounan Auto Homepage <onboarding@resend.dev>';

/** 送信先。フォームからは指定させない（第三者への踏み台送信を防ぐため） */
const TO_ADDRESS = 'kounan.lease@gmail.com';

/** 問い合わせジャンル。トップページの select の value と完全に一致させること */
const ALLOWED_CATEGORIES = new Set([
    '車検',
    '点検',
    '整備・修理',
    '板金修理',
    '新車販売',
    '中古車販売',
    'ノレタ',
    'ノリドク（法人向けリース）',
    'ローン・リース全般',
    '自動車保険',
    '採用・応募',
    'その他',
]);

/** 項目ごとの最大文字数。長文を貼り付けるスパムでメールが破綻しないようにする */
const MAX_LENGTH = {
    name: 100,
    email: 254,
    phone: 30,
    preferredDate: 20,
    preferredTime: 10,
    company: 120,
    jobTitle: 120,
    message: 2000,
} as const;

/** 同一IPからの送信上限（件数 / 期間）。ボットの連投を止めるための最低限の防波堤 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

/**
 * IPごとの送信時刻。
 * サーバーレスではインスタンスごとに独立するため完全な制限にはならないが、
 * 単一インスタンスへの連投は確実に止められる。
 */
const recentSubmissions = new Map<string, number[]>();

export interface ContactFormData {
    name: string;
    email: string;
    category: string;
    /** 折り返しの電話番号（任意） */
    phone?: string;
    preferredDate?: string;
    preferredTime?: string;
    /** ノリドク（法人リース）のときだけ入る会社情報 */
    company?: string;
    /** 採用・応募のときだけ入る希望職種 */
    jobTitle?: string;
    message: string;
    /**
     * ハニーポット。画面には出ない項目なので、人が入力することはない。
     * 値が入っていたらボットとみなす。
     */
    website?: string;
}

/** 送信元IPを取り出す。プロキシ経由なので x-forwarded-for の先頭を使う */
function getClientIp(): string {
    const headerList = headers();
    const forwarded = headerList.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return headerList.get('x-real-ip') ?? 'unknown';
}

/** 上限を超えていれば true。あわせて古い記録を捨てる */
function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const history = (recentSubmissions.get(ip) ?? []).filter(
        (time) => now - time < RATE_LIMIT_WINDOW_MS,
    );

    if (history.length >= RATE_LIMIT_MAX) {
        recentSubmissions.set(ip, history);
        return true;
    }

    history.push(now);
    recentSubmissions.set(ip, history);

    // Map が際限なく育たないよう、記録が空になったIPは削除する
    for (const [key, times] of recentSubmissions) {
        if (times.every((time) => now - time >= RATE_LIMIT_WINDOW_MS)) {
            recentSubmissions.delete(key);
        }
    }
    return false;
}

/** 前後の空白を落として文字列にそろえる。undefined と数値混入の両方に備える */
function clean(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

/**
 * 入力値を検証する。問題なければ整形済みの値を、問題があればエラーメッセージを返す。
 * ブラウザ側の required だけでは、フォームを介さない直接送信を防げないため必ず通す。
 */
function validate(
    formData: ContactFormData,
): { ok: true; value: Required<Omit<ContactFormData, 'website'>> } | { ok: false; error: string } {
    const name = clean(formData.name);
    const email = clean(formData.email);
    const category = clean(formData.category);
    const message = clean(formData.message);
    const phone = clean(formData.phone);
    const preferredDate = clean(formData.preferredDate);
    const preferredTime = clean(formData.preferredTime);
    const company = clean(formData.company);
    const jobTitle = clean(formData.jobTitle);

    if (!name || !email || !category || !message) {
        return { ok: false, error: '必須項目が入力されていません。' };
    }
    if (!ALLOWED_CATEGORIES.has(category)) {
        return { ok: false, error: 'お問い合わせジャンルを選び直してください。' };
    }
    // 「@ を含み、前後に文字があり、ドメインにドットがある」だけを見る簡易チェック。
    // 厳密な正規表現は正当なアドレスを弾くほうが害が大きい
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, error: 'メールアドレスの形式をご確認ください。' };
    }

    const lengths: [string, string, number][] = [
        ['お名前', name, MAX_LENGTH.name],
        ['メールアドレス', email, MAX_LENGTH.email],
        ['電話番号', phone, MAX_LENGTH.phone],
        ['ご希望日', preferredDate, MAX_LENGTH.preferredDate],
        ['ご希望時間', preferredTime, MAX_LENGTH.preferredTime],
        ['会社名・屋号', company, MAX_LENGTH.company],
        ['希望職種', jobTitle, MAX_LENGTH.jobTitle],
        ['お問い合わせ内容', message, MAX_LENGTH.message],
    ];
    for (const [label, value, max] of lengths) {
        if (value.length > max) {
            return { ok: false, error: `${label}が長すぎます（${max}文字以内）。` };
        }
    }

    // 件名は1行に収まる必要があるため、改行を含む名前は受け付けない
    if (/[\r\n]/.test(name) || /[\r\n]/.test(email)) {
        return { ok: false, error: 'お名前・メールアドレスに改行は使用できません。' };
    }

    return {
        ok: true,
        value: { name, email, category, phone, preferredDate, preferredTime, company, jobTitle, message },
    };
}

export async function sendEmail(formData: ContactFormData) {
    // ハニーポットに値が入っていたらボット。成功を返して、弾いたことを気づかせない
    if (clean(formData.website)) {
        return { success: true };
    }

    const validation = validate(formData);
    if (!validation.ok) {
        return { success: false, error: validation.error };
    }

    if (isRateLimited(getClientIp())) {
        return {
            success: false,
            error: '送信回数の上限に達しました。しばらく時間をおいてからお試しください。',
        };
    }

    const {
        name,
        email,
        category,
        phone,
        preferredDate,
        preferredTime,
        company,
        jobTitle,
        message,
    } = validation.value;

    // 希望日時が入力されている場合のみメール本文に追加する
    const preferredLine =
        preferredDate || preferredTime
            ? `ご希望日時: ${preferredDate || '指定なし'} ${preferredTime || ''}\n`
            : '';

    // 任意項目は入力されたときだけ行を足す
    const optionalLines = [
        phone ? `電話番号: ${phone}` : '',
        company ? `会社名・屋号: ${company}` : '',
        jobTitle ? `希望職種: ${jobTitle}` : '',
    ]
        .filter(Boolean)
        .join('\n');

    // 採用の連絡が営業の問い合わせに埋もれないよう、件名の先頭で区別する
    const isRecruit = category.includes('採用') || category.includes('応募');
    const subjectTag = isRecruit ? '【HP採用応募】' : '【HPお問い合わせ】';

    try {
        const data = await resend.emails.send({
            from: FROM_ADDRESS,
            to: [TO_ADDRESS],
            subject: `${subjectTag}${name}様より（${category}）`,
            replyTo: email,
            text: `
お名前: ${name}
メールアドレス: ${email}
お問い合わせジャンル: ${category}
${optionalLines ? optionalLines + '\n' : ''}${preferredLine}
メッセージ内容:
${message}
            `,
        });

        if (data.error) {
            console.error('Resend error:', data.error);
            return { success: false, error: data.error.message };
        }

        return { success: true };
    } catch (error: any) {
        console.error('Send email error:', error);
        return { success: false, error: error.message || '予期せぬエラーが発生しました。' };
    }
}
