'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ArrowRight from '@/components/ArrowRight';
import Breadcrumb from '@/components/Breadcrumb';
import MobileActionBar from '@/components/MobileActionBar';
import PurchaseMethodTable from '@/components/PurchaseMethodTable';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { buildContactUrl } from '@/lib/contactHandoff';
import { ANNUAL_INTEREST_RATE, LOAN_PAYMENTS, carBasePrices, formatPrice } from '@/lib/carPrices';
import { solveMonthlyPayment } from '@/lib/loanCalculator';
import { categoryLabels, sortedCarLineup, type CarCategory } from '@/lib/carLineup';

/** 実質年率の表示用（3.9%） */
const RATE_LABEL = `${(ANNUAL_INTEREST_RATE * 100).toFixed(1)}%`;

/** 月々の目安を示すお借入れ額（円） */
const PRINCIPAL_SAMPLES = [1000000, 1500000, 2000000, 2500000, 3000000, 4000000];

/** ヒーローに出す代表例。表の1行目と同じ計算式から出すので数字がずれない */
const heroMonthly = Math.round(solveMonthlyPayment(PRINCIPAL_SAMPLES[0]));

// 審査から納車までの流れ。所要日数は案件ごとに変わるため書かず、手順と担当者だけを示す
const flowSteps = [
    {
        step: '01',
        title: 'ご相談',
        desc: 'ご希望の車種とご予算、いま乗っているお車の状況をうかがいます。お電話・LINE・フォームのいずれでも承ります。',
    },
    {
        step: '02',
        title: 'お見積り',
        desc: '車両価格・登録諸費用・メンテナンス費用まで含めて、月々いくらになるかをお出しします。買い方の比較もこの段階でご説明します。',
    },
    {
        step: '03',
        title: '仮審査のお申し込み',
        desc: '必要事項をご記入いただき、当社から信販会社へ仮審査を申し込みます。結果が出ましたら当社よりご連絡します。',
    },
    {
        step: '04',
        title: '本審査・ご契約',
        desc: '仮審査の通過後、本人確認書類などをそろえて本審査へ進み、ご契約手続きを行います。',
    },
    {
        step: '05',
        title: '車両の発注',
        desc: 'ご契約後、メーカーへ車両を発注します。納期は車種・グレードによって変わるため、発注時にご案内します。',
    },
    {
        step: '06',
        title: 'ご納車・お支払い開始',
        desc: 'お引き渡し時に、お支払いの開始時期と引き落とし日をご説明します。ご納車後の車検・点検・修理も当社で承ります。',
    },
];

// カーローンに関する FAQ（構造化データにも使う）
const faqData = [
    {
        question: '金沢市でカーローンを組むなら金利はどれくらいですか？',
        answer: `港南自動車サービスのカーローン「ノレタ」は実質年率${RATE_LABEL}です。一般的なディーラーローン（4.9%〜）と比べても金利負担を抑えられます。支払回数は36回が基本です。`,
    },
    {
        question: '頭金やボーナス払いは必要ですか？',
        answer: '必要ありません。頭金0円・ボーナス払いなしで月々定額のお支払いにできます。ボーナス月に余裕があるときだけ追加で返済していただくことも可能です。',
    },
    {
        question: '審査にはどんな書類が必要ですか？',
        answer: '運転免許証などの本人確認書類のほか、お勤め先やご収入に関する情報をうかがいます。お車やご契約の内容によって必要書類が変わるため、仮審査のお申し込み時に当社からご案内します。',
    },
    {
        question: '途中で繰上返済はできますか？',
        answer: 'できます。「ノレタ」は残価設定型ではなく自由返済型のカーローンのため、繰上返済をすると返済期間が短くなり、そのぶん分割手数料が軽くなります。',
    },
    {
        question: '車検やメンテナンス費用もローンに含められますか？',
        answer: 'はい。車検費用、オイル交換、故障修理などを月々の定額に含める形にできます。急な出費に備えなくてよいので、家計の見通しが立てやすくなります。',
    },
    {
        question: 'ローンとリースはどちらを選べばよいですか？',
        answer: '個人のお客様は、完済後にお車がご自身のものになるカーローン「ノレタ」が基本です。リース料を経費として処理したい法人・個人事業主のお客様には、法人向けリース「ノリドク」をご案内しています。',
    },
];

// 車種の選択肢を出す順序
const categoryOrder: CarCategory[] = ['KCAR', 'SUV', 'MINIVAN'];

export default function CarloanPage() {
    // 仮審査の相談に引き継ぐ車種
    const [selectedRoute, setSelectedRoute] = useState<string>('/kcar/hustler');

    const selectedCar = useMemo(
        () =>
            categoryOrder
                .flatMap((cat) => sortedCarLineup[cat])
                .find((car) => car.route === selectedRoute),
        [selectedRoute]
    );

    const monthlyPrice = carBasePrices[selectedRoute];

    // お借入れ額ごとの月々の目安（元利均等・ボーナス払いなし）
    const principalRows = useMemo(
        () =>
            PRINCIPAL_SAMPLES.map((principal) => ({
                principal,
                monthly: Math.round(solveMonthlyPayment(principal)),
            })),
        []
    );

    // 仮審査の相談をトップページのフォームへ引き継ぐURL
    const contactUrl = buildContactUrl({
        category: 'ローン仮審査',
        lines: selectedCar
            ? [
                  `ご希望の車種: ${selectedCar.maker} ${selectedCar.name}`,
                  `月々の目安: ${formatPrice(monthlyPrice)}`,
                  `実質年率: ${RATE_LABEL}`,
                  `支払回数: ${LOAN_PAYMENTS}回`,
              ]
            : [],
    });

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
                currentPath="/carloan"
                logoAlt="港南自動車サービス｜石川県金沢市の自動車ローン・新車販売"
            />

            <main id="main" tabIndex={-1} className="pt-16 md:pt-20">
                <Breadcrumb
                    items={[
                        { name: 'ホーム', href: '/' },
                        { name: 'カーローン', href: '/carloan' },
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
                                    <span>自由返済型カーローン「ノレタ」</span>
                                </p>

                                <h1 className="mt-6 text-balance text-[32px] font-bold leading-[1.35] tracking-ja text-gray-900 md:text-[46px]">
                                    金沢の<span className="text-teal-700">自動車ローン</span>なら
                                    <br />
                                    港南自動車サービス
                                </h1>

                                <p className="mt-7 max-w-xl text-[15px] leading-loose text-gray-600 md:text-base text-pretty">
                                    実質年率{RATE_LABEL}、頭金0円・ボーナス払いなし。車検やオイル交換などの維持費まで月々の定額に含められる、
                                    <b className="font-bold text-gray-900">残価設定型ではない自由返済型のカーローン</b>
                                    です。金利の目安から審査の流れまで、このページにまとめました。
                                </p>

                            </div>

                            {/* スマホでは縦に積むため、CTAより先に金額が目に入る順序にする */}
                            <div className="order-2 lg:order-none lg:col-span-7">
                                <div className="flex flex-col gap-3 sm:flex-row lg:mt-2">
                                    <a
                                        href="#simulation"
                                        className="group flex h-14 items-center justify-between gap-8 rounded-xl bg-teal-700 px-7 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                                    >
                                        月々の目安を見る
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </a>
                                    <a
                                        href="#flow"
                                        className="group flex h-14 items-center justify-between gap-8 rounded-xl border border-gray-300 px-7 text-[15px] font-bold text-gray-900 transition-[background-color,border-color,transform] duration-200 hover:border-teal-700 hover:bg-gray-50 active:scale-[0.98]"
                                    >
                                        審査の流れを見る
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>

                            {/* ローンを調べに来た人の問いは「いくら借りたら月いくらか」の一点なので、
                                下の返済表を待たせず、その1行だけを先に出す */}
                            <div className="order-1 lg:order-none lg:col-span-5">
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 md:p-8">
                                    <p className="text-sm text-gray-600">
                                        <span className="u-num font-medium text-gray-900">
                                            100万円
                                        </span>
                                        をお借入れした場合
                                    </p>
                                    <p className="mt-4 flex items-baseline gap-2 border-b border-gray-200 pb-6">
                                        <span className="u-num text-[52px] font-medium leading-none text-teal-700 md:text-[64px]">
                                            {heroMonthly.toLocaleString()}
                                        </span>
                                        <span className="text-lg font-bold text-gray-900 text-balance">
                                            円／月
                                        </span>
                                    </p>
                                    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                                        {[
                                            { term: '実質年率', value: RATE_LABEL },
                                            { term: '支払回数', value: `${LOAN_PAYMENTS}回` },
                                            { term: '頭金', value: '0円' },
                                            { term: 'ボーナス払い', value: 'なし' },
                                        ].map((row) => (
                                            <div key={row.term}>
                                                <dt className="text-xs text-gray-500">
                                                    {row.term}
                                                </dt>
                                                <dd className="u-num mt-1 font-medium text-gray-900">
                                                    {row.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                                <p className="mt-3 text-xs leading-loose text-gray-500">
                                    元利均等・ボーナス払いなしで計算した概算です。お借入れ額ごとの目安は下の表をご覧ください。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Rate Section（金利と返済期間の目安） */}
                <section id="rate" className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px] text-balance">
                                    金利と返済期間の目安
                                </h2>
                                <span className="u-chip">Rate</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600 text-pretty">
                                実質年率{RATE_LABEL}。支払回数は{LOAN_PAYMENTS}
                                回（3年）を基本にしています。下の表は、お借入れ額に対して毎月いくらお支払いいただくかの目安です。
                            </p>
                        </header>

                        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
                            <div className="lg:col-span-7">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[26rem] overflow-hidden rounded-2xl border border-gray-200 bg-white text-left">
                                        <caption className="sr-only">
                                            お借入れ額別の月々のお支払い目安（実質年率{RATE_LABEL}・
                                            {LOAN_PAYMENTS}回・ボーナス払いなし）
                                        </caption>
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-white">
                                                <th scope="col" className="u-label px-5 py-4">
                                                    お借入れ額
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="u-label px-5 py-4 text-right"
                                                >
                                                    月々のお支払い
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="u-label px-5 py-4 text-right"
                                                >
                                                    お支払い総額
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {principalRows.map((row) => (
                                                <tr
                                                    key={row.principal}
                                                    className="border-t border-gray-200"
                                                >
                                                    <th
                                                        scope="row"
                                                        className="u-num px-5 py-4 text-left font-medium text-gray-900"
                                                    >
                                                        {row.principal.toLocaleString()}円
                                                    </th>
                                                    <td className="u-num whitespace-nowrap px-5 py-4 text-right font-medium text-teal-700">
                                                        {row.monthly.toLocaleString()}円
                                                    </td>
                                                    <td className="u-num whitespace-nowrap px-5 py-4 text-right text-gray-600">
                                                        {(
                                                            row.monthly * LOAN_PAYMENTS
                                                        ).toLocaleString()}
                                                        円
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="mt-5 text-xs leading-loose text-gray-500">
                                    ※実質年率{RATE_LABEL}・{LOAN_PAYMENTS}
                                    回・元利均等・ボーナス払いなしで計算した概算です。端数処理の関係で実際のお支払い額とは数十円の差が出ることがあります。下取り車の有無、車両の値引き、メンテナンス費用の組み込み方によっても変わりますので、正確な金額はお見積りでご案内します。
                                </p>
                            </div>

                            <div className="space-y-4 lg:col-span-5">
                                <article className="rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
                                    <h3 className="text-lg font-bold text-gray-900 text-balance">
                                        金利{RATE_LABEL}の意味
                                    </h3>
                                    <p className="mt-4 text-[15px] leading-loose text-gray-600 text-pretty">
                                        一般的なディーラーローン（4.9%〜）と比べると、同じ車・同じ期間でも支払総額に差が出ます。当社は車検・点検・保険まで長くお付き合いいただく前提のため、ローン単体の利益を抑えた金利設定にしています。
                                    </p>
                                </article>
                                <article className="rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
                                    <h3 className="text-lg font-bold text-gray-900 text-balance">
                                        自由返済型なので期間を調整できます
                                    </h3>
                                    <p className="mt-4 text-[15px] leading-loose text-gray-600 text-pretty">
                                        残価設定型ローンではないため、3年後に「まとまった残価を一括で払う」「高い金利で再ローンを組み直す」といったことがありません。余裕のあるときに繰上返済すれば期間が短くなり、そのぶん分割手数料も軽くなります。
                                    </p>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Simulation Section（車種別の月々の目安と仮審査の相談） */}
                <section id="simulation" className="border-t border-gray-200 bg-white py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px] text-balance">
                                    車種から月々の目安を見る
                                </h2>
                                <span className="u-chip">Simulation</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600 text-pretty">
                                車種を選ぶと、車検やオイル交換などの維持費まで含めた月々の目安が出ます。そのままの内容で仮審査のご相談に進めます。
                            </p>
                        </header>

                        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
                            <div className="lg:col-span-5">
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-7">
                                    <label
                                        htmlFor="loan-car"
                                        className="u-label block px-1"
                                    >
                                        ご希望の車種
                                    </label>
                                    <select
                                        id="loan-car"
                                        value={selectedRoute}
                                        onChange={(e) => setSelectedRoute(e.target.value)}
                                        className="mt-4 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-[15px] text-gray-900 transition-colors focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                                    >
                                        {categoryOrder.map((cat) => (
                                            <optgroup key={cat} label={categoryLabels[cat]}>
                                                {sortedCarLineup[cat].map((car) => (
                                                    <option key={car.route} value={car.route}>
                                                        {car.maker} {car.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <p className="mt-4 text-xs leading-loose text-gray-500">
                                        一覧にない車種でもお見積りできます。フォームのご相談内容にお書きください。
                                    </p>
                                </div>
                            </div>

                            <div className="lg:col-span-7">
                                <div className="rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
                                    <p className="u-label">
                                        {selectedCar?.maker} {selectedCar?.name}
                                    </p>
                                    <p className="mt-4 flex items-baseline gap-2">
                                        <span className="u-num text-[40px] font-medium leading-none text-teal-700 md:text-[52px]">
                                            {monthlyPrice?.toLocaleString()}
                                        </span>
                                        <span className="text-lg font-bold text-gray-900 text-balance">
                                            円／月〜
                                        </span>
                                    </p>

                                    <dl className="mt-8 border-t border-gray-200">
                                        {[
                                            { term: '実質年率', value: RATE_LABEL },
                                            { term: '支払回数', value: `${LOAN_PAYMENTS}回（3年）` },
                                            { term: '頭金', value: '0円' },
                                            { term: 'ボーナス払い', value: 'なし' },
                                            { term: '車検・メンテ費用', value: '月々の定額に込み' },
                                        ].map((row) => (
                                            <div
                                                key={row.term}
                                                className="flex items-baseline justify-between gap-4 border-b border-gray-200 py-3"
                                            >
                                                <dt className="text-sm text-gray-600">{row.term}</dt>
                                                <dd className="u-num text-[15px] font-medium text-gray-900">
                                                    {row.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>

                                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                        <Link
                                            href={contactUrl}
                                            className="group flex h-14 items-center justify-between gap-6 rounded-xl bg-teal-700 px-6 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                                        >
                                            <span className="flex flex-col leading-tight">
                                                この内容で仮審査を相談
                                                <span className="mt-1 text-xs font-medium text-white/80">
                                                    フォームへ引き継ぎます
                                                </span>
                                            </span>
                                            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                        </Link>
                                        <a
                                            href="tel:076-268-1788"
                                            className="group flex h-14 items-center justify-between gap-6 rounded-xl border border-gray-300 px-6 text-[15px] font-bold text-gray-900 transition-[background-color,border-color,transform] duration-200 hover:border-teal-700 hover:bg-gray-50 active:scale-[0.98]"
                                        >
                                            <span className="flex flex-col leading-tight">
                                                電話で相談する
                                                <span className="u-num mt-1 text-xs font-medium text-gray-500">
                                                    076-268-1788
                                                </span>
                                            </span>
                                            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                        </a>
                                    </div>

                                    <p className="mt-6 text-xs leading-loose text-gray-500">
                                        ※月々の金額はグレード・オプション・下取り車の有無によって変わります。仮審査はお申し込みいただいた内容にもとづき信販会社が判断するため、結果をお約束するものではありません。
                                    </p>
                                </div>

                                <p className="mt-5 text-sm text-gray-600">
                                    車種ごとの装備や月々の内訳は
                                    <Link
                                        href="/shinsha"
                                        className="font-bold text-teal-700 underline underline-offset-4 hover:text-teal-500"
                                    >
                                        新車販売ページ
                                    </Link>
                                    、ローンの仕組みの詳しい説明は
                                    <Link
                                        href="/noreta"
                                        className="font-bold text-teal-700 underline underline-offset-4 hover:text-teal-500"
                                    >
                                        ノレタのページ
                                    </Link>
                                    でご覧いただけます。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Flow Section（審査から納車までの流れ） */}
                <section id="flow" className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px] text-balance">
                                    審査から納車までの流れ
                                </h2>
                                <span className="u-chip">Flow</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600 text-pretty">
                                信販会社とのやり取りは当社が窓口となって進めます。お客様にご用意いただくのは書類だけです。
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

                        <p className="mt-4 max-w-3xl text-xs leading-loose text-gray-500">
                            ※審査に要する期間と納期は、お申し込みの内容や車種によって異なります。ご相談時点での見込みをその都度ご案内します。
                        </p>
                    </div>
                </section>

                {/* Comparison Section（ローン・リース・現金の比較） */}
                <section className="border-t border-gray-200 bg-white py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px] text-balance">
                                    ローン・リース・現金の比較
                                </h2>
                                <span className="u-chip">Compare</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600 text-pretty">
                                個人のお客様はカーローン「ノレタ」、法人・個人事業主のお客様はリース「ノリドク」が基本です。それぞれの違いを並べました。
                            </p>
                        </header>

                        <div className="mt-12">
                            <PurchaseMethodTable />
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
                                金沢市でのカーローンについてよくいただくご質問にお答えします。
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
                                    仮審査・お見積りのご相談
                                </h2>
                                <p className="mt-4 max-w-lg text-[15px] leading-loose text-white/80 text-pretty">
                                    「月々いくらまでなら無理がないか」からご相談いただけます。金沢市金石本町の店舗でも、お電話・LINE・フォームでも承ります。
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
                                    href={contactUrl}
                                    className="group flex h-16 items-center justify-between gap-6 rounded-xl border border-white/50 px-6 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-white/10 active:scale-[0.98]"
                                >
                                    <span className="flex flex-col leading-tight">
                                        仮審査をフォームで相談する
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
