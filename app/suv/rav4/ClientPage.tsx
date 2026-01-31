'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    const basePrice = 49000; // 基本月額料金

    const colors: ColorOption[] = useMemo(() => [
        { name: 'スーパーホワイトⅡ', price: 0, colorCode: '#FFFFFF' },
        { name: 'アティチュードブラックマイカ', price: 0, colorCode: '#000000' },
        { name: 'グレーメタリック', price: 900, colorCode: '#6B7280' },
        { name: 'アティチュードブラックマイカ×アーバンカーキ', price: 3200, colorCode: '#4A5D23' },
    ], []);

    const options: VehicleOption[] = useMemo(() => [
        { name: 'フロアマット（デラックスタイプ）', price: 0, isDefault: true, category: 'インテリア' },
        { name: 'ハンズフリーパワーバックドア（挟み込み防止機能・停止位置メモリー機能付）', price: 0, isDefault: true, category: 'エクステリア' },
        { name: 'パノラミックビューモニター（床下透過表示機能付）', price: 2500, isDefault: false, category: 'ナビ・電装' },
        { name: 'スペアタイヤ（応急用）　T165/80D17', price: 400, isDefault: false, category: 'エクステリア' },
        { name: 'デジタルインナーミラー（前後方録画機能付）', price: 0, isDefault: true, category: 'ナビ・電装' },
        { name: 'アクセサリーコンセント（ラゲージ）　AC100V・100W', price: 300, isDefault: false, category: 'ナビ・電装' },
        { name: 'スタッドレスタイヤ', price: 5200, category: 'タイヤ・ホイール' },
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <Link href="/noreta" className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-4 group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        ノレタ一覧に戻る
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-teal-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    NoReTa
                                </span>
                                <span className="text-slate-400 text-sm">
                                    港南自動車オリジナルサービス
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                                トヨタ RAV4
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium">
                                グレード: Adventure OFFROAD package Ⅱ
                            </span>
                            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium">
                                駆動方式: 4WD
                            </span>
                            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium">
                                排気量: 2,000cc
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
                                src="/cars/rav4.jpg"
                                alt="トヨタ RAV4"
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        </div>

                        {/* Color Selection - Large Swatches */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                <span className="w-1 h-6 bg-teal-500 rounded-full mr-3"></span>
                                ボディカラー
                            </h2>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`group flex flex-col items-center transition-all duration-300 ${selectedColor === color.name ? 'scale-105' : 'hover:scale-105'
                                            }`}
                                    >
                                        <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300 ${selectedColor === color.name
                                            ? 'ring-4 ring-teal-500 ring-offset-4'
                                            : 'ring-2 ring-slate-200 hover:ring-slate-300'
                                            }`}>
                                            <div
                                                className="absolute inset-1 rounded-full shadow-inner"
                                                style={{ backgroundColor: color.colorCode }}
                                            ></div>
                                            {color.colorCode === '#FFFFFF' && (
                                                <div className="absolute inset-1 rounded-full border border-slate-200"></div>
                                            )}
                                        </div>
                                        <span className={`mt-3 text-sm font-medium text-center leading-tight ${selectedColor === color.name ? 'text-teal-600' : 'text-slate-600'
                                            }`}>
                                            {color.name}
                                        </span>
                                        <span className={`text-xs mt-1 ${selectedColor === color.name ? 'text-teal-500' : 'text-slate-400'
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
                                    <span className="w-1 h-6 bg-teal-500 rounded-full mr-3"></span>
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
                                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left ${isChecked
                                                    ? 'border-teal-500 bg-teal-50 shadow-md'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isChecked
                                                    ? 'bg-teal-500 text-white'
                                                    : 'bg-slate-100 text-transparent'
                                                    }`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-bold ${isChecked ? 'text-teal-700' : 'text-slate-700'}`}>
                                                            {option.name}
                                                        </span>
                                                        {isDefault && (
                                                            <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                                                                標準装備
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`text-right font-bold ${isChecked ? 'text-teal-600' : 'text-slate-500'}`}>
                                                    {option.price > 0 ? `+${option.price.toLocaleString()}円/月` : '無料'}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Price Summary Card */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-8 shadow-2xl">
                            <div className="text-center">
                                <p className="text-slate-400 text-sm mb-2">月々のお支払い</p>
                                <div className="text-5xl md:text-6xl font-black mb-2">
                                    <span className="text-teal-400">{calculateTotalPrice().toLocaleString()}</span>
                                    <span className="text-2xl ml-1">円</span>
                                </div>
                                <p className="text-slate-400 text-sm">税込・頭金なし・ボーナス払いなし</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: '頭金', value: '無し', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { label: 'ボーナス', value: '無し', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { label: '車検', value: '不要', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                        { label: 'オイルメンテ', value: '港南負担', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                        { label: '1年間', value: '傷保証', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                    ].map((feature, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow text-center">
                            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                </svg>
                            </div>
                            <p className="text-sm text-slate-500 mb-1">{feature.label}</p>
                            <p className="text-lg font-bold text-teal-600">{feature.value}</p>
                        </div>
                    ))}
                </div>

                {/* Company Info */}
                <div className="mt-12 text-center text-sm text-slate-500 bg-white rounded-2xl p-6 shadow-lg">
                    <p className="font-bold text-slate-700 mb-2">株式会社港南自動車サービス</p>
                    <p>〒920-0336 石川県金沢市金石本町ハ14番地</p>
                    <p>TEL: 076-268-1788 / FAX: 076-268-3163</p>
                </div>
            </div>

            {/* Fixed Bottom Price Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl z-50 p-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="hidden sm:block">
                        <p className="font-bold text-slate-800">トヨタ RAV4</p>
                        <p className="text-xs text-slate-500">Adventure OFFROAD package Ⅱ・4WD・2,000cc</p>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                            <p className="text-xs text-slate-500">月々のお支払い</p>
                            <p className="text-2xl md:text-3xl font-black text-teal-600">
                                {calculateTotalPrice().toLocaleString()}<span className="text-sm ml-1">円</span>
                            </p>
                        </div>
                        <Link
                            href="/#contact"
                            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all whitespace-nowrap"
                        >
                            お問い合わせ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
