import { MetadataRoute } from 'next';

/**
 * ホーム画面に追加したときの表示名・アイコン・テーマ色。
 * オフライン動作（Service Worker）は行わないため、表示に必要な最小構成にとどめる。
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '株式会社港南自動車サービス',
        short_name: '港南自動車',
        description:
            '石川県金沢市の車検・自動車整備・新車販売。頭金0円のカーローン「ノレタ」、法人リース「ノリドク」。',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        // app/layout.tsx の viewport.themeColor と揃えること
        theme_color: '#ffffff',
        lang: 'ja',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    };
}
