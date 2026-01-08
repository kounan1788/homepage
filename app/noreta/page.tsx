'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type CarCategory = 'SUV' | 'MINIVAN' | 'KCAR';

interface Car {
    name: string;
    price: string;
    image: string;
    route?: string;
}

export default function Page() {
    const [activeCategory, setActiveCategory] = useState<CarCategory>('SUV');
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
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
                price: '30,000円～',
                image: '/cars/jimnysierra.jpg',
                route: '/suv/jimnysierra',
            },
            {
                name: 'ヤリスクロス',
                price: '42,000円～',
                image: '/cars/yariscross.jpg',
                route: '/suv/yariscross',
            },
            { name: 'VEZEL', price: '49,000円～', image: '/cars/vezel.jpg', route: '/suv/vezel' },
            {
                name: 'カローラクロス',
                price: '49,000円～',
                image: '/cars/corollacross.jpg',
                route: '/suv/corollacross',
            },
            {
                name: 'ハリアー',
                price: '56,000円～',
                image: '/cars/harrier.jpg',
                route: '/suv/harrier',
            },
            { name: 'RAV4', price: '49,000円～', image: '/cars/rav4.jpg', route: '/suv/rav4' },
            {
                name: 'ランクル 250',
                price: '55,000円～',
                image: '/cars/landcruiser.jpg',
                route: '/suv/landcruiser',
            },
            { name: 'クラウン', price: '80,500円～', image: '/cars/crown.jpg', route: '/suv/crown' },
            { name: 'NX', price: '80,000円～', image: '/cars/nx.jpg', route: '/suv/nx' },
        ],

        MINIVAN: [
            { name: 'ノア', price: '58,000円～', image: '/cars/noah.jpg', route: '/minivan/noah' },
            { name: 'ヴォクシー', price: '58,000円～', image: '/cars/voxy.jpg', route: '/minivan/voxy' },
            {
                name: 'アルファード',
                price: '72,800円～',
                image: '/cars/alphard.jpg',
                route: '/minivan/alphard',
            },
        ],

        KCAR: [
            { name: 'NBOX カスタム', price: '24,000円～', image: '/cars/nbox.jpg', route: '/kcar/nbox' },
            {
                name: 'タントカスタム',
                price: '22,000円～',
                image: '/cars/tanto.jpg',
                route: '/kcar/tanto',
            },
            {
                name: 'タントファンクロス',
                price: '22,000円～',
                image: '/cars/tantofun.jpg',
                route: '/kcar/tantofun',
            },
            {
                name: 'デリカミニ',
                price: '25,000円～',
                image: '/cars/delicamini.jpg',
                route: '/kcar/delicamini',
            },
            {
                name: 'スペーシアカスタム',
                price: '22,000円～',
                image: '/cars/spacia.jpg',
                route: '/kcar/spacia',
            },
            {
                name: 'スペーシアギア',
                price: '22,000円～',
                image: '/cars/spaciagear.jpg',
                route: '/kcar/spaciagear',
            },
            {
                name: 'ハスラー',
                price: '22,000円～',
                image: '/cars/hustler.jpg',
                route: '/kcar/hustler',
            },
            { name: 'ジムニー', price: '22,000円～', image: '/cars/jimny.jpg', route: '/kcar/jimny' },
        ],
    };

    // 各カテゴリの車種を価格順（安い順）にソート
    const carData: Record<CarCategory, Car[]> = {
        SUV: sortByPrice(rawCarData.SUV),
        MINIVAN: sortByPrice(rawCarData.MINIVAN),
        KCAR: sortByPrice(rawCarData.KCAR),
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-teal-100" data-oid="dn0w-eo">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-lg py-2'
                    : 'bg-transparent py-5'
                    }`}
                data-oid="fqghwyr"
            >
                <div
                    className="container mx-auto px-6 flex justify-between items-center"
                    data-oid="ogzl6xz"
                >
                    <Link href="/" className="flex items-center group" data-oid="0eh.y8p">
                        <div className={`relative transition-all duration-500 ${isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}>
                            <Image
                                src="/logo.png"
                                alt="港南自動車サービス株式会社"
                                width={280}
                                height={70}
                                className={`h-full w-auto object-contain transition-all duration-500 ${!isScrolled && 'brightness-0 invert'}`}
                                priority
                            />
                        </div>
                    </Link>
                    <div className="hidden lg:flex items-center space-x-8" data-oid="jdpcl.f">
                        <nav className={`flex items-center space-x-8 transition-colors duration-500 ${isScrolled ? 'text-slate-700' : 'text-white'}`} data-oid="_c2.5k6">
                            {[
                                { name: 'サービス内容', href: '/#services' },
                                { name: '取扱車種', href: '/#cases' },
                                { name: '会社情報', href: '/#company' },
                                { name: 'お問い合わせ', href: '/#contact' }
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="relative font-medium hover:text-teal-500 transition-colors group overflow-hidden"
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300"></span>
                                </Link>
                            ))}
                        </nav>
                        <Link
                            href="/noreta"
                            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5 ${isScrolled
                                ? 'bg-teal-600 text-white hover:bg-teal-700'
                                : 'bg-white text-teal-700 hover:bg-slate-100'
                                }`}
                            data-oid="r7m-jfd"
                        >
                            ノレタ詳細
                        </Link>
                    </div>
                    <button
                        className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${isScrolled ? 'bg-teal-600 text-white' : 'bg-white/20 text-white backdrop-blur-sm'
                            }`}
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        data-oid="av_bd._"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
                        >
                            {menuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                <div
                    className={`fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[60] lg:hidden transition-all duration-500 flex flex-col items-center justify-center space-y-8 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                    {[
                        { name: 'サービス内容', href: '/#services' },
                        { name: '取扱車種', href: '/#cases' },
                        { name: '会社情報', href: '/#company' },
                        { name: 'お問い合わせ', href: '/#contact' }
                    ].map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="text-2xl font-bold text-white hover:text-teal-400 transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        href="/noreta"
                        className="px-10 py-4 bg-teal-500 text-white rounded-full font-bold text-xl shadow-2xl"
                        onClick={() => setMenuOpen(false)}
                    >
                        ノレタ詳細
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center" data-oid="jrqex-7">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/noreta-hero.jpg"
                        alt="ノレタ - 新しい車の乗り方"
                        fill
                        className="object-cover animate-slow-zoom"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-white z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20 text-center">
                    <div className="inline-flex items-center space-x-2 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 px-4 py-2 rounded-full text-teal-300 text-sm font-bold mb-8 tracking-widest uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        <span>創業60年以上の実績</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                        <span className="block text-3xl md:text-5xl mb-2 font-bold opacity-90">港南自動車サービスが提供する</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
                            ノレタ
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                        新車に乗るなら、もっと気軽に。もっとお得に。<br />
                        月々定額、頭金・ボーナス払いなしで憧れの一台を。
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {['頭金なし', 'ボーナス払いなし', '3年契約'].map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl flex items-center shadow-xl"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-lg font-bold text-white tracking-wider">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a
                            href="#lineup"
                            className="group relative px-10 py-5 bg-teal-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-teal-500 transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center">
                                ラインナップを見る
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </a>
                    </div>
                </div>


            </section>



            {/* Main Content */}
            <main id="lineup" className="relative bg-white pt-24 pb-32" data-oid="vgxn62n">
                {/* Vehicle Lineup Section */}
                <div className="container mx-auto px-6" data-oid="4ni0p50">
                    <div className="text-center mb-20" data-oid="e3-q:y4">
                        <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-sm font-black tracking-widest uppercase mb-4" data-oid=":pu:qf-">
                            Vehicle Lineup
                        </div>
                        <h2
                            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
                            data-oid="sy5_s6q"
                        >
                            ラインナップ
                        </h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium" data-oid="t9gm.vc">
                            お客様のニーズに合わせた多彩な車種を取り揃えております。<br />
                            月々の定額設定で、憧れの新車をより身近に。
                        </p>
                    </div>

                    {/* Category Selector */}
                    <div className="flex justify-center mb-16" data-oid="gp09t-h">
                        <div
                            className="inline-flex p-1.5 bg-slate-100 rounded-2xl shadow-inner"
                            data-oid="v36fooq"
                        >
                            {(['SUV', 'MINIVAN', 'KCAR'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    className={`px-10 py-4 rounded-xl text-lg font-black transition-all duration-300 ${activeCategory === cat
                                        ? 'bg-white text-teal-600 shadow-md scale-105'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    onClick={() => setActiveCategory(cat)}
                                    aria-label={`${cat}カテゴリを表示`}
                                    data-oid="0y2xs:-"
                                >
                                    {cat === 'KCAR' ? '軽自動車' : cat === 'MINIVAN' ? 'ミニバン' : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Car Grid */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        data-oid="wnbbmkp"
                    >
                        {carData[activeCategory].map((car, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col h-full"
                                data-oid="50p0a1e"
                            >
                                <Link href={car.route || '#'} className="flex flex-col h-full" data-oid="rsq6_45">
                                    <div
                                        className="relative w-full pt-[75%] overflow-hidden"
                                        data-oid="jj074yg"
                                    >
                                        <Image
                                            src={car.image}
                                            alt={car.name}
                                            fill
                                            className="object-cover absolute top-0 left-0 group-hover:scale-110 transition-transform duration-700 ease-out"
                                            data-oid=":-l:y6e"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>

                                    </div>

                                    <div className="p-10 flex flex-col flex-grow" data-oid="85w1c.a">
                                        <div className="flex items-baseline justify-between mb-4 gap-4" data-oid="price-header-wrap">
                                            <h4 className="text-2xl font-black text-slate-800 tracking-tight" data-oid="aqc_wkg">
                                                {car.name}
                                            </h4>
                                            <div
                                                className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-xl text-lg font-black whitespace-nowrap"
                                                data-oid="hsfw-i4"
                                            >
                                                <span className="text-xs font-bold mr-1 opacity-70">月々</span>
                                                {car.price}
                                            </div>
                                        </div>
                                        <div
                                            className="flex flex-wrap gap-2 mb-8"
                                            data-oid="1zq11i7"
                                        >
                                            {['頭金なし', 'ボーナスなし', '3年契約'].map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-teal-100"
                                                    data-oid="zqj0wrh"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-auto border-t border-slate-50 pt-6 flex items-center justify-between" data-oid="hwnmccz">
                                            <span
                                                className="text-teal-600 text-sm font-black flex items-center group-hover:text-teal-500 transition-colors"
                                                data-oid="cq:nz8_"
                                            >
                                                詳細を見る
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    data-oid="settcez"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                        data-oid="kftmwmq"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Why Noreta Section (安さの秘密) */}
                <section className="py-32 bg-slate-50 relative overflow-hidden" data-oid="709fdsg">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent z-10" data-oid="grad-top"></div>

                    <div className="container mx-auto px-6 relative z-10" data-oid="46o57.p">
                        <div className="text-center mb-24" data-oid="secret-header">
                            <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-sm font-black tracking-widest uppercase mb-4" data-oid=":lk30bf">
                                WHY SO AFFORDABLE?
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight" data-oid="dzihdm7">
                                なんでそんなに安いの？
                            </h2>
                            <p className="text-xl text-slate-500 font-bold" data-oid="2.9o5tl">
                                港南自動車サービスが実現する、3つの理由
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto" data-oid="hxmpxux">
                            {/* Point 1 */}
                            <div className="group bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-slate-100 transition-all duration-500 hover:shadow-2xl" data-oid=".pgj:90">
                                <div className="flex flex-col md:flex-row gap-10 items-start" data-oid="pt1-layout">
                                    <div className="flex-shrink-0" data-oid="pc8y:6s">
                                        <div className="w-24 h-24 bg-teal-600 rounded-3xl flex items-center justify-center shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" data-oid="2hs-tai">
                                            <span className="text-white font-black text-4xl" data-oid="_33zlyb">01</span>
                                        </div>
                                    </div>
                                    <div className="flex-grow" data-oid="y24d2wj">
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 tracking-tight leading-tight" data-oid="krp651x">
                                            3年後のリセールだけを考慮した<br className="hidden md:block" />車両・オプション設定
                                        </h3>
                                        <div className="space-y-6" data-oid="y-g00bw">
                                            <p className="text-slate-600 text-lg font-medium leading-relaxed" data-oid="gfdh3zz">
                                                新車を賢く乗り換える鍵は「車両設定」にあります。単に人気車を選ぶだけでなく、3年後の市場価値を徹底的に分析。プロの視点で「最も価値が落ちにくい」組み合わせをご提案します。
                                            </p>
                                            <div className="bg-slate-50 rounded-3xl p-8" data-oid="7l16u3f">
                                                <p className="font-black text-teal-700 mb-6 flex items-center" data-oid="906.zsh">
                                                    <span className="w-1.5 h-6 bg-teal-600 rounded-full mr-3" data-oid="h-line"></span>
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
                                                            <svg className="h-6 w-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                            <div className="group bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-slate-100 transition-all duration-500 hover:shadow-2xl" data-oid="si6zjvw">
                                <div className="flex flex-col md:flex-row gap-10 items-start" data-oid="pt2-layout">
                                    <div className="flex-shrink-0" data-oid="wt:8y_e">
                                        <div className="w-24 h-24 bg-teal-600 rounded-3xl flex items-center justify-center shadow-lg transform rotate-6 group-hover:rotate-0 transition-transform duration-500" data-oid="lq-f-k9">
                                            <span className="text-white font-black text-4xl" data-oid="sa9bx9-">02</span>
                                        </div>
                                    </div>
                                    <div className="flex-grow" data-oid="yjv6tmj">
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 tracking-tight leading-tight" data-oid="obvqt1a">
                                            自由返済型ローンと<br className="hidden md:block" />業界トップクラスの低金利 2.5%
                                        </h3>
                                        <div className="space-y-6" data-oid="k3fl9l4">
                                            <p className="text-slate-600 text-lg font-medium leading-relaxed" data-oid="ac9ko9u">
                                                一般的な残価設定型ローンではなく、柔軟な「自由返済型」を採用。さらに、実質年率2.5%という圧倒的な低金利により、金利負担を最小限に抑えています。
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="pt:2ivh">
                                                <div className="bg-teal-50 rounded-3xl p-8 border border-teal-100" data-oid="nmhqa3g">
                                                    <p className="font-black text-teal-900 mb-4" data-oid="i8z0h70">金利 2.5% のメリット</p>
                                                    <p className="text-slate-600 font-medium text-sm leading-relaxed" data-oid="li-m1">
                                                        一般的なディーラー（3.9%〜）と比較しても、支払総額で大きな差が出ます。もちろん、メンテナンス代も含めた設定が可能です。
                                                    </p>
                                                </div>
                                                <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100" data-oid="6zbpo6s">
                                                    <p className="font-black text-emerald-900 mb-4" data-oid="mm8:goj">自由返済型の安心</p>
                                                    <p className="text-slate-600 font-medium text-sm leading-relaxed" data-oid="li-m2">
                                                        3年後に乗り続ける場合も、高金利な「再ローン」手続きは不要。2.5%のまま柔軟に期間を調整できます。
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Point 3 */}
                            <div className="group bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-slate-100 transition-all duration-500 hover:shadow-2xl" data-oid="lw9j4p0">
                                <div className="flex flex-col md:flex-row gap-10 items-start" data-oid="pt3-layout">
                                    <div className="flex-shrink-0" data-oid="yf.7i3a">
                                        <div className="w-24 h-24 bg-teal-600 rounded-3xl flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" data-oid="c_.q:fw">
                                            <span className="text-white font-black text-4xl" data-oid="x0m1zb5">03</span>
                                        </div>
                                    </div>
                                    <div className="flex-grow" data-oid="1-8t4mx">
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 tracking-tight leading-tight" data-oid=".1wi25_">
                                            地域密着60年の基盤があるから<br className="hidden md:block" />実現できる「お客様第一」の利益率
                                        </h3>
                                        <div className="space-y-6" data-oid=":cp2yeq">
                                            <p className="text-slate-600 text-lg font-medium leading-relaxed" data-oid="1-jo5:g">
                                                「ノレタ」単体での利益は決して多くありません。しかし、車検、点検、保険、販売とトータルカーライフをサポートし続ける港南自動車だからこそ、この驚きの価格設定が可能になりました。
                                            </p>
                                            <div className="bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden" data-oid="szywr8a">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600 opacity-20 blur-3xl" data-oid="blur"></div>
                                                <p className="text-white/90 font-medium leading-relaxed italic relative z-10" data-oid=":9m.:r2">
                                                    「一度きりの利益より、一生のお付き合いを。」<br />
                                                    創業60年以上の歩みが、お客様への還元という形で実を結んでいます。
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-32 relative bg-white" data-oid="._gvodc">
                    <div className="container mx-auto px-6 relative z-10" data-oid="skrri5s">
                        <div className="text-center mb-20" data-oid="contact-header">
                            <div className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-sm font-black tracking-widest uppercase mb-4" data-oid="g2e7wpr">
                                GET IN TOUCH
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight" data-oid="74paijr">
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
                                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl flex flex-col items-center text-center h-full" data-oid="_sis:yn">
                                    <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center mb-8" data-oid="bvidzx7">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-4" data-oid="sda_vfv">お電話でのお問い合わせ</h3>
                                    <a href="tel:076-268-1788" className="text-4xl md:text-5xl font-black text-teal-600 mb-8 hover:scale-105 transition-transform" data-oid="l96a_oc">
                                        076-268-1788
                                    </a>
                                    <p className="text-slate-500 font-bold leading-relaxed" data-oid="7dop659">
                                        平日 9:00 〜 18:00 / 土曜 9:00 〜 17:00<br />
                                        <span className="text-sm opacity-75">定休日: 第2・第4土曜日、日曜、祝日</span>
                                    </p>
                                </div>
                            </div>

                            {/* Email/Form Contact */}
                            <div className="relative group p-1 w-full" data-oid="email-wrap">
                                <div className="absolute -inset-1 bg-gradient-to-r from-slate-700 to-slate-900 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl flex flex-col items-center text-center h-full" data-oid="_4c975e">
                                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8" data-oid="g8-z-w-">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-10" data-oid="wt-29wd">メールでのお問い合わせ</h3>
                                    <Link href="/#contact" className="group relative w-full inline-flex items-center justify-center px-10 py-6 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-slate-800 transition-all duration-300 overflow-hidden mb-8" data-oid="0yewdpl">
                                        <span className="relative z-10 flex items-center">
                                            フォームに移動
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <footer className="bg-gray-800 text-white py-12 mt-20" data-oid="dc3dad9">
                <div className="container mx-auto px-4" data-oid="9vfs393">
                    <div className="flex flex-col md:flex-row justify-between" data-oid="7e9u957">
                        <div className="mb-8 md:mb-0" data-oid="t.00_gu">
                            <div className="flex items-center mb-4" data-oid="8oy3-zf">
                                <div
                                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3"
                                    data-oid="8p9ado."
                                >
                                    <span
                                        className="text-teal-600 font-bold text-sm"
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
                                            href="#"
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
                        className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm"
                        data-oid="7vpp84k"
                    >
                        &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights
                        Reserved.
                    </div>
                </div>
            </footer>

            {/* Floating Contact Button */}
            <div className="fixed bottom-8 right-8 z-50 group" data-oid="3jfrilz">
                <div
                    className="bg-white rounded-lg shadow-lg p-2 mb-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    data-oid="icu1r5p"
                >
                    <p className="text-xs text-center font-medium text-gray-700" data-oid="3p5v2m6">
                        お問い合わせ
                    </p>
                </div>
                <Link
                    href="/#contact"
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="お問い合わせセクションへ移動"
                    data-oid="wcbuw78"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        data-oid="x56led-"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            data-oid="u2u..a2"
                        />
                    </svg>
                </Link>
            </div>
        </div >
    );
}
