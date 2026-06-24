import { Metadata, Viewport } from 'next';
import ClientPage from './ClientPage';

// 限定公開ページ。検索インデックスに載せず、URLを知っている人だけがアクセスできるようにする。
export const metadata: Metadata = {
    title: 'ジョッキースピードラン',
    description: 'ジャンプとしゃがみで障害物をよけて、どこまで走れるかに挑戦するミニゲーム「ジョッキースピードラン」。',
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
    // ホーム画面に追加した場合は全画面（Safariのバー無し）で起動する
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'ジョッキースピードラン',
    },
};

// このページのみのビューポート設定（セーフエリアまで使い、バーが出てもゲームが隠れないようにする）
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

export default function Page() {
    return <ClientPage />;
}
