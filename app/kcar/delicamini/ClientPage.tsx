'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { carBasePrices, carLoanPrincipals } from '@/lib/carPrices';
import BonusPaymentSimulator from '@/components/BonusPaymentSimulator';
import { buildContactUrl } from '@/lib/contactHandoff';

interface ColorOption {
    name: string;
    price: number;
    colorCode: string;
}

interface VehicleOption {
    name: string;
    price: number;
    isDefault?: boolean;
    category?: string;
    incompatibleWith?: string[];
}

export default function Page() {
    const basePrice = carBasePrices['/kcar/delicamini'];

    const colors: ColorOption[] = useMemo(() => [
        { name: 'ブラックマイカ', price: 0, colorCode: '#1a1a1a' },
        { name: 'ホワイトパール', price: 0, colorCode: '#f8f8f8' },
        { name: 'アッシュグリーンメタリック×ブラックマイカ', price: 1650, colorCode: '#8fac8b' },
        { name: 'ナチュラルアイボリーメタリック×ブラックマイカ', price: 1650, colorCode: '#e5dcc6' },
        { name: 'ホワイトパール×ブラックマイカ', price: 1650, colorCode: '#f8f8f8' },
    ], []);

    const options: VehicleOption[] = useMemo(() => [
        { name: 'フロアマット', price: 0, isDefault: true, category: 'インテリア' },
        { name: 'サイドバイザー', price: 0, isDefault: true, category: 'エクステリア' },
        { name: '7インチフルセグナビ', price: 4800, isDefault: false, category: 'ナビ・電装' },
        { name: 'アダプティブLEDヘッドライト', price: 2400, isDefault: false, category: 'エクステリア' },
        { name: 'ルーフレール', price: 900, isDefault: false, category: 'エクステリア' },
        { name: '純正9インチナビ', price: 8600, isDefault: false, category: 'ナビ・電装' },
        { name: 'コネクトナビパッケージA(T Premium/G Premium用)', price: 12500, isDefault: false, category: 'ナビ・電装' },
        { name: 'スタッドレスタイヤ', price: 4000, isDefault: false, category: 'タイヤ・ホイール' },
    ], []);

    const [selectedColor, setSelectedColor] = useState<string>(colors[0].name);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(
        options.filter((opt) => opt.isDefault).map((opt) => opt.name),
    );

    const selectedColorOption = colors.find((color) => color.name === selectedColor);

    // 見積票の明細に並べる行（車両本体 → ボディカラー → 有料オプションの順）
    const quoteLines = useMemo(() => {
        const lines: { label: string; price: number }[] = [
            { label: '車両本体', price: basePrice },
        ];
        if (selectedColorOption && selectedColorOption.price > 0) {
            lines.push({ label: selectedColorOption.name, price: selectedColorOption.price });
        }
        selectedOptions.forEach((name) => {
            const option = options.find((opt) => opt.name === name);
            if (option && option.price > 0) {
                lines.push({ label: option.name, price: option.price });
            }
        });
        return lines;
    }, [basePrice, selectedColorOption, selectedOptions, options]);

    const calculateTotalPrice = () => {
        return Math.round(quoteLines.reduce((sum, line) => sum + line.price, 0));
    };

    // 選んだ構成を持ったまま相談へ進むためのURL（docs/blueprints/ux-lease-application.md）
    const contactUrl = (() => {
        const paidOptions = selectedOptions.filter((name) => {
            const opt = options.find((o) => o.name === name);
            return opt && !opt.isDefault;
        });
        return buildContactUrl({
            category: 'ノレタ',
            lines: [
                '車種: 三菱 デリカミニ（T Premium・2WD・660cc）',
                `ボディカラー: ${selectedColor}`,
                paidOptions.length > 0
                    ? `追加オプション: ${paidOptions.join('・')}`
                    : '追加オプション: なし（標準装備のみ）',
                `月々のお支払い（概算）: ${calculateTotalPrice().toLocaleString()}円`,
            ],
        });
    })();

    const toggleOption = (optionName: string) => {
        if (selectedOptions.includes(optionName)) {
            setSelectedOptions(selectedOptions.filter((name) => name !== optionName));
        } else {
            setSelectedOptions([...selectedOptions, optionName]);
        }
    };

    const optionsByCategory = useMemo(() => {
        const grouped: { [key: string]: VehicleOption[] } = {};

        options.forEach((option) => {
            const category = option.category || 'その他';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(option);
        });

        return grouped;
    }, [options]);

    return (
        <div className="min-h-dvh bg-paper">
            {/* 票の表題 */}
            <header className="bg-teal-900 text-white">
                <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
                    {/* パンくずリスト（構造化データは page.tsx 側で出力済み） */}
                    <nav aria-label="パンくずリスト" className="mb-4">
                        <ol className="flex flex-wrap items-center text-xs text-teal-200">
                            <li><Link href="/" className="hover:text-white transition-colors">ホーム</Link></li>
                            <li className="mx-2 text-teal-400">›</li>
                            <li><Link href="/noreta" className="hover:text-white transition-colors">カーローン ノレタ</Link></li>
                            <li className="mx-2 text-teal-400">›</li>
                            <li className="text-white">三菱 デリカミニ</li>
                        </ol>
                    </nav>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="u-label text-mint-300">ノレタ お見積り</span>
                            <h1 className="mt-2 text-3xl font-bold tracking-ja md:text-5xl">
                                三菱 デリカミニ
                            </h1>
                            <p className="mt-3 text-sm text-teal-100">
                                T Premium ／ 2WD ／ 660cc
                            </p>
                        </div>

                        <Link
                            href="/noreta"
                            className="group inline-flex items-center self-start text-sm text-teal-100 transition-colors hover:text-white md:self-auto"
                        >
                            <svg aria-hidden="true" className="mr-2 size-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            ほかの車種を見る
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 pb-32 pt-8 md:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* ── 左：車両・ボディカラー・ボーナス払い ── */}
                    <div className="space-y-6">
                        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-rule bg-white">
                            <Image
                                src="/cars/delicamini.jpg"
                                alt="三菱 デリカミニ"
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        </div>

                        {/* ボディカラー欄 */}
                        <section className="rounded-2xl border border-rule bg-white">
                            <h2 className="border-b border-rule px-5 py-3">
                                <span className="u-label">ボディカラー</span>
                            </h2>
                            <ul className="divide-y divide-rule">
                                {colors.map((color) => {
                                    const isSelected = selectedColor === color.name;
                                    return (
                                        <li key={color.name}>
                                            <button
                                                onClick={() => setSelectedColor(color.name)}
                                                aria-pressed={isSelected}
                                                className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-colors duration-150 ${isSelected ? 'bg-mint-50' : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span
                                                    className={`relative size-8 flex-shrink-0 rounded-full transition-ui duration-200 ${isSelected
                                                        ? 'ring-2 ring-teal-700 ring-offset-2'
                                                        : 'ring-1 ring-rule-strong'
                                                        }`}
                                                >
                                                    <span
                                                        className="absolute inset-[2px] rounded-full"
                                                        style={{ backgroundColor: color.colorCode }}
                                                    ></span>
                                                </span>

                                                <span className={`flex-1 text-sm leading-snug ${isSelected ? 'font-bold text-teal-800' : 'text-gray-800'}`}>
                                                    {color.name}
                                                </span>

                                                <span className={`u-num text-sm ${color.price > 0 ? 'text-gray-800' : 'text-gray-500'}`}>
                                                    {color.price > 0 ? `+${color.price.toLocaleString()}` : '±0'}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>

                        {/* ボーナス払いシミュレーター */}
                        <BonusPaymentSimulator principal={carLoanPrincipals['/kcar/delicamini']} />
                    </div>

                    {/* ── 右：オプション・見積明細 ── */}
                    <div className="space-y-6">
                        {/* オプション：種類ごとに小見出しを挟んだ1枚の表 */}
                        <section className="overflow-hidden rounded-2xl border border-rule bg-white">
                            <h2 className="border-b border-rule px-5 py-3">
                                <span className="u-label">オプション</span>
                            </h2>

                            {Object.entries(optionsByCategory).map(([category, categoryOptions]) => (
                                <div key={category}>
                                    <h3 className="border-b border-rule bg-gray-50 px-5 py-1.5 text-xs text-gray-600">
                                        {category}
                                    </h3>
                                    <ul className="divide-y divide-rule border-b border-rule last:border-b-0">
                                        {categoryOptions.map((option) => {
                                            const isChecked = selectedOptions.includes(option.name);

                                            return (
                                                <li key={option.name}>
                                                    <button
                                                        onClick={() => toggleOption(option.name)}
                                                        aria-pressed={isChecked}
                                                        className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-colors duration-150 ${isChecked ? 'bg-mint-50' : 'hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className={`flex size-5 flex-shrink-0 items-center justify-center rounded-sm border transition-ui ${isChecked
                                                            ? 'border-teal-700 bg-teal-700 text-white'
                                                            : 'border-rule-strong bg-white text-transparent'
                                                            }`}>
                                                            <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </span>

                                                        <span className="flex-1 text-sm leading-snug text-gray-800">
                                                            {option.name}
                                                            {option.isDefault && (
                                                                <span className="ml-2 whitespace-nowrap text-xs text-gray-500">標準装備</span>
                                                            )}
                                                        </span>

                                                        <span className={`u-num text-sm ${option.price > 0 ? 'text-gray-800' : 'text-gray-500'}`}>
                                                            {option.price > 0 ? `+${option.price.toLocaleString()}` : '±0'}
                                                        </span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        {/* 見積明細 */}
                        <section className="overflow-hidden rounded-2xl border border-teal-700 bg-white shadow-lg">
                            <h2 className="bg-teal-700 px-5 py-3">
                                <span className="u-label text-mint-200">月々のお支払い</span>
                            </h2>

                            <dl className="divide-y divide-rule px-5">
                                {quoteLines.map((line) => (
                                    <div key={line.label} className="flex items-baseline justify-between gap-4 py-2.5">
                                        <dt className="text-sm leading-snug text-gray-700">{line.label}</dt>
                                        <dd className="u-num whitespace-nowrap text-sm text-gray-800">
                                            {line.price.toLocaleString()}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <div className="border-t-2 border-teal-700 px-5 py-4">
                                <div className="flex items-baseline justify-between gap-4">
                                    <span className="text-sm font-bold text-gray-800">合計</span>
                                    <span className="u-num text-4xl font-bold text-teal-700">
                                        {calculateTotalPrice().toLocaleString()}
                                        <span className="ml-1 font-sans text-base font-normal text-gray-600">円/月</span>
                                    </span>
                                </div>
                                <p className="mt-1 text-right text-xs text-gray-500">税込・頭金なし</p>

                                <Link
                                    href={contactUrl}
                                    className="mt-5 block rounded-xl bg-teal-700 px-6 py-3.5 text-center font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.99]"
                                >
                                    この内容で相談する
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>

                {/* 契約に含まれるもの */}
                <section className="mt-10 rounded-2xl border border-rule bg-white">
                    <h2 className="border-b border-rule px-5 py-3">
                        <span className="u-label">すべての月額に含まれます</span>
                    </h2>
                    <dl className="grid grid-cols-2 sm:grid-cols-4">
                        {[
                            { label: '頭金', value: 'なし' },
                            { label: 'ボーナス払い', value: '任意' },
                            { label: '車検費用', value: '込み' },
                            { label: '傷の保証', value: '1年間' },
                        ].map((item, index) => (
                            <div
                                key={item.label}
                                className={`px-5 py-4 ${index > 0 ? 'border-l border-rule' : ''} ${index >= 2 ? 'border-t border-rule sm:border-t-0' : ''} ${index === 2 ? 'border-l-0 sm:border-l' : ''}`}
                            >
                                <dt className="text-xs text-gray-500">{item.label}</dt>
                                <dd className="mt-0.5 font-bold text-teal-700">{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <hr className="u-road my-10 border-0" />

                <div className="text-center text-sm leading-relaxed text-gray-500">
                    <p className="font-bold text-gray-700">株式会社港南自動車サービス</p>
                    <p>〒920-0336 石川県金沢市金石本町ハ14番地</p>
                    <p className="u-num">TEL 076-268-1788 ／ FAX 076-268-3163</p>
                </div>
            </div>

            {/* 画面下に留まる合計 */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-rule bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
                    <div className="hidden md:block">
                        <div className="font-bold text-gray-800">三菱 デリカミニ</div>
                        <div className="text-sm text-gray-500">T Premium ／ 2WD ／ 660cc</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
                        <div className="text-right">
                            <div className="text-xs text-gray-500">月々のお支払い</div>
                            <div className="u-num text-2xl font-bold text-teal-700 md:text-3xl">
                                {calculateTotalPrice().toLocaleString()}
                                <span className="ml-1 font-sans text-sm font-normal text-gray-600">円</span>
                            </div>
                        </div>
                        <Link
                            href={contactUrl}
                            className="rounded-xl bg-teal-700 px-6 py-3 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                        >
                            相談する
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
