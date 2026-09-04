'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * ページ描画中に例外が発生したときの画面。
 * Next.js 標準のエラー画面は英語なので、電話導線を持つ日本語の画面に差し替える。
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 本番では digest だけがログに残る。原因追跡の手掛かりとして出力しておく
        console.error('Page error:', error);
    }, [error]);

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 py-16 text-center text-gray-900">
            <h1 className="text-[26px] font-bold leading-tight md:text-[32px]">
                ページを表示できませんでした
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-loose text-gray-600">
                一時的な問題が発生しています。少し時間をおいて再読み込みをお試しください。
                お急ぎの場合はお電話でご用件を承ります。
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={reset}
                    className="h-14 rounded-xl bg-teal-700 px-7 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                >
                    再読み込みする
                </button>
                <a
                    href="tel:076-268-1788"
                    className="u-num flex h-14 items-center justify-center rounded-xl border border-gray-300 px-7 text-[15px] font-bold text-gray-900 transition-colors hover:border-teal-700 hover:text-teal-700"
                >
                    076-268-1788
                </a>
            </div>

            <Link
                href="/"
                className="mt-8 text-sm text-gray-500 underline underline-offset-4 transition-colors hover:text-teal-700"
            >
                トップページへ戻る
            </Link>

            {error.digest && (
                <p className="u-num mt-10 text-xs text-gray-400">エラーID: {error.digest}</p>
            )}
        </div>
    );
}
