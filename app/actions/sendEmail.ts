'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: {
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
}) {
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
    } = formData;

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
            from: 'Kounan Auto Homepage <onboarding@resend.dev>',
            to: ['kounan.lease@gmail.com'],
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
