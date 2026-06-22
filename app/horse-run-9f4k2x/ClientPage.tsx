'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileActionBar from '@/components/MobileActionBar';

// 操作方法（仕様書より）
const controls = [
    { device: 'PC', op: 'スペース / ↑ キー', desc: 'ジャンプ（↓押しっぱなしでしゃがみ）' },
    { device: 'スマホ', op: '画面の上半分をタップ / 下半分を長押し', desc: 'タップでジャンプ・長押しでしゃがみ' },
];

// アイテム（仕様書より）
const items = [
    { name: 'ケーキ', effect: '5秒間 無敵' },
    { name: 'パフェ', effect: '体力（ハート）を1回復' },
    { name: 'コーヒー', effect: '200m 無敵で直進ダッシュ' },
];

export default function Page() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    // スマホでスタート時、ゲーム(iframe)からの要求で横画面・全画面表示にする
    const [enlarged, setEnlarged] = useState(false);
    const [portrait, setPortrait] = useState(false);
    useEffect(() => {
        const onMsg = (e: MessageEvent) => {
            if (e.origin !== window.location.origin) return;
            const d = e.data as { type?: string; action?: string };
            if (d && d.type === 'kounan-horse' && d.action === 'enlarge') setEnlarged(true);
        };
        window.addEventListener('message', onMsg);
        return () => window.removeEventListener('message', onMsg);
    }, []);
    useEffect(() => {
        const upd = () => setPortrait(window.innerHeight > window.innerWidth);
        upd();
        window.addEventListener('resize', upd);
        window.addEventListener('orientationchange', upd);
        return () => {
            window.removeEventListener('resize', upd);
            window.removeEventListener('orientationchange', upd);
        };
    }, []);
    useEffect(() => {
        document.body.style.overflow = enlarged ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [enlarged]);
    const exitEnlarge = () => {
        setEnlarged(false);
        try {
            if (document.fullscreenElement) document.exitFullscreen();
        } catch {}
        try {
            (screen.orientation as unknown as { unlock?: () => void })?.unlock?.();
        } catch {}
    };

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-slate-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-[1.02]">
                        <Image src="/logo.png" alt="港南自動車サービス｜石川県金沢市の車検・自動車整備" width={180} height={45} className="w-auto h-10 md:h-12 object-contain" priority />
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <Link href="/shaken" className="text-slate-600 hover:text-teal-700 transition-colors">車検</Link>
                        <Link href="/#services" className="text-slate-600 hover:text-teal-700 transition-colors">サービス内容</Link>
                        <Link href="/#cases" className="text-slate-600 hover:text-teal-700 transition-colors">取扱車種</Link>
                        <Link href="/#company" className="text-slate-600 hover:text-teal-700 transition-colors">会社情報</Link>
                        <Link href="/#contact" className="text-slate-600 hover:text-teal-700 transition-colors">お問い合わせ</Link>
                        <Link href="/noreta" className="text-white bg-teal-700 px-5 py-2.5 rounded-full hover:bg-teal-800 transition-all shadow-md hover:shadow-lg">
                            ノレタ詳細
                        </Link>
                    </nav>
                    <button
                        className="md:hidden p-2 rounded-xl bg-teal-700 text-white transition-all duration-300"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-label="メニューを開く"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}>
                            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile menu */}
            <div className={`fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[60] md:hidden transition-all duration-500 flex flex-col items-center justify-center space-y-8 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors" aria-label="メニューを閉じる">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                {[
                    { name: '車検', href: '/shaken' },
                    { name: 'サービス内容', href: '/#services' },
                    { name: '取扱車種', href: '/#cases' },
                    { name: '会社情報', href: '/#company' },
                    { name: 'お問い合わせ', href: '/#contact' },
                ].map((item, i) => (
                    <Link key={i} href={item.href} className="text-2xl font-bold text-white hover:text-teal-400 transition-colors" onClick={() => setMenuOpen(false)}>
                        {item.name}
                    </Link>
                ))}
                <Link href="/noreta" className="px-10 py-4 bg-teal-500 text-white rounded-full font-bold text-xl shadow-2xl" onClick={() => setMenuOpen(false)}>
                    ノレタ詳細
                </Link>
            </div>

            <main className="pt-24 md:pt-32">
                {/* Hero */}
                <section className="container mx-auto px-4 mb-10 text-center">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs md:text-sm font-bold mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                        限定公開・無料ミニゲーム
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                        馬<span className="text-teal-700">スピードラン</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        ジャンプとしゃがみで障害物をよけて、どこまで走れるかに挑戦！アイテムを取りながら最長距離を目指す、港南自動車サービスのミニゲームです。
                    </p>
                </section>

                {/* ゲーム本体（iframe埋め込み・横長3:1） */}
                <section className="container mx-auto px-4 mb-20">
                    <div className={enlarged ? 'fixed inset-0 z-[9999] bg-black' : 'max-w-3xl mx-auto'}>
                        {enlarged && (
                            <button
                                onClick={exitEnlarge}
                                className="fixed top-3 right-3 z-[10000] px-4 py-2 rounded-full bg-white/90 text-slate-900 font-bold text-sm shadow-lg"
                                aria-label="全画面を閉じる"
                            >
                                ✕ 閉じる
                            </button>
                        )}
                        <iframe
                            src="/game/horse_game/horse_speed_run.html"
                            title="馬スピードラン"
                            className={enlarged ? 'border-0 bg-black' : 'w-full rounded-3xl shadow-2xl border border-slate-200 bg-slate-900'}
                            style={
                                enlarged
                                    ? portrait
                                        ? {
                                              position: 'fixed',
                                              top: '50%',
                                              left: '50%',
                                              width: '100vh',
                                              height: '100vw',
                                              transform: 'translate(-50%, -50%) rotate(90deg)',
                                          }
                                        : { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }
                                    : { height: 440, width: '100%' }
                            }
                            loading="lazy"
                            allow="fullscreen"
                            allowFullScreen
                        />
                    </div>
                    <p className="text-center text-slate-400 text-xs mt-4">
                        ※ スマホでは横画面・<a href="/game/horse_game/horse_speed_run.html" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-bold hover:underline">別ウィンドウ</a>での表示がおすすめです。
                    </p>
                </section>

                {/* 遊び方 */}
                <section className="container mx-auto px-4 space-y-16 mb-24">
                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">操作方法</h2>
                            <p className="text-slate-500">ジャンプとしゃがみだけ。カンタン操作です。</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {controls.map((c, idx) => (
                                <article key={idx} className="bg-white p-8 rounded-2xl border border-slate-200">
                                    <div className="text-teal-700 font-black text-sm tracking-widest uppercase mb-3">{c.device}</div>
                                    <p className="text-lg font-black text-slate-900 mb-2">{c.op}</p>
                                    <p className="text-slate-500 text-sm">{c.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">アイテム</h2>
                            <p className="text-slate-500">取るとお得な効果が発動します。</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            {items.map((it, idx) => (
                                <article key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                                    <p className="text-slate-900 font-black text-lg mb-1">{it.name}</p>
                                    <p className="text-teal-700 font-bold text-sm">{it.effect}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-white pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                        <div>
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-slate-950 font-black text-[10px]">KONAN</span>
                                </div>
                                <h3 className="text-2xl font-black">港南自動車サービス</h3>
                            </div>
                            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                                石川県金沢市で半世紀以上にわたり、地域の皆様の安全を守り続けてきました。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Contact Information</div>
                            <address className="text-xl font-bold not-italic">石川県金沢市金石本町ハ14</address>
                            <div className="flex flex-col space-y-2">
                                <Link href="tel:076-268-1788" className="text-3xl font-black text-teal-400 hover:text-white transition-colors">076-268-1788</Link>
                                <span className="text-slate-500 text-sm">受付：平日 9:00 - 18:00 / 土曜 9:00 - 17:00 / 日祝定休</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-slate-900 text-slate-500 text-xs">
                        <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>

            {/* スマホ用の電話・LINE固定バー */}
            <MobileActionBar />
        </div>
    );
}
