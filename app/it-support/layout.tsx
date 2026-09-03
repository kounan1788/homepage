import type { Metadata } from 'next';
import { ogImage } from '@/lib/imageSize';

export const metadata: Metadata = {
    // 共通テンプレート（| 港南自動車サービス - 金沢市）を付けると社名が二重になるため absolute で指定
    title: { absolute: '金沢のAI導入・ホームページ制作支援｜港南自動車サービス' },
    description:
        '金沢市の中小企業・店舗向けIT支援。対面特化型のAI活用講座、ホームページ制作・運用、月額IT相談まで。自動車業界・店舗ビジネスに強い港南自動車サービスが二人三脚で伴走します。無料相談受付中。',
    keywords: [
        '金沢 AI導入',
        '金沢市 AI講座',
        '石川県 AI研修',
        '金沢 ホームページ制作',
        '金沢市 Web制作',
        '石川県 IT支援',
        '中小企業 IT相談 金沢',
        '店舗 DX 石川県',
        '港南自動車 IT支援',
    ],
    alternates: {
        canonical: '/it-support',
    },
    openGraph: {
        title: '金沢のAI導入・ホームページ制作支援｜港南自動車サービス',
        description:
            '金沢市の中小企業・店舗向けIT支援。対面特化型AI活用講座、ホームページ制作・運用、月額IT相談まで二人三脚で伴走します。',
        url: 'https://www.kounan-auto.jp/it-support',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: ogImage('/og-image.jpg', '金沢のAI導入・ホームページ制作支援｜港南自動車サービス'),
    },
};

export default function ItSupportLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
