'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';

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
    const basePrice = 80500;

    const colors: ColorOption[] = [
        { name: 'アティチュードブラックマイカ', price: 0, colorCode: '#000000' },
        { name: 'プレシャスホワイトパール', price: 1100, colorCode: '#F5F5F5' },
        { name: 'プレシャスシルバー', price: 0, colorCode: '#C0C0C0' },
        { name: 'エモーショナルレッドⅢ', price: 1100, colorCode: '#8B0000' },
    ];

    const options: VehicleOption[] = [
        { name: 'フロアマット', price: 0, isDefault: true, category: 'インテリア' },
        {
            name: 'ディスプレイオーディオPlus',
            price: 0,
            isDefault: true,
            category: 'ナビ・電装',
        },
        { name: 'パノラミックビューモニター', price: 0, isDefault: true, category: 'ナビ・電装' },
        { name: 'デジタルインナーミラー', price: 0, isDefault: true, category: 'ナビ・電装' },
        { name: 'ハンズフリーパワーバックドア', price: 2750, category: 'エクステリア' },
        { name: 'パワートランクリッド', price: 3300, category: 'エクステリア' },
        { name: 'デジタルキー', price: 1100, category: 'セキュリティ' },
        { name: 'プレミアムサウンドシステム', price: 4400, category: 'ナビ・電装' },
        { name: '寒冷地仕様', price: 600, category: 'その他' },
        {
            name: 'スタッドレスタイヤ',
            price: 6800,
            category: 'タイヤ・ホイール',
            incompatibleWith: ['オールシーズンタイヤ'],
        },
        {
            name: 'オールシーズンタイヤ',
            price: 5500,
            category: 'タイヤ・ホイール',
            incompatibleWith: ['スタッドレスタイヤ'],
        },
    ];

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
            const option = options.find((opt) => opt.name === optionName);
            if (option && option.incompatibleWith) {
                const compatibleOptions = selectedOptions.filter(
                    (name) => !option.incompatibleWith?.includes(name),
                );
                setSelectedOptions([...compatibleOptions, optionName]);
            } else {
                setSelectedOptions([...selectedOptions, optionName]);
            }
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
    }, []);

    const selectedColorCode = useMemo(() => {
        return colors.find((c) => c.name === selectedColor)?.colorCode || colors[0].colorCode;
    }, [selectedColor]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-oid="u9b.g5p">
            <div
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 border border-gray-300"
                data-oid="zvhrmls"
            >
                <div className="mb-8 border-b border-gray-300 pb-4" data-oid="p2xydp1">
                    <div
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
                        data-oid="x2cfzfn"
                    >
                        <h1
                            className="text-3xl md:text-4xl font-bold text-gray-900"
                            data-oid="hy1tpf7"
                        >
                            トヨタ クラウン
                        </h1>
                        <div
                            className="flex flex-wrap gap-6 text-base md:text-lg font-medium"
                            data-oid="msh19uy"
                        >
                            <span
                                className="bg-white border border-gray-300 px-3 py-1 rounded-xl text-gray-700 shadow-sm"
                                data-oid="82j47w-"
                            >
                                グレード: CROSSOVER RS
                            </span>
                            <span
                                className="bg-white border border-gray-300 px-3 py-1 rounded-xl text-gray-700 shadow-sm"
                                data-oid="tpd9q24"
                            >
                                駆動方式: AWD
                            </span>
                            <span
                                className="bg-white border border-gray-300 px-3 py-1 rounded-xl text-gray-700 shadow-sm"
                                data-oid="4jx.s7z"
                            >
                                排気量: 2,400cc
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="5mf67_n">
                    <div
                        className="relative aspect-auto min-h-[350px] md:min-h-[450px] rounded-2xl overflow-hidden shadow-sm"
                        data-oid="yc6a7kg"
                    >
                        <Image
                            src="/cars/crown.jpg"
                            alt="トヨタ クラウン"
                            fill
                            className="object-contain hover:scale-105 transition-transform duration-200"
                            data-oid="zd.g1d4"
                        />
                    </div>

                    <div
                        className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm"
                        data-oid="avy70lv"
                    >
                        <div className="mb-8" data-oid="n.zdc4x">
                            <h2
                                className="text-xl md:text-2xl font-bold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="uhyhywx"
                            >
                                ボディカラー
                            </h2>
                            <div className="space-y-4" data-oid="q8ljocr">
                                {colors.map((color) => (
                                    <label
                                        key={color.name}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border ${
                                            selectedColor === color.name
                                                ? 'border-blue-500 bg-white shadow-md'
                                                : 'border-gray-300 bg-white'
                                        } hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer`}
                                        data-oid="54lwch8"
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            checked={selectedColor === color.name}
                                            onChange={() => setSelectedColor(color.name)}
                                            className="w-5 h-5 accent-blue-600"
                                            data-oid="yryjx3z"
                                        />

                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: color.colorCode }}
                                            data-oid="lhmevcg"
                                        ></div>
                                        <span
                                            className="font-medium text-gray-900"
                                            data-oid=":fif1hv"
                                        >
                                            {color.name}
                                        </span>
                                        {color.price > 0 && (
                                            <span
                                                className="ml-auto text-gray-700 font-medium"
                                                data-oid="056az87"
                                            >
                                                カラーオプション: {color.price.toLocaleString()}円
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div data-oid="fbxlhyc">
                            <h2
                                className="text-xl md:text-2xl font-bold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="tfqlcbi"
                            >
                                オプション選択
                            </h2>
                            {Object.entries(optionsByCategory).map(
                                ([category, categoryOptions]) => (
                                    <div key={category} className="mb-6" data-oid=".2_5806">
                                        <h3
                                            className="font-medium text-sm text-gray-600 mb-2"
                                            data-oid="u9_nq1r"
                                        >
                                            {category}
                                        </h3>
                                        <div className="space-y-2" data-oid="ng5x55u">
                                            {categoryOptions.map((option) => {
                                                const isChecked = selectedOptions.includes(
                                                    option.name,
                                                );
                                                const isDisabled = option.incompatibleWith?.some(
                                                    (incompOpt) =>
                                                        selectedOptions.includes(incompOpt) &&
                                                        !isChecked,
                                                );

                                                return (
                                                    <label
                                                        key={option.name}
                                                        className={`flex items-center gap-3 p-3 rounded-2xl border ${
                                                            isChecked
                                                                ? 'border-blue-500 bg-white shadow-md'
                                                                : 'border-gray-300 bg-white'
                                                        } ${
                                                            isDisabled
                                                                ? 'opacity-50 cursor-not-allowed'
                                                                : 'hover:border-blue-300 hover:shadow-sm cursor-pointer'
                                                        } transition-all duration-200`}
                                                        data-oid="nyc_tcg"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() =>
                                                                !isDisabled &&
                                                                toggleOption(option.name)
                                                            }
                                                            disabled={isDisabled}
                                                            className="w-5 h-5 accent-blue-600"
                                                            data-oid="6ci65x2"
                                                        />

                                                        <div className="flex-1" data-oid="x-wq8fc">
                                                            <div
                                                                className="font-medium text-gray-900"
                                                                data-oid="bjzx-vb"
                                                            >
                                                                {option.name}
                                                                {option.isDefault && (
                                                                    <span
                                                                        className="ml-2 text-xs font-normal text-blue-600 bg-white border border-blue-300 px-2 py-0.5 rounded"
                                                                        data-oid="3rk3pfh"
                                                                    >
                                                                        標準装備
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {option.incompatibleWith &&
                                                                option.incompatibleWith.length >
                                                                    0 && (
                                                                    <div
                                                                        className="text-xs text-gray-600 mt-1"
                                                                        data-oid="vc5iiat"
                                                                    >
                                                                        ※他のオプションとの同時装着はできません
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <span
                                                            className="text-gray-700 font-medium whitespace-nowrap"
                                                            data-oid="4f4jpfb"
                                                        >
                                                            {option.price.toLocaleString()}円
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className="mt-12 bg-white rounded-2xl p-6 border border-gray-300 shadow-sm"
                    data-oid="cavqcde"
                >
                    <div
                        className="flex flex-col md:flex-row md:items-end justify-center gap-4 mb-8"
                        data-oid="a867izx"
                    >
                        <div className="text-center md:text-right" data-oid="gcph4fo">
                            <div className="text-sm text-gray-600 mb-1" data-oid="v7xp2hy">
                                合計金額
                            </div>
                            <div
                                className="text-4xl md:text-5xl font-bold text-blue-600"
                                data-oid="o:ofhlk"
                            >
                                {calculateTotalPrice().toLocaleString()}円
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8" data-oid="5i6jhoq">
                        <button
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                            data-oid="uaa1hmw"
                        >
                            お問い合わせはコチラ
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-oid="baw62rc">
                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="2qowvd1"
                        >
                            <div className="flex flex-col items-center" data-oid="rwaf-gm">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="oj.4t16"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="y-lf9a0"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="4o0hqw3"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="bim7d_t"
                                >
                                    頭金
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="cxdl1qx">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="1.xmp8g"
                        >
                            <div className="flex flex-col items-center" data-oid="rz6ow9o">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="qp9jf55"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="vsk2o5o"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="fvwht1:"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="t3.8pm8"
                                >
                                    ボーナス
                                </div>
                                <div className="text-teal-600 font-bold" data-oid="c1icr9f">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border-2 border-teal-500 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200"
                            data-oid="-sbqrtp"
                        >
                            <div className="flex flex-col items-center" data-oid="uw3be2b">
                                <div
                                    className="w-12 h-12 bg-white border border-teal-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="-j5ehpt"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-teal-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="1-pdnoz"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid=".ut-.17"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="m4kft1i"
                                >
                                    車検
                                </div>
                                <div className="text-teal-600 font-bold" data-oid=".vqrb:u">
                                    不要
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border-2 border-teal-500 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200"
                            data-oid="27_0s5o"
                        >
                            <div className="flex flex-col items-center" data-oid="y898wmu">
                                <div
                                    className="w-12 h-12 bg-white border border-teal-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="jlu3e6i"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-teal-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="k0-31uw"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                            data-oid="21ztdg9"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="py56j.:"
                                >
                                    オイルメンテ
                                </div>
                                <div className="text-teal-600 font-bold" data-oid="jptl-b8">
                                    港南負担
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border-2 border-teal-500 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200"
                            data-oid="c_qqnm."
                        >
                            <div className="flex flex-col items-center" data-oid="vz_w8sv">
                                <div
                                    className="w-12 h-12 bg-white border border-teal-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="dhyd6:s"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-teal-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="710u5wp"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            data-oid="k7-nx_x"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="bk8rl6l"
                                >
                                    1年間
                                </div>
                                <div className="text-teal-600 font-bold" data-oid="8:fgkrb">
                                    傷保証
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
