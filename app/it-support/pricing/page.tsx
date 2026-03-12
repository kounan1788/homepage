'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PricingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setScrolled(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 pb-20">
            {/* Header (Simplified & Consistent) */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-slate-900/90 backdrop-blur-sm py-4'}`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/it-support" className="flex items-center group">
                        <div className={`relative transition-all duration-500 h-8 md:h-10`}>
                            <Image
                                src="/logo.png"
                                alt="港南自動車サービス株式会社｜IT・Webサポート"
                                width={240}
                                height={60}
                                className={`h-full w-auto object-contain transition-all duration-500 ${!scrolled && 'brightness-0 invert'}`}
                                priority
                            />
                        </div>
                    </Link>

                    <nav
                        className={`hidden lg:flex items-center space-x-8 transition-colors duration-500 ${scrolled ? 'text-slate-700' : 'text-white'}`}
                    >
                        <Link
                            href="/it-support"
                            className="font-bold hover:text-teal-400 transition-colors"
                        >
                            ITサポート トップ
                        </Link>
                        <a
                            href="#monthly"
                            className="font-bold hover:text-teal-400 transition-colors"
                        >
                            月額スタッフ支援
                        </a>
                        <a
                            href="#courses"
                            className="font-bold hover:text-teal-400 transition-colors"
                        >
                            AI講座
                        </a>
                        <a
                            href="#website"
                            className="font-bold hover:text-teal-400 transition-colors"
                        >
                            ホームページ制作
                        </a>
                        <a
                            href="/it-support#contact"
                            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg hover:-translate-y-0.5 ${scrolled ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-teal-500 text-white hover:bg-teal-400'}`}
                        >
                            無料相談
                        </a>
                    </nav>

                    <button
                        className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${scrolled ? 'bg-teal-600 text-white' : 'bg-white/20 text-white backdrop-blur-sm'}`}
                        onClick={toggleMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[60] lg:hidden transition-all duration-500 flex flex-col items-center justify-center space-y-8 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                <Link
                    href="/it-support"
                    className="text-2xl font-bold text-white hover:text-teal-400"
                    onClick={() => setMenuOpen(false)}
                >
                    ITサポー トトップ
                </Link>
                <a
                    href="#monthly"
                    className="text-2xl font-bold text-white hover:text-teal-400"
                    onClick={() => setMenuOpen(false)}
                >
                    月額スタッフ支援プラン
                </a>
                <a
                    href="#courses"
                    className="text-2xl font-bold text-white hover:text-teal-400"
                    onClick={() => setMenuOpen(false)}
                >
                    AI講座料金
                </a>
                <a
                    href="#website"
                    className="text-2xl font-bold text-white hover:text-teal-400"
                    onClick={() => setMenuOpen(false)}
                >
                    ホームページ制作料金
                </a>
                <Link
                    href="/it-support#contact"
                    className="px-10 py-4 bg-teal-500 text-white rounded-full font-bold text-xl shadow-2xl mt-4"
                    onClick={() => setMenuOpen(false)}
                >
                    無料相談を開く
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0 opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-slate-900 to-blue-900/80 z-10"></div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="opacity-100">
                        <span className="text-teal-400 font-bold tracking-widest text-sm mb-4 block">
                            PRICING PLANS
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-md">
                            料金のご案内
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
                            お客様の課題や規模に合わせて最適なサポートをお選びいただける、明瞭でわかりやすい料金体系をご用意しています。
                        </p>
                    </div>
                </div>
            </section>

            {/* 1. 月額IT支援サポート（松竹梅） */}
            <section id="monthly" className="py-24 relative overflow-hidden bg-slate-50">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="opacity-100">
                        <div className="text-center mb-16">
                            <span className="text-teal-600 font-bold tracking-widest text-sm mb-2 block">
                                MONTHLY SUPPORT
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">
                                会社のスタッフ様向け「月額IT支援サポート」
                            </h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                                企業様が毎月定額でITの相談やサポートを受けられるプランです。
                                <br className="hidden md:block" />
                                上位プランになるほどサポート範囲が広がり、より深い業務改善をお手伝いします。
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                            {/* 梅プラン */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-md border border-slate-200 relative flex flex-col">
                                <div className="mb-6 border-b border-slate-100 pb-6">
                                    <div className="text-slate-500 font-bold mb-1">
                                        ライト / IT駆け込み寺
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-800 mb-4">
                                        梅プラン
                                    </h3>
                                    <div className="flex items-baseline text-slate-800">
                                        <span className="text-4xl font-black">
                                            ¥30,000<span className="text-xl">〜</span>
                                        </span>
                                        <span className="text-slate-500 ml-2 font-medium">
                                            / 月
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-2">
                                        ※料金は税別目安です
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    <li className="flex text-slate-600">
                                        <svg
                                            className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <div>
                                            <span className="font-bold text-slate-700 block">
                                                月10件程度までのIT相談
                                            </span>
                                            <span className="text-sm">
                                                チャット（LINE/Slack等）またはメール
                                            </span>
                                        </div>
                                    </li>
                                    <li className="flex text-slate-600">
                                        <svg
                                            className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-sm">
                                            日常的なトラブルシューティング
                                            <br />
                                            （「パソコンの調子が悪い」「ソフトの使い方がわからない」など）
                                        </span>
                                    </li>
                                </ul>
                                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border border-slate-100 mt-auto">
                                    <strong className="text-slate-800">おすすめ:</strong>{' '}
                                    とりあえず気軽に質問できる環境が欲しい企業様向け。
                                </div>
                            </div>

                            {/* 竹プラン (Recommended) */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-2xl border-2 border-teal-500 relative flex flex-col z-10">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-emerald-400 text-white font-black text-sm px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
                                    一番おすすめ！
                                </div>
                                <div className="mb-6 border-b border-slate-100 pb-6">
                                    <div className="text-teal-600 font-bold mb-1">スタンダード</div>
                                    <h3 className="text-3xl font-black text-slate-800 mb-4">
                                        竹プラン
                                    </h3>
                                    <div className="flex items-baseline text-slate-800">
                                        <span className="text-5xl font-black">
                                            ¥80,000<span className="text-xl">〜</span>
                                        </span>
                                        <span className="text-slate-500 ml-2 font-medium">
                                            / 月
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-2">
                                        ※料金は税別目安です
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    <li className="flex text-slate-800 font-medium">
                                        <svg
                                            className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <div>
                                            <span className="font-bold text-teal-700 block">
                                                IT相談が無制限
                                            </span>
                                            <span className="text-sm text-slate-600">
                                                チャット・メールにて回数を気にせず相談可能
                                            </span>
                                        </div>
                                    </li>
                                    <li className="flex text-slate-800 font-medium">
                                        <svg
                                            className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <div>
                                            <span className="font-bold block">
                                                月1回（1〜2時間）の定期ミーティング
                                            </span>
                                            <span className="text-sm text-slate-600">
                                                オンラインor訪問でのIT活用ミニレクチャーや導入ツールの相談など
                                            </span>
                                        </div>
                                    </li>
                                    <li className="flex text-slate-600 opacity-60">
                                        <svg
                                            className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-sm line-through">
                                            業務自動化ツールの構築支援
                                        </span>
                                    </li>
                                </ul>
                                <div className="bg-teal-50 p-4 rounded-xl text-sm text-slate-700 border border-teal-100 mt-auto">
                                    <strong className="text-teal-800">おすすめ:</strong>{' '}
                                    無制限の質問と定例ミーティングで、確実なIT化推進の基盤を作りたい企業様へ。圧倒的に割安なメインプラン。
                                </div>
                            </div>

                            {/* 松プラン */}
                            <div className="bg-slate-800 rounded-[2rem] p-8 shadow-xl border border-slate-700 relative flex flex-col text-white">
                                <div className="mb-6 border-b border-slate-700 pb-6">
                                    <div className="text-slate-400 font-bold mb-1">
                                        プレミアム / まるごとIT顧問
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4">
                                        松プラン
                                    </h3>
                                    <div className="flex items-baseline text-white">
                                        <span className="text-4xl font-black">
                                            ¥150,000<span className="text-xl">〜</span>
                                        </span>
                                        <span className="text-slate-400 ml-2 font-medium">
                                            / 月
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-2">
                                        ※料金は税別目安です
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    <li className="flex text-slate-300">
                                        <svg
                                            className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-sm">
                                            竹プランの全内容（常時相談無制限等）
                                        </span>
                                    </li>
                                    <li className="flex text-slate-300">
                                        <svg
                                            className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <div>
                                            <span className="font-bold text-white block">
                                                月2〜3回の深い現場支援（訪問/オンライン）
                                            </span>
                                            <span className="text-sm">
                                                現場スタッフ様への直接指導など
                                            </span>
                                        </div>
                                    </li>
                                    <li className="flex text-slate-300">
                                        <svg
                                            className="w-5 h-5 text-teal-400 mr-3 flex-shrink-0 mt-0.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <div>
                                            <span className="font-bold text-white block">
                                                業務効率化ツールのシステム実装サポート
                                            </span>
                                            <span className="text-sm">
                                                ノーコードでの自動化構築など、開発工程までコミット
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                                <div className="bg-slate-900/50 p-4 rounded-xl text-sm text-slate-300 mt-auto">
                                    <strong className="text-teal-400">おすすめ:</strong>{' '}
                                    ITコンサルタントや専属SEを雇うより圧倒的にお得。システムの現場定着まで伴走してほしい企業様へ。
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. AI講座プラン (マンツーマン vs グループ) */}
            <section id="courses" className="py-24 relative overflow-hidden bg-white">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="opacity-100">
                        <div className="text-center mb-16">
                            <span className="text-teal-600 font-bold tracking-widest text-sm mb-2 block">
                                COURSES
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">
                                対面特化型 AI講座 料金
                            </h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                                難易度に応じたベース料金に対し、グループ受講（複数名）の場合は1名追加ごとの料金を大幅に割り引く仕組みです。
                                <br />
                                <span className="font-bold text-teal-600">
                                    上位講座になるほどグループ受講での1人あたりの単価がお得になります。
                                </span>
                            </p>
                        </div>

                        {/* レベルごとの料金表 */}
                        <div className="max-w-5xl mx-auto">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                                    <thead>
                                        <tr className="bg-slate-100 border-b border-slate-200">
                                            <th className="p-4 md:p-6 font-bold text-slate-700 w-1/4">
                                                講座レベル
                                            </th>
                                            <th className="p-4 md:p-6 font-bold text-slate-700 bg-teal-50/50 w-1/4 text-center">
                                                マンツーマン
                                                <br />
                                                <span className="text-xs font-normal">
                                                    （基本料金/1名様）
                                                </span>
                                            </th>
                                            <th className="p-4 md:p-6 font-bold text-slate-700 w-1/4 text-center">
                                                追加人数料金
                                                <br />
                                                <span className="text-xs font-normal">
                                                    （1名追加ごと）
                                                </span>
                                            </th>
                                            <th className="p-4 md:p-6 font-bold text-slate-800 bg-orange-50/50 w-1/4 text-center border-l border-orange-100">
                                                例：3名グループ受講時の
                                                <br />
                                                お得額目安
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {/* 初級 */}
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 md:p-6">
                                                <div className="font-bold text-lg text-slate-800 block">
                                                    初級講座
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    基礎知識・ツール登録など
                                                </div>
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-xl font-bold bg-teal-50/20">
                                                10,000
                                                <span className="text-sm font-normal">円</span>
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-lg text-teal-600 font-bold">
                                                +5,000
                                                <span className="text-sm font-normal">円</span>
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-sm font-bold bg-orange-50/30 border-l border-orange-100">
                                                <div className="text-slate-600">
                                                    1人あたり約 6,700円
                                                </div>
                                                <div className="text-orange-600 mt-1">
                                                    （1名あたり 約3,300円お得！）
                                                </div>
                                            </td>
                                        </tr>
                                        {/* 中級 */}
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 md:p-6">
                                                <div className="font-bold text-lg text-slate-800 block">
                                                    中級講座
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    実務活用・プロンプト技術
                                                </div>
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-xl font-bold bg-teal-50/20">
                                                20,000
                                                <span className="text-sm font-normal">円</span>
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-lg text-teal-600 font-bold">
                                                +10,000
                                                <span className="text-sm font-normal">円</span>
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-sm font-bold bg-orange-50/30 border-l border-orange-100">
                                                <div className="text-slate-600">
                                                    1人あたり約 13,300円
                                                </div>
                                                <div className="text-orange-600 mt-1">
                                                    （1名あたり 約6,700円お得！）
                                                </div>
                                            </td>
                                        </tr>
                                        {/* 発展 */}
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 md:p-6">
                                                <div className="font-bold text-lg text-slate-800 block">
                                                    発展講座
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    AIを活用したWeb・システム構築
                                                </div>
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-xl font-bold bg-teal-50/20">
                                                20,000
                                                <span className="text-sm font-normal">円</span>
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-lg text-teal-600 font-bold">
                                                +10,000
                                                <span className="text-sm font-normal">円</span>
                                            </td>
                                            <td className="p-4 md:p-6 text-center text-sm font-bold bg-orange-50/30 border-l border-orange-100">
                                                <div className="text-slate-600">
                                                    1人あたり約 13,300円
                                                </div>
                                                <div className="text-orange-600 mt-1">
                                                    （1名あたり 約6,700円お得！）
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-right mt-4 text-xs text-slate-500">
                                ※表示価格はすべて税別目安です。※講座内容は事前ヒアリングによりカスタマイズ可能です。
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. ホームページ制作プラン */}
            <section id="website" className="py-24 relative overflow-hidden bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="opacity-100">
                        <div className="text-center mb-16">
                            <span className="text-teal-600 font-bold tracking-widest text-sm mb-2 block">
                                WEBSITE CREATION
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">
                                ホームページ制作 料金
                            </h2>
                            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                                テンプレートからオリジナルデザインまで、用途に合わせたWebサイトを制作いたします。
                            </p>
                        </div>

                        {/* 制作プランカード */}
                        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch mb-16">
                            {/* テンプレートプラン */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-md border border-slate-200 flex flex-col relative overflow-hidden text-center">
                                <div className="mb-6 border-b border-slate-100 pb-6 flex-grow">
                                    <h3 className="text-2xl font-black text-slate-800 mb-4">
                                        テンプレートから作成
                                    </h3>
                                    <div className="flex items-baseline justify-center text-slate-800">
                                        <span className="text-5xl font-black">¥50,000</span>
                                    </div>
                                    <p className="text-slate-500 mt-4 text-sm leading-relaxed">
                                        ご用意したデザインテンプレートをベースに、スピーディかつ低コストで構築します。
                                    </p>
                                </div>
                            </div>

                            {/* オリジナルプラン */}
                            <div className="bg-slate-800 rounded-[2rem] p-8 shadow-xl border border-slate-700 flex flex-col relative overflow-hidden text-white text-center">
                                <div className="mb-6 border-b border-slate-700 pb-6 flex-grow">
                                    <h3 className="text-2xl font-black text-white mb-4">
                                        オリジナル
                                    </h3>
                                    <div className="flex items-baseline justify-center text-white">
                                        <span className="text-5xl font-black">¥80,000<span className="text-xl">〜</span></span>
                                    </div>
                                    <p className="text-slate-300 mt-4 text-sm leading-relaxed">
                                        貴社の独自性やブランドカラーを反映したオリジナルデザインを作成します。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 料金に含まれる内容＆オプション */}
                        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                            {/* 基本パッケージ */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 height-full">
                                <h4 className="text-xl font-bold text-slate-800 mb-6 border-b-2 border-teal-500 pb-2 inline-block">
                                    ＜料金に含まれている内容＞
                                </h4>
                                <ul className="space-y-4">
                                    {[
                                        '4ページ構成（TOP ＋ お問合せ）＋ 2ページ',
                                        'スマホ対応',
                                        'お問い合わせフォーム',
                                        '内外SEO対策',
                                        '修正回数5回まで無料（それ以降1回2,000円）'
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex text-slate-600 items-start">
                                            <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm font-medium leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 追加オプション */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 height-full">
                                <h4 className="text-xl font-bold text-slate-800 mb-6 border-b-2 border-teal-500 pb-2 inline-block">
                                    ＜追加オプション＞
                                </h4>
                                <ul className="space-y-4 pt-2">
                                    <li className="flex justify-between items-center border-b border-slate-100 pb-4">
                                        <span className="font-medium text-slate-700 text-sm">ページ追加 一枚</span>
                                        <span className="font-bold text-teal-600">10,000円</span>
                                    </li>
                                    <li className="flex justify-between items-center border-b border-slate-100 py-2 pb-4">
                                        <span className="font-medium text-slate-700 text-sm">予約システム設置</span>
                                        <span className="font-bold text-teal-600">40,000円</span>
                                    </li>
                                    <li className="flex justify-between items-center py-2">
                                        <span className="font-medium text-slate-700 text-sm">決算機能追加</span>
                                        <span className="font-bold text-teal-600">30,000円</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 保守プラン */}
                        <div className="max-w-5xl mx-auto mt-20">
                            <div className="text-center mb-10">
                                <span className="inline-block py-1 px-3 rounded-full bg-teal-100 text-teal-800 text-sm font-bold tracking-widest mb-3">
                                    MAINTENANCE
                                </span>
                                <h4 className="text-3xl font-black text-slate-800">
                                    保守プラン
                                </h4>
                                <p className="text-slate-500 mt-4">ウェブサイト公開後の運用・管理もサポートいたします。</p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                                {/* 自分でやっちゃうプラン */}
                                <div className="bg-white border text-center border-slate-200 rounded-[2rem] p-8 md:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm flex flex-col relative group">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-200 transition-colors">
                                        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h5 className="text-2xl font-black text-slate-800 mb-2">
                                        自分でやっちゃうプラン
                                    </h5>
                                    <div className="flex items-baseline justify-center text-slate-800 mb-6">
                                        <span className="text-4xl font-black">¥0</span>
                                        <span className="text-sm font-medium ml-1 text-slate-500">/月</span>
                                    </div>
                                    <p className="text-base text-slate-600 leading-relaxed flex-grow border-t border-slate-100 pt-6">
                                        お客さまご自身で管理が出来るプランです。<br/>サイトの更新や保守を自社で行いたい場合におすすめです。
                                    </p>
                                </div>
                                
                                {/* 港南おまかせプラン */}
                                <div className="bg-gradient-to-br from-teal-50 to-white text-center border-2 border-teal-500 rounded-[2rem] p-8 md:p-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-md relative flex flex-col z-10">
                                    {/* 装飾 */}
                                    <div className="absolute inset-0 rounded-[2rem] overflow-hidden -z-10 pointer-events-none">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-bl-[100px] opacity-10"></div>
                                    </div>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white font-black text-sm px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
                                        安心・手間いらず！
                                    </div>

                                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 mt-2">
                                        <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h5 className="text-2xl font-black text-teal-900 mb-2">
                                        港南おまかせプラン
                                    </h5>
                                    <div className="flex flex-col items-center justify-center mb-6">
                                        <div className="text-teal-700 font-bold flex items-baseline">
                                            <span className="text-4xl font-black">¥20,000<span className="text-2xl font-bold">〜</span></span>
                                            <span className="text-sm font-medium ml-1">/月</span>
                                        </div>
                                        <span className="text-xs text-teal-600 mt-2 font-medium bg-teal-100/50 py-1 px-3 rounded-full">
                                            ※任せたい内容によるため要相談
                                        </span>
                                    </div>
                                    
                                    <p className="text-base text-slate-700 leading-relaxed mb-6 flex-grow font-medium border-t border-teal-200/50 pt-6">
                                        港南自動車が月額料金を頂いてお客様のサイトを<br className="hidden lg:block"/>まるごと管理するプランです。<br/>
                                        <span className="inline-block mt-2 bg-teal-100 text-teal-800 text-sm font-bold px-3 py-1 rounded">
                                            ドメイン代・サーバー代 込み！
                                        </span>
                                    </p>

                                    {/* 注意書き */}
                                    <div className="bg-white/90 p-5 rounded-2xl text-sm border border-orange-200 text-left shadow-sm relative">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 rounded-l-2xl"></div>
                                        <div className="text-orange-800 leading-relaxed flex items-start font-bold">
                                            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span>ただ途中からプランを変更した場合は、ドメイン代とサーバー代はお客様負担になります。</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. シナジー・優待 (Synergy) */}
            <section
                id="synergy"
                className="py-20 relative overflow-hidden bg-slate-900 border-t-8 border-teal-500"
            >
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('/images/mechanic.jpg')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="opacity-100">
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                                <svg
                                    className="w-8 h-8 text-white relative z-10"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                    />
                                </svg>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white mb-3">
                                    【特別優待】セットでのご利用がお得です
                                </h3>
                                <p className="text-slate-300 mb-4 leading-relaxed">
                                    中級講座以上のグループ受講をしていただいた企業様は、
                                    <br className="hidden md:block" />
                                    <span className="text-yellow-400 font-bold border-b border-yellow-400">
                                        月額IT支援プラン（竹・松）の初月料金を無料
                                    </span>
                                    とさせていただきます。
                                    <br />
                                    講座で学んだ知識を、そのまま実際の自社業務への立ち上げまでスムーズに繋げることが可能です。
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 text-center relative z-10">
                            <a
                                href="/it-support#contact"
                                className="inline-flex items-center justify-center px-10 py-5 bg-teal-600 text-white rounded-2xl font-black text-xl shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:shadow-[0_0_60px_rgba(20,184,166,0.5)] hover:bg-teal-500 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto group"
                            >
                                料金・プランについて無料相談する
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 ml-2 transform group-hover:translate-x-2 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </a>
                            <p className="mt-6 text-sm text-slate-400">
                                貴社の状況に合わせた最適なプランをカスタマイズしてご提案いたします
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center mb-6">
                        <Link href="/">
                            <Image src="/logo.png" alt="港南自動車サービス" width={180} height={45} className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                    <div className="text-slate-500 text-sm mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
                        <span>〒920-0336 石川県金沢市金石本町ハ14番地</span>
                        <span className="hidden md:inline">|</span>
                        <span>TEL: 076-268-1788</span>
                        <span className="hidden md:inline">|</span>
                        <span>定休日: 第2土曜・日祝・GW・お盆・年末年始</span>
                    </div>
                    <div className="text-slate-600 text-xs">
                        &copy; {new Date().getFullYear()} KOUNAN AUTO SERVICE INC.
                    </div>
                </div>
            </footer>
        </div>
    );
}
