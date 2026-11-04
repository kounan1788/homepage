import type { Metadata } from 'next';
import Link from 'next/link';
import ArrowRight from '@/components/ArrowRight';
import Breadcrumb from '@/components/Breadcrumb';
import MobileActionBar from '@/components/MobileActionBar';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { ogImage } from '@/lib/imageSize';
import ReminderFormLoader from './ReminderFormLoader';

export const metadata: Metadata = {
    // 共通テンプレートを付けない完全なtitle（社名の二重表示を防ぐ）
    title: { absolute: '車検満了日のLINEお知らせ｜港南自動車サービス（金沢市）' },
    description:
        '車検の満了日をLINEでお知らせします。満了日の2ヶ月前に通知が届き、そのままご予約いただくと早期予約割引2,200円が適用されます。金沢市の港南自動車サービス。',
    alternates: {
        canonical: '/shaken-reminder',
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: '車検満了日のLINEお知らせ｜港南自動車サービス（金沢市）',
        description:
            '車検の満了日をLINEでお知らせします。満了日の2ヶ月前に通知が届き、そのままご予約いただくと早期予約割引2,200円が適用されます。',
        url: 'https://www.kounan-auto.jp/shaken-reminder',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
        images: ogImage('/og-image.jpg', '車検満了日のLINEお知らせ｜港南自動車サービス'),
    },
};

/** 登録するとどうなるか。この3ステップの順番がそのまま案内の順番になる */
const steps = [
    {
        step: '01',
        title: 'LINEで友だち追加',
        desc: '当社の公式LINEと友だちになります。お知らせはこのLINEに届きます。',
    },
    {
        step: '02',
        title: '車検満了日を登録',
        desc: '車検証に記載された満了日をご入力ください。入力は満了日・車種・ナンバー下4桁だけです。',
    },
    {
        step: '03',
        title: '2ヶ月前にLINEが届く',
        desc: '満了日の2ヶ月前にお知らせします。そのままご予約いただくと早期予約割引の対象です。',
    },
];

export default function Page() {
    return (
        <div className="min-h-dvh bg-white text-gray-900">
            <SiteHeader
                currentPath="/shaken-reminder"
                logoAlt="港南自動車サービス｜石川県金沢市の車検・自動車整備"
            />

            <main id="main" tabIndex={-1} className="pt-16 md:pt-20">
                {/* パンくずリスト（BreadcrumbList 構造化データもここが出力する） */}
                <Breadcrumb
                    items={[
                        { name: 'ホーム', href: '/' },
                        { name: '車検', href: '/shaken' },
                        { name: '車検満了日のLINEお知らせ', href: '/shaken-reminder' },
                    ]}
                />

                {/* Hero：説明はサーバー側で描画する（クローラーが本文を取得できるようにするため） */}
                <section className="bg-white pb-14 pt-6 md:pb-16 md:pt-8">
                    <div className="container">
                        <hr className="u-road" aria-hidden="true" />

                        <div className="mt-8 max-w-3xl">
                            <p className="flex items-center gap-4 text-xs text-gray-600 md:text-sm">
                                <span className="h-px w-10 bg-teal-700" aria-hidden="true" />
                                <span>車検満了日リマインダー（無料）</span>
                            </p>

                            <h1 className="mt-6 text-[30px] font-bold leading-[1.35] tracking-ja text-gray-900 md:text-[44px]">
                                車検の満了日を
                                <br className="md:hidden" />
                                <span className="text-teal-700">LINE</span>でお知らせします
                            </h1>

                            <p className="mt-8 text-[15px] leading-loose text-gray-600 md:text-base">
                                「気づいたら車検が切れていた」を防ぐための無料のサービスです。車検満了日をご登録いただくと、
                                <strong className="font-bold text-gray-900">満了日の2ヶ月前に当社の公式LINEへ通知</strong>
                                が届きます。車検が切れた公道の走行は法律で禁じられていますので、余裕のあるうちにご準備ください。
                            </p>
                            <p className="mt-4 text-[15px] leading-loose text-gray-600 md:text-base">
                                通知が届いたタイミングでご予約いただくと、
                                <strong className="font-bold text-gray-900">早期予約割引 2,200円</strong>
                                （満了日の2ヶ月前までのご予約）が適用されます。通知を受け取ってそのままご予約いただければ、割引の条件を逃しません。
                            </p>
                        </div>
                    </div>
                </section>

                {/* 登録するとどうなるか */}
                <section className="border-t border-gray-200 bg-gray-50 py-16 md:py-20">
                    <div className="container">
                        <span className="u-label">How it works</span>
                        <h2 className="mt-4 text-[24px] font-bold leading-tight text-gray-900 md:text-[30px]">
                            登録するとどうなるか
                        </h2>

                        <ol className="mt-10 grid gap-6 md:grid-cols-3">
                            {steps.map((item) => (
                                <li
                                    key={item.step}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 md:p-7"
                                >
                                    <span className="u-num text-sm font-medium text-teal-700">
                                        {item.step}
                                    </span>
                                    <h3 className="mt-3 text-[17px] font-bold text-gray-900">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-loose text-gray-600">
                                        {item.desc}
                                    </p>
                                </li>
                            ))}
                        </ol>

                        <p className="mt-8 text-xs leading-relaxed text-gray-500">
                            ※お知らせは当社の公式LINEからお送りします。配信の停止はLINEのブロック、またはお電話でいつでも承ります。
                        </p>
                    </div>
                </section>

                {/* 登録フォーム（LIFF）。ここだけクライアント側で読み込む */}
                <section className="border-t border-gray-200 bg-white py-16 md:py-20">
                    <div className="container">
                        <div className="max-w-2xl">
                            <span className="u-label">Registration</span>
                            <h2 className="mt-4 text-[24px] font-bold leading-tight text-gray-900 md:text-[30px]">
                                満了日を登録する
                            </h2>
                            <p className="mt-4 text-sm leading-loose text-gray-600">
                                ご入力は3項目だけです。お車の点検・修理の履歴と照らし合わせるため、車種とナンバーもお聞きしていますが、どちらも任意です。
                            </p>

                            <div className="mt-10">
                                <ReminderFormLoader />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 車検ページへの内部リンク */}
                <section className="border-t border-gray-200 bg-gray-50 py-16 md:py-20">
                    <div className="container">
                        <div className="max-w-2xl">
                            <h2 className="text-[22px] font-bold leading-tight text-gray-900 md:text-[26px]">
                                車検の料金・流れをお探しの方へ
                            </h2>
                            <p className="mt-4 text-sm leading-loose text-gray-600">
                                車種クラス別の料金表、車検の流れと所要時間、割引の一覧は車検のページにまとめています。お見積りもその場でご確認いただけます。
                            </p>
                            <Link
                                href="/shaken"
                                className="group mt-8 flex items-center justify-between gap-6 rounded-xl border border-gray-300 bg-white px-6 py-5 transition-[background-color,transform] duration-200 hover:bg-white/60 active:scale-[0.99]"
                            >
                                <span>
                                    <span className="block text-balance text-lg font-bold text-gray-900">
                                        金沢市の車検 65,040円〜
                                    </span>
                                    <span className="mt-2 block text-pretty text-sm leading-relaxed text-gray-600">
                                        料金表・車検の流れ・割引の組み合わせをご案内しています。
                                    </span>
                                </span>
                                <ArrowRight className="shrink-0 text-teal-700 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
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
                                    LINEをお使いでない方は、お電話で満了日をお知らせください。次回の車検時期が近づきましたら、こちらからご連絡します。
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
