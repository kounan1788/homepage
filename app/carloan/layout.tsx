import type { Metadata } from 'next';
import { ogImage } from '@/lib/imageSize';

export const metadata: Metadata = {
    // 共通テンプレートを付けない完全なtitle（金利と流れを先頭で訴求）
    title: { absolute: '金沢の自動車ローン｜実質年率3.9%・審査の流れ｜港南自動車サービス' },
    description:
        '金沢市で自動車ローンをお探しなら港南自動車サービス。実質年率3.9%・頭金0円・ボーナス払いなしの自由返済型カーローン「ノレタ」。金利と返済期間の目安、ご相談から納車までの流れ、リースとの月額比較をまとめました。仮審査のご相談も受け付けています。',
    keywords: [
        'カーローン 金沢',
        '自動車ローン 金沢',
        '金沢市 カーローン',
        'マイカーローン 金沢',
        '車 ローン 石川県',
        'カーローン 低金利 金沢',
        'car loan 金沢',
        'ローン 審査 車 金沢',
        '頭金なし カーローン',
        '港南自動車 ローン',
    ],
    alternates: {
        canonical: '/carloan',
    },
    openGraph: {
        title: '金沢の自動車ローン｜実質年率3.9%・審査の流れ【港南自動車サービス】',
        description:
            '実質年率3.9%・頭金0円・ボーナス払いなしの自由返済型カーローン「ノレタ」。金利と返済期間の目安、審査から納車までの流れをまとめました。',
        url: 'https://www.kounan-auto.jp/carloan',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: ogImage('/og-image.jpg', '金沢市の自動車ローンなら港南自動車サービス'),
    },
};

export default function CarloanLayout({ children }: { children: React.ReactNode }) {
    // パンくず構造化データはページ内の Breadcrumb コンポーネントが出力する
    return <>{children}</>;
}
