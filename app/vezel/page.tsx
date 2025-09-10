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
    const basePrice = 45000;
    const loanTermMonths = 36;

    const colors: ColorOption[] = [
        { name: 'クリスタルブラック・パール', price: 0, colorCode: '#000000' },
        { name: 'プラチナホワイトパール', price: 1100, colorCode: '#F5F5F5' },
        { name: 'プレミアムサンライトホワイトパール', price: 1700, colorCode: '#FFE4B5' },
    ];

    const options: VehicleOption[] = [
        { name: 'フロアマット', price: 0, isDefault: true, category: 'インテリア' },
        { name: 'Honda CONNECT for Gathers', price: 0, isDefault: true, category: 'ナビ・電装' },
        { name: 'スタッドレスタイヤ', price: 6050, category: 'タイヤ・ホイール' },
    ];

    const [selectedColor, setSelectedColor] = useState<string>(colors[0].name);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(
        options.filter((opt) => opt.isDefault).map((opt) => opt.name),
    );

    const calculateTotalPrice = () => {
        let total = basePrice;

        const colorPrice = colors.find((c) => c.name === selectedColor)?.price || 0;
        total += colorPrice;

        selectedOptions.forEach((optName) => {
            const option = options.find((opt) => opt.name === optName);
            if (option) {
                total += option.price;
            }
        });

        return Math.round(total);
    };

    const totalCost = useMemo(() => {
        return calculateTotalPrice() * loanTermMonths;
    }, [selectedColor, selectedOptions]);

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
        <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-oid="q24x:m0">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6" data-oid="yhsbaxx">
                <div className="mb-8 border-b pb-4" data-oid="re_xtec">
                    <div
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
                        data-oid="-uqgm2r"
                    >
                        <h1
                            className="text-3xl md:text-4xl font-bold text-gray-800"
                            data-oid="4d.7tiw"
                        >
                            ホンダ VEZEL
                        </h1>
                        <div
                            className="flex flex-wrap gap-6 text-base md:text-lg font-medium"
                            data-oid=".h7xi_w"
                        >
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="ayhj:lp"
                            >
                                グレード: e:HEV Z
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="q2x.atp"
                            >
                                駆動方式: 2WD
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="9ynbjkf"
                            >
                                排気量: 1,500cc
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="m6asm95">
                    <div
                        className="relative aspect-auto min-h-[350px] md:min-h-[450px] rounded-lg overflow-hidden"
                        data-oid="74rjl32"
                    >
                        <Image
                            src="/cars/vezel.jpg"
                            alt="ホンダ VEZEL"
                            fill
                            className="object-contain hover:scale-105 transition-transform duration-300"
                            data-oid="m8rtlmd"
                        />
                    </div>

                    <div
                        className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                        data-oid="5bi8_wu"
                    >
                        <div className="mb-8" data-oid="k7mq62k">
                            <h2
                                className="text-xl md:text-2xl font-bold mb-4 text-gray-800 border-b pb-2"
                                data-oid="ww1x2xg"
                            >
                                ボディカラー
                            </h2>
                            <div className="space-y-4" data-oid=":dtmov:">
                                {colors.map((color) => (
                                    <label
                                        key={color.name}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                            selectedColor === color.name
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200'
                                        } hover:border-blue-300 transition-colors cursor-pointer`}
                                        data-oid="3e-lcqj"
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            checked={selectedColor === color.name}
                                            onChange={() => setSelectedColor(color.name)}
                                            className="w-5 h-5 accent-blue-600"
                                            data-oid="ikg3nqn"
                                        />

                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: color.colorCode }}
                                            data-oid="z..bsy9"
                                        ></div>
                                        <span
                                            className="font-medium text-gray-800"
                                            data-oid="05jixe1"
                                        >
                                            {color.name}
                                        </span>
                                        {color.price > 0 && (
                                            <span
                                                className="ml-auto text-gray-700 font-medium"
                                                data-oid="g5b-d6i"
                                            >
                                                カラーオプション: {color.price.toLocaleString()}円
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div data-oid=".75ldoy">
                            <h2
                                className="text-xl md:text-2xl font-bold mb-4 text-gray-800 border-b pb-2"
                                data-oid="p:ql:3h"
                            >
                                オプション選択
                            </h2>
                            {Object.entries(optionsByCategory).map(
                                ([category, categoryOptions]) => (
                                    <div key={category} className="mb-6" data-oid="-f.6ptf">
                                        <h3
                                            className="font-medium text-sm text-gray-500 mb-2"
                                            data-oid="7_54e9p"
                                        >
                                            {category}
                                        </h3>
                                        <div className="space-y-2" data-oid="b1k0t95">
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
                                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                                            isChecked
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-200'
                                                        } ${
                                                            isDisabled
                                                                ? 'opacity-50 cursor-not-allowed'
                                                                : 'hover:border-blue-300 cursor-pointer'
                                                        } transition-colors`}
                                                        data-oid="3tr9ld0"
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
                                                            data-oid="urglapf"
                                                        />

                                                        <div className="flex-1" data-oid="z34.ab0">
                                                            <div
                                                                className="font-medium text-gray-800"
                                                                data-oid="50j6ec9"
                                                            >
                                                                {option.name}
                                                                {option.isDefault && (
                                                                    <span
                                                                        className="ml-2 text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded"
                                                                        data-oid="eu_77dw"
                                                                    >
                                                                        標準装備
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {option.incompatibleWith &&
                                                                option.incompatibleWith.length >
                                                                    0 && (
                                                                    <div
                                                                        className="text-xs text-gray-500 mt-1"
                                                                        data-oid="ra8996u"
                                                                    >
                                                                        ※他のオプションとの同時装着はできません
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <span
                                                            className="text-gray-700 font-medium whitespace-nowrap"
                                                            data-oid="lmhejiq"
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
                    className="mt-12 bg-gray-100 rounded-lg p-6 border border-gray-200"
                    data-oid="tb:ssc1"
                >
                    <div
                        className="flex flex-col md:flex-row md:items-end justify-center gap-4 mb-8"
                        data-oid="6twss_y"
                    >
                        <div className="text-center md:text-right" data-oid="1cs7_m.">
                            <div className="text-sm text-gray-500 mb-1" data-oid="6dbqy48">
                                お支払い
                            </div>
                            <div
                                className="text-4xl md:text-5xl font-bold text-blue-600"
                                data-oid="wwh0dtk"
                            >
                                月々 {calculateTotalPrice().toLocaleString()}円
                            </div>
                            <div className="text-sm text-gray-500 mt-1" data-oid="3p.iv.:">
                                （{loanTermMonths}回払い / 総額 {totalCost.toLocaleString()}円）
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8" data-oid="e1dc:z:">
                        <button
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-medium hover:bg-blue-700 transition-colors shadow-md"
                            data-oid="_uftgjh"
                        >
                            お問い合わせはコチラ
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-oid="h-c:_yb">
                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid="s91xf2c"
                        >
                            <div className="flex flex-col items-center" data-oid="2ovkhqx">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="f8diob4"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="h752sgv"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="khoovkd"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="herhqfe"
                                >
                                    頭金
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="wanyk:t">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid="0nnnvzc"
                        >
                            <div className="flex flex-col items-center" data-oid="zl6vyy8">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="9rks4ki"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="-x.wa3b"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="_wj6odd"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="srqbe8-"
                                >
                                    ボーナス
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="2:xu2w:">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid="-xmuw6s"
                        >
                            <div className="flex flex-col items-center" data-oid="x:ez5sc">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="-xdukmj"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="ylg6at."
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="2i4wfow"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="wfqbvz:"
                                >
                                    車検
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="b43x2-h">
                                    不要
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid="rbj9rev"
                        >
                            <div className="flex flex-col items-center" data-oid="clli_l9">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="ku9b_7."
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="qlpcr-y"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                            data-oid="xod6ql8"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="p0.k8-0"
                                >
                                    オイルメンテ
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="ioa48hs">
                                    港南負担
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid="lcfxyc1"
                        >
                            <div className="flex flex-col items-center" data-oid="ynhwmpr">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="go2rut2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="wmp21gs"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            data-oid="l7my2:p"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="9vnp1d."
                                >
                                    1年間
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="uip9wi4">
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


