import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.kounan-auto.jp';
const APP_DIR = join(process.cwd(), 'app');

/**
 * サイトマップに載せないルート。
 * ここに追加したら、対応するページ側の metadata にも robots.index: false を入れること
 * （サイトマップから外すだけではインデックス拒否にならないため）。
 */
const EXCLUDED_ROUTES = new Set([
    '/horse-run-9f4k2x', // 限定公開のミニゲーム
    '/coffee-site-template', // IT支援の制作サンプル（架空店舗）
    '/gallery-site-template',
    '/housemaker-site-template',
]);

type RouteSetting = {
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
};

/** ルートごとの優先度・更新頻度。未指定のルートは DEFAULT_SETTING（車種ページ想定）になる */
const ROUTE_SETTINGS: Record<string, RouteSetting> = {
    '/': { changeFrequency: 'weekly', priority: 1 },
    '/noreta': { changeFrequency: 'weekly', priority: 0.9 },
    '/noridoku': { changeFrequency: 'weekly', priority: 0.9 },
    '/shaken': { changeFrequency: 'monthly', priority: 0.8 },
    '/it-support': { changeFrequency: 'monthly', priority: 0.8 },
    '/it-support/pricing': { changeFrequency: 'monthly', priority: 0.7 },
    '/recruit': { changeFrequency: 'monthly', priority: 0.7 },
    '/game': { changeFrequency: 'monthly', priority: 0.5 },
};

const DEFAULT_SETTING: RouteSetting = { changeFrequency: 'monthly', priority: 0.6 };

const PAGE_FILE = /^page\.(tsx|ts|jsx|js)$/;

/** そのルートを構成するファイル（page/layout/ClientPage 等）の最終更新日時 */
function lastModifiedOf(dir: string): Date {
    const times = readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => statSync(join(dir, entry.name)).mtime.getTime());
    return new Date(Math.max(...times));
}

/**
 * app/ を再帰的に走査して、実在する静的ページのルートを全て集めます。
 * 手書きリストの追記漏れを防ぐため、ページを追加すれば自動でサイトマップに載ります。
 */
function collectRoutes(dir: string, route = ''): { path: string; lastModified: Date }[] {
    const entries = readdirSync(dir, { withFileTypes: true });
    const routes: { path: string; lastModified: Date }[] = [];

    if (entries.some((entry) => entry.isFile() && PAGE_FILE.test(entry.name))) {
        routes.push({ path: route === '' ? '/' : route, lastModified: lastModifiedOf(dir) });
    }

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const name = entry.name;

        // _private / @parallel / .well-known / api はURLにならないので辿らない
        if (name.startsWith('_') || name.startsWith('@') || name.startsWith('.') || name === 'api') {
            continue;
        }
        // 動的ルート [slug] はURLを列挙できないため、増えたら個別対応する
        if (name.startsWith('[')) continue;
        // ルートグループ (group) はURLのセグメントにならないので、パスは伸ばさず中身だけ辿る
        if (name.startsWith('(') && name.endsWith(')')) {
            routes.push(...collectRoutes(join(dir, name), route));
            continue;
        }

        routes.push(...collectRoutes(join(dir, name), `${route}/${name}`));
    }

    return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
    return collectRoutes(APP_DIR)
        .filter(({ path }) => !EXCLUDED_ROUTES.has(path))
        // 優先度の高い順、同率はパス順にして出力を安定させる
        .sort((a, b) => {
            const priorityDiff =
                (ROUTE_SETTINGS[b.path] ?? DEFAULT_SETTING).priority -
                (ROUTE_SETTINGS[a.path] ?? DEFAULT_SETTING).priority;
            return priorityDiff !== 0 ? priorityDiff : a.path.localeCompare(b.path);
        })
        .map(({ path, lastModified }) => {
            const { changeFrequency, priority } = ROUTE_SETTINGS[path] ?? DEFAULT_SETTING;
            return {
                url: path === '/' ? BASE_URL : `${BASE_URL}${path}`,
                lastModified,
                changeFrequency,
                priority,
            };
        });
}
