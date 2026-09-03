import type { Metadata } from 'next';
import { ogImage } from '@/lib/imageSize';

export const metadata: Metadata = {
    title: '採用情報｜港南自動車サービス【金沢市】',
    description:
        '石川県金沢市の港南自動車サービスで自動車整備士を募集中。繁忙期も残業完全ゼロ、年間休日110日、有給取得可。創業70年の指定工場で、資格取得費用は会社が全額負担。未経験者歓迎、面接1回・5営業日以内に結果をご連絡します。',
    keywords: [
        '自動車整備士 求人 金沢',
        '整備士 募集 石川県',
        '整備士 残業なし 求人',
        '港南自動車 採用',
        '金沢市 自動車 求人',
        '車検 整備 求人',
        '自動車ディーラー 求人 金沢',
    ],
    alternates: {
        canonical: '/recruit',
    },
    openGraph: {
        title: '採用情報｜港南自動車サービス【金沢市】',
        description:
            '繁忙期も残業完全ゼロ・年間休日110日。創業70年の指定工場で自動車整備士を募集中。未経験歓迎、資格取得費用は会社が全額負担します。',
        url: 'https://www.kounan-auto.jp/recruit',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: ogImage('/og-image.jpg', '採用情報｜港南自動車サービス（金沢市）'),
    },
};

/**
 * 求人の掲載開始日と募集終了日。
 * Google しごと検索は validThrough を過ぎた求人を掲載から外すため、
 * 募集を継続する場合はこの2つの日付を更新すること。
 */
const JOB_POSTED_DATE = '2026-09-03';
const JOB_VALID_THROUGH = '2027-09-03';

export default function RecruitLayout({ children }: { children: React.ReactNode }) {
    // 求人構造化データ（Google しごと検索向け）。掲載内容はページ本文と一致させている
    const jobPostingSchema = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: 'ピットエンジニア（自動車整備士）',
        description:
            '<p>お客様の大切なお車の車検・点検・整備をお任せします。最初はできることから、経験豊富な先輩が一つひとつ丁寧に教えるので、未経験からでも着実にプロの整備士へ成長できます。</p>' +
            '<p>国の指定工場としてリフト4基・検査ラインを備え、スキャンツールも完備。HV・EVまで扱えるので、これからの時代に通用する技術が身につきます。</p>' +
            '<p>残業は完全ゼロ。繁忙期であっても、平日は18時・土曜は17時にきちんと帰れます。年間休日110日、有給休暇も取得できます。</p>',
        identifier: {
            '@type': 'PropertyValue',
            name: '株式会社港南自動車サービス',
            value: 'pit-engineer',
        },
        datePosted: JOB_POSTED_DATE,
        validThrough: JOB_VALID_THROUGH,
        employmentType: 'FULL_TIME',
        hiringOrganization: { '@id': 'https://www.kounan-auto.jp/#organization' },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '金石本町ハ14番地',
                addressLocality: '金沢市',
                addressRegion: '石川県',
                postalCode: '920-0336',
                addressCountry: 'JP',
            },
        },
        baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'JPY',
            value: {
                '@type': 'QuantitativeValue',
                value: 195000,
                unitText: 'MONTH',
            },
        },
        // 応募資格（普通自動車運転免許・整備士資格不問）
        qualifications:
            '普通自動車運転免許（AT限定可）。整備士資格は不問で、入社後の資格取得を会社が全額支援します。',
        jobBenefits:
            '社会保険完備（雇用・労災・健康・厚生年金）、賞与年2回、昇給年1回、年間休日110日、残業なし、資格取得費用は会社が全額負担。',
        industry: '自動車整備業',
        directApply: true,
    };

    // パンくず構造化データ（ホーム > 採用情報）
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'ホーム',
                item: 'https://www.kounan-auto.jp',
            },
            { '@type': 'ListItem', position: 2, name: '採用情報' },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {children}
        </>
    );
}
