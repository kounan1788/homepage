import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
    title: '港南自動車サービス｜車検・点検から新車・中古車販売まで',
    description: '金沢市の港南自動車サービスです。車検・整備、月々1.1万円から新車に乗れる「ノレタ」、新車・中古車販売など、地域に根ざしたサービスでお客様の安心・快適なカーライフをサポートします。',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ja" data-oid="fn6nn3g">
            <body className="" data-oid="wjvghu5">
                {children}
            </body>
        </html>
    );
}
