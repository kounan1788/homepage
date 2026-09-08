'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArrowRight from '@/components/ArrowRight';
import Breadcrumb from '@/components/Breadcrumb';
import MobileActionBar from '@/components/MobileActionBar';
import PurchaseMethodTable from '@/components/PurchaseMethodTable';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { carBasePrices, formatPrice } from '@/lib/carPrices';
import { cn } from '@/lib/utils';
import {
    carImageScale,
    categoryLabels,
    lineupMakers,
    sortedCarLineup,
    type CarCategory,
} from '@/lib/carLineup';

// 新車購入の流れ。納期は車種で大きく変わるため、日数は書かずに手順だけを示す
const flowSteps = [
    {
        step: '01',
        title: 'ご相談・ヒアリング',
        desc: 'お使いになる場面、ご予算、お乗り換えのご希望時期をうかがいます。いま乗っているお車の下取りもあわせてご相談ください。',
    },
    {
        step: '02',
        title: '車種とグレードのご提案',
        desc: '3年後の価値まで見たうえで、値落ちしにくいグレード・色・オプションの組み合わせをご提案します。金沢の冬道での扱いやすさもふまえてお選びします。',
    },
    {
        step: '03',
        title: 'お支払い方法の決定',
        desc: '現金・カーローン「ノレタ」・法人リース「ノリドク」を、月々の負担と支払総額の両方で並べてご説明します。',
    },
    {
        step: '04',
        title: 'ご契約・車両の発注',
        desc: '必要書類をご案内し、メーカーへ発注します。納期は車種・グレードによって変わるため、発注時に最新の見込みをお伝えします。',
    },
    {
        step: '05',
        title: 'ご納車',
        desc: '車両の状態と装備の使い方をご説明してお引き渡しします。ご購入後の点検・車検・修理も当社で承ります。',
    },
];

// 新車購入に関する FAQ（構造化データにも使う）
const faqData = [
    {
        question: '金沢市で新車を買うなら、どこがおすすめですか？',
        answer: '港南自動車サービスは石川県金沢市で創業70年の自動車整備工場兼販売店です。全メーカーの新車を取り扱い、購入後の車検・点検・修理まで同じ工場で対応します。頭金なし・月々27,000円からのカーローン「ノレタ」もご用意しています。',
    },
    {
        question: '頭金なしで新車を買えますか？',
        answer: 'はい。カーローン「ノレタ」なら頭金0円・ボーナス払いなしで新車にお乗りいただけます。実質年率3.9%、支払回数36回が基本で、車検やオイル交換などの維持費も月々の定額に含まれます。',
    },
    {
        question: '取り扱っているメーカーを教えてください。',
        answer: 'トヨタ・レクサス・ホンダ・スズキ・ダイハツ・三菱などをはじめ、全メーカーの新車をお取り扱いしています。サイトの一覧にない車種もお取り寄せできますので、ご希望の車種をお聞かせください。',
    },
    {
        question: '今乗っている車の下取りはできますか？',
        answer: 'はい、下取りも承ります。年式・走行距離・状態を確認したうえで査定額をお出しし、新車のお見積りに反映します。',
    },
    {
        question: '納車までどれくらいかかりますか？',
        answer: '車種・グレード・オプションによって大きく異なります。ご相談いただいた時点での最新の納期をメーカーに確認し、お見積りとあわせてご案内します。',
    },
    {
        question: '新車を買ったあとの車検や点検もお願いできますか？',
        answer: 'はい。当社は金沢市金石本町の運輸局指定工場（民間車検場）です。ご購入後の法定点検・車検・修理まで一貫して承ります。当社でご購入いただいたお車の初回車検は、最短90分の立会い車検をご利用いただけます。',
    },
];

// カテゴリの表示順。台数が多く問い合わせも多い軽自動車から見せる
const categoryOrder: CarCategory[] = ['KCAR', 'SUV', 'MINIVAN'];

// ヒーローに出す3台。各カテゴリの最安を1台ずつ選ぶので、
// 価格を書き替えても「〜円から」の根拠と食い違わない
const heroCars = categoryOrder.map((cat) => sortedCarLineup[cat][0]);

export default function ShinshaPage() {
    const [activeCategory, setActiveCategory] = useState<CarCategory>('KCAR');

    // FAQPage 構造化データ
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqData.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    };

    return (
        <div className="min-h-dvh bg-white text-gray-900">
            {/* FAQ構造化データ（AIクローラーにも見えるよう静的HTMLに含める） */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <SiteHeader
                currentPath="/shinsha"
                logoAlt="港南自動車サービス｜石川県金沢市の新車販売・車検"
            />

            <main id="main" tabIndex={-1} className="pt-16 md:pt-20">
                <Breadcrumb
                    items={[
                        { name: 'ホーム', href: '/' },
                        { name: '新車販売', href: '/shinsha' },
                    ]}
                />

                {/* Hero Section */}
                <section className="bg-white pb-16 pt-6 md:pb-20 md:pt-8">
                    <div className="container">
                        <hr className="u-road" aria-hidden="true" />

                        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
                            <div className="lg:col-span-7">
                                <p className="flex items-center gap-4 text-xs text-gray-600 md:text-sm">
                                    <span className="h-px w-10 bg-teal-700" aria-hidden="true" />
                                    <span>石川県金沢市金石本町・創業70年の自動車販売店</span>
                                </p>

                                <h1 className="mt-6 text-balance text-[32px] font-bold leading-[1.35] tracking-ja text-gray-900 md:text-[46px]">
                                    金沢で<span className="text-teal-700">新車</span>を買うなら
                                    <br />
                                    港南自動車サービス
                                </h1>

                                <p className="mt-7 max-w-xl text-[15px] leading-loose text-gray-600 md:text-base text-pretty">
                                    トヨタ・ホンダ・スズキ・ダイハツなど全メーカーの新車をお取り扱いしています。車種選びだけでなく、現金・カーローン・リースという
                                    <b className="font-bold text-gray-900">
                                        「買い方」まで含めてご提案
                                    </b>
                                    するのが、整備工場である当社の新車販売です。
                                </p>

                            </div>

                            {/* スマホでは縦に積むため、CTAより先に価格が目に入る順序にする */}
                            <div className="order-2 lg:order-none lg:col-span-7">
                                <div className="flex flex-col gap-3 sm:flex-row lg:mt-2">
                                    <a
                                        href="#lineup"
                                        className="group flex h-14 items-center justify-between gap-8 rounded-xl bg-teal-700 px-7 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                                    >
                                        取扱車種と月々の目安を見る
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </a>
                                    <a
                                        href="#access"
                                        className="group flex h-14 items-center justify-between gap-8 rounded-xl border border-gray-300 px-7 text-[15px] font-bold text-gray-900 transition-[background-color,border-color,transform] duration-200 hover:border-teal-700 hover:bg-gray-50 active:scale-[0.98]"
                                    >
                                        来店のご予約
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>

                            {/* 「金沢 新車」で来た人がまず知りたいのは価格と車種なので、
                                説明より先に実車と月額を出す。各カテゴリの最安から1台ずつ */}
                            <div className="order-1 lg:order-none lg:col-span-5">
                                <div className="overflow-hidden rounded-2xl border border-gray-200">
                                    {heroCars.map((car, index) => (
                                        <Link
                                            key={car.route}
                                            href={car.route}
                                            className={cn(
                                                'flex items-center gap-4 bg-white p-4 transition-colors duration-200 hover:bg-mint-50',
                                                index > 0 && 'border-t border-gray-200'
                                            )}
                                        >
                                            <span className="relative block h-14 w-20 shrink-0 sm:h-16 sm:w-24">
                                                <Image
                                                    src={car.image}
                                                    alt=""
                                                    fill
                                                    sizes="96px"
                                                    className="object-contain"
                                                    style={{
                                                        transform: `scale(${carImageScale[car.image] ?? 1})`,
                                                    }}
                                                    priority
                                                />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-xs text-gray-500">
                                                    {car.maker}
                                                </span>
                                                {/* 車種名は商品名なので省略しない。狭い幅では折り返す */}
                                                <span className="mt-0.5 block font-bold leading-snug text-gray-900">
                                                    {car.name}
                                                </span>
                                            </span>
                                            <span className="u-num shrink-0 text-right">
                                                <span className="block text-lg font-medium text-teal-700">
                                                    {carBasePrices[car.route].toLocaleString()}
                                                    <span className="ml-0.5 text-xs">円</span>
                                                </span>
                                                <span className="mt-0.5 block text-[11px] text-gray-500">
                                                    月々
                                                </span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                                <p className="mt-3 text-xs leading-loose text-gray-500">
                                    頭金・ボーナス払いなし、車検やオイル交換などの維持費込みの月額です（カーローン「ノレタ」の場合）。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lineup Section（取扱メーカーと人気車種） */}
                <section id="lineup" className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px] text-balance">
                                    取扱メーカーと人気車種
                                </h2>
                                <span className="u-chip">Lineup</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600 text-pretty">
                                下の金額は、カーローン「ノレタ」でお乗りいただく場合の月々の目安です（頭金なし・車検やオイル交換などの維持費込み）。車種を選ぶと、装備や月々の内訳をまとめた車種ページへ移動します。
                            </p>
                        </header>

                        {/* 取扱メーカー */}
                        <div className="mt-10 flex flex-wrap items-center gap-2">
                            {lineupMakers.map((maker) => (
                                <span key={maker} className="u-chip">
                                    {maker}
                                </span>
                            ))}
                            <span className="text-sm text-gray-500">ほか全メーカーお取り寄せ可</span>
                        </div>

                        {/* カテゴリの切り替え */}
                        <div className="mt-10 flex flex-wrap gap-2 border-b border-gray-200">
                            {categoryOrder.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveCategory(cat)}
                                    aria-pressed={activeCategory === cat}
                                    className={cn(
                                        '-mb-px border-b-2 px-5 py-3 text-[15px] font-bold transition-colors duration-150',
                                        activeCategory === cat
                                            ? 'border-teal-700 text-teal-700'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    {categoryLabels[cat]}
                                </button>
                            ))}
                        </div>

                        {/* 非表示のカテゴリもDOMには残す。条件レンダリングにすると選択中以外の
                            車種ページへのリンクが静的HTMLから消え、クローラーから到達できなくなるため */}
                        {categoryOrder.map((cat) => (
                            <div
                                key={cat}
                                className={cn(
                                    'mt-10 grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3',
                                    activeCategory === cat ? 'grid' : 'hidden'
                                )}
                            >
                                {sortedCarLineup[cat].map((car) => (
                                    <article
                                        key={car.route}
                                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-colors duration-200 hover:border-mint-300"
                                    >
                                        <Link href={car.route} className="flex h-full flex-col">
                                            {/* 写真ごとに縦横比が違うため切らずに収め、
                                                車体の見た目の大きさは carImageScale で揃える */}
                                            <div className="relative w-full overflow-hidden bg-white pt-[70%]">
                                                <Image
                                                    src={car.image}
                                                    alt={`${car.maker} ${car.name}｜金沢市の新車販売・港南自動車サービス`}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="absolute left-0 top-0 object-contain p-3"
                                                    style={{
                                                        transform: `scale(${carImageScale[car.image] ?? 1})`,
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col border-t border-gray-200 px-5 py-4">
                                                <span className="u-label">{car.maker}</span>
                                                <div className="mt-2 flex items-baseline justify-between gap-4">
                                                    <h3 className="text-lg font-bold tracking-ja text-gray-900 text-balance">
                                                        {car.name}
                                                    </h3>
                                                    <span className="u-num whitespace-nowrap text-lg font-medium text-teal-700">
                                                        {formatPrice(carBasePrices[car.route])}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        ))}

                        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <a
                                href="#access"
                                className="group flex h-14 items-center justify-between gap-8 rounded-xl bg-teal-700 px-7 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                            >
                                車種選びを相談する
                                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                            </a>
                            <p className="text-sm text-gray-500">
                                一覧にない車種・グレードもお取り寄せできます。
                            </p>
                        </div>
                    </div>
                </section>

                {/* Buying Methods Section（3つの買い方の比較） */}
                <section id="buy" className="border-t border-gray-200 bg-white py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px] text-balance">
                                    新車の3つの買い方
                                </h2>
                                <span className="u-chip">Payment</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600 text-pretty">
                                同じ車でも、買い方によって初期費用も毎月の負担も変わります。現金一括、カーローン「ノレタ」、法人向けリース「ノリドク」を並べて比較できるようにしました。
                            </p>
                        </header>

                        <div className="mt-12">
                            <PurchaseMethodTable />
                        </div>

                        <div className="mt-10 grid gap-4 md:grid-cols-2">
                            <Link
                                href="/carloan"
                                className="group flex items-center justify-between gap-6 rounded-2xl border border-gray-200 bg-white p-7 transition-colors duration-200 hover:border-mint-300 hover:bg-mint-50"
                            >
                                <span>
                                    <span className="block text-lg font-bold text-gray-900 text-balance">
                                        カーローンの金利と審査の流れ
                                    </span>
                                    <span className="mt-2 block text-sm leading-relaxed text-gray-600 text-pretty">
                                        実質年率3.9%。車種別の月々の目安と、ご相談から納車までの進み方をまとめています。
                                    </span>
                                </span>
                                <ArrowRight className="shrink-0 text-teal-700 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/shaken"
                                className="group flex items-center justify-between gap-6 rounded-2xl border border-gray-200 bg-white p-7 transition-colors duration-200 hover:border-mint-300 hover:bg-mint-50"
                            >
                                <span>
                                    <span className="block text-lg font-bold text-gray-900 text-balance">
                                        購入後の車検・点検
                                    </span>
                                    <span className="mt-2 block text-sm leading-relaxed text-gray-600 text-pretty">
                                        金沢市の運輸局指定工場。当社でご購入いただいたお車の初回車検は最短90分です。
                                    </span>
                                </span>
                                <ArrowRight className="shrink-0 text-teal-700 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Flow Section（新車購入の流れ） */}
                <section className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px] text-balance">
                                    新車購入の流れ
                                </h2>
                                <span className="u-chip">Flow</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600 text-pretty">
                                ご相談からご納車までの手順です。ご来店は予約なしでも承りますが、ご予約いただくとお待たせしません。
                            </p>
                        </header>

                        <ol className="relative mt-12 max-w-3xl">
                            {flowSteps.map((item, index) => (
                                <li key={item.step} className="relative flex gap-6 pb-10 last:pb-0">
                                    {index < flowSteps.length - 1 && (
                                        <span
                                            className="absolute left-6 top-12 -ml-px h-[calc(100%-3rem)] border-l-2 border-dotted border-mint-300"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="u-num relative flex size-12 shrink-0 items-center justify-center rounded-full border border-teal-700 bg-white text-sm font-medium text-teal-700">
                                        {item.step}
                                    </span>
                                    <div className="pt-1.5">
                                        <h3 className="text-lg font-bold text-gray-900 text-balance">
                                            {item.title}
                                        </h3>
                                        <p className="mt-3 text-[15px] leading-loose text-gray-600 text-pretty">
                                            {item.desc}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Access Section（金沢市の店舗情報と来店予約） */}
                <section id="access" className="border-t border-gray-200 bg-white py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px] text-balance">
                                    店舗情報・来店のご予約
                                </h2>
                                <span className="u-chip">Access</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600 text-pretty">
                                金沢市金石本町の整備工場に併設した店舗です。実車を見ながらのご相談も、お見積りだけのご相談も歓迎です。
                            </p>
                        </header>

                        <div className="mt-12 grid gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-5">
                                <dl className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
                                    {[
                                        {
                                            term: '所在地',
                                            value: '〒920-0336 石川県金沢市金石本町ハ14',
                                        },
                                        { term: '電話', value: '076-268-1788', num: true },
                                        { term: 'FAX', value: '076-268-3163', num: true },
                                        { term: '平日', value: '9:00〜18:00', num: true },
                                        { term: '土曜', value: '9:00〜17:00', num: true },
                                        {
                                            term: '定休',
                                            value: '日曜・祝日／土曜は月により異なります',
                                        },
                                    ].map((row, index) => (
                                        <div
                                            key={row.term}
                                            className={cn(
                                                'flex gap-4 py-3 text-sm',
                                                index > 0 && 'border-t border-gray-200'
                                            )}
                                        >
                                            <dt className="w-16 shrink-0 text-gray-500">
                                                {row.term}
                                            </dt>
                                            <dd
                                                className={cn(
                                                    'text-gray-900',
                                                    row.num && 'u-num font-medium'
                                                )}
                                            >
                                                {row.term === '電話' ? (
                                                    <a
                                                        href="tel:076-268-1788"
                                                        className="transition-colors hover:text-teal-700"
                                                    >
                                                        {row.value}
                                                    </a>
                                                ) : (
                                                    row.value
                                                )}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                <div className="mt-4 grid gap-3">
                                    <a
                                        href="tel:076-268-1788"
                                        className="group flex h-14 items-center justify-between gap-6 rounded-xl bg-teal-700 px-6 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                                    >
                                        <span className="flex flex-col leading-tight">
                                            電話で来店予約する
                                            <span className="u-num mt-1 text-xs font-medium text-white/80">
                                                076-268-1788
                                            </span>
                                        </span>
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </a>
                                    <a
                                        href="https://lin.ee/CKQM0mE"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex h-14 items-center justify-between gap-6 rounded-xl bg-[#06C755] px-6 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-[#05b04c] active:scale-[0.98]"
                                    >
                                        <span className="flex flex-col leading-tight">
                                            LINEで相談する
                                            <span className="sr-only">（新しいタブで開きます）</span>
                                            <span className="mt-1 text-xs font-medium text-white/80">
                                                24時間受付
                                            </span>
                                        </span>
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </a>
                                    <Link
                                        href="/?c=新車販売#contact"
                                        className="group flex h-14 items-center justify-between gap-6 rounded-xl border border-gray-300 px-6 text-[15px] font-bold text-gray-900 transition-[background-color,border-color,transform] duration-200 hover:border-teal-700 hover:bg-gray-50 active:scale-[0.98]"
                                    >
                                        <span className="flex flex-col leading-tight">
                                            フォームで相談する
                                            <span className="mt-1 text-xs font-medium text-gray-500">
                                                ご希望の来店日時も指定できます
                                            </span>
                                        </span>
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-gray-200 lg:col-span-7">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102498.79916169232!2d136.51245513968695!3d36.600202237727785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff9cc85432c3f01%3A0x9d1d9922dd9db39!2z5riv5Y2X6Ieq5YuV6LuK44K144O844OT44K5!5e0!3m2!1sja!2sjp!4v1744335562038!5m2!1sja!2sjp"
                                    className="absolute inset-0 h-full w-full"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="港南自動車サービス地図"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px] text-balance">
                                    よくある質問
                                </h2>
                                <span className="u-chip">FAQ</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600 text-pretty">
                                金沢市での新車購入についてよくいただくご質問にお答えします。
                            </p>
                        </header>

                        <div className="mt-12 max-w-3xl">
                            {faqData.map((item) => (
                                <details
                                    key={item.question}
                                    className="group mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors duration-200 hover:border-mint-300"
                                >
                                    <summary className="flex cursor-pointer items-start gap-4 p-5 md:p-6">
                                        <span className="u-num mt-0.5 shrink-0 text-sm font-medium text-teal-700">
                                            Q
                                        </span>
                                        <span className="flex-1 font-bold text-gray-900">
                                            {item.question}
                                        </span>
                                        <svg
                                            aria-hidden="true"
                                            className="mt-1 size-4 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.75}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </summary>
                                    <div className="flex gap-4 border-t border-gray-200 px-5 pb-6 pt-5 md:px-6">
                                        <span className="u-num shrink-0 text-sm font-medium text-gray-500">
                                            A
                                        </span>
                                        <p className="flex-1 text-[15px] leading-loose text-gray-600 text-pretty">
                                            {item.answer}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 締めのご案内（ページ内で唯一の濃い面） */}
                <section className="bg-teal-900 py-16 md:py-20">
                    <div className="container">
                        <div className="grid gap-8 md:grid-cols-12 md:items-end">
                            <div className="md:col-span-7">
                                <span className="u-label text-teal-200">Contact</span>
                                <h2 className="mt-4 text-[26px] font-bold leading-tight text-white md:text-[32px] text-balance">
                                    新車のご相談・お見積り
                                </h2>
                                <p className="mt-4 max-w-lg text-[15px] leading-loose text-white/80 text-pretty">
                                    「この車に月々いくらで乗れるか知りたい」だけでも構いません。ご予算をうかがって、車種と買い方の組み合わせをお出しします。
                                </p>
                            </div>
                            <div className="grid gap-3 md:col-span-5">
                                <a
                                    href="tel:076-268-1788"
                                    className="group flex h-16 items-center justify-between gap-6 rounded-xl bg-white px-6 font-bold text-gray-900 transition-[background-color,transform] duration-200 hover:bg-gray-50 active:scale-[0.98]"
                                >
                                    <span className="flex flex-col leading-tight">
                                        <span className="u-num text-xl">076-268-1788</span>
                                        <span className="mt-1 text-[11px] font-medium text-gray-500">
                                            平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                                        </span>
                                    </span>
                                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                </a>
                                <Link
                                    href="/?c=新車販売#contact"
                                    className="group flex h-16 items-center justify-between gap-6 rounded-xl border border-white/50 px-6 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-white/10 active:scale-[0.98]"
                                >
                                    <span className="flex flex-col leading-tight">
                                        フォームで相談する
                                        <span className="mt-1 text-[11px] font-medium text-white/70">
                                            24時間受付
                                        </span>
                                    </span>
                                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
            <MobileActionBar />
        </div>
    );
}
