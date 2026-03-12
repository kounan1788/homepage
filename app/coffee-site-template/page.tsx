"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CoffeeSiteTemplate() {
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
        { name: 'HOME', href: '#home' },
        { name: 'ABOUT', href: '#about' },
        { name: 'PRODUCTS', href: '#products' },
        { name: 'SHOP', href: '#shop' },
    ];

    const products = [
        { id: 1, name: 'オリジナルブレンド', price: '¥1,200 / 200g', desc: 'バランスの取れた毎日飲みたい定番ブレンド。', image: '/images/coffee/product-1.jpg' },
        { id: 2, name: 'エチオピア イルガチェフェ', price: '¥1,500 / 200g', desc: '華やかな香りとフルーティーな酸味が特徴。', image: '/images/coffee/product-2.jpg' },
        { id: 3, name: 'コロンビア スプレモ', price: '¥1,300 / 200g', desc: 'しっかりとしたコクと甘みのある味わい。', image: '/images/coffee/product-3.jpg' },
        { id: 4, name: 'グアテマラ アンティグア', price: '¥1,400 / 200g', desc: 'チョコレートのような甘さと深いコク。', image: '/images/coffee/product-4.jpg' },
    ];

    return (
        <div className="font-serif text-amber-900 bg-[#fdfaf6] min-h-screen selection:bg-amber-700 selection:text-white">

            {/* Header */}
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-1' : 'bg-transparent py-2'}`}>
                <div className="container mx-auto px-6 max-w-6xl flex justify-between items-center">
                    <Link href="#home" className="flex items-center">
                        <Image src="/images/coffee/logo.png" alt="COFFEE ROASTERS" width={120} height={30} className="object-contain" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold tracking-widest hover:text-amber-600 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a href="#online-store" className="bg-amber-800 text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest hover:bg-amber-700 transition-colors">
                            ONLINE STORE
                        </a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-amber-900" onClick={() => setMenuOpen(!menuOpen)}>
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile Nav */}
            <div className={`fixed inset-0 z-40 bg-white flex flex-col items-center justify-center transition-transform duration-500 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="space-y-8 text-center">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block text-2xl font-bold tracking-widest text-amber-900"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a href="#online-store" onClick={() => setMenuOpen(false)} className="inline-block bg-amber-800 text-white px-8 py-3 rounded-full text-lg font-bold tracking-widest mt-4">
                        ONLINE STORE
                    </a>
                </div>
            </div>

            <main>
                {/* Hero */}
                <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image src="/images/coffee/mainimg.jpg" alt="Freshly Roasted Coffee" fill className="object-cover" priority />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                    <div className="relative z-10 text-center px-4">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wider drop-shadow-lg">
                            FRESHLY ROASTED
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 tracking-widest font-light">
                            心から安らぐ、一杯のコーヒーを。
                        </p>
                    </div>
                </section>

                {/* About */}
                <section id="about" className="py-24 bg-[#fdfaf6]">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-12 tracking-widest">ABOUT US</h2>
                        <div className="leading-relaxed text-lg text-amber-900/80 space-y-6">
                            <p>
                                私たちは、世界中の厳選された農園から直接買い付けた生豆を、<br className="hidden md:block" />
                                丁寧に自家焙煎してお届けするロースターです。
                            </p>
                            <p>
                                「毎日飲みたくなる、ホッとする味わい」を追求し、<br className="hidden md:block" />
                                豆それぞれの個性を最大限に引き出す焙煎を心掛けています。
                            </p>
                            <p>
                                あなたの日常に、ささやかな彩りと癒しの時間を。
                            </p>
                        </div>
                    </div>
                </section>

                {/* Products */}
                <section id="products" className="py-24 bg-white">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <h2 className="text-3xl font-bold mb-16 tracking-widest text-center">PRODUCTS</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <div key={product.id} className="group cursor-pointer">
                                    <div className="relative aspect-square overflow-hidden bg-[#f4ebd9] mb-6 rounded-lg flex items-center justify-center">
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                                        <Image src={`/images/coffee/sample${product.id}.jpg`} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                                    <p className="text-amber-900/60 text-sm mb-3 h-10">{product.desc}</p>
                                    <p className="font-bold">{product.price}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-16 text-center">
                            <a href="#online-store" className="inline-block border-2 border-amber-800 text-amber-800 px-10 py-3 rounded-full font-bold tracking-widest hover:bg-amber-800 hover:text-white transition-colors">
                                View All Products
                            </a>
                        </div>
                    </div>
                </section>

                {/* Shop Info */}
                <section id="shop" className="py-24 bg-[#f4ebd9]">
                    <div className="container mx-auto px-6 max-w-4xl flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2">
                            <div className="relative w-full aspect-square bg-amber-900/10 rounded-lg overflow-hidden flex items-center justify-center">
                                <Image src="/images/coffee/sample5.jpg" alt="Shop Interior" fill className="object-cover" />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                            <h2 className="text-3xl font-bold tracking-widest mb-6">SHOP INFO</h2>
                            <div>
                                <h4 className="font-bold mb-1">COFFEE ROASTERS 本店</h4>
                                <p className="text-amber-900/80">〒100-0000 東京都千代田区1-1-1<br />TEL: 03-1234-5678</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-1">営業時間</h4>
                                <p className="text-amber-900/80">平日: 8:00 - 18:00<br />土日祝: 10:00 - 19:00<br />定休日: 水曜日</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-amber-900 text-amber-100 py-12 text-center">
                <div className="container mx-auto px-6">
                    <p className="text-2xl font-bold tracking-widest mb-6">COFFEE ROASTERS</p>
                    <p className="text-sm tracking-widest opacity-60">
                        &copy; {new Date().getFullYear()} COFFEE ROASTERS. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
