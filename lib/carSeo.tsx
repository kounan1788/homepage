import type { Metadata } from 'next';
import { carBasePrices } from './carPrices';

/**
 * 車種ページのSEO情報（メタデータ・構造化データの両方で使用）。
 */
export interface CarSeoInfo {
    /** 車種ページのルートパス（例: '/suv/jimnysierra'）。carBasePrices のキーと一致させる */
    path: string;
    /** メーカー名を含む車種名（例: 'スズキ ジムニーシエラ'） */
    name: string;
    /** メーカー名（例: 'スズキ'） */
    brand: string;
    /** 車両画像のパス（例: '/cars/jimnysierra.jpg'） */
    image: string;
}

const BASE_URL = 'https://www.kounan-auto.jp';

/**
 * 車種ページの Metadata（title / description / canonical / OGP）を生成します。
 */
export function buildCarMetadata(car: CarSeoInfo, description: string): Metadata {
    const title = `${car.name} - ノレタ｜港南自動車`;
    return {
        title,
        description,
        alternates: {
            canonical: car.path,
        },
        openGraph: {
            title,
            description,
            url: `${BASE_URL}${car.path}`,
            type: 'website',
            locale: 'ja_JP',
            siteName: '株式会社港南自動車サービス',
            images: [
                {
                    url: car.image,
                    width: 1200,
                    height: 630,
                    alt: `${car.name}｜カーリース ノレタ（港南自動車サービス）`,
                },
            ],
        },
    };
}

/**
 * 車種ページの構造化データ（Product + Offer、BreadcrumbList）を出力します。
 */
export function CarJsonLd({ car, description }: { car: CarSeoInfo; description: string }) {
    const basePrice = carBasePrices[car.path];

    // Product + Offer 構造化データ（月額リース価格）
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${car.name}（カーリース ノレタ）`,
        image: `${BASE_URL}${car.image}`,
        description,
        brand: {
            '@type': 'Brand',
            name: car.brand,
        },
        offers: {
            '@type': 'Offer',
            url: `${BASE_URL}${car.path}`,
            priceCurrency: 'JPY',
            price: basePrice,
            priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: basePrice,
                priceCurrency: 'JPY',
                // 月額料金であることを示す
                referenceQuantity: {
                    '@type': 'QuantitativeValue',
                    value: 1,
                    unitCode: 'MON',
                },
            },
            availability: 'https://schema.org/InStock',
            seller: {
                '@id': `${BASE_URL}/#organization`,
            },
        },
    };

    // パンくず構造化データ（ホーム > ノレタ > 車種名）
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'ホーム',
                item: BASE_URL,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'カーリース ノレタ',
                item: `${BASE_URL}/noreta`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: car.name,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
