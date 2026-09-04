'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import MobileActionBar from '@/components/MobileActionBar';
import { carBasePrices, formatPrice } from '@/lib/carPrices';
import { readUrlParam, writeUrlParams } from '@/lib/urlState';

// ノレタ FAQ データ
const noretaFaqData = [
    {
        question: '金沢市で新車を買うなら、どこがおすすめですか？',
        answer: '港南自動車サービスの「ノレタ」がおすすめです。月々定額、頭金・ボーナス払いなしで新車に乗れる3年のカーローン。創業70年の実績と信頼があります。',
    },
    {
        question: 'ノレタの月々の支払いはいくらからですか？',
        answer: '軽自動車で月々27,000円から、SUVで35,000円からご利用いただけます。頭金・ボーナス払いは不要です。',
    },
    {
        question: '3年後はどうなりますか？',
        answer: '3年後は、①新しい車に乗り換え、②同じ車を継続利用、③車を売却（下取り）、の3つの選択肢からお選びいただけます。',
    },
    {
        question: '車検やメンテナンスは含まれていますか？',
        answer: 'はい、ノレタには車検費用、オイル交換、故障修理などがすべて含まれています。急な出費の心配がありません。',
    },
];

type CarCategory = 'SUV' | 'MINIVAN' | 'KCAR';

interface Car {
    name: string;
    price: string;
    image: string;
    route?: string;
}

/**
 * 一覧カードで車体の見え方を揃えるための倍率。
 * 写真ごとに車が写り込む大きさ（余白の量）も縦横比も違うため、
 * 実測した車体の幅をもとに、どのカードでも同じ大きさに見えるよう補正する。
 */
const carImageScale: Record<string, number> = {
    '/cars/jimnysierra.jpg': 0.91,
    '/cars/yariscross.jpg': 1.29,
    '/cars/xbee.jpg': 0.99,
    '/cars/vezel.jpg': 0.89,
    '/cars/corollacross.jpg': 1.06,
    '/cars/harrier.jpg': 0.97,
    '/cars/rav4.jpg': 1.18,
    '/cars/landcruiser.jpg': 1.0,
    '/cars/crownsport.jpg': 0.96,
    '/cars/nx.jpg': 0.99,
    '/cars/noah.jpg': 0.99,
    '/cars/voxy.jpg': 0.98,
    '/cars/alphard.jpg': 0.99,
    '/cars/nbox.jpg': 1.41,
    '/cars/tantocustom.jpg': 1.04,
    '/cars/tantofuncross.jpg': 1.03,
    '/cars/delicamini.jpg': 1.12,
    '/cars/spacia.jpg': 0.93,
    '/cars/spaciagear.jpg': 1.0,
    '/cars/hustler.jpg': 1.03,
    '/cars/jimny.jpg': 0.96,
};

export default function Page() {
    const [activeCategory, setActiveCategory] = useState<CarCategory>('SUV');
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Escapeキーでメニューを閉じ、開閉ボタンにフォーカスを戻す
    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setMenuOpen(false);
            document.getElementById('menu-toggle')?.focus();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen]);


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // ── 選択中のカテゴリをURLに反映する（例: /noreta?category=KCAR） ──
    // マウント後にURLを読んで復元する（静的HTMLは既定値のままなので不一致は起きない）
    useEffect(() => {
        const category = readUrlParam('category');
        if (category === 'SUV' || category === 'MINIVAN' || category === 'KCAR') {
            setActiveCategory(category);
        }
    }, []);

    // カテゴリが変わったらURLを書き換える。初回はURLからの復元を上書きしないよう飛ばす
    const skipFirstUrlWrite = useRef(true);
    useEffect(() => {
        if (skipFirstUrlWrite.current) {
            skipFirstUrlWrite.current = false;
            return;
        }
        // 既定値（SUV）のときはURLに出さない
        writeUrlParams({ category: activeCategory === 'SUV' ? null : activeCategory });
    }, [activeCategory]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        // 途中位置で読み込まれた場合もヘッダーの見た目を合わせる
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 価格文字列から数値を抽出する関数
    const extractPriceNumber = (priceString: string): number => {
        return parseInt(priceString.replace(/[,円～]/g, ''), 10);
    };

    // 価格順にソートする関数
    const sortByPrice = (cars: Car[]): Car[] => {
        return [...cars].sort((a, b) => extractPriceNumber(a.price) - extractPriceNumber(b.price));
    };

    const rawCarData: Record<CarCategory, Car[]> = {
        SUV: [
            {
                name: 'ジムニーシエラ',
                price: formatPrice(carBasePrices['/suv/jimnysierra']),
                image: '/cars/jimnysierra.jpg',
                route: '/suv/jimnysierra',
            },
            {
                name: 'ヤリスクロス',
                price: formatPrice(carBasePrices['/suv/yariscross']),
                image: '/cars/yariscross.jpg',
                route: '/suv/yariscross',
            },
            {
                name: 'クロスビー',
                price: formatPrice(carBasePrices['/suv/xbee']),
                image: '/cars/xbee.jpg',
                route: '/suv/xbee',
            },
            { name: 'ヴェゼル', price: formatPrice(carBasePrices['/suv/vezel']), image: '/cars/vezel.jpg', route: '/suv/vezel' },
            {
                name: 'カローラクロス',
                price: formatPrice(carBasePrices['/suv/corollacross']),
                image: '/cars/corollacross.jpg',
                route: '/suv/corollacross',
            },
            {
                name: 'ハリアー',
                price: formatPrice(carBasePrices['/suv/harrier']),
                image: '/cars/harrier.jpg',
                route: '/suv/harrier',
            },
            { name: 'RAV4', price: formatPrice(carBasePrices['/suv/rav4']), image: '/cars/rav4.jpg', route: '/suv/rav4' },
            {
                name: 'ランクル 250',
                price: formatPrice(carBasePrices['/suv/landcruiser']),
                image: '/cars/landcruiser.jpg',
                route: '/suv/landcruiser',
            },
            { name: 'クラウンスポーツ', price: formatPrice(carBasePrices['/suv/crown']), image: '/cars/crownsport.jpg', route: '/suv/crown' },
            { name: 'NX', price: formatPrice(carBasePrices['/suv/nx']), image: '/cars/nx.jpg', route: '/suv/nx' },
        ],

        MINIVAN: [
            { name: 'ノア', price: formatPrice(carBasePrices['/minivan/noah']), image: '/cars/noah.jpg', route: '/minivan/noah' },
            { name: 'ヴォクシー', price: formatPrice(carBasePrices['/minivan/voxy']), image: '/cars/voxy.jpg', route: '/minivan/voxy' },
            {
                name: 'アルファード',
                price: formatPrice(carBasePrices['/minivan/alphard']),
                image: '/cars/alphard.jpg',
                route: '/minivan/alphard',
            },
        ],

        KCAR: [
            { name: 'N-BOX カスタム', price: formatPrice(carBasePrices['/kcar/nbox']), image: '/cars/nbox.jpg', route: '/kcar/nbox' },
            {
                name: 'タントカスタム',
                price: formatPrice(carBasePrices['/kcar/tantocustom']),
                image: '/cars/tantocustom.jpg',
                route: '/kcar/tantocustom',
            },
            {
                name: 'タントファンクロス',
                price: formatPrice(carBasePrices['/kcar/tantofuncross']),
                image: '/cars/tantofuncross.jpg',
                route: '/kcar/tantofuncross',
            },
            {
                name: 'デリカミニ',
                price: formatPrice(carBasePrices['/kcar/delicamini']),
                image: '/cars/delicamini.jpg',
                route: '/kcar/delicamini',
            },
            {
                name: 'スペーシアカスタム',
                price: formatPrice(carBasePrices['/kcar/spacia']),
                image: '/cars/spacia.jpg',
                route: '/kcar/spacia',
            },
            {
                name: 'スペーシアギア',
                price: formatPrice(carBasePrices['/kcar/spaciagear']),
                image: '/cars/spaciagear.jpg',
                route: '/kcar/spaciagear',
            },
            {
                name: 'ハスラー',
                price: formatPrice(carBasePrices['/kcar/hustler']),
                image: '/cars/hustler.jpg',
                route: '/kcar/hustler',
            },
            { name: 'ジムニー', price: formatPrice(carBasePrices['/kcar/jimny']), image: '/cars/jimny.jpg', route: '/kcar/jimny' },
        ],
    };

    // 各カテゴリの車種を価格順（安い順）にソート
    const carData: Record<CarCategory, Car[]> = {
        SUV: sortByPrice(rawCarData.SUV),
        MINIVAN: sortByPrice(rawCarData.MINIVAN),
        KCAR: sortByPrice(rawCarData.KCAR),
    };

    // FAQPage 構造化データ
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: noretaFaqData.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    return (
        <div className="min-h-dvh bg-white text-gray-800 font-sans selection:bg-teal-100" data-oid="dn0w-eo">
            {/* FAQ構造化データ（AIクローラーにも見えるよう静的HTMLに含める） */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${isScrolled
                    ? 'bg-white/95 backdrop-blur border-b border-gray-200 py-2'
                    : 'bg-gray-950/35 py-5'
                    }`}
                data-oid="fqghwyr"
            >
                <div
                    className="container mx-auto px-6 flex justify-between items-center"
                    data-oid="ogzl6xz"
                >
                    <Link href="/" className="flex items-center group" data-oid="0eh.y8p">
                        <div className={`relative ${isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}>
                            <Image
                                src="/logo.png"
                                alt="港南自動車サービス株式会社"
                                width={280}
                                height={70}
                                className={`h-full w-auto object-contain ${!isScrolled && 'brightness-0 invert'}`}
                                priority
                            />
                        </div>
                    </Link>
                    <div className="hidden xl:flex items-center gap-5 whitespace-nowrap" data-oid="jdpcl.f">
                        <nav className={`flex items-center gap-7 whitespace-nowrap transition-colors duration-200 ${isScrolled ? 'text-slate-700' : 'text-white'}`} data-oid="_c2.5k6">
                            {[
                                { name: '車検', href: '/shaken' },
                                { name: 'サービス内容', href: '/#services' },
                                { name: '取扱車種', href: '/#cases' },
                                { name: '会社情報', href: '/#company' },
                                { name: '採用情報', href: '/recruit' },
                                { name: 'お問い合わせ', href: '/#contact' }
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="relative font-medium hover:text-teal-500 transition-colors group overflow-hidden"
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-200"></span>
                                </Link>
                            ))}
                        </nav>
                        <Link
                            href="/noreta"
                            className={`px-6 py-2.5 rounded-full font-bold transition-ui duration-200 shadow-lg   ${isScrolled
                                ? 'bg-teal-700 text-white hover:bg-teal-800'
                                : 'bg-white text-teal-800 hover:bg-slate-100'
                                }`}
                            data-oid="r7m-jfd"
                        >
                            ノレタ詳細
                        </Link>
                        <Link
                            href="/noridoku"
                            className={`px-6 py-2.5 rounded-full font-bold transition-ui duration-200 shadow-lg   ${isScrolled
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            ノリドク詳細
                        </Link>
                    </div>
                    <button
                        className={`xl:hidden flex size-11 items-center justify-center rounded border transition-colors ${isScrolled ? 'bg-teal-700 text-white' : 'bg-white/20 text-white backdrop-blur-sm'
                            }`}
                        id="menu-toggle"
                        aria-controls="mobile-menu"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-label="メニューを開く"
                        data-oid="av_bd._"
                    >
                        <svg aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`}
                        >
                            {menuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile menu - headerの外に配置してスクロール時の影響を受けないようにする */}
            <div
                id="mobile-menu"
                className={`fixed inset-0 overscroll-contain bg-gray-900 z-50 xl:hidden transition-opacity duration-200 flex flex-col items-center justify-center space-y-7 px-6 ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                    }`}
            >
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    aria-label="メニューを閉じる"
                >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                {[
                    { name: '車検', href: '/shaken' },
                    { name: 'サービス内容', href: '/#services' },
                    { name: '取扱車種', href: '/#cases' },
                    { name: '会社情報', href: '/#company' },
                    { name: '採用情報', href: '/recruit' },
                    { name: 'お問い合わせ', href: '/#contact' }
                ].map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="text-xl font-bold text-white hover:text-teal-300 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        {item.name}
                    </Link>
                ))}
                <Link
                    href="/noreta"
                    className="flex h-14 w-full max-w-xs items-center justify-center rounded bg-teal-700 font-bold text-white"
                    onClick={() => setMenuOpen(false)}
                >
                    ノレタ詳細
                </Link>
                <Link
                    href="/noridoku"
                    className="flex h-14 w-full max-w-xs items-center justify-center rounded border border-white/50 font-bold text-white"
                    onClick={() => setMenuOpen(false)}
                >
                    ノリドク詳細
                </Link>
            </div>

            {/* Hero Section */}
            <section id="main" tabIndex={-1} className="bg-teal-900 text-white">
                {/* 写真には文字が焼き込まれているため、切り抜かず幅基準で全体を出す */}
                <div className="mx-auto max-w-5xl px-4 pt-20 md:px-8">
                    <Image
                        src="/images/noreta-hero01.jpg"
                        alt="ノレタで乗れる車種"
                        width={1920}
                        height={1080}
                        className="h-auto w-full rounded-2xl"
                        priority
                    />
                </div>

                <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 md:px-8">
                    <h1 className="text-4xl font-bold tracking-ja md:text-5xl">ノレタ</h1>
                    <p className="mt-4 max-w-xl text-lg leading-relaxed text-teal-100">
                        新車を、買うのではなく毎月の暮らしの一部にする。
                        金沢で70年、車を直してきた整備工場のカーローンです。
                    </p>
                </div>
            </section>



            {/* Main Content */}
            <main id="lineup" className="relative bg-white pt-24 pb-32" data-oid="vgxn62n">
                {/* Vehicle Lineup Section */}
                <div className="container mx-auto px-6" data-oid="4ni0p50">
                    <div className="mb-12 max-w-2xl">
                        <h2 className="text-4xl font-bold tracking-ja text-gray-900 md:text-5xl">
                            ラインナップ
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-gray-600">
                            表示はすべて月々の総額です。どの車種も頭金なし・3年契約、
                            ボーナス払いは使っても使わなくても構いません。
                        </p>
                    </div>

                    {/* Category Selector */}
                    <div className="mb-10 flex flex-wrap gap-2 border-b border-rule">
                        {(['SUV', 'MINIVAN', 'KCAR'] as const).map((cat) => (
                            <button
                                key={cat}
                                className={`-mb-px border-b-2 px-5 py-3 font-bold transition-colors duration-150 ${activeCategory === cat
                                    ? 'border-teal-700 text-teal-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveCategory(cat)}
                                aria-label={`${cat}カテゴリを表示`}
                            >
                                {cat === 'KCAR' ? '軽自動車' : cat === 'MINIVAN' ? 'ミニバン' : cat}
                            </button>
                        ))}
                    </div>

                    {/* Car Grid
                        非表示のカテゴリもDOMには残す。条件レンダリングにすると初期表示の
                        SUV以外（軽自動車・ミニバン）の車種ページへのリンクが静的HTMLから
                        消え、クローラーから到達できない孤立ページになるため。 */}
                    {(['SUV', 'MINIVAN', 'KCAR'] as const).map((cat) => (
                        <div
                            key={cat}
                            className={`${activeCategory === cat ? 'grid' : 'hidden'} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10`}
                        >
                        {carData[cat].map((car, index) => (
                            <div
                                key={index}
                                className="group overflow-hidden rounded-2xl border border-rule bg-white transition-colors duration-200 hover:border-teal-700"
                            >
                                <Link href={car.route || '#'} className="flex h-full flex-col">
                                    {/* 写真ごとに縦横比が違う（1:1〜1.9:1）ため、切らずに全体を収める。
                                        車体の見た目の大きさは carImageScale で揃える */}
                                    <div className="relative w-full overflow-hidden bg-white pt-[75%]">
                                        <Image
                                            src={car.image}
                                            alt={car.name}
                                            fill
                                            className="absolute left-0 top-0 object-contain p-3"
                                            style={{ transform: `scale(${carImageScale[car.image] ?? 1})` }}
                                        />
                                    </div>

                                    <div className="flex flex-1 items-baseline justify-between gap-4 border-t border-rule px-5 py-4">
                                        <h3 className="text-lg font-bold tracking-ja text-gray-900">
                                            {car.name}
                                        </h3>
                                        <span className="u-num whitespace-nowrap text-lg font-bold text-teal-700">
                                            {car.price}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        </div>
                    ))}
                </div>
                {/* Why Noreta Section (安さの秘密) */}
                <section className="py-32 bg-slate-50 relative overflow-hidden" data-oid="709fdsg">
                    <div className="absolute top-0 left-0 w-full h-24 bg-transparent z-10" data-oid="grad-top"></div>

                    <div className="container mx-auto px-6 relative z-10" data-oid="46o57.p">
                        <div className="text-center mb-24" data-oid="secret-header">
                            <h2 className="text-[28px] md:text-[36px] font-bold text-gray-900 mb-8 tracking-ja" data-oid="dzihdm7">
                                なんでそんなに安いの？
                            </h2>
                            <p className="text-xl text-slate-500 font-bold" data-oid="2.9o5tl">
                                港南自動車サービスが実現する、3つの理由
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto" data-oid="hxmpxux">
                            {/* Point 1 */}
                            <div className="rounded-2xl border border-rule bg-white p-8 md:p-12" data-oid=".pgj:90">
                                <div className="flex flex-col md:flex-row gap-10 items-start" data-oid="pt1-layout">
                                    <div className="flex-grow" data-oid="y24d2wj">
                                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 tracking-ja leading-tight" data-oid="krp651x">
                                            3年後のリセールだけを考慮した<br className="hidden md:block" />車両・オプション設定
                                        </h3>
                                        <div className="space-y-6" data-oid="y-g00bw">
                                            <p className="text-slate-600 text-lg font-medium leading-relaxed" data-oid="gfdh3zz">
                                                新車を賢く乗り換える鍵は「車両設定」にあります。単に人気車を選ぶだけでなく、3年後の市場価値を徹底的に分析。プロの視点で「最も価値が落ちにくい」組み合わせをご提案します。
                                            </p>
                                            <div className="rounded-2xl border border-rule bg-paper p-6 md:p-8" data-oid="7l16u3f">
                                                <p className="font-bold text-teal-800 mb-6 flex items-center" data-oid="906.zsh">
                                                    <span className="w-1.5 h-6 bg-teal-700 rounded-full mr-3" data-oid="h-line"></span>
                                                    「ノレタ」が提案する賢い選択
                                                </p>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 font-bold" data-oid="xaachj6">
                                                    {[
                                                        '市場価値の高い人気車種',
                                                        '値崩れしにくい上位グレード',
                                                        'リセールに強い定番カラー',
                                                        '必須と言われるメーカーオプション',
                                                        '精密な残価（下取り）予測',
                                                        '最大限の車両値引き'
                                                    ].map((item, i) => (
                                                        <li key={i} className="flex items-center" data-oid={`li-${i}`}>
                                                            <svg aria-hidden="true" className="size-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Point 2 */}
                            <div className="rounded-2xl border border-rule bg-white p-8 md:p-12" data-oid="si6zjvw">
                                <div className="flex flex-col md:flex-row gap-10 items-start" data-oid="pt2-layout">
                                    <div className="flex-grow" data-oid="yjv6tmj">
                                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 tracking-ja leading-tight" data-oid="obvqt1a">
                                            自由返済型ローンと<br className="hidden md:block" />業界トップクラスの低金利 3.9%
                                        </h3>
                                        <div className="space-y-6" data-oid="k3fl9l4">
                                            <p className="text-slate-600 text-lg font-medium leading-relaxed" data-oid="ac9ko9u">
                                                一般的な残価設定型ローンではなく、柔軟な「自由返済型」を採用。さらに、実質年率3.9%という圧倒的な低金利により、金利負担を最小限に抑えています。
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="pt:2ivh">
                                                <div className="bg-teal-50 rounded-3xl p-8 border border-teal-100" data-oid="nmhqa3g">
                                                    <p className="font-bold text-teal-900 mb-4" data-oid="i8z0h70">金利 3.9% のメリット</p>
                                                    <p className="text-slate-600 font-medium text-sm leading-relaxed" data-oid="li-m1">
                                                        一般的なディーラー（4.9%〜）と比較しても、支払総額で大きな差が出ます。もちろん、メンテナンス代も含めた設定が可能です。
                                                    </p>
                                                </div>
                                                <div className="bg-teal-50 rounded p-8 border border-teal-200" data-oid="6zbpo6s">
                                                    <p className="font-bold text-teal-900 mb-4" data-oid="mm8:goj">自由返済型の安心</p>
                                                    <p className="text-slate-600 font-medium text-sm leading-relaxed" data-oid="li-m2">
                                                        3年後に乗り続ける場合も、高金利な「再ローン」手続きは不要。3.9%のまま柔軟に期間を調整できます。
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Point 3 */}
                            <div className="rounded-2xl border border-rule bg-white p-8 md:p-12" data-oid="lw9j4p0">
                                <div className="flex flex-col md:flex-row gap-10 items-start" data-oid="pt3-layout">
                                    <div className="flex-grow" data-oid="1-8t4mx">
                                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 tracking-ja leading-tight" data-oid=".1wi25_">
                                            地域密着70年の基盤があるから<br className="hidden md:block" />実現できる「お客様第一」の利益率
                                        </h3>
                                        <div className="space-y-6" data-oid=":cp2yeq">
                                            <p className="text-slate-600 text-lg font-medium leading-relaxed" data-oid="1-jo5:g">
                                                「ノレタ」単体での利益は決して多くありません。しかし、車検、点検、保険、販売とトータルカーライフをサポートし続ける港南自動車だからこそ、この驚きの価格設定が可能になりました。
                                            </p>
                                            <div className="bg-slate-900 text-white rounded p-8 relative overflow-hidden" data-oid="szywr8a">
                                                <div className="absolute top-0 right-0 size-32 bg-teal-700 opacity-20 hidden" data-oid="blur"></div>
                                                <p className="text-white/90 font-medium leading-relaxed italic relative z-10" data-oid=":9m.:r2">
                                                    「一度きりの利益より、一生のお付き合いを。」<br />
                                                    創業70年の歩みが、お客様への還元という形で実を結んでいます。
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 mb-6 tracking-ja">
                                よくある質問
                            </h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                                ノレタについてよくいただくご質問にお答えします
                            </p>
                        </div>
                        <div className="max-w-3xl mx-auto space-y-6">
                            {noretaFaqData.map((item, idx) => (
                                <article key={idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-start">
                                        <span className="text-teal-700 mr-3">Q.</span>
                                        {item.question}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed pl-8">
                                        <span className="text-teal-700 font-bold mr-2">A.</span>
                                        {item.answer}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-32 relative bg-white" data-oid="._gvodc">
                    <div className="container mx-auto px-6 relative z-10" data-oid="skrri5s">
                        <div className="text-center mb-20" data-oid="contact-header">
                            <h2 className="text-[28px] md:text-[36px] font-bold text-gray-900 mb-8 tracking-ja" data-oid="74paijr">
                                お問い合わせ
                            </h2>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-bold leading-relaxed" data-oid="zm9jvpt">
                                「ノレタ」をご覧いただきありがとうございます。<br />
                                お客様にぴったりのプランをご提案します。
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" data-oid="kp6ch1_">
                            {/* Phone Contact */}
                            <div className="relative group p-1 w-full" data-oid="phone-wrap">
                                <div className="hidden"></div>
                                <div className="relative bg-white p-10 md:p-12 rounded shadow-xl flex flex-col items-center text-center h-full" data-oid="_sis:yn">
                                    <div className="size-20 bg-teal-50 rounded-2xl flex items-center justify-center mb-8" data-oid="bvidzx7">
                                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="size-10 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4" data-oid="sda_vfv">お電話でのお問い合わせ</h3>
                                    <a href="tel:076-268-1788" className="text-4xl md:text-5xl font-bold text-teal-700 mb-8 transition-transform" data-oid="l96a_oc">
                                        076-268-1788
                                    </a>
                                    <p className="text-slate-500 font-bold leading-relaxed" data-oid="7dop659">
                                        平日 9:00 〜 18:00 / 土曜 9:00 〜 17:00<br />
                                        <span className="text-sm opacity-75">定休日: 日曜・祝日／土曜は月により異なります</span>
                                    </p>
                                </div>
                            </div>

                            {/* Email/Form Contact */}
                            <div className="relative group p-1 w-full" data-oid="email-wrap">
                                <div className="hidden"></div>
                                <div className="relative bg-white p-10 md:p-12 rounded shadow-xl flex flex-col items-center text-center h-full" data-oid="_4c975e">
                                    <div className="size-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8" data-oid="g8-z-w-">
                                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="size-10 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-10" data-oid="wt-29wd">メールでのお問い合わせ</h3>
                                    <Link href="/#contact" className="group relative w-full inline-flex items-center justify-center px-10 py-6 bg-slate-900 text-white rounded-2xl font-bold text-xl shadow-2xl hover:bg-slate-800 transition-ui duration-200 overflow-hidden mb-8" data-oid="0yewdpl">
                                        <span className="relative z-10 flex items-center">
                                            フォームに移動
                                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="size-6 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </Link>
                                    <p className="text-slate-500 font-bold" data-oid="o8ffu9e">
                                        24時間受付中。順次対応させていただきます。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-14 mt-20" data-oid="dc3dad9">
                <div className="container mx-auto px-4" data-oid="9vfs393">
                    <div className="flex flex-col md:flex-row justify-between" data-oid="7e9u957">
                        <div className="mb-8 md:mb-0" data-oid="t.00_gu">
                            <div className="flex items-center mb-4" data-oid="8oy3-zf">
                                <div
                                    className="size-11 bg-teal-700 rounded flex items-center justify-center mr-3"
                                    data-oid="8p9ado."
                                >
                                    <span
                                        className="text-white font-bold text-sm"
                                        data-oid="gialhj-"
                                    >
                                        港南
                                    </span>
                                </div>
                                <div data-oid="jur2_2h">
                                    <h3 className="text-lg font-bold" data-oid=".:1enyw">
                                        株式会社港南自動車サービス
                                    </h3>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm" data-oid="deecrz4">
                                〒920-0336
                                <br data-oid="z..qx2:" />
                                石川県金沢市金石本町ハ14
                                <br data-oid="o7v-d6g" />
                                TEL:{' '}
                                <a
                                    href="tel:076-268-1788"
                                    className="hover:text-teal-300 transition-colors"
                                    data-oid="kebaq19"
                                >
                                    076-268-1788
                                </a>
                                <br data-oid="k416jag" />
                                FAX: 076-268-3163
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8" data-oid="txvkr8t">
                            <div data-oid="u4-b:a.">
                                <h4
                                    className="text-lg font-bold mb-4 text-teal-300"
                                    data-oid="yi75k6."
                                >
                                    サービス
                                </h4>
                                <ul className="space-y-2 text-gray-300" data-oid="d5o5yl3">
                                    <li data-oid="3705fgy">
                                        <Link
                                            href="/#services"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="fu702e5"
                                        >
                                            車検・点検
                                        </Link>
                                    </li>
                                    <li data-oid="b_y1dj.">
                                        <Link
                                            href="/"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="1ff4fj2"
                                        >
                                            ノレタ
                                        </Link>
                                    </li>
                                    <li data-oid="m65ex74">
                                        <Link
                                            href="/#services"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="-qi2ptm"
                                        >
                                            新車・中古車販売
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div data-oid=".mdonh.">
                                <h4
                                    className="text-lg font-bold mb-4 text-teal-300"
                                    data-oid="4pk-6q2"
                                >
                                    会社情報
                                </h4>
                                <ul className="space-y-2 text-gray-300" data-oid="is75czj">
                                    <li data-oid="kv6o7gi">
                                        <Link
                                            href="/#company"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid=":bj83_r"
                                        >
                                            会社概要
                                        </Link>
                                    </li>
                                    <li data-oid="w4dr:r.">
                                        <Link
                                            href="/#contact"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="3z.l_jt"
                                        >
                                            お問い合わせ
                                        </Link>
                                    </li>
                                    <li data-oid="ww8v2:3">
                                        <a
                                            href="/privacy"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="8p99fsu"
                                        >
                                            プライバシーポリシー
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div
                        className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-sm"
                        data-oid="7vpp84k"
                    >
                        &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights
                        Reserved.
                    </div>
                </div>
            </footer>

            {/* Floating Contact Button */}
            {/* お問い合わせへの固定ボタン（ホバーしなくてもラベルが読める） */}
            <div className="hidden md:block fixed bottom-6 right-6 z-30">
                <Link
                    href="/#contact"
                    className="group flex h-12 items-center gap-3 rounded bg-teal-700 px-5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-teal-600"
                >
                    <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                    </svg>
                    お問い合わせ
                </Link>
            </div>

            {/* スマホ用の電話・LINE固定バー */}
            <MobileActionBar />
        </div >
    );
}
