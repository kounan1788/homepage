import type { Metadata } from 'next';
import ArrowRight from '@/components/ArrowRight';
import Breadcrumb from '@/components/Breadcrumb';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import BookingFormLoader from './BookingFormLoader';

export const metadata: Metadata = {
    // 共通テンプレートを付けない完全なtitle（社名の二重表示を防ぐ）
    title: { absolute: 'LINEで車検予約｜港南自動車サービス（金沢市）' },
    description: '車検のご予約をLINEで申し込めます。金沢市の港南自動車サービス。',
    alternates: {
        canonical: '/shaken-booking',
    },
    // LINEログイン付きの申込フォームなので検索結果には出さない（入口は車検ページのカレンダー）
    robots: {
        index: false,
        follow: false,
    },
};

/**
 * 申込から確定までの流れ。完了画面の手順表示（BookingDone.tsx）と同じ3段階・同じ呼び名にそろえる。
 * フォームまでのスクロールを短くするため、カードではなく1行で見せる
 */
const steps = ['フォームで申し込む', 'LINEで申込内容を送信', '当店から確定のご連絡'];

export default function Page() {
    return (
        <div className="min-h-dvh bg-white text-gray-900">
            <SiteHeader
                currentPath="/shaken-booking"
                logoAlt="港南自動車サービス｜石川県金沢市の車検・自動車整備"
            />

            <main id="main" tabIndex={-1} className="pt-16 md:pt-20">
                <Breadcrumb
                    items={[
                        { name: 'ホーム', href: '/' },
                        { name: '車検', href: '/shaken' },
                        { name: 'LINEで車検予約', href: '/shaken-booking' },
                    ]}
                />

                {/* Hero：説明はサーバー側で描画する。フォームまでのスクロールを短くするため簡潔にする */}
                <section className="bg-white pb-8 pt-6 md:pb-10 md:pt-8">
                    <div className="container">
                        <div className="max-w-2xl">
                            <h1 className="text-[28px] font-bold leading-[1.35] tracking-ja text-gray-900 md:text-[40px]">
                                LINEで車検を予約する
                            </h1>

                            <p className="mt-5 text-[15px] leading-loose text-gray-700 md:text-base">
                                お電話をしなくても、LINEで車検のご予約を申し込めます。お申し込みの時点ではまだ確定していません。当店からLINEで確定のご連絡をします。
                            </p>

                            {/* 申込から確定までの3段階 */}
                            <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold text-teal-700">
                                {steps.map((step, index) => (
                                    <li key={step} className="flex items-center gap-2">
                                        {index > 0 && (
                                            <span aria-hidden="true" className="text-gray-400">
                                                ›
                                            </span>
                                        )}
                                        <span>
                                            {index + 1}. {step}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                {/* 予約フォーム（LIFF）。ここだけクライアント側で読み込む */}
                <section className="border-t border-gray-200 bg-white pb-16 pt-10 md:pb-20 md:pt-12">
                    <div className="container">
                        <div className="max-w-2xl">
                            <h2 className="text-[22px] font-bold leading-tight text-gray-900 md:text-[28px]">
                                予約を申し込む
                            </h2>

                            <div className="mt-8">
                                <BookingFormLoader />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 電話の締め（LINEが使えない方の受け皿） */}
                <section className="bg-teal-900 py-16 md:py-20">
                    <div className="container">
                        <div className="grid gap-8 md:grid-cols-12 md:items-end">
                            <div className="md:col-span-7">
                                <h2 className="text-[26px] font-bold leading-tight text-white md:text-[32px]">
                                    お電話でも承ります
                                </h2>
                                <p className="mt-4 max-w-lg text-[15px] leading-loose text-white/80">
                                    LINEをお使いでない方や、△の日をご希望の方はお電話でご予約ください。
                                </p>
                            </div>
                            <div className="md:col-span-5">
                                <a
                                    href="tel:076-268-1788"
                                    className="group flex h-16 items-center justify-between gap-6 rounded-xl bg-white px-6 font-bold text-gray-900 transition-[background-color,transform] duration-200 hover:bg-gray-50 active:scale-[0.98]"
                                >
                                    <span className="flex flex-col leading-tight">
                                        <span className="u-num text-xl">076-268-1788</span>
                                        <span className="mt-1 text-[11px] font-medium text-gray-500">
                                            平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                                        </span>
                                    </span>
                                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />

            {/* スマホ用の電話・LINE固定バーはこのページでは出さない。
                申込後の「LINEで申込内容を送信する」から気をそらさないため（電話はページ内に案内がある） */}
        </div>
    );
}
