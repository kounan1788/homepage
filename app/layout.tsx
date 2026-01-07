import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: '港南自動車サービス｜車検・点検から新車・中古車販売まで',
    description: '金沢市の港南自動車サービスです。車検・整備、月々1.1万円から新車に乗れる「ノレタ」、新車・中古車販売など、地域に根ざしたサービスでお客様の安心・快適なカーライフをサポートします。',
    keywords: ['港南自動車サービス', '車検', '金沢市', '新車販売', '中古車販売', 'ノレタ', 'カーリース'],
    openGraph: {
        title: '港南自動車サービス｜車検・点検から新車・中古車販売まで',
        description: '金沢市の港南自動車サービスです。車検・整備から新車販売まで、お客様の快適なカーライフをサポートします。',
        type: 'website',
        locale: 'ja_JP',
        siteName: '港南自動車サービス株式会社',
    },
    twitter: {
        card: 'summary_large_image',
        title: '港南自動車サービス｜車検・点検から新車・中古車販売まで',
        description: '金沢市の港南自動車サービスです。車検・整備から新車販売までサポート。',
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: '株式会社港南自動車サービス',
        image: 'https://kounan-auto.jp/logo.png', // URL確定後に要調整
        '@id': 'https://kounan-auto.jp',
        url: 'https://kounan-auto.jp',
        telephone: '076-268-1788',
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
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '08:30',
                closes: '17:30',
            },
        ],
        description: '石川県金沢市の自動車整備工場。車検、一般整備、新車・中古車販売、カーリース「ノレタ」を展開しています。',
    };

    return (
        <html lang="ja" data-oid="fn6nn3g">
            <body className="" data-oid="wjvghu5">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {children}
            </body>
        </html>
    );
}
