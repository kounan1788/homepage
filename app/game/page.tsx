import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: '港南ドライブチャレンジ｜遊んで割引GET【港南自動車サービス】',
    description:
        '港南自動車サービスのミニゲーム「港南ドライブチャレンジ」。3車線の道路でガードレールをよけて走り、走破距離に応じて割引コードをGET！PC・スマホ対応、無料で今すぐ遊べます。',
    alternates: {
        canonical: '/game',
    },
    openGraph: {
        title: '港南ドライブチャレンジ｜遊んで割引GET',
        description:
            'ガードレールをよけて走るだけ。走破距離に応じて割引コードがもらえる港南自動車サービスのミニゲーム。',
        url: 'https://www.kounan-auto.jp/game',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
    },
};

export default function Page() {
    return <ClientPage />;
}
