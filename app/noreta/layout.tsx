import type { Metadata } from 'next';
import { ogImage } from '@/lib/imageSize';

export const metadata: Metadata = {
    // 「金沢 新車」は /shinsha が受け持つため、このページは商品名「ノレタ」と月々定額の仕組みで立てる。
    // 共通テンプレートを付けると社名が二重になるので absolute で指定する
    title: { absolute: 'ノレタ｜頭金0円・車検込みの月々定額カーローン｜港南自動車サービス' },
    description:
        '港南自動車サービス（石川県金沢市）の個人向けカーローン「ノレタ」。頭金0円・ボーナス払いなしで、車検やオイル交換などの維持費まで月々の定額に含められます。実質年率3.9%・36回。軽自動車は月々27,000円から、車種ごとの月額を掲載しています。',
    keywords: [
        '金沢市 新車',
        '新車リース 金沢',
        'カーリース 金沢',
        'ノレタ',
        '新車 月々 定額',
        '頭金なし 新車',
        '金沢 カーリース おすすめ',
        '軽自動車 リース 金沢',
        '石川県 カーリース',
        '港南自動車 ノレタ',
    ],
    alternates: {
        canonical: '/noreta',
    },
    openGraph: {
        title: 'ノレタ｜頭金0円・車検込みの月々定額カーローン｜港南自動車サービス',
        description:
            '頭金0円・ボーナス払いなし。車検やオイル交換まで月々の定額に含められる、港南自動車サービスのカーローン「ノレタ」。',
        url: 'https://www.kounan-auto.jp/noreta',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: ogImage('/og-image.jpg', '金沢市の新車カーローン「ノレタ」港南自動車サービス'),
    },
};

export default function NoretaLayout({ children }: { children: React.ReactNode }) {
    // パンくず構造化データ（ホーム > ノレタ）
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://www.kounan-auto.jp' },
            { '@type': 'ListItem', position: 2, name: '新車カーローン「ノレタ」' },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {children}
        </>
    );
}
