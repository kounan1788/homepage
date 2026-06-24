'use client';

import { useState, useEffect } from 'react';

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
            <main className="pt-10 pb-20">
                {/* タイトル */}
                <section className="container mx-auto px-4 mb-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
                        馬<span className="text-teal-700">スピードラン</span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        ジャンプとしゃがみで障害物をよけて、どこまで走れるかに挑戦！アイテムを取りながら最長距離を目指そう。
                    </p>
                </section>

                {/* 横画面推奨の案内（タイトルとゲームの間に目立たせて配置） */}
                <section className="container mx-auto px-4 mb-8">
                    <div className="max-w-3xl mx-auto flex items-center justify-center gap-3 rounded-2xl bg-amber-400 text-amber-950 font-black px-5 py-4 shadow-lg ring-2 ring-amber-300">
                        <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="4" y="2" width="10" height="16" rx="2" transform="rotate(15 9 10)" />
                            <path d="M18 14a7 7 0 0 1-7 7" />
                            <path d="M18 21l2-1-1-2" />
                        </svg>
                        <span className="text-base md:text-lg">横画面でのプレイを推奨しています</span>
                    </div>
                </section>

                {/* ゲーム本体（iframe埋め込み・横長3:1） */}
                <section className="container mx-auto px-4 mb-16">
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
                                              width: '100dvh',
                                              height: '100dvw',
                                              transform: 'translate(-50%, -50%) rotate(90deg)',
                                          }
                                        : { position: 'fixed', top: 0, left: 0, width: '100dvw', height: '100dvh' }
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
                <section className="container mx-auto px-4 space-y-16">
                    <div>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3">操作方法</h2>
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
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3">アイテム</h2>
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
        </div>
    );
}
