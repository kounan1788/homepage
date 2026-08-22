'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { carBasePrices } from '@/lib/carPrices';
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
    const basePrice = carBasePrices['/kcar/nbox'];

    const colors: ColorOption[] = useMemo(() => [
        { name: 'クリスタルブラックパール', price: 0, colorCode: '#1a1a1a' },
        { name: 'プラチナホワイトパール', price: 0, colorCode: '#f8f8f8' },
    ], []);

    const options: VehicleOption[] = useMemo(() => [
        { name: 'フロアマット', price: 0, isDefault: true, category: 'インテリア' },
        { name: 'ワイドバイザー', price: 0, isDefault: true, category: 'エクステリア' },
        { name: '8インチフルセグナビ', price: 3700, category: 'ナビ・電装' },
        { name: 'メーカーオプションセット', price: 3900, category: 'セット' },
        { name: 'スタッドレスタイヤ', price: 3000, category: 'タイヤ・ホイール' },
    ], []);

    const [selectedColor, setSelectedColor] = useState<string>(colors[0].name);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(
        options.filter((opt) => opt.isDefault).map((opt) => opt.name),
    );

    const calculateTotalPrice = () => {
        let total = basePrice;

        const selectedColorOption = colors.find((color) => color.name === selectedColor);
        if (selectedColorOption) {
            total += selectedColorOption.price;
        }

        selectedOptions.forEach((optName) => {
            const option = options.find((opt) => opt.name === optName);
            if (option) {
                total += option.price;
            }
        });

        return Math.round(total);
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
                '車種: ホンダ N-BOX（カスタム・2WD・660cc）',
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

    const selectedColorCode = useMemo(() => {
        return colors.find((c) => c.name === selectedColor)?.colorCode || colors[0].colorCode;
    }, [selectedColor, colors]);

    return (
        <div className="min-h-dvh bg-gray-50">
            {/* Hero Header */}
            <div className="bg-gray-900 text-white py-8 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* パンくずリスト（構造化データは page.tsx 側で出力済み） */}
                    <nav aria-label="パンくずリスト" className="mb-3">
                        <ol className="flex flex-wrap items-center text-xs text-slate-500">
                            <li><Link href="/" className="hover:text-white transition-colors">ホーム</Link></li>
                            <li className="mx-2">›</li>
                            <li><Link href="/noreta" className="hover:text-white transition-colors">カーローン ノレタ</Link></li>
                            <li className="mx-2">›</li>
                            <li className="text-slate-200">ホンダ N-BOX カスタム</li>
                        </ol>
                    </nav>                    <Link href="/noreta" className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-4 group">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        ノレタ一覧に戻る
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-teal-700 text-white text-xs font-bold px-3 py-1 rounded">
                                    NoReTa
                                </span>
                                <span className="text-slate-500 text-sm">
                                    月々定額・頭金なしで新車に乗れるカーローン
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-ja">
                                ホンダ N-BOX
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="border border-white/25 px-4 py-2 rounded text-sm">
                                グレード: カスタム
                            </span>
                            <span className="border border-white/25 px-4 py-2 rounded text-sm">
                                駆動方式: 2WD
                            </span>
                            <span className="border border-white/25 px-4 py-2 rounded text-sm">
                                排気量: 660cc
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Car Image Section */}
                    <div className="space-y-6">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-2xl">
                            <Image
                                src="/cars/nbox.jpg"
                                alt="ホンダ N-BOX"
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        </div>

                        {/* Color Selection - Large Swatches */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                <span className="w-1 h-5 bg-teal-700 mr-3"></span>
                                ボディカラー
                            </h2>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`group flex flex-col items-center transition-ui duration-200 ${selectedColor === color.name ? '' : ''
                                            }`}
                                    >
                                        <div className={`relative size-16 md:size-20 rounded-full transition-ui duration-200 ${selectedColor === color.name
                                            ? 'ring-2 ring-teal-700 ring-offset-2'
                                            : 'ring-2 ring-slate-200 hover:ring-slate-300'
                                            }`}>
                                            <div
                                                className="absolute inset-1 rounded-full shadow-inner"
                                                style={{ backgroundColor: color.colorCode }}
                                            ></div>
                                            {(color.colorCode === '#FFFFFF' || color.colorCode === '#F5F5F5' || color.colorCode === '#f8f8f8') && (
                                                <div className="absolute inset-1 rounded-full border border-slate-200"></div>
                                            )}
                                        </div>
                                        <span className={`mt-3 text-sm font-medium text-center leading-tight ${selectedColor === color.name ? 'text-teal-700' : 'text-slate-600'
                                            }`}>
                                            {color.name}
                                        </span>
                                        <span className={`text-xs mt-1 ${selectedColor === color.name ? 'text-teal-500' : 'text-slate-500'
                                            }`}>
                                            {color.price > 0 ? `+${color.price.toLocaleString()}円/月` : '標準'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Options Section - Card Style */}
                    <div className="space-y-6">
                        {Object.entries(optionsByCategory).map(([category, categoryOptions]) => (
                            <div key={category} className="bg-white rounded-3xl p-6 shadow-xl">
                                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                    <span className="w-1 h-5 bg-teal-700 mr-3"></span>
                                    {category}
                                </h2>
                                <div className="space-y-3">
                                    {categoryOptions.map((option) => {
                                        const isChecked = selectedOptions.includes(option.name);
                                        const isDefault = option.isDefault;

                                        return (
                                            <button
                                                key={option.name}
                                                onClick={() => toggleOption(option.name)}
                                                className={`w-full flex items-center gap-4 p-4 rounded border transition-colors duration-200 text-left ${isChecked
                                                    ? 'border-teal-700 bg-teal-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-400'
                                                    }`}
                                            >
                                                <div className={`size-6 rounded border flex items-center justify-center transition-ui ${isChecked
                                                    ? 'border-teal-500 bg-teal-500'
                                                    : 'border-slate-300'
                                                    }`}>
                                                    {isChecked && (
                                                        <svg aria-hidden="true" className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-slate-800">
                                                        {option.name}
                                                    </div>
                                                    {isDefault && (
                                                        <span className="text-xs text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                                                            標準装備
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={`text-lg font-bold ${isChecked ? 'text-teal-700' : 'text-slate-500'}`}>
                                                    {option.price > 0 ? `+${option.price.toLocaleString()}円` : '¥0'}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Price Summary Card */}
                        <div className="bg-teal-800 rounded-3xl p-6 shadow-xl text-white">
                            <div className="text-center">
                                <div className="text-teal-100 text-sm mb-1">月々のお支払い</div>
                                <div className="text-5xl font-bold mb-4">
                                    ¥{calculateTotalPrice().toLocaleString()}
                                </div>
                                <Link
                                    href={contactUrl}
                                    className="block w-full rounded-2xl bg-white px-8 py-4 text-center font-bold text-teal-700 transition-[background-color,transform] duration-200 hover:bg-mint-50 active:scale-[0.98]"
                                >
                                    お問い合わせはコチラ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: '💰', label: '頭金', value: '無し' },
                        { icon: '🎁', label: 'ボーナス', value: '無し' },
                        { icon: '🔧', label: '車検', value: '不要' },
                        { icon: '🛡️', label: '1年間', value: '傷保証' },
                    ].map((feature, index) => (
                        <div key={index} className="bg-white rounded-2xl p-4 shadow-lg text-center hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-2">{feature.icon}</div>
                            <div className="text-xs text-slate-500 mb-1">{feature.label}</div>
                            <div className="font-bold text-teal-700">{feature.value}</div>
                        </div>
                    ))}
                </div>

                {/* Company Info */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    <p className="font-semibold">株式会社港南自動車サービス</p>
                    <p>〒920-0336 石川県金沢市金石本町ハ14番地</p>
                    <p>TEL: 076-268-1788 / FAX: 076-268-3163</p>
                </div>
            </div>

            {/* Fixed Bottom Price Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 z-40 pb-[env(safe-area-inset-bottom)]">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="hidden md:block">
                        <div className="text-slate-800 font-bold">ホンダ N-BOX</div>
                        <div className="text-slate-500 text-sm">カスタム・2WD・660cc</div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                            <div className="text-slate-500 text-xs">月々のお支払い</div>
                            <div className="text-2xl md:text-3xl font-bold text-teal-700">
                                ¥{calculateTotalPrice().toLocaleString()}
                            </div>
                        </div>
                        <Link
                            href={contactUrl}
                            className="rounded-xl bg-teal-700 px-6 py-3 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                        >
                            お問い合わせ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}