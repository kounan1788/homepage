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
    const basePrice = 62000;
    const loanTermMonths = 36;

    const colors: ColorOption[] = [
        { name: 'ブラック', price: 0, colorCode: '#000000' },
        { name: 'プラチナホワイトパールマイカ', price: 950, colorCode: '#F5F5F5' },
    ];

    const options: VehicleOption[] = [
        { name: 'フロアマット', price: 0, isDefault: true, category: 'インテリア' },
        { name: 'トヨタ チームメイト', price: 2700, category: 'ナビ・電装' },
        { name: 'ヒッチメンバー', price: 2150, category: 'エクステリア' },
        { name: 'デジタルキー', price: 950, category: 'ナビ・電装' },
        { name: 'VZ ディーゼル', price: 2150, category: 'パワートレイン' },
        { name: 'スタッドレスタイヤ', price: 5000, category: 'タイヤ・ホイール' },
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
        <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-oid="csvtw0q">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6" data-oid="csi:2ih">
                <div className="mb-8 border-b pb-4" data-oid="uqepd7-">
                    <div
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
                        data-oid="zw-9j7w"
                    >
                        <h1
                            className="text-3xl md:text-4xl font-bold text-gray-800"
                            data-oid="7wpb1i_"
                        >
                            トヨタ ランクル 250
                        </h1>
                        <div
                            className="flex flex-wrap gap-6 text-base md:text-lg font-medium"
                            data-oid="-fm1n22"
                        >
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="2m.l5km"
                            >
                                グレード: VZ GAS
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="adffh7w"
                            >
                                駆動方式: 4WD
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="0:v1na_"
                            >
                                排気量: 2,700cc
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="j59p1ex">
                    <div
                        className="relative aspect-auto min-h-[350px] md:min-h-[450px] rounded-lg overflow-hidden"
                        data-oid="s64-5a1"
                    >
                        <Image
                            src="/cars/landcruiser.jpg"
                            alt="トヨタ ランクル 250"
                            fill
                            className="object-contain hover:scale-105 transition-transform duration-300"
                            data-oid="_3tfs7d"
                        />
                    </div>

                    <div
                        className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                        data-oid="9:ht04j"
                    >
                        <div className="mb-8" data-oid="l7nssgs">
                            <h2
                                className="text-xl md:text-2xl font-bold mb-4 text-gray-800 border-b pb-2"
                                data-oid=":6nibw1"
                            >
                                ボディカラー
                            </h2>
                            <div className="space-y-4" data-oid="jvdkdfy">
                                {colors.map((color) => (
                                    <label
                                        key={color.name}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                            selectedColor === color.name
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200'
                                        } hover:border-blue-300 transition-colors cursor-pointer`}
                                        data-oid="8vj_zsr"
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            checked={selectedColor === color.name}
                                            onChange={() => setSelectedColor(color.name)}
                                            className="w-5 h-5 accent-blue-600"
                                            data-oid="rybhjg-"
                                        />

                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: color.colorCode }}
                                            data-oid="pko3csq"
                                        ></div>
                                        <span
                                            className="font-medium text-gray-800"
                                            data-oid="cm4_a20"
                                        >
                                            {color.name}
                                        </span>
                                        {color.price > 0 && (
                                            <span
                                                className="ml-auto text-gray-700 font-medium"
                                                data-oid="9k5_z3w"
                                            >
                                                カラーオプション: {color.price.toLocaleString()}円
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div data-oid="ua9dhjq">
                            <h2
                                className="text-xl md:text-2xl font-bold mb-4 text-gray-800 border-b pb-2"
                                data-oid="57ogrr0"
                            >
                                オプション選択
                            </h2>
                            {Object.entries(optionsByCategory).map(
                                ([category, categoryOptions]) => (
                                    <div key={category} className="mb-6" data-oid="6jzof5l">
                                        <h3
                                            className="font-medium text-sm text-gray-500 mb-2"
                                            data-oid="nufnltw"
                                        >
                                            {category}
                                        </h3>
                                        <div className="space-y-2" data-oid="uudxzsq">
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
                                                        data-oid="j.kgm2v"
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
                                                            data-oid="k6wsv6v"
                                                        />

                                                        <div className="flex-1" data-oid="i2x.v.r">
                                                            <div
                                                                className="font-medium text-gray-800"
                                                                data-oid="t1ak7.g"
                                                            >
                                                                {option.name}
                                                                {option.isDefault && (
                                                                    <span
                                                                        className="ml-2 text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded"
                                                                        data-oid="2ylvhvz"
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
                                                                        data-oid="xy0:y8b"
                                                                    >
                                                                        ※他のオプションとの同時装着はできません
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <span
                                                            className="text-gray-700 font-medium whitespace-nowrap"
                                                            data-oid="os2ca4u"
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
                    data-oid="gx.ahdc"
                >
                    <div
                        className="flex flex-col md:flex-row md:items-end justify-center gap-4 mb-8"
                        data-oid="_l3m5dh"
                    >
                        <div className="text-center md:text-right" data-oid="1afz24f">
                            <div className="text-sm text-gray-500 mb-1" data-oid="_thwp4s">
                                お支払い
                            </div>
                            <div
                                className="text-4xl md:text-5xl font-bold text-blue-600"
                                data-oid="86ctjwp"
                            >
                                月々 {calculateTotalPrice().toLocaleString()}円
                            </div>
                            <div className="text-sm text-gray-500 mt-1" data-oid="d3ci6iw">
                                （{loanTermMonths}回払い / 総額 {totalCost.toLocaleString()}円）
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8" data-oid="n5:y0at">
                        <button
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-medium hover:bg-blue-700 transition-colors shadow-md"
                            data-oid="zgdzom9"
                        >
                            お問い合わせはコチラ
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-oid="_faj1__">
                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid="k3-o8m-"
                        >
                            <div className="flex flex-col items-center" data-oid="db3u5kp">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="0im5c_p"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="9_azn51"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="4pxhszb"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="4mxqi_b"
                                >
                                    頭金
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="p0m7rjs">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid="jh35j7i"
                        >
                            <div className="flex flex-col items-center" data-oid="di-t7zj">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="rbuwltz"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="2yovm71"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="63s7hw4"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="qqqpmiz"
                                >
                                    ボーナス
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="sd2xk75">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid="bwlql94"
                        >
                            <div className="flex flex-col items-center" data-oid="qki0-bg">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="g9ggmz4"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="wp.z067"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="rqyq1k1"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="uxjh0gd"
                                >
                                    車検
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="o66:vd1">
                                    不要
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid="g3kekrz"
                        >
                            <div className="flex flex-col items-center" data-oid="dccc_oq">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="dabgs4k"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="e:bgfd1"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                            data-oid=".bkp79r"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="z31t2eu"
                                >
                                    オイルメンテ
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="o-_y4a6">
                                    港南負担
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            data-oid=".d.sf6v"
                        >
                            <div className="flex flex-col items-center" data-oid="_fux530">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                                    data-oid="z.z.ti."
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="k6nrm2e"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            data-oid="7q8a5mg"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="vh5g76j"
                                >
                                    1年間
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="2lnj4a_">
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
