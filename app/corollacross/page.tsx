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
        { name: 'アティチュードブラックマイカ', price: 0, colorCode: '#000000' },
        { name: 'プラチナホワイトパールマイカ', price: 950, colorCode: '#F5F5F5' },
    ];

    const options: VehicleOption[] = [
        { name: 'フロアマット', price: 0, isDefault: true, category: 'インテリア' },
        { name: 'ディスプレイオーディオPlus', price: 3550, category: 'ナビ・電装' },
        { name: 'パノラミックビューモニター', price: 4400, category: 'ナビ・電装' },
        { name: 'パノラマルーフ', price: 3100, category: 'エクステリア' },
        { name: 'おくだけ充電', price: 400, category: 'インテリア' },
        { name: 'デジタルキー', price: 950, category: 'セキュリティ' },
        { name: 'スペアタイヤ（応急用 T155/70D17）', price: 450, category: 'タイヤ・ホイール' },
        { name: 'スタッドレスタイヤ', price: 6700, category: 'タイヤ・ホイール' },
    ];

    const [selectedColor, setSelectedColor] = useState<string>(colors[0].name);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(
        options.filter((opt) => opt.isDefault).map((opt) => opt.name),
    );

    const calculateTotalPrice = () => {
        let total = basePrice;

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
        <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-oid="bf7s5yq">
            <div
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 border border-gray-300"
                data-oid="ce.2vn0"
            >
                <div className="mb-8 border-b border-gray-300 pb-4" data-oid="a1lzqgh">
                    <div
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
                        data-oid="q07p65e"
                    >
                        <h1
                            className="text-3xl md:text-4xl font-bold text-gray-900"
                            data-oid="gh7uto7"
                        >
                            トヨタ カローラクロス
                        </h1>
                        <div
                            className="flex flex-wrap gap-6 text-base md:text-lg font-medium"
                            data-oid="0c_4:r0"
                        >
                            <span
                                className="bg-white border border-gray-300 px-3 py-1 rounded-xl text-gray-700 shadow-sm"
                                data-oid="vvd9nqy"
                            >
                                グレード: HYBRID Z
                            </span>
                            <span
                                className="bg-white border border-gray-300 px-3 py-1 rounded-xl text-gray-700 shadow-sm"
                                data-oid="14r0c7q"
                            >
                                駆動方式: 2WD
                            </span>
                            <span
                                className="bg-white border border-gray-300 px-3 py-1 rounded-xl text-gray-700 shadow-sm"
                                data-oid="g92.oj4"
                            >
                                排気量: 1,800cc
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="pn8etl_">
                    <div
                        className="relative aspect-auto min-h-[350px] md:min-h-[450px] rounded-2xl overflow-hidden shadow-sm"
                        data-oid="h6tkso4"
                    >
                        <Image
                            src="/cars/corollacross.jpg"
                            alt="トヨタ カローラクロス"
                            fill
                            className="object-contain hover:scale-105 transition-transform duration-200"
                            data-oid="16qod5l"
                        />
                    </div>

                    <div
                        className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm"
                        data-oid="hoocrg."
                    >
                        <div className="mb-8" data-oid="rqe9-4g">
                            <h2
                                className="text-xl md:text-2xl font-bold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="wzg3.rv"
                            >
                                ボディカラー
                            </h2>
                            <div className="space-y-4" data-oid="_ci9rfx">
                                {colors.map((color) => (
                                    <label
                                        key={color.name}
                                        className={`flex items-center gap-3 p-3 rounded-2xl border ${
                                            selectedColor === color.name
                                                ? 'border-blue-500 bg-white shadow-md'
                                                : 'border-gray-300 bg-white'
                                        } hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer`}
                                        data-oid="mjdfh4b"
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            checked={selectedColor === color.name}
                                            onChange={() => setSelectedColor(color.name)}
                                            className="w-5 h-5 accent-blue-600"
                                            data-oid="a4ni-ii"
                                        />

                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: color.colorCode }}
                                            data-oid="-rus9zb"
                                        ></div>
                                        <span
                                            className="font-medium text-gray-900"
                                            data-oid="gkmwrc9"
                                        >
                                            {color.name}
                                        </span>
                                        {color.price > 0 && (
                                            <span
                                                className="ml-auto text-gray-700 font-medium"
                                                data-oid="e2:qczz"
                                            >
                                                カラーオプション: {color.price.toLocaleString()}円
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div data-oid="n9om79e">
                            <h2
                                className="text-xl md:text-2xl font-bold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="j_8wip1"
                            >
                                オプション選択
                            </h2>
                            {Object.entries(optionsByCategory).map(
                                ([category, categoryOptions]) => (
                                    <div key={category} className="mb-6" data-oid="f1dot_o">
                                        <h3
                                            className="font-medium text-sm text-gray-600 mb-2"
                                            data-oid="pqai9lm"
                                        >
                                            {category}
                                        </h3>
                                        <div className="space-y-2" data-oid="4hw.o3o">
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
                                                        data-oid="8qy7vcz"
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
                                                            data-oid="fc.e_lv"
                                                        />

                                                        <div className="flex-1" data-oid="nz-dcdj">
                                                            <div
                                                                className="font-medium text-gray-900"
                                                                data-oid="_k6u373"
                                                            >
                                                                {option.name}
                                                                {option.isDefault && (
                                                                    <span
                                                                        className="ml-2 text-xs font-normal text-blue-600 bg-white border border-blue-300 px-2 py-0.5 rounded"
                                                                        data-oid="hl4oru8"
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
                                                                        data-oid="5.ift7o"
                                                                    >
                                                                        ※他のオプションとの同時装着はできません
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <span
                                                            className="text-gray-700 font-medium whitespace-nowrap"
                                                            data-oid="5_c2l65"
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
                    data-oid="hklfa8w"
                >
                    <div
                        className="flex flex-col md:flex-row md:items-end justify-center gap-4 mb-8"
                        data-oid="8dtforn"
                    >
                        <div className="text-center md:text-right" data-oid="q00.61y">
                            <div className="text-sm text-gray-600 mb-1" data-oid="kc9-.b:">
                                お支払い
                            </div>
                            <div
                                className="text-4xl md:text-5xl font-bold text-blue-600"
                                data-oid="tiw3f:g"
                            >
                                月々 {calculateTotalPrice().toLocaleString()}円
                            </div>
                            <div className="text-sm text-gray-600 mt-1" data-oid="42eomhe">
                                （{loanTermMonths}回払い / 総額 {totalCost.toLocaleString()}円）
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8" data-oid="mhvfswm">
                        <button
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                            data-oid="mtsu0r7"
                        >
                            お問い合わせはコチラ
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-oid="mdtxq8u">
                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="2.t5:g:"
                        >
                            <div className="flex flex-col items-center" data-oid="ipv9yv0">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="uuegl1-"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="kn--7e3"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="33jpfhs"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-600"
                                    data-oid="5kphb_t"
                                >
                                    頭金
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="dqisy1q">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="abo01n5"
                        >
                            <div className="flex flex-col items-center" data-oid=".2raxa0">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="ut9nczu"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="vk5nz32"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="6r1dh42"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="f11uwhh"
                                >
                                    ボーナス
                                </div>
                                <div className="text-teal-600 font-bold" data-oid="rdk8vm-">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border-2 border-teal-500 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200"
                            data-oid="_5cs_77"
                        >
                            <div className="flex flex-col items-center" data-oid="v9_ymr6">
                                <div
                                    className="w-12 h-12 bg-white border border-teal-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="6c_l65g"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-teal-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="5vxlldd"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="32ma05m"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="rn6lj00"
                                >
                                    車検
                                </div>
                                <div className="text-teal-600 font-bold" data-oid="s8ut2b3">
                                    不要
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border-2 border-teal-500 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200"
                            data-oid=".so_lxl"
                        >
                            <div className="flex flex-col items-center" data-oid="_y-isvj">
                                <div
                                    className="w-12 h-12 bg-white border border-teal-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="7-b8e33"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-teal-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="5zq6ba0"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                            data-oid="mkluqc4"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="juaybej"
                                >
                                    オイルメンテ
                                </div>
                                <div className="text-teal-600 font-bold" data-oid="1ggebf.">
                                    港南負担
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border-2 border-teal-500 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-200"
                            data-oid=".ojnk9d"
                        >
                            <div className="flex flex-col items-center" data-oid="vwkt48h">
                                <div
                                    className="w-12 h-12 bg-white border border-teal-300 rounded-full flex items-center justify-center mb-3 shadow-sm"
                                    data-oid="2974.o5"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-teal-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="nuv5n3-"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            data-oid="uj_733d"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="0u2clmq"
                                >
                                    1年間
                                </div>
                                <div className="text-teal-600 font-bold" data-oid="7yf1kow">
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
