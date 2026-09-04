import type { Metadata } from 'next';
import { ogImage } from '@/lib/imageSize';
import { visibleJobs, type JobListing } from '@/lib/recruitJobs';

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

/**
 * 求人構造化データ（Google しごと検索向け）。
 * 掲載内容は lib/recruitJobs.ts から生成するため、ページ本文と必ず一致する。
 * published: false の求人は visibleJobs に入らないので、構造化データにも出ない。
 */
function buildJobPostingSchema(job: JobListing) {
    return {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.schemaTitle,
        description: `<p>${job.description}</p>`,
        identifier: {
            '@type': 'PropertyValue',
            name: '株式会社港南自動車サービス',
            value: job.id,
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
                value: job.salary.monthlyMin,
                unitText: 'MONTH',
            },
        },
        qualifications: job.requirements.join('。'),
        jobBenefits: [...job.benefits, job.workStyle.vacation].join('、'),
        industry: '自動車整備業',
        directApply: true,
    };
}

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

export default function RecruitLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {visibleJobs.map((job) => (
                <script
                    key={job.id}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(buildJobPostingSchema(job)),
                    }}
                />
            ))}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {children}
        </>
    );
}
