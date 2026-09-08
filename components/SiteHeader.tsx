'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArrowRight from '@/components/ArrowRight';
import { navItems } from '@/lib/siteNav';
import { cn } from '@/lib/utils';

/**
 * 下層ページ共通のヘッダー（固定・白地）とモバイルメニュー。
 *
 * currentPath には自分のページのパスを渡す。ナビの現在地表示に使う。
 */
export default function SiteHeader({
    currentPath,
    logoAlt,
}: {
    currentPath: string;
    logoAlt: string;
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    // メニューを開いている間の焦点の扱い。
    // 背面（ヘッダー・本文・フッター・固定バー）を inert にしてタブ移動が抜け出さないようにし、
    // 開いたらメニュー内へフォーカスを移す。閉じたら開閉ボタンへ戻す。
    useEffect(() => {
        if (!menuOpen) return;

        const menu = document.getElementById('mobile-menu');
        const background = menu?.parentElement
            ? ([...menu.parentElement.children].filter(
                  (el) => el !== menu && el.tagName !== 'SCRIPT'
              ) as HTMLElement[])
            : [];

        background.forEach((el) => el.setAttribute('inert', ''));
        document.getElementById('menu-close')?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setMenuOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            // inert を外してからでないとフォーカスを戻せない
            background.forEach((el) => el.removeAttribute('inert'));
            document.getElementById('menu-toggle')?.focus();
        };
    }, [menuOpen]);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between gap-6 md:h-20">
                    <Link href="/" className="flex shrink-0 items-center py-1">
                        <Image
                            src="/logo.png"
                            alt={logoAlt}
                            width={280}
                            height={70}
                            className="h-8 w-auto object-contain md:h-10"
                            priority
                        />
                    </Link>

                    <nav
                        className="hidden items-center gap-5 whitespace-nowrap text-[15px] text-gray-700 xl:flex"
                        aria-label="メインメニュー"
                    >
                        {navItems.map((item) => {
                            const current = item.href === currentPath;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    aria-current={current ? 'page' : undefined}
                                    className={cn(
                                        'group relative py-3 transition-colors hover:text-teal-700',
                                        current && 'font-bold text-teal-700'
                                    )}
                                >
                                    {item.name}
                                    <span
                                        className={cn(
                                            'absolute inset-x-0 bottom-0 h-px origin-left bg-current transition-transform duration-200 group-hover:scale-x-100',
                                            current ? 'scale-x-100' : 'scale-x-0'
                                        )}
                                        aria-hidden="true"
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden items-center gap-5 whitespace-nowrap xl:flex">
                        <a
                            href="tel:076-268-1788"
                            className="flex flex-col justify-center py-1 leading-none text-gray-900 transition-colors hover:text-teal-700"
                        >
                            <span className="u-num text-lg font-medium tracking-wide">
                                076-268-1788
                            </span>
                            <span className="mt-1 text-[10px] text-gray-500">
                                平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                            </span>
                        </a>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/noreta"
                                className="flex h-11 items-center rounded-full bg-teal-700 px-5 text-sm font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.97]"
                            >
                                ノレタ
                            </Link>
                            <Link
                                href="/noridoku"
                                className="flex h-11 items-center rounded-full border border-blue-600 px-5 text-sm font-bold text-blue-600 transition-[background-color,color,transform] duration-200 hover:bg-blue-600 hover:text-white active:scale-[0.97]"
                            >
                                ノリドク
                            </Link>
                        </div>
                    </div>

                    <button
                        className="flex size-11 items-center justify-center rounded border border-gray-300 text-gray-900 transition-colors xl:hidden"
                        id="menu-toggle"
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                    >
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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

            {/* Mobile menu - header の外に置き、スクロール時の影響を受けないようにする */}
            <div
                id="mobile-menu"
                className={cn(
                    'fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-gray-900 pt-6 transition-opacity duration-200 xl:hidden',
                    'pb-[calc(4rem+env(safe-area-inset-bottom))]',
                    menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                )}
            >
                <div className="container flex items-center justify-between">
                    <Image
                        src="/logo.png"
                        alt=""
                        width={280}
                        height={70}
                        className="h-8 w-auto object-contain brightness-0 invert"
                    />
                    <button
                        id="menu-close"
                        onClick={() => setMenuOpen(false)}
                        className="flex size-11 items-center justify-center rounded border border-white/40 text-white"
                        aria-label="メニューを閉じる"
                    >
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                        >
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="container mt-6" aria-label="メインメニュー（モバイル）">
                    <ul className="border-t border-white/15">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="flex items-center justify-between border-b border-white/15 py-5 text-lg font-bold text-white"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.name}
                                    <ArrowRight className="text-white/50" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <Link
                            href="/noreta"
                            className="flex h-14 items-center justify-center rounded bg-teal-700 font-bold text-white"
                            onClick={() => setMenuOpen(false)}
                        >
                            ノレタ
                        </Link>
                        <Link
                            href="/noridoku"
                            className="flex h-14 items-center justify-center rounded border border-white/50 font-bold text-white"
                            onClick={() => setMenuOpen(false)}
                        >
                            ノリドク
                        </Link>
                    </div>

                    <a href="tel:076-268-1788" className="mt-8 block border-t border-white/15 pt-6">
                        <span className="text-xs text-white/60">お電話でのご相談</span>
                        <span className="u-num mt-1 block text-3xl font-medium text-white">
                            076-268-1788
                        </span>
                    </a>
                </nav>
            </div>
        </>
    );
}
