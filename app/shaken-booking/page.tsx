import type { Metadata } from 'next';
import ArrowRight from '@/components/ArrowRight';
import Breadcrumb from '@/components/Breadcrumb';
import MobileActionBar from '@/components/MobileActionBar';
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

/** 申込から確定までの流れ。この順番がそのまま案内の順番になる */
const steps = [
    {
        step: '01',
        title: 'フォームで申し込む',
        desc: '希望日（第2希望まで）と車種をご入力ください。選べるのは受け入れ状況が〇の日です。',
    },
    {
        step: '02',
        title: 'LINEで申込内容を送信',
        desc: '申し込むとトーク画面が開き、申込内容が入力されています。そのまま送信してください。',
    },
    {
        step: '03',
        title: '当店から確定のご連絡',
        desc: 'LINEで日程を確定します。ご予約日の前日には、LINEでお知らせが届きます。',
    },
];

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

                {/* Hero：説明はサーバー側で描画する */}
                <section className="bg-white pb-14 pt-6 md:pb-16 md:pt-8">
                    <div className="container">
                        <hr className="u-road" aria-hidden="true" />

                        <div className="mt-8 max-w-3xl">
                            <h1 className="text-[30px] font-bold leading-[1.35] tracking-ja text-gray-900 md:text-[44px]">
                                <span className="text-teal-700">LINE</span>で車検を予約する
                            </h1>

                            <p className="mt-8 text-[15px] leading-loose text-gray-600 md:text-base">
                                お電話をしなくても、LINEで車検のご予約を申し込めます。
                                <strong className="font-bold text-gray-900">
                                    お申し込みの時点では、ご予約はまだ確定していません。
                                </strong>
                                当店からLINEで確定のご連絡をします。
                            </p>
                            <p className="mt-4 text-[15px] leading-loose text-gray-600 md:text-base">
                                受け入れ状況が△の日は、お電話（
                                <a href="tel:076-268-1788" className="u-num font-bold text-teal-700 underline">
                                    076-268-1788
                                </a>
                                ）でご相談ください。
                            </p>
                        </div>
                    </div>
                </section>

                {/* 申込から確定までの流れ */}
                <section className="border-t border-gray-200 bg-gray-50 py-16 md:py-20">
                    <div className="container">
                        <span className="u-label">How it works</span>
                        <h2 className="mt-4 text-[24px] font-bold leading-tight text-gray-900 md:text-[30px]">
                            ご予約の流れ
                        </h2>

                        <ol className="mt-10 grid gap-6 md:grid-cols-3">
                            {steps.map((item) => (
                                <li
                                    key={item.step}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 md:p-7"
                                >
                                    <span className="u-num text-sm font-medium text-teal-700">{item.step}</span>
                                    <h3 className="mt-3 text-[17px] font-bold text-gray-900">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-loose text-gray-600">{item.desc}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* 予約フォーム（LIFF）。ここだけクライアント側で読み込む */}
                <section className="border-t border-gray-200 bg-white py-16 md:py-20">
                    <div className="container">
                        <div className="max-w-2xl">
                            <span className="u-label">Booking</span>
                            <h2 className="mt-4 text-[24px] font-bold leading-tight text-gray-900 md:text-[30px]">
                                予約を申し込む
                            </h2>

                            <div className="mt-10">
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
                                <span className="u-label text-teal-200">Contact</span>
                                <h2 className="mt-4 text-[26px] font-bold leading-tight text-white md:text-[32px]">
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

            {/* スマホ用の電話・LINE固定バー */}
            <MobileActionBar />
        </div>
    );
}
