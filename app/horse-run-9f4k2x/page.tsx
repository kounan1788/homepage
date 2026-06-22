import { Metadata } from 'next';
import ClientPage from './ClientPage';

// 限定公開ページ。検索インデックスに載せず、URLを知っている人だけがアクセスできるようにする。
export const metadata: Metadata = {
    title: '馬スピードラン',
    description: 'ジャンプとしゃがみで障害物をよけて、どこまで走れるかに挑戦するミニゲーム「馬スピードラン」。',
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
};

export default function Page() {
    return <ClientPage />;
}
