import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'ページが見つかりません',
    robots: { index: false, follow: true },
};

// 迷子になった人がすぐ戻れる先。トップの主要導線だけに絞る
const SHORTCUTS = [
    { href: '/', label: 'トップページ', description: '会社情報・営業カレンダー・お問い合わせ' },
    { href: '/shaken', label: '車検・点検', description: '料金シミュレーションと割引制度' },
    { href: '/noreta', label: 'カーローン ノレタ', description: '頭金0円・月々定額で新車に乗る' },
    { href: '/noridoku', label: '法人リース ノリドク', description: '法人・個人事業主向けカーリース' },
    { href: '/recruit', label: '採用情報', description: '整備士・スタッフの募集要項' },
];

export default function NotFound() {
    return (
        <div className="flex min-h-dvh flex-col bg-white text-gray-900">
            <header className="border-b border-gray-200 bg-white">
                <div className="container flex h-16 items-center justify-between gap-6 md:h-20">
                    <Link href="/" className="flex shrink-0 items-center">
                        <Image
                            src="/logo.png"
                            alt="株式会社港南自動車サービス"
                            width={280}
                            height={70}
                            className="h-8 w-auto object-contain md:h-10"
                        />
                    </Link>
                    <a
                        href="tel:076-268-1788"
                        className="u-num text-sm font-bold text-teal-700 transition-colors hover:text-teal-500 md:text-base"
                    >
                        076-268-1788
                    </a>
                </div>
            </header>

            <main id="main" tabIndex={-1} className="container flex-1 py-16 md:py-24">
                <p className="u-num text-[64px] font-bold leading-none text-mint-200 md:text-[96px]">
                    404
                </p>
                <h1 className="mt-6 text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                    ページが見つかりませんでした
                </h1>
                <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                    お探しのページは、移動または削除された可能性があります。
                    お手数ですが、下記のいずれかからお進みください。
                    お急ぎの場合はお電話でも承ります。
                </p>

                <ul className="mt-12 max-w-2xl divide-y divide-gray-200 border-y border-gray-200">
                    {SHORTCUTS.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="group flex items-center justify-between gap-6 py-5 transition-colors hover:text-teal-700"
                            >
                                <span>
                                    <span className="block text-[15px] font-bold">{item.label}</span>
                                    <span className="mt-1 block text-sm text-gray-500">
                                        {item.description}
                                    </span>
                                </span>
                                <svg
                                    aria-hidden="true"
                                    className="size-5 shrink-0 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-teal-700"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path
                                        d="M4 12h15m0 0l-6-6m6 6l-6 6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        </li>
                    ))}
                </ul>

                <a
                    href="tel:076-268-1788"
                    className="mt-12 inline-flex h-14 items-center gap-3 rounded-xl bg-teal-700 px-7 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                >
                    電話で問い合わせる
                    <span className="u-num">076-268-1788</span>
                </a>
            </main>

            <footer className="border-t border-gray-200 bg-gray-900 py-10 text-white">
                <div className="container flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-white/50">
                        &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights
                        Reserved.
                    </p>
                    <Link href="/privacy" className="u-label text-white/60 hover:text-teal-300">
                        プライバシーポリシー
                    </Link>
                </div>
            </footer>
        </div>
    );
}
