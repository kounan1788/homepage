'use client';

import Link from 'next/link';

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    /** 構造化データを出力するか（ページ側で別途出力済みの場合は false にして重複を防ぐ） */
    includeSchema?: boolean;
}

export default function Breadcrumb({ items, includeSchema = true }: BreadcrumbProps) {
    // 構造化データの生成
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://www.kounan-auto.jp${item.href}`,
        })),
    };

    return (
        <>
            {/* AIクローラーにも見えるよう静的HTMLに含める */}
            {includeSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                />
            )}
            <nav aria-label="パンくずリスト" className="container mx-auto px-4 py-4">
                <ol className="flex items-center space-x-2 text-sm text-slate-500">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <svg
                                    className="w-4 h-4 mx-2 text-slate-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            )}
                            {index === items.length - 1 ? (
                                <span className="text-slate-700 font-medium">{item.name}</span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="hover:text-teal-600 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
