import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'プライバシーポリシー',
    description:
        '株式会社港南自動車サービスの個人情報保護方針。お問い合わせフォームで取得する個人情報の利用目的、第三者提供、外部送信されるユーザー情報の取扱いについて記載しています。',
    alternates: {
        canonical: '/privacy',
    },
    openGraph: {
        title: 'プライバシーポリシー｜港南自動車サービス',
        description: '株式会社港南自動車サービスの個人情報保護方針。',
        url: 'https://www.kounan-auto.jp/privacy',
        type: 'website',
        locale: 'ja_JP',
        siteName: '株式会社港南自動車サービス',
    },
};

/** 最終改定日。内容を変更したらここも必ず更新すること */
const LAST_UPDATED = '2026年9月4日';

/**
 * 外部送信規律（電気通信事業法 第27条の12）に基づく公表事項。
 * 新しい外部サービスを組み込んだら、必ずこの表に1行足すこと。
 */
const EXTERNAL_TRANSMISSIONS = [
    {
        name: 'Google アナリティクス 4',
        provider: 'Google LLC',
        purpose: 'サイトの利用状況の分析・改善',
        data: '閲覧ページ、滞在時間、参照元、端末・ブラウザの種類、IPアドレス、Cookie識別子',
        optOut: 'https://tools.google.com/dlpage/gaoptout/',
        policy: 'https://policies.google.com/privacy',
    },
    {
        name: 'Google マップ',
        provider: 'Google LLC',
        purpose: '当社所在地の地図表示',
        data: 'IPアドレス、ブラウザ情報、Cookie識別子、地図の操作情報',
        optOut: null,
        policy: 'https://policies.google.com/privacy',
    },
    {
        name: 'Elfsight（Google 口コミ表示）',
        provider: 'Elfsight LLC',
        purpose: 'Googleマップに投稿された口コミの表示',
        data: 'IPアドレス、ブラウザ情報、Cookie識別子',
        optOut: null,
        policy: 'https://elfsight.com/privacy-policy/',
    },
    {
        name: 'Resend',
        provider: 'Resend, Inc.',
        purpose: 'お問い合わせフォーム送信内容の当社へのメール送信',
        data: 'フォームに入力された氏名・メールアドレス・電話番号・お問い合わせ内容',
        optOut: null,
        policy: 'https://resend.com/legal/privacy-policy',
    },
];

export default function PrivacyPage() {
    return (
        <div className="min-h-dvh bg-white text-gray-900">
            {/* ヘッダー（規約ページなのでロゴと電話のみの簡易版） */}
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

            <main id="main" tabIndex={-1} className="container py-14 md:py-20">
                <nav aria-label="パンくずリスト" className="mb-8">
                    <ol className="flex items-center gap-2 text-sm text-gray-500">
                        <li>
                            <Link href="/" className="transition-colors hover:text-teal-700">
                                ホーム
                            </Link>
                        </li>
                        <li aria-hidden="true" className="text-gray-300">
                            ›
                        </li>
                        <li className="font-medium text-gray-900">プライバシーポリシー</li>
                    </ol>
                </nav>

                <hr className="u-road" aria-hidden="true" />
                <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                    <h1 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                        プライバシーポリシー
                    </h1>
                    <span className="u-chip">Privacy Policy</span>
                </div>

                <p className="mt-8 max-w-3xl text-[15px] leading-loose text-gray-700">
                    株式会社港南自動車サービス（以下「当社」）は、お客様の個人情報を適切に保護することが
                    社会的責務であると考え、個人情報の保護に関する法律その他の関係法令を遵守し、
                    以下のとおり個人情報を取り扱います。
                </p>

                <div className="mt-14 max-w-3xl space-y-14">
                    <Section title="1. 事業者情報">
                        <dl className="border-t border-gray-200 text-[15px]">
                            <Row term="事業者名">株式会社港南自動車サービス</Row>
                            <Row term="所在地">〒920-0336 石川県金沢市金石本町ハ14番地</Row>
                            <Row term="連絡先">
                                電話 076-268-1788 ／ FAX 076-268-3163
                                <br />
                                メール info@kounan-auto.jp
                            </Row>
                        </dl>
                    </Section>

                    <Section title="2. 取得する個人情報">
                        <p>
                            当社は、お問い合わせフォーム、お電話、ご来店、採用へのご応募などを通じて、
                            以下の情報を取得します。
                        </p>
                        <ul className="mt-5 space-y-2.5">
                            <Item>氏名</Item>
                            <Item>メールアドレス</Item>
                            <Item>電話番号</Item>
                            <Item>会社名・屋号（法人リースのお問い合わせの場合）</Item>
                            <Item>希望職種（採用へのご応募の場合）</Item>
                            <Item>お問い合わせ内容、ご希望のご来店日時</Item>
                            <Item>
                                サイトの閲覧履歴等（Cookie等を通じて自動的に取得される情報。第5項をご覧ください）
                            </Item>
                        </ul>
                    </Section>

                    <Section title="3. 利用目的">
                        <p>取得した個人情報は、次の目的の範囲内でのみ利用します。</p>
                        <ul className="mt-5 space-y-2.5">
                            <Item>お問い合わせ・ご相談・お見積りへの回答およびご連絡</Item>
                            <Item>
                                車検・整備・車両販売・カーローン・カーリースのご案内および契約手続き
                            </Item>
                            <Item>アフターサービス、法定点検・車検時期のご案内</Item>
                            <Item>採用選考および採用に関するご連絡</Item>
                            <Item>サイトの利用状況の分析によるサービス改善</Item>
                        </ul>
                        <p className="mt-5">
                            上記の目的を超えて利用する必要が生じた場合は、あらためてご本人の同意をいただきます。
                        </p>
                    </Section>

                    <Section title="4. 第三者への提供">
                        <p>当社は、次の場合を除き、ご本人の同意なく個人情報を第三者に提供しません。</p>
                        <ul className="mt-5 space-y-2.5">
                            <Item>法令に基づく場合</Item>
                            <Item>
                                人の生命・身体または財産の保護のために必要があり、ご本人の同意を得ることが
                                困難である場合
                            </Item>
                            <Item>
                                車両の登録手続き、自動車保険、ローン・リースの与信審査など、
                                ご依頼いただいた業務の遂行に必要な範囲で、
                                運輸支局・保険会社・信販会社等に提供する場合
                            </Item>
                        </ul>
                        <p className="mt-5">
                            また、業務の一部を外部に委託する場合は、委託先に対して必要かつ適切な監督を行います。
                        </p>
                    </Section>

                    <Section title="5. 外部サービスへの情報送信について">
                        <p>
                            当社サイトでは以下の外部サービスを利用しており、
                            ご利用にあたってお客様の情報が各サービス提供者へ送信されます
                            （電気通信事業法第27条の12に基づく公表）。
                        </p>
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full min-w-[640px] border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-gray-300 text-left">
                                        <th scope="col" className="py-3 pr-4 font-bold text-gray-900">
                                            サービス名
                                        </th>
                                        <th scope="col" className="py-3 pr-4 font-bold text-gray-900">
                                            送信先
                                        </th>
                                        <th scope="col" className="py-3 pr-4 font-bold text-gray-900">
                                            送信される情報
                                        </th>
                                        <th scope="col" className="py-3 font-bold text-gray-900">
                                            利用目的・停止方法
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {EXTERNAL_TRANSMISSIONS.map((service) => (
                                        <tr
                                            key={service.name}
                                            className="border-b border-gray-200 align-top"
                                        >
                                            <td className="py-4 pr-4 font-medium text-gray-900">
                                                {service.name}
                                            </td>
                                            <td className="py-4 pr-4 text-gray-700">
                                                <a
                                                    href={service.policy}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-teal-700 underline underline-offset-4 hover:text-teal-500"
                                                >
                                                    {service.provider}
                                                </a>
                                            </td>
                                            <td className="py-4 pr-4 leading-relaxed text-gray-700">
                                                {service.data}
                                            </td>
                                            <td className="py-4 leading-relaxed text-gray-700">
                                                {service.purpose}
                                                {service.optOut && (
                                                    <>
                                                        <br />
                                                        <a
                                                            href={service.optOut}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-teal-700 underline underline-offset-4 hover:text-teal-500"
                                                        >
                                                            送信を停止する
                                                        </a>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-6">
                            ブラウザの設定でCookieを無効にすることでも、これらの情報送信を制限できます。
                            ただし、一部の機能が正しく動作しなくなる場合があります。
                        </p>
                    </Section>

                    <Section title="6. 安全管理措置">
                        <p>
                            当社は、個人情報の漏えい・滅失・毀損を防ぐため、
                            取扱担当者の限定、業務上必要な範囲でのアクセス制限、
                            通信の暗号化（HTTPS）などの措置を講じます。
                        </p>
                    </Section>

                    <Section title="7. 開示・訂正・削除のご請求">
                        <p>
                            ご本人から、保有する個人情報の開示、訂正、追加、削除、利用停止、
                            第三者提供の停止をご請求いただいた場合、
                            ご本人であることを確認のうえ、法令に従い遅滞なく対応します。
                            下記の窓口までご連絡ください。
                        </p>
                    </Section>

                    <Section title="8. お問い合わせ窓口">
                        <dl className="border-t border-gray-200 text-[15px]">
                            <Row term="窓口">株式会社港南自動車サービス 個人情報お問い合わせ窓口</Row>
                            <Row term="電話">
                                <a
                                    href="tel:076-268-1788"
                                    className="u-num text-teal-700 underline underline-offset-4 hover:text-teal-500"
                                >
                                    076-268-1788
                                </a>
                                <span className="ml-3 text-sm text-gray-500">
                                    平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                                </span>
                            </Row>
                            <Row term="メール">info@kounan-auto.jp</Row>
                        </dl>
                    </Section>

                    <Section title="9. 本ポリシーの改定">
                        <p>
                            当社は、法令の変更やサービス内容の見直しに応じて、
                            本ポリシーを改定することがあります。
                            改定した場合は、本ページに掲載した時点から効力を生じるものとします。
                        </p>
                    </Section>
                </div>

                <p className="mt-14 max-w-3xl text-sm text-gray-500">最終改定日：{LAST_UPDATED}</p>

                <div className="mt-12">
                    <Link
                        href="/"
                        className="inline-flex h-12 items-center rounded-xl border border-gray-300 px-6 text-sm font-bold text-gray-900 transition-colors hover:border-teal-700 hover:text-teal-700"
                    >
                        トップページへ戻る
                    </Link>
                </div>
            </main>

            <footer className="border-t border-gray-200 bg-gray-900 py-10 text-white">
                <div className="container flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-white/50">
                        &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights
                        Reserved.
                    </p>
                    <p className="u-label text-white/60">Kohnan Auto Service ／ Kanazawa</p>
                </div>
            </footer>
        </div>
    );
}

// 見出し + 本文のまとまり
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900 md:text-xl">
                {title}
            </h2>
            <div className="mt-6 text-[15px] leading-loose text-gray-700">{children}</div>
        </section>
    );
}

// 定義リストの1行
function Row({ term, children }: { term: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 border-b border-gray-200 py-4 sm:flex-row sm:gap-6">
            <dt className="shrink-0 text-xs font-bold text-teal-700 sm:w-28 sm:pt-1">{term}</dt>
            <dd className="text-gray-900">{children}</dd>
        </div>
    );
}

// 箇条書きの1項目
function Item({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex gap-3">
            <span
                aria-hidden="true"
                className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-teal-700"
            />
            <span>{children}</span>
        </li>
    );
}
