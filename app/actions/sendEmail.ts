'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: {
    name: string;
    email: string;
    category: string;
    message: string;
}) {
    const { name, email, category, message } = formData;

    try {
        const data = await resend.emails.send({
            from: 'Kounan Auto Homepage <onboarding@resend.dev>',
            to: ['kounan.lease@gmail.com'],
            subject: `【HPお問い合わせ】${name}様より（${category}）`,
            replyTo: email,
            text: `
お名前: ${name}
メールアドレス: ${email}
お問い合わせジャンル: ${category}

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
