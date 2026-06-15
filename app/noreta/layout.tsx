import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '金沢市で新車に乗るなら「ノレタ」｜月々定額・頭金なしの新車リース',
    description:
        '金沢市で新車をお探しなら港南自動車の「ノレタ」。月々定額、頭金・ボーナス払いなしで新車に乗れる3年リースプラン。軽自動車27,000円〜、SUV35,000円〜。車検・メンテナンスもコミコミで安心。石川県金沢市の方はお気軽にご相談ください。',
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
        title: '金沢市で新車に乗るなら「ノレタ」｜月々定額・頭金なし【港南自動車サービス】',
        description:
            '金沢市で新車をお探しなら港南自動車の「ノレタ」。月々定額、頭金・ボーナス払いなしで新車に乗れます。',
        url: 'https://www.kounan-auto.jp/noreta',
        type: 'website',
        locale: 'ja_JP',
        siteName: '港南自動車サービス株式会社',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: '金沢市の新車リース「ノレタ」港南自動車サービス',
            },
        ],
    },
};

export default function NoretaLayout({ children }: { children: React.ReactNode }) {
    // パンくず構造化データ（ホーム > ノレタ）
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://www.kounan-auto.jp' },
            { '@type': 'ListItem', position: 2, name: '新車リース「ノレタ」' },
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
