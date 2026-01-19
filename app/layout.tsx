import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    metadataBase: new URL('https://kounan-auto.jp'),
    title: {
        default: '港南自動車｜金沢市の車検・新車販売・カーリース【創業60年】',
        template: '%s | 港南自動車サービス - 金沢市',
    },
    description:
        '石川県金沢市の港南自動車サービスは創業60年以上の信頼と実績。車検・整備から新車・中古車販売、月々定額カーリース「ノレタ」まで対応。金沢市で車検をお探しなら港南自動車へ。全メーカー対応、最短90分スピード車検。',
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
        title: '港南自動車｜金沢市の車検・新車販売・カーリース【創業60年】',
        description:
            '石川県金沢市の港南自動車サービス。車検・整備から新車・中古車販売、月々定額カーリース「ノレタ」まで。創業60年以上の信頼と実績。',
        url: 'https://kounan-auto.jp',
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
        title: '港南自動車｜金沢市の車検・新車販売【創業60年】',
        description:
            '石川県金沢市の港南自動車。車検・整備から新車販売まで。創業60年以上の信頼と実績。',
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
        '@id': 'https://kounan-auto.jp/#organization',
        name: '株式会社港南自動車サービス',
        alternateName: ['港南自動車', '港南自動車サービス'],
        image: 'https://kounan-auto.jp/logo.png',
        url: 'https://kounan-auto.jp',
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
            '石川県金沢市で創業60年以上の自動車整備工場。車検、一般整備、新車・中古車販売、カーリース「ノレタ」「ノリドク」を展開。金沢市の車検なら港南自動車へ。',
        foundingDate: '1964',
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
        sameAs: ['https://www.instagram.com/kounan_auto/'],
    };

    // WebSite 構造化データ
    const webSiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': 'https://kounan-auto.jp/#website',
        url: 'https://kounan-auto.jp',
        name: '株式会社港南自動車サービス',
        alternateName: ['港南自動車', '港南自動車サービス'],
        description: '石川県金沢市の車検・新車販売・カーリース',
        publisher: { '@id': 'https://kounan-auto.jp/#organization' },
        inLanguage: 'ja',
    };

    return (
        <html lang="ja" data-oid="fn6nn3g">
            <body className="" data-oid="wjvghu5">
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
        </html>
    );
}
