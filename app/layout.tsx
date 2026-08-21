import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

// ブラウザUI（アドレスバー等）の色をページ地色に合わせる
export const viewport: Viewport = {
    themeColor: '#ffffff',
    colorScheme: 'light',
};

export const metadata: Metadata = {
    metadataBase: new URL('https://www.kounan-auto.jp'),
    title: {
        default: '金沢の新車販売・車検・月々定額カーリース｜港南自動車サービス',
        template: '%s | 港南自動車サービス - 金沢市',
    },
    description:
        '金沢で新車をお探しなら港南自動車サービス。頭金0円・月々27,000円〜の定額カーリース「ノレタ」で新車に乗れます。車検・整備、新車・中古車販売まで創業70年の実績。',
    keywords: [
        '港南自動車',
        '港南自動車サービス',
        '金沢市 車検',
        '金沢市 新車',
        '金沢市 自動車整備',
        '石川県 車検',
        '金沢 車検 安い',
        '金沢市 中古車',
        '新車販売 金沢',
        'カーリース 金沢',
        'ノレタ',
        'ノリドク',
        '法人リース 石川',
        '車検 金沢市 おすすめ',
        '自動車整備 石川県',
    ],
    authors: [{ name: '株式会社港南自動車サービス' }],
    creator: '株式会社港南自動車サービス',
    publisher: '株式会社港南自動車サービス',
    applicationName: '株式会社港南自動車サービス',
    formatDetection: {
        email: false,
        address: false,
        telephone: true,
    },
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: '金沢の新車販売・車検・月々定額カーリース｜港南自動車サービス',
        description:
            '金沢で新車をお探しなら港南自動車サービス。頭金0円・月々27,000円〜の定額カーリース「ノレタ」。車検・整備から新車・中古車販売まで創業70年の実績。',
        url: 'https://www.kounan-auto.jp',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: '港南自動車サービス - 石川県金沢市の車検・自動車整備・新車販売',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '金沢の新車販売・車検・カーリース｜港南自動車サービス',
        description:
            '頭金0円・月々27,000円〜で新車に乗れる「ノレタ」。車検・整備から新車販売まで創業70年。',
        images: ['/og-image.jpg'],
    },
    verification: {
        google: '-W2UbNO9NQ_vzSdJH6hzGyC8-VrA04QghkXdl8JvSLc',
    },
    icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/icon.png',
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    // LocalBusiness 構造化データ
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'AutoRepair', 'AutoDealer'],
        '@id': 'https://www.kounan-auto.jp/#organization',
        name: '株式会社港南自動車サービス',
        // 誤表記（湖南・河南）でも検索されているため alternateName に含める
        alternateName: ['港南自動車', '港南自動車サービス', '湖南自動車', '河南自動車'],
        image: 'https://www.kounan-auto.jp/logo.png',
        url: 'https://www.kounan-auto.jp',
        telephone: '076-268-1788',
        faxNumber: '076-268-3163',
        email: 'info@kounan-auto.jp',
        priceRange: '¥¥',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '金石本町ハ14番地',
            addressLocality: '金沢市',
            addressRegion: '石川県',
            postalCode: '920-0336',
            addressCountry: 'JP',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 36.6268,
            longitude: 136.6406,
        },
        areaServed: [
            { '@type': 'City', name: '金沢市' },
            { '@type': 'State', name: '石川県' },
        ],
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '09:00',
                closes: '17:00',
            },
        ],
        description:
            '石川県金沢市で創業70年の自動車整備工場。車検、一般整備、新車・中古車販売、カーリース「ノレタ」「ノリドク」を展開。金沢市の車検なら港南自動車へ。',
        foundingDate: '1956',
        slogan: '安心・快適なカーライフを',
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: '港南自動車サービス一覧',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: { '@type': 'Service', name: '車検・点検' },
                },
                {
                    '@type': 'Offer',
                    itemOffered: { '@type': 'Service', name: '新車販売' },
                },
                {
                    '@type': 'Offer',
                    itemOffered: { '@type': 'Service', name: '中古車販売' },
                },
                {
                    '@type': 'Offer',
                    itemOffered: { '@type': 'Service', name: 'カーリース「ノレタ」' },
                },
                {
                    '@type': 'Offer',
                    itemOffered: { '@type': 'Service', name: '法人リース「ノリドク」' },
                },
            ],
        },
        sameAs: ['https://www.instagram.com/kounanj_kanazawa/'],
    };

    // WebSite 構造化データ
    const webSiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://www.kounan-auto.jp/#website',
        url: 'https://www.kounan-auto.jp',
        name: '株式会社港南自動車サービス',
        alternateName: ['港南自動車', '港南自動車サービス', '湖南自動車', '河南自動車'],
        description: '石川県金沢市の車検・新車販売・カーリース',
        publisher: { '@id': 'https://www.kounan-auto.jp/#organization' },
        inLanguage: 'ja',
    };

    return (
        <html lang="ja" className="scroll-smooth" data-oid="fn6nn3g">
            <head>
                {/* 本文・見出し: Zen Kaku Gothic New / 数値・ラベル: IBM Plex Mono
                    取得できない環境では tailwind.config.ts のフォールバック（ヒラギノ角ゴ等）で表示される */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* App Router のルートレイアウトなので全ページに適用される。
                    next/font はビルド時に和文サブセットの取得が必要になり、
                    ネットワークが無い環境でビルドが落ちるため採用していない。 */}
                {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                <link
                    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Zen+Maru+Gothic:wght@500;700;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-white font-sans text-gray-900 antialiased" data-oid="wjvghu5">
                {/* Tabキーの最初の到達先。ヘッダーを読み飛ばして本文へ移動できる */}
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-teal-700 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
                >
                    本文へスキップ
                </a>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
                />
                {children}
            </body>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
        </html>
    );
}
