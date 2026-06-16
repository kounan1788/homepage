'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import MobileActionBar from '@/components/MobileActionBar';

// 操作方法（仕様書より）
const controls = [
    { device: 'PC', op: '← / → キー', desc: '左右の車線へ移動' },
    { device: 'スマホ', op: '画面の左半分 / 右半分をタップ', desc: '左右の車線へ移動' },
];

// 割引ランク（仕様書 TIERS より）
const tiers = [
    { rank: 'BRONZE', dist: '750m 以上', amount: '50円引き' },
    { rank: 'SILVER', dist: '2,000m 以上', amount: '100円引き' },
    { rank: 'GOLD', dist: '3,600m 以上', amount: '200円引き' },
    { rank: 'PLATINUM', dist: '6,000m 以上', amount: '300円引き' },
];

// 遊び方の流れ（仕様書 2.1 より）
const steps = [
    { step: '01', title: 'スタート', desc: 'スタートボタンを押すと「3・2・1・GO!」のカウントダウン後にゲーム開始。' },
    { step: '02', title: 'よける', desc: '3車線を左右に移動して、前方から迫るガードレールをよけ続けます。' },
    { step: '03', title: '距離をのばす', desc: '走った距離がそのままスコアに。進むほどスピードが上がり難しくなります。' },
    { step: '04', title: '割引GET', desc: '走破距離に応じて割引コードが発行されます。来店時にぜひご活用ください。' },
];

export default function Page() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

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
                        <Link href="/recruit" className="text-slate-600 hover:text-teal-700 transition-colors">採用情報</Link>
                        <Link href="/#contact" className="text-slate-600 hover:text-teal-700 transition-colors">お問い合わせ</Link>
                        <Link href="/noreta" className="text-white bg-teal-700 px-5 py-2.5 rounded-full hover:bg-teal-800 transition-all shadow-md hover:shadow-lg">
                            ノレタ詳細
                        </Link>
                        <Link href="/noridoku" className="text-white bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                            ノリドク詳細
                        </Link>
                    </nav>
                    <button
                        className="md:hidden p-2 rounded-xl bg-teal-700 text-white transition-all duration-300"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-label="メニューを開く"
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
                            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile menu */}
            <div
                className={`fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[60] md:hidden transition-all duration-500 flex flex-col items-center justify-center space-y-8 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    aria-label="メニューを閉じる"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                {[
                    { name: '車検', href: '/shaken' },
                    { name: 'サービス内容', href: '/#services' },
                    { name: '取扱車種', href: '/#cases' },
                    { name: '会社情報', href: '/#company' },
                    { name: '採用情報', href: '/recruit' },
                    { name: 'お問い合わせ', href: '/#contact' },
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
                <Link href="/noreta" className="px-10 py-4 bg-teal-500 text-white rounded-full font-bold text-xl shadow-2xl" onClick={() => setMenuOpen(false)}>
                    ノレタ詳細
                </Link>
                <Link href="/noridoku" className="px-10 py-4 bg-blue-500 text-white rounded-full font-bold text-xl shadow-2xl" onClick={() => setMenuOpen(false)}>
                    ノリドク詳細
                </Link>
            </div>

            <main className="pt-24 md:pt-32">
                {/* パンくずリスト */}
                <Breadcrumb
                    items={[
                        { name: 'ホーム', href: '/' },
                        { name: '港南ドライブチャレンジ', href: '/game' },
                    ]}
                />

                {/* Hero */}
                <section className="container mx-auto px-4 mb-12 text-center">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs md:text-sm font-bold mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                        遊んで割引GET・無料ミニゲーム
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                        港南<span className="text-teal-700">ドライブ</span>チャレンジ
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        3車線の道路でガードレールをよけて、どこまで走れるかに挑戦！走った距離に応じて割引コードがもらえる、港南自動車サービスのミニゲームです。PC・スマホどちらでも今すぐ遊べます。
                    </p>
                </section>

                {/* ゲーム本体（iframe埋め込み） */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="max-w-[460px] mx-auto">
                        <iframe
                            src="/game/drive-game.html"
                            title="港南ドライブチャレンジ"
                            className="w-full rounded-3xl shadow-2xl border border-slate-200 bg-slate-900"
                            style={{ height: 760 }}
                            loading="lazy"
                            allow="fullscreen"
                            allowFullScreen
                        />
                    </div>
                    <p className="text-center text-slate-400 text-xs mt-4">
                        ※ うまく表示されない場合は<a href="/game/drive-game.html" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-bold hover:underline">こちら（別ウィンドウ）</a>からお楽しみください。
                    </p>
                </section>

                {/* 遊び方・割引の説明 */}
                <section className="container mx-auto px-4 space-y-24 mb-24">
                    {/* 操作方法 */}
                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">操作はカンタン</h2>
                            <p className="text-slate-500">左右に動かしてよけるだけ。むずかしい操作はありません。</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {controls.map((c, idx) => (
                                <article key={idx} className="bg-white p-8 rounded-2xl border border-slate-200">
                                    <div className="text-teal-700 font-black text-sm tracking-widest uppercase mb-3">{c.device}</div>
                                    <p className="text-xl font-black text-slate-900 mb-2">{c.op}</p>
                                    <p className="text-slate-500 text-sm">{c.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* 遊び方の流れ */}
                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">遊び方</h2>
                            <p className="text-slate-500">スタートから割引GETまでの流れ。</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {steps.map((item, idx) => (
                                <article key={idx} className="bg-white p-6 rounded-2xl border border-slate-200">
                                    <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center text-xs font-black mb-6 shadow-lg shadow-teal-200">
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-black mb-2">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* 割引ランク */}
                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">走った距離で割引GET</h2>
                            <p className="text-slate-500">走破距離に応じて、4段階の割引コードが発行されます。</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {tiers.map((t, idx) => (
                                <article key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                                    <div className="text-slate-400 font-black text-xs tracking-widest uppercase mb-3">{t.rank}</div>
                                    <p className="text-slate-900 font-black text-lg mb-1">{t.dist}</p>
                                    <p className="text-2xl font-black text-teal-700">{t.amount}</p>
                                </article>
                            ))}
                        </div>
                        <p className="text-center text-slate-400 text-xs mt-8 max-w-2xl mx-auto leading-relaxed">
                            ※ 割引コードの内容・ご利用方法・有効期限については、店舗スタッフまでお問い合わせください。割引はゲーム内演出であり、ご利用条件は変更となる場合があります。
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <p className="text-slate-600 mb-6 font-bold">車検・新車・カーリースのご相談もお気軽にどうぞ。</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="tel:076-268-1788" className="inline-flex items-center justify-center px-8 py-4 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-all font-bold shadow-lg">
                                お電話で相談（076-268-1788）
                            </Link>
                            <Link href="/shaken" className="inline-flex items-center justify-center px-8 py-4 bg-slate-200 text-slate-800 rounded-xl hover:bg-slate-300 transition-all font-bold">
                                車検について見る
                            </Link>
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
                                石川県金沢市で半世紀以上にわたり、地域の皆様の安全を守り続けてきました。<br />
                                丁寧な仕事、誠実な説明、そして確かな技術。
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
                    <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-6">
                        <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                        <nav className="flex space-x-8">
                            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
                            <Link href="/shaken" className="hover:text-white transition-colors">車検について</Link>
                            <Link href="/noreta" className="hover:text-white transition-colors">個人リース「ノレタ」</Link>
                        </nav>
                    </div>
                </div>
            </footer>

            {/* スマホ用の電話・LINE固定バー */}
            <MobileActionBar />
        </div>
    );
}
