import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * 新車の「3つの買い方」比較表。
 * 新車販売ページとカーローンページの両方から使うため、
 * 表の中身をここに一本化して記載の食い違いを防いでいます。
 *
 * 金利などの数値は lib/carPrices.ts の定数と一致させること。
 */

type MethodKey = 'cash' | 'loan' | 'lease';

// verdict は「どれを選ぶか」の判断。表のセルに長文を入れると読めないため、表の外に出している
const methods: {
    key: MethodKey;
    name: string;
    note: string;
    href?: string;
    verdict: string;
}[] = [
    {
        key: 'cash',
        name: '現金一括',
        note: 'まとまった資金で購入',
        verdict: '手元の資金に余裕があり、支払総額をいちばん抑えたい方に。',
    },
    {
        key: 'loan',
        name: 'カーローン「ノレタ」',
        note: '個人のお客様向け',
        href: '/noreta',
        verdict: '頭金を出さずに新車に乗りたい方、毎月の出費を一定にしたい方に。',
    },
    {
        key: 'lease',
        name: 'リース「ノリドク」',
        note: '法人・個人事業主向け',
        href: '/noridoku',
        verdict: 'リース料を経費として処理したい法人・個人事業主の方に。',
    },
];

const rows: { label: string; values: Record<MethodKey, string> }[] = [
    {
        label: '頭金',
        values: { cash: '車両価格の全額', loan: 'なし（0円）', lease: 'なし（0円）' },
    },
    {
        label: '月々の支払い',
        values: { cash: 'なし', loan: '定額 27,000円〜', lease: 'お見積り（定額）' },
    },
    {
        label: 'ボーナス払い',
        values: { cash: '—', loan: 'なし（任意で追加返済も可）', lease: 'なし' },
    },
    {
        label: '車検・メンテ費用',
        values: {
            cash: 'かかった都度お支払い',
            loan: '月々の定額に込み',
            lease: '月々のリース料に込み',
        },
    },
    {
        label: '金利・手数料',
        values: { cash: 'なし', loan: '実質年率 3.9%', lease: 'リース料に含む' },
    },
    {
        label: '契約期間',
        values: { cash: '—', loan: '3年（36回）が基本', lease: 'ご相談ください' },
    },
    {
        label: '車の所有',
        values: {
            cash: 'ご購入時からお客様',
            loan: '完済後はお客様のもの',
            lease: '契約期間中はリース会社',
        },
    },
];

export default function PurchaseMethodTable() {
    return (
        <div>
            {/* 横に3列並ぶため、狭い画面では表だけを横スクロールさせる */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[42rem] overflow-hidden rounded-2xl border border-gray-200 bg-white text-left">
                    <caption className="sr-only">
                        現金一括・カーローン「ノレタ」・リース「ノリドク」の比較
                    </caption>
                    <thead>
                        <tr className="border-b border-gray-200 bg-white">
                            <th scope="col" className="u-label w-32 px-5 py-4">
                                比較項目
                            </th>
                            {methods.map((m) => (
                                <th
                                    key={m.key}
                                    scope="col"
                                    className={cn('px-5 py-4 align-top', m.key === 'loan' && 'bg-mint-50')}
                                >
                                    <span className="block text-[15px] font-bold text-gray-900">
                                        {m.href ? (
                                            <Link
                                                href={m.href}
                                                className="underline underline-offset-4 transition-colors hover:text-teal-700"
                                            >
                                                {m.name}
                                            </Link>
                                        ) : (
                                            m.name
                                        )}
                                    </span>
                                    <span className="mt-1 block text-[11px] font-normal text-gray-500">
                                        {m.note}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.label} className="border-t border-gray-200">
                                <th
                                    scope="row"
                                    className="px-5 py-4 text-left align-top text-sm font-bold text-gray-900"
                                >
                                    {row.label}
                                </th>
                                {methods.map((m) => (
                                    <td
                                        key={m.key}
                                        className={cn(
                                            'px-5 py-4 align-top text-sm leading-relaxed text-pretty text-gray-600',
                                            m.key === 'loan' && 'bg-mint-50'
                                        )}
                                    >
                                        {row.values[m.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 判断の一文。表の列と同じ並び順にして、どの方式の話か迷わないようにする */}
            <div className="mt-5 grid gap-3 md:grid-cols-3">
                {methods.map((m) => (
                    <p
                        key={m.key}
                        className={cn(
                            'rounded-xl border p-5 text-sm leading-relaxed text-pretty',
                            m.key === 'loan'
                                ? 'border-mint-300 bg-mint-50 text-gray-900'
                                : 'border-gray-200 bg-white text-gray-600'
                        )}
                    >
                        <b className="mb-1 block font-bold text-gray-900">{m.name}</b>
                        {m.verdict}
                    </p>
                ))}
            </div>

            <p className="mt-5 max-w-2xl text-pretty text-xs leading-loose text-gray-500">
                ※月々の金額は車種・グレード・オプションによって変わります。ノレタは実質年率3.9%の自由返済型カーローンで、残価設定型ローンではありません。ノリドク（リース）は法人・個人事業主のお客様向けのサービスです。詳しい条件はお見積り時にご説明します。
            </p>
        </div>
    );
}
