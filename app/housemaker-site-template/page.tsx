"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HouseMakerTemplate() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: '家づくりのこだわり', href: '#features' },
        { name: '人気プラン', href: '#plans' },
        { name: 'イベント', href: '#events' },
        { name: 'モデルルーム案内', href: '#model-room' },
        { name: 'アクセス', href: '#access' },
    ];

    return (
        <div className="font-sans text-slate-800 bg-white min-h-screen">
            {/* Header */}
            <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : 'bg-white/95 py-6'}`}>
                <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
                    <Link href="#" className="flex items-center space-x-2">
                        {/* Dummy Logo */}
                        <div className="w-10 h-10 bg-indigo-900 rounded-sm flex items-center justify-center text-white font-bold text-xl">
                            H
                        </div>
                        <span className="text-2xl font-bold tracking-wider text-slate-900 hidden sm:block">
                            港南工務店
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden xl:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold tracking-wide text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden xl:flex items-center space-x-4">
                        <div className="flex space-x-2 text-xs text-slate-400 mr-4 border-r border-slate-200 pr-6">
                            <span className="hover:text-indigo-600 cursor-pointer font-bold transition-colors">EN</span>
                            <span>|</span>
                            <span className="hover:text-indigo-600 cursor-pointer transition-colors">CH</span>
                        </div>
                        <button className="bg-indigo-900 text-white px-8 py-3 rounded-md text-sm font-bold hover:bg-indigo-800 transition-all shadow-lg hover:shadow-indigo-900/30">
                            来場予約・資料請求
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="xl:hidden text-slate-900" onClick={() => setMenuOpen(!menuOpen)}>
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center space-y-8">
                    <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)} className="text-white text-xl font-bold tracking-widest hover:text-indigo-400 transition-colors">
                            {link.name}
                        </a>
                    ))}
                    <button className="bg-indigo-600 text-white px-10 py-4 rounded-md font-bold mt-4 w-64 text-center">
                        来場予約・資料請求
                    </button>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative h-screen bg-slate-100 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/housemaker/1.jpg"
                        alt="House Interior"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
                </div>
                <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16 max-w-7xl mx-auto pt-20">
                    <div className="w-24 h-1 bg-indigo-500 mb-8"></div>
                    <div className="space-y-4 mb-8 text-white">
                        <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-snug tracking-tight">
                            <span className="block mb-2 text-indigo-200">The Homebuilder</span>
                            <span className="block">You Can Trust.</span>
                        </h2>
                    </div>
                    <div className="space-y-2 text-slate-300 text-lg sm:text-lg md:text-xl md:whitespace-nowrap font-medium tracking-wide border-l-4 border-indigo-500 pl-6">
                        <p>地域でつくる、安心の注文住宅</p>
                        <p>暮らしにちょうどいい家</p>
                        <p>相談からアフターまで丁寧にサポート致します</p>
                    </div>
                </div>
            </section>

            {/* Features (こだわり) */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-3 block">Attention to detail</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800">家づくりのこだわり</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "設計の自由度", img: "/images/housemaker/img_info1.jpg" },
                            { title: "耐震・構造へのこだわり", img: "/images/housemaker/img_info2.jpg" },
                            { title: "断熱・気密（快適性能）", img: "/images/housemaker/img_info3.jpg" },
                            { title: "素材選び（自然素材）", img: "/images/housemaker/img_info4.jpg" },
                            { title: "家事ラク動線", img: "/images/housemaker/img_info5.jpg" },
                            { title: "収納計画", img: "/images/housemaker/img_info6.jpg" },
                            { title: "採光・風通し", img: "/images/housemaker/img_info7.jpg" },
                            { title: "アフターサポート", img: "/images/housemaker/img_info8.jpg" },
                        ].map((item, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-slate-100">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <h4 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">ご家族のライフスタイルに合わせた最適なプランをご提案し、理想の住まいを形にします。</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Plans */}
            <section id="plans" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-3 block">Popular Plans</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800">人気プラン</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "平屋プラン", rank: 1, img: "/images/housemaker/sample1.jpg" },
                            { title: "2階建てプラン", rank: 2, img: "/images/housemaker/sample2.jpg" },
                            { title: "コンパクト住宅", rank: 3, img: "/images/housemaker/sample3.jpg" },
                            { title: "ZEH・省エネ住宅", rank: 4, img: "/images/housemaker/1.jpg" },
                            { title: "ガレージのある家", rank: 5, img: "/images/housemaker/2.jpg" },
                            { title: "リフォーム・リノベ", rank: 6, img: "/images/housemaker/3.jpg" },
                        ].map((plan, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group flex flex-col hover:shadow-xl transition-shadow relative">
                                {plan.rank <= 3 && (
                                    <div className={`absolute top-0 left-0 w-12 h-12 flex items-center justify-center text-white font-bold text-lg z-10 ${plan.rank === 1 ? 'bg-amber-500' : plan.rank === 2 ? 'bg-slate-400' : 'bg-orange-400'}`}>
                                        {plan.rank}
                                    </div>
                                )}
                                <div className="aspect-[16/10] overflow-hidden bg-slate-200">
                                    <img src={plan.img} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="p-6">
                                    <h4 className="font-bold text-xl text-slate-800">{plan.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button className="bg-white border-2 border-indigo-900 text-indigo-900 hover:bg-indigo-900 hover:text-white px-10 py-4 font-bold rounded-md transition-colors w-full sm:w-auto">
                            他のプランをもっと見る →
                        </button>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="bg-indigo-950 py-24 text-center px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-white text-3xl md:text-4xl font-black mb-12">暮らしを体感する</h2>
                    <div className="aspect-video bg-indigo-900 rounded-xl overflow-hidden shadow-2xl relative">
                        {/* Placeholder for iframe / video */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-20 h-20 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm">
                                <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </button>
                        </div>
                        <img src="/images/housemaker/1s.jpg" alt="Video thumbnail" className="w-full h-full object-cover opacity-60" />
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section id="events" className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-3 block">Event</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800">イベントのご案内</h2>
                    </div>

                    <div className="space-y-12">
                        {/* April */}
                        <div>
                            <h3 className="text-2xl font-bold border-l-4 border-indigo-600 pl-4 mb-6 text-slate-800">4月のイベント</h3>
                            <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                                {[1, 2, 3].map((item) => (
                                    <div key={`apr-${item}`} className="flex flex-col md:flex-row border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                                        <div className="md:w-1/3 bg-slate-100/50 p-6 font-bold text-indigo-900 flex items-center">
                                            完成見学会・構造見学会など見出し
                                        </div>
                                        <div className="md:w-2/3 p-6 text-slate-600">
                                            ここにイベントの詳細な説明が入ります。日時や場所、どのような内容がわかるか、予約の有無などを簡潔に記載して参加を促します。
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* May */}
                        <div>
                            <h3 className="text-2xl font-bold border-l-4 border-indigo-600 pl-4 mb-6 text-slate-800">5月のイベント</h3>
                            <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                                {[1].map((item) => (
                                    <div key={`may-${item}`} className="flex flex-col md:flex-row border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                                        <div className="md:w-1/3 bg-slate-100/50 p-6 font-bold text-indigo-900 flex items-center">
                                            家づくり相談会
                                        </div>
                                        <div className="md:w-2/3 p-6 text-slate-600">
                                            土地探しから資金計画、プランの作成まで、家づくりに関することなら何でもご相談いただける無料の相談会を実施します。
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner Section */}
            <div className="bg-slate-100 py-16 border-y border-slate-200">
                <div className="container mx-auto px-6 text-center">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-md font-black text-lg shadow-xl hover:shadow-indigo-600/30 transition-all">
                        来場予約 / 資料請求はこちら
                    </button>
                </div>
            </div>

            {/* Model Home Tour */}
            <section id="model-room" className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                    <span className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-3 block">Model Home Tour</span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">モデルルーム案内</h2>
                    <p className="text-slate-500 mb-12">お近くの弊社モデルルームへぜひお越しください。</p>

                    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-slate-200 shadow-lg">
                        <img src="/images/housemaker/map.jpg" alt="Map background" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-slate-900/10"></div>

                        {/* Fake Pins */}
                        <div className="absolute top-[20%] left-[30%] bg-indigo-600 text-white p-2 rounded-lg shadow-lg font-bold text-xs md:text-sm animate-bounce cursor-pointer hover:bg-indigo-500 transition-colors">
                            📍 #01 本社モデルルーム
                        </div>
                        <div className="absolute top-[50%] left-[60%] bg-indigo-600 text-white p-2 rounded-lg shadow-lg font-bold text-xs md:text-sm cursor-pointer hover:bg-indigo-500 transition-colors">
                            📍 #02 北展示場
                        </div>
                        <div className="absolute top-[70%] left-[20%] bg-indigo-600 text-white p-2 rounded-lg shadow-lg font-bold text-xs md:text-sm cursor-pointer hover:bg-indigo-500 transition-colors">
                            📍 #03 南展示場
                        </div>
                    </div>
                </div>
            </section>

            {/* News */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-3 block">News</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800">お知らせ</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                        <dl className="divide-y divide-slate-100">
                            {[
                                { date: "2026/03/10", text: "ゴールデンウィーク期間中の営業日のご案内" },
                                { date: "2026/02/15", text: "新しいモデルルームがオープンしました。見学予約を受付中です。" },
                                { date: "2025/12/20", text: "年末年始の休業期間に関するお知らせとなります。" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col sm:flex-row py-4 sm:items-center hover:bg-slate-50 transition-colors">
                                    <dt className="text-indigo-600 font-bold w-32 mb-1 sm:mb-0 shrink-0">{item.date}</dt>
                                    <dd className="text-slate-600 cursor-pointer hover:text-indigo-800 transition-colors">{item.text}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="access" className="bg-slate-900 text-slate-400 py-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-12">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <h2 className="text-3xl font-black text-white mb-6 tracking-wider">港南工務店</h2>
                            <p className="text-sm leading-relaxed mb-6">
                                〒100-0000<br />
                                東京都中央区建築町1-2-3<br />
                                Tel：03-0000-0000<br />
                                受付時間：月曜日から金曜日の8時から18時まで
                            </p>
                            <div className="flex space-x-4 mb-8">
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 text-white transition-colors">X</a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 text-white transition-colors">L</a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 text-white transition-colors">Y</a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 text-white transition-colors">I</a>
                            </div>
                            <ul className="flex space-x-6 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">会社案内</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">採用情報</a></li>
                            </ul>
                        </div>

                        {/* Map */}
                        <div className="lg:col-span-2">
                            <h3 className="text-white font-bold mb-6 text-lg">会場へのアクセス</h3>
                            <div className="aspect-[21/9] bg-slate-800 rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.0448418561778!2d139.74267721573196!3d35.675897837870934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b89b2e1c8b1%3A0x59a123e3d5ac5ab6!2z44CSMTAwLTAwMTQg5p2x5Lqs6YO95Y2D5Luj55Sw5Yy65rC455Sw55S677yR5LiB55uu77yX4oiS77yR!5e0!3m2!1sja!2sjp!4v1545036128899"
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center text-xs">
                        <p>Copyright&copy; 港南工務店 All Rights Reserved.</p>
                        <p className="mt-4 md:mt-0 opacity-50">Web Design: Template-Party (Modified)</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
