import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '採用情報｜港南自動車サービス【金沢市】',
    description:
        '石川県金沢市の港南自動車サービスで一緒に働きませんか？自動車整備士、営業スタッフ募集中。創業60年以上の安定企業、充実の福利厚生、アットホームな職場環境。未経験者歓迎。',
    keywords: [
        '自動車整備士 求人 金沢',
        '整備士 募集 石川県',
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
            '石川県金沢市の港南自動車サービスで一緒に働きませんか？創業60年以上の安定企業で自動車整備士・営業スタッフ募集中。',
        url: 'https://kounan-auto.jp/recruit',
        type: 'website',
        locale: 'ja_JP',
        siteName: '港南自動車サービス株式会社',
    },
};

export default function RecruitLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
