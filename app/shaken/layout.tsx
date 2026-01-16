import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '金沢市の車検｜最短90分スピード車検・創業60年の実績',
    description:
        '石川県金沢市の車検なら港南自動車サービス。最短90分のスピード車検、国家資格整備士による丁寧な対面診断。軽自動車65,090円〜。完全予約制で待ち時間なし。金沢市で車検をお探しの方はお気軽にご相談ください。',
    keywords: [
        '金沢市 車検',
        '石川県 車検',
        '車検 金沢',
        '金沢 車検 安い',
        '車検 金沢市 おすすめ',
        '軽自動車 車検 金沢',
        'スピード車検 金沢',
        '港南自動車 車検',
        '車検費用 金沢市',
        '車検 石川県 格安',
    ],
    alternates: {
        canonical: '/shaken',
    },
    openGraph: {
        title: '金沢市の車検｜最短90分スピード車検【港南自動車サービス】',
        description:
            '石川県金沢市の車検なら港南自動車サービス。創業60年以上の信頼と実績。最短90分スピード車検。',
        url: 'https://kounan-auto.jp/shaken',
        type: 'website',
        locale: 'ja_JP',
        siteName: '港南自動車サービス株式会社',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: '金沢市の車検なら港南自動車サービス',
            },
        ],
    },
};

export default function ShakenLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
