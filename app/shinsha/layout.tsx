import type { Metadata } from 'next';
import { ogImage } from '@/lib/imageSize';

export const metadata: Metadata = {
    // 共通テンプレートを付けない完全なtitle（「金沢 新車」の検索意図に価格で答える）
    title: { absolute: '金沢で新車を買うなら｜月々27,000円〜の新車販売・港南自動車サービス' },
    description:
        '金沢市で新車をお探しなら港南自動車サービス。トヨタ・ホンダ・スズキ・ダイハツなど全メーカーの新車を取り扱い。現金・カーローン「ノレタ」（実質年率3.9%・頭金なし月々27,000円〜）・法人リース「ノリドク」の3つの買い方を比較できます。創業70年、金沢市金石本町。来店予約受付中。',
    keywords: [
        '金沢 新車',
        '金沢市 新車',
        '新車販売 金沢',
        '新車 購入 金沢',
        '金沢 車 買うなら',
        '石川県 新車',
        '軽自動車 新車 金沢',
        '新車 頭金なし 金沢',
        '金沢 新車 安い',
        '港南自動車 新車',
    ],
    alternates: {
        canonical: '/shinsha',
    },
    openGraph: {
        title: '金沢で新車を買うなら｜月々27,000円〜の新車販売【港南自動車サービス】',
        description:
            '金沢市で創業70年。全メーカーの新車を、現金・カーローン「ノレタ」・法人リース「ノリドク」の3つの買い方からお選びいただけます。',
        url: 'https://www.kounan-auto.jp/shinsha',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: ogImage('/og-image.jpg', '金沢市の新車販売なら港南自動車サービス'),
    },
};

export default function ShinshaLayout({ children }: { children: React.ReactNode }) {
    // パンくず構造化データはページ内の Breadcrumb コンポーネントが出力する
    return <>{children}</>;
}
