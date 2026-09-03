import type { Metadata } from 'next';
import { ogImage } from '@/lib/imageSize';

export const metadata: Metadata = {
    title: { absolute: 'IT支援の料金プラン｜AI講座・HP制作｜港南自動車サービス' },
    description:
        '港南自動車サービスのIT支援料金。企業向け「月額IT支援サポート」、対面特化型AI講座（グループ割引あり）、テンプレート〜オリジナルまでのホームページ制作費用を明瞭に掲載しています。',
    keywords: [
        'AI講座 料金 金沢',
        'ホームページ制作 費用 金沢',
        '金沢市 Web制作 料金',
        'IT顧問 月額 石川県',
        '中小企業 IT支援 料金',
        '港南自動車 IT支援 料金',
    ],
    alternates: {
        canonical: '/it-support/pricing',
    },
    openGraph: {
        title: 'IT支援の料金プラン｜港南自動車サービス',
        description:
            '月額IT支援サポート、対面特化型AI講座、ホームページ制作の料金を明瞭に掲載。課題や規模に合わせてお選びいただけます。',
        url: 'https://www.kounan-auto.jp/it-support/pricing',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: ogImage('/og-image.jpg', 'IT支援の料金プラン｜港南自動車サービス'),
    },
};

export default function ItSupportPricingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
