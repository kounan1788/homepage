"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GallerySiteTemplate() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // 画像閲覧（Fancyboxの簡易代替用）
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'HOME', href: '#home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'PROFILE', href: '#profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { name: 'PORTFOLIO', href: '#portfolio', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'CONTACT', href: '#contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    ];

    // サンプル画像データ（テンプレートのimages_sampleに準拠、動画はスキップ）
    const portfolioItems = [
        { id: 2, src: '/images/gallery/2.jpg', caption: 'ポートレート写真' },
        { id: 3, src: '/images/gallery/3.jpg', caption: '街並みのスケッチ' },
        { id: 4, src: '/images/gallery/4.jpg', caption: '猫の写真' },
        { id: 5, src: '/images/gallery/5.jpg', caption: '静物画' },
        { id: 7, src: '/images/gallery/7.jpg', caption: '旅行先での一枚' },
        { id: 8, src: '/images/gallery/8.jpg', caption: 'インテリアデザイン' },
        { id: 9, src: '/images/gallery/9.jpg', caption: '自然風景' },
        { id: 10, src: '/images/gallery/10.jpg', caption: 'カフェの写真' },
        { id: 12, src: '/images/gallery/12.jpg', caption: '製品撮影' },
        { id: 14, src: '/images/gallery/14.jpg', caption: 'モノクロ写真' },
        { id: 15, src: '/images/gallery/15.jpg', caption: 'テクスチャ素材' },
        { id: 16, src: '/images/gallery/16.jpg', caption: '建築写真' },
        { id: 17, src: '/images/gallery/17.jpg', caption: 'アートワーク' },
        { id: 18, src: '/images/gallery/18.jpg', caption: '夕焼け空' },
        { id: 19, src: '/images/gallery/19.jpg', caption: '夜景' },
        { id: 20, src: '/images/gallery/20.jpg', caption: '花の写真' },
    ];

    return (
        <div className="font-sans text-neutral-800 bg-neutral-900 min-h-screen selection:bg-rose-500 selection:text-white">

            {/* Header & Navigation */}
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-neutral-900/90 backdrop-blur-md shadow-lg border-b border-neutral-800 py-3' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
                    <Link href="#home" className="flex items-center group">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                            <span className="font-black text-2xl text-neutral-900 tracking-tighter">P</span>
                        </div>
                        <span className="text-xl font-bold tracking-[0.2em] text-white">PORTFOLIO</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center space-x-2 bg-neutral-800/50 backdrop-blur-sm rounded-full p-1 border border-neutral-700/50">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="flex items-center space-x-2 px-6 py-2 rounded-full text-xs font-bold tracking-widest text-neutral-300 hover:text-white hover:bg-neutral-700 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                                </svg>
                                <span>{link.name}</span>
                            </a>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden text-white w-12 h-12 flex items-center justify-center bg-neutral-800 rounded-full" onClick={() => setMenuOpen(!menuOpen)}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-neutral-950/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="space-y-8 text-center">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-center space-x-4 text-white text-2xl font-bold tracking-[0.2em] hover:text-rose-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                            </svg>
                            <span>{link.name}</span>
                        </a>
                    ))}
                </div>
            </div>

            <main>
                {/* Hero Section */}
                <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {/* 背景画像３枚をCSSアニメーションでクロスフェードさせる（JSなし）*/}
                        <img src="/images/gallery/2.jpg" alt="hero 1" className="absolute inset-0 w-full h-full object-cover animate-[kenburns_24s_infinite] opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-900/40 to-neutral-900"></div>
                    </div>

                    <div className="relative z-10 text-center px-6 mix-blend-screen">
                        <p className="text-rose-500 font-bold tracking-[0.5em] text-sm md:text-base mb-6 uppercase">Photographer & Designer</p>
                        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 opacity-90">
                            CREATIVE<br />WORKS.
                        </h1>
                        <p className="text-neutral-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
                            一瞬の光と影を切り取り、デザインで新たな価値を創造する。<br className="hidden md:block" />フリーランスのクリエイターとして活動しています。
                        </p>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-neutral-500">
                        <span className="text-[10px] uppercase tracking-[0.2em] mb-2">Scroll</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                </section>

                {/* News Ticker */}
                <div className="bg-rose-600 text-white py-3 overflow-hidden whitespace-nowrap border-y border-rose-500/30">
                    <div className="animate-[scroll_20s_linear_infinite] inline-block font-mono text-xs tracking-widest uppercase">
                        <span className="mx-8 font-bold text-rose-200">2026.03.10</span> 新しいポートフォリオサイトを公開しました。ギャラリーの作品を追加しました。
                        <span className="mx-8 font-bold text-rose-200">2026.02.25</span> Web Design Award 2026 にて特別賞を受賞しました。
                        <span className="mx-8 font-bold text-rose-200">2026.01.15</span> 春の新作写真展「光の軌跡」を銀座ギャラリーにて開催予定です。(4/1〜4/7)
                        {/* ループ用 */}
                        <span className="mx-8 font-bold text-rose-200">2026.03.10</span> 新しいポートフォリオサイトを公開しました。ギャラリーの作品を追加しました。
                    </div>
                </div>

                {/* Profile Section */}
                <section id="profile" className="py-24 md:py-32 relative bg-neutral-900">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="flex flex-col md:flex-row items-center gap-16">
                            <div className="w-full md:w-5/12">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                                    <div className="absolute inset-0 bg-rose-500 mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10"></div>
                                    <img src="/images/gallery/14.jpg" alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                                </div>
                            </div>
                            <div className="w-full md:w-7/12">
                                <div className="mb-12">
                                    <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">PROFILE</h2>
                                    <div className="w-12 h-1 bg-rose-500"></div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-6">山田 太郎 <span className="text-base font-normal text-neutral-500 ml-4">Taro Yamada</span></h3>
                                <p className="text-neutral-400 leading-relaxed mb-8">
                                    1990年生まれ、東京都在住。美術大学デザイン科を卒業後、制作会社にてアートディレクターとして勤務。2020年に独立し、現在はフリーランスのフォトグラファー・Webデザイナーとして活動中。
                                    <br /><br />
                                    「感情に訴えかけるビジュアル」をテーマに、広告写真、ポートレート、そしてWebサイトのUI/UXデザインまで幅広く手がけています。
                                </p>

                                <div className="grid grid-cols-2 gap-8 border-t border-neutral-800 pt-8">
                                    <div>
                                        <h4 className="text-rose-500 font-bold text-xs tracking-widest uppercase mb-3 text-shadow">Skills</h4>
                                        <ul className="text-neutral-400 text-sm space-y-2">
                                            <li>Photography (Portrait, Product)</li>
                                            <li>Web Design (Figma, XD)</li>
                                            <li>Front-end (React, Tailwind)</li>
                                            <li>Retouching (Photoshop)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-rose-500 font-bold text-xs tracking-widest uppercase mb-3">Awards</h4>
                                        <ul className="text-neutral-400 text-sm space-y-2">
                                            <li>2026 Web Design Award</li>
                                            <li>2023 Tokyo Photo Contest</li>
                                            <li>2021 Good Design Award</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Portfolio Section (Masonry) */}
                <section id="portfolio" className="py-24 md:py-32 bg-neutral-950">
                    <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">PORTFOLIO</h2>
                            <p className="text-neutral-500">これまでの制作実績や作品集です。</p>
                        </div>

                        {/* Tailwind CSS Column Layout for Masonry Grid */}
                        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {portfolioItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-lg bg-neutral-800"
                                    onClick={() => setSelectedImage(item.src)}
                                >
                                    <img
                                        src={item.src}
                                        alt={item.caption}
                                        className="w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                        <div className="p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-white font-bold">{item.caption}</p>
                                            <span className="text-rose-400 text-xs font-bold tracking-widest mt-2 uppercase flex items-center">
                                                View Image <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <button className="px-10 py-4 border border-neutral-700 text-white font-bold tracking-widest text-sm hover:bg-white hover:text-neutral-900 transition-colors uppercase rounded-full">
                                Load More Projects
                            </button>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-24 md:py-32 bg-neutral-900 relative">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
                    <div className="container mx-auto px-6 max-w-3xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">CONTACT</h2>
                            <p className="text-neutral-400">お仕事のご依頼やご相談は、こちらのフォームよりお気軽にお問い合わせください。</p>
                        </div>

                        <div className="bg-neutral-800/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-neutral-700/50 shadow-2xl">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Name *</label>
                                        <input type="text" className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors rounded-lg" placeholder="お名前" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Email *</label>
                                        <input type="email" className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors rounded-lg" placeholder="メールアドレス" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Subject</label>
                                    <select className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors appearance-none rounded-lg">
                                        <option>お仕事のご依頼（撮影）</option>
                                        <option>お仕事のご依頼（Webデザイン）</option>
                                        <option>その他のお問い合わせ</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Message *</label>
                                    <textarea rows={6} className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 focus:outline-none focus:border-rose-500 transition-colors resize-none rounded-lg" placeholder="お問い合わせ内容をご記入ください"></textarea>
                                </div>
                                <div className="pt-4 text-center">
                                    <button type="button" className="bg-white text-neutral-900 font-bold uppercase tracking-widest text-sm px-16 py-4 hover:bg-rose-500 hover:text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-rose-500/25">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-neutral-950 py-12 border-t border-neutral-900 text-center">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center space-x-6 mb-8">
                        <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 text-neutral-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">TW</a>
                        <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 text-neutral-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">IN</a>
                        <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 text-neutral-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">BE</a>
                    </div>
                    <p className="text-neutral-600 font-mono text-xs tracking-widest mb-4">
                        Copyright &copy; Sample Site All Rights Reserved.
                    </p>
                    <p className="text-neutral-700 text-[10px] uppercase">
                        Web Design: Template-Party (Modified)
                    </p>
                </div>
            </footer>

            {/* Lightbox / Image Viewer */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    >
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Enlarged"
                        className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
                        onClick={(e) => e.stopPropagation()} // 画像クリックで閉じないようにする
                    />
                </div>
            )}

            {/* Global CSS (キーフレームアニメーション等) */}
            <style jsx global>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes kenburns {
                    0% { transform: scale(1) translate(0, 0); }
                    50% { transform: scale(1.1) translate(-1%, -1%); }
                    100% { transform: scale(1) translate(0, 0); }
                }
            `}</style>
        </div>
    );
}
