'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import ArrowRight from '@/components/ArrowRight';
import { buildContactUrl } from '@/lib/contactHandoff';
import { cn } from '@/lib/utils';
import {
    isRankingStale,
    keiRanking,
    rankingMonth,
    registeredRanking,
    type RankingItem,
} from '@/lib/carRanking';

/**
 * 全国の新車販売ランキング（軽自動車・乗用車の各1〜15位）。
 *
 * 毎月の更新は lib/carRanking.ts の集計月と台数を書き替えるだけで済むようにしており、
 * このファイルは並べ方（見た目）と、各行から次に進む先の出し分けだけを持ちます。
 */

/** 最初に見せる件数。残りは「もっと見る」で開く */
const INITIAL_COUNT = 5;

// 空の配列はカードごと出さない（見出しだけが残るのを避ける）
const groups: { title: string; items: RankingItem[] }[] = [
    { title: '軽自動車', items: keiRanking },
    { title: '乗用車', items: registeredRanking },
].filter((group) => group.items.length > 0);

/**
 * 各行の遷移先。自社の車種ページがあればそこへ、無ければ車種名を引き継いで相談へ送る。
 */
function rowHref(car: RankingItem): string {
    if (car.route) return car.route;
    return buildContactUrl({
        category: '新車販売',
        lines: [`車種: ${car.maker} ${car.name}`],
    });
}

/**
 * カテゴリ1つぶんのカード。
 * 6位以降は閉じている間も DOM に残して CSS で隠す。
 * 条件レンダリングにすると下位の車種ページへのリンクが静的HTMLから消え、
 * クローラーから到達できなくなるため（取扱車種の一覧と同じ考え方）。
 */
function RankingCard({ title, items }: { title: string; items: RankingItem[] }) {
    const [expanded, setExpanded] = useState(false);
    const listId = useId();
    const hasMore = items.length > INITIAL_COUNT;
    const shownCount = expanded || !hasMore ? items.length : INITIAL_COUNT;

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <header className="flex items-baseline justify-between gap-4 border-b border-gray-200 px-5 py-4">
                <h4 className="text-lg font-bold tracking-ja text-gray-900">{title}</h4>
                <span className="u-label">Top {shownCount}</span>
            </header>

            <ol id={listId}>
                {items.map((car, index) => (
                    <li
                        key={car.name}
                        className={cn(
                            'border-t border-gray-100 first:border-t-0',
                            index >= INITIAL_COUNT && !expanded && 'hidden'
                        )}
                    >
                        <Link
                            href={rowHref(car)}
                            className="group flex items-center gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-mint-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-700"
                        >
                            <span
                                className={cn(
                                    'u-num flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
                                    index === 0
                                        ? 'bg-teal-700 text-white'
                                        : 'bg-mint-100 text-teal-800'
                                )}
                                aria-hidden="true"
                            >
                                {index + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[15px] font-bold text-gray-900">
                                    <span className="sr-only">{index + 1}位 </span>
                                    {car.name}
                                    <span className="sr-only">
                                        {car.route
                                            ? 'の車種ページを見る'
                                            : 'のお取り寄せを相談する'}
                                    </span>
                                </span>
                                <span className="mt-0.5 block text-xs text-gray-500">
                                    {car.maker}
                                </span>
                            </span>
                            <span className="flex shrink-0 items-center gap-2">
                                <span className="u-num whitespace-nowrap text-[15px] text-gray-700">
                                    {car.units.toLocaleString()}
                                    <span className="ml-0.5 text-xs text-gray-500">台</span>
                                </span>
                                <ArrowRight className="shrink-0 text-gray-400 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-teal-700" />
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>

            {hasMore && (
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                    aria-controls={listId}
                    aria-label={`${title}の${INITIAL_COUNT + 1}〜${items.length}位を${expanded ? '閉じる' : 'もっと見る'}`}
                    className="flex w-full items-center justify-center gap-2 border-t border-gray-100 px-5 py-3.5 text-[13px] font-bold text-teal-700 transition-colors duration-200 hover:bg-mint-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-700"
                >
                    {expanded ? '閉じる' : 'もっと見る'}
                    <ArrowRight
                        className={cn(
                            'shrink-0 transition-transform duration-200',
                            expanded && 'rotate-180'
                        )}
                    />
                </button>
            )}
        </section>
    );
}

export default function NewCarRanking() {
    // 集計月の鮮度は閲覧時点で判定する（ページはビルド時に生成されるため、描画後に見る）
    const [isStale, setIsStale] = useState(false);
    useEffect(() => {
        setIsStale(isRankingStale());
    }, []);

    if (groups.length === 0) return null;

    return (
        <div className="mt-14 border-t border-gray-200 pt-12">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h3 className="text-xl font-bold tracking-ja text-gray-900 md:text-[22px]">
                    全国の新車販売ランキング
                </h3>
                <span className="u-chip">{rankingMonth}</span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-loose text-gray-600 text-pretty">
                いま全国でよく売れている車です。当社ではどの車種もお取り寄せできますので、
                気になる車があればお気軽にご相談ください。
            </p>
            {isStale && (
                <p className="mt-2 max-w-2xl text-sm leading-loose text-gray-600 text-pretty">
                    {rankingMonth}
                    の集計から2か月以上が経っています。最新の販売状況はお問い合わせください。
                </p>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
                {groups.map((group) => (
                    <RankingCard key={group.title} title={group.title} items={group.items} />
                ))}
            </div>

            <p className="mt-4 text-xs leading-loose text-gray-500">
                {rankingMonth}
                の全国の新車販売台数。出典：全国軽自動車協会連合会「軽自動車通称名別新車販売速報」、日本自動車販売協会連合会「乗用車ブランド通称名別順位」（乗用車は軽自動車・海外ブランド車を除く）。
            </p>
        </div>
    );
}
