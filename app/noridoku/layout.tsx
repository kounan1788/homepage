import type { Metadata } from 'next';
import { ogImage } from '@/lib/imageSize';

export const metadata: Metadata = {
    // 共通テンプレートを付けると社名が二重になるので absolute で指定する
    title: { absolute: '法人カーリース「ノリドク」｜金利2.5%〜・違約金ゼロ｜港南自動車サービス' },
    description:
        '石川県金沢市の港南自動車サービスによる、法人・個人事業主向けカーリース「ノリドク」。金利2.5%〜、違約金ゼロ。月々定額で経費処理が簡単になり、車両管理の手間も減らせます。全メーカー対応。',
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
        url: 'https://www.kounan-auto.jp/noridoku',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: ogImage('/og-image.jpg', '法人向けカーリース「ノリドク」港南自動車サービス'),
    },
};

export default function NoridokuLayout({ children }: { children: React.ReactNode }) {
    // パンくず構造化データはページ内の Breadcrumb コンポーネントが出力する
    return <>{children}</>;
}
