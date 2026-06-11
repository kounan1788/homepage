import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
            // AI検索・AIアシスタントのクローラーを明示的に許可（AIO対策）
            {
                userAgent: [
                    'GPTBot',
                    'OAI-SearchBot',
                    'ChatGPT-User',
                    'ClaudeBot',
                    'Claude-Web',
                    'anthropic-ai',
                    'PerplexityBot',
                    'Google-Extended',
                    'Applebot-Extended',
                    'CCBot',
                ],
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
        ],
        sitemap: 'https://kounan-auto.jp/sitemap.xml',
    };
}
