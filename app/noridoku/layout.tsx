import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '法人向けカーリース「ノリドク」｜月々定額で経費処理も簡単',
    description:
        '石川県金沢市の法人向けカーリース「ノリドク」。月々定額で経費処理が簡単、車両管理の手間を削減。全メーカー対応、メンテナンスパック付きで安心。金沢市・石川県の法人様はお気軽にご相談ください。',
    keywords: [
        '法人 カーリース 金沢',
        '法人リース 石川県',
        'ノリドク',
        '社用車 リース 金沢',
        '法人 車 リース',
        '経費 カーリース',
        '金沢市 法人リース',
        '石川県 社用車',
        '港南自動車 ノリドク',
        '法人向け カーリース 北陸',
    ],
    alternates: {
        canonical: '/noridoku',
    },
    openGraph: {
        title: '法人向けカーリース「ノリドク」｜月々定額【港南自動車サービス】',
        description:
            '石川県金沢市の法人向けカーリース「ノリドク」。月々定額で経費処理が簡単、車両管理の手間を削減。',
        url: 'https://kounan-auto.jp/noridoku',
        type: 'website',
        locale: 'ja_JP',
        siteName: '港南自動車サービス株式会社',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: '法人向けカーリース「ノリドク」港南自動車サービス',
            },
        ],
    },
};

export default function NoridokuLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
