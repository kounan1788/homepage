import type { Metadata } from 'next';
import { ogImage } from '@/lib/imageSize';

export const metadata: Metadata = {
    title: '金沢市の車検 65,040円〜｜最短90分立会い車検',
    description:
        '金沢市の車検が法定費用込み65,040円〜。新車購入後の初回車検限定・最短90分の立会い車検、完全予約制・1日3台。国家資格整備士が丁寧に対応。電話・LINEで予約できます。',
    keywords: [
        '金沢市 車検',
        '石川県 車検',
        '車検 金沢',
        '金沢 車検 安い',
        '車検 金沢市 おすすめ',
        '軽自動車 車検 金沢',
        'スピード車検 金沢',
        '港南自動車 車検',
        '車検費用 金沢市',
        '車検 石川県 格安',
    ],
    alternates: {
        canonical: '/shaken',
    },
    openGraph: {
        title: '金沢市の車検 65,040円〜｜最短90分【港南自動車サービス】',
        description:
            '金沢市の車検が法定費用込み65,040円〜。最短90分立会い車検（新車購入後の初回車検限定）。完全予約制・1日3台。',
        url: 'https://www.kounan-auto.jp/shaken',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: ogImage('/og-image.jpg', '金沢市の車検なら港南自動車サービス'),
    },
};

export default function ShakenLayout({ children }: { children: React.ReactNode }) {
    // パンくず構造化データはページ内の Breadcrumb コンポーネントが出力する
    return <>{children}</>;
}
