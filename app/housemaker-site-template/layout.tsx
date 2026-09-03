import type { Metadata } from 'next';

// IT支援サービスの制作サンプル（架空の店舗内容）。
// 検索インデックスには載せず、/it-support からの導線でのみ閲覧してもらう。
export const metadata: Metadata = {
    title: '工務店サイト制作サンプル｜港南自動車サービス IT支援',
    alternates: {
        canonical: '/housemaker-site-template',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function HouseMakerTemplateLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
