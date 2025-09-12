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
    const basePrice = 55000;
    const loanTermMonths = 36;

    const colors: ColorOption[] = [
        { name: 'アティチュードブラックマイカ', price: 0, colorCode: '#000000' },
        { name: 'スーパーホワイトⅡ', price: 0, colorCode: '#F5F5F5' },
        { name: 'グレーメタリック', price: 900, colorCode: '#C0C0C0' },
        { name: 'ブラックマイカ✕アーバンカーキ', price: 3200, colorCode: '#90A39B' },
    ];

    const options: VehicleOption[] = [
        { name: 'フロアマット', price: 0, isDefault: true, category: 'インテリア' },
        {
            name: 'ハンズフリーパワーバックドア',
            price: 0,
            isDefault: true,
            category: 'エクステリア',
        },
        { name: 'スペアタイヤ', price: 0, isDefault: true, category: 'エクステリア' },
        { name: 'デジタルインナーミラー', price: 0, isDefault: true, category: 'ナビ・電装' },
        { name: 'パノラミックビューモニター', price: 2500, category: 'ナビ・電装' },
        { name: '寒冷地仕様', price: 600, category: 'その他' },
        { name: 'スタッドレスタイヤ', price: 5200, category: 'タイヤ・ホイール' },
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
        <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-oid="uorcbik">
            <div
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 border border-gray-300"
                data-oid="n9six40"
            >
                <div className="mb-8 border-b border-gray-300 pb-4" data-oid="qap.8ty">
                    <div
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
                        data-oid="gouif7h"
                    >
                        <h1
                            className="text-3xl md:text-4xl font-bold text-gray-900"
                            data-oid="khkejng"
                        >
                            トヨタ RAV4
                        </h1>
                        <div
                            className="flex flex-wrap gap-6 text-base md:text-lg font-medium"
                            data-oid="e1lq_wy"
                        >
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="10efnbb"
                            >
                                グレード: Adventure OFFROAD package Ⅱ
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="cw7t311"
                            >
                                駆動方式: 4WD
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="nr6ccm:"
                            >
                                排気量: 2,000cc
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="7f0af72">
                    <div
                        className="relative aspect-auto min-h-[350px] md:min-h-[450px] rounded-2xl overflow-hidden shadow-sm"
                        data-oid="832ql8s"
                    >
                        <Image
                            src="/cars/rav4.jpg"
                            alt="トヨタ RAV4"
                            fill
                            className="object-contain hover:scale-105 transition-transform duration-200"
                            data-oid="6sakzgn"
                        />
                    </div>

                    <div
                        className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm"
                        data-oid="_aaqkcs"
                    >
                        <div className="mb-8" data-oid="8zaqo0v">
                            <h2
                                className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="ieem2mu"
                            >
                                ボディカラー
                            </h2>
                            <div className="space-y-4" data-oid="9595:-9">
                                {colors.map((color) => (
                                    <label
                                        key={color.name}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                            selectedColor === color.name
                                                ? 'border-blue-500 bg-white shadow-md'
                                                : 'border-gray-300'
                                        } hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer`}
                                        data-oid=":5k3p_v"
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            checked={selectedColor === color.name}
                                            onChange={() => setSelectedColor(color.name)}
                                            className="w-5 h-5 accent-blue-600"
                                            data-oid="_6k9iim"
                                        />

                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: color.colorCode }}
                                            data-oid="5dxhfuj"
                                        ></div>
                                        <span
                                            className="font-medium text-gray-900"
                                            data-oid="i.74tw-"
                                        >
                                            {color.name}
                                        </span>
                                        {color.price > 0 && (
                                            <span
                                                className="ml-auto text-gray-700 font-medium"
                                                data-oid="kbiw1x:"
                                            >
                                                カラーオプション: {color.price.toLocaleString()}円
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div data-oid="_1d_9ba">
                            <h2
                                className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="5naatw_"
                            >
                                オプション選択
                            </h2>
                            {Object.entries(optionsByCategory).map(
                                ([category, categoryOptions]) => (
                                    <div key={category} className="mb-6" data-oid="o00wpeq">
                                        <h3
                                            className="font-medium text-sm text-gray-500 mb-2"
                                            data-oid="fw97nxv"
                                        >
                                            {category}
                                        </h3>
                                        <div className="space-y-2" data-oid="_xsg_mo">
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
                                                                ? 'border-blue-500 bg-white shadow-md'
                                                                : 'border-gray-300'
                                                        } ${
                                                            isDisabled
                                                                ? 'opacity-50 cursor-not-allowed'
                                                                : 'hover:border-blue-300 hover:shadow-sm cursor-pointer'
                                                        } transition-all duration-200`}
                                                        data-oid=":alm8mz"
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
                                                            data-oid="b6-c3fk"
                                                        />

                                                        <div className="flex-1" data-oid="x_fr2by">
                                                            <div
                                                                className="font-medium text-gray-900"
                                                                data-oid="nsi2-ws"
                                                            >
                                                                {option.name}
                                                                {option.isDefault && (
                                                                    <span
                                                                        className="ml-2 text-xs font-normal text-blue-700 bg-white border border-blue-300 px-2 py-0.5 rounded"
                                                                        data-oid="ukff6.y"
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
                                                                        data-oid="ow2gq6r"
                                                                    >
                                                                        ※他のオプションとの同時装着はできません
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <span
                                                            className="text-gray-700 font-medium whitespace-nowrap"
                                                            data-oid="8hils6n"
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
                    data-oid="92gjoa2"
                >
                    <div
                        className="flex flex-col md:flex-row md:items-end justify-center gap-4 mb-8"
                        data-oid="ife973z"
                    >
                        <div className="text-center md:text-right" data-oid="2i2426o">
                            <div className="text-sm text-gray-500 mb-1" data-oid="vf:-2y_">
                                お支払い
                            </div>
                            <div
                                className="text-4xl md:text-5xl font-bold text-blue-600"
                                data-oid="4:b2nsq"
                            >
                                月々 {calculateTotalPrice().toLocaleString()}円
                            </div>
                            <div className="text-sm text-gray-500 mt-1" data-oid="gm:x6fh">
                                （{loanTermMonths}回払い / 総額 {totalCost.toLocaleString()}円）
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8" data-oid="11.:bwb">
                        <button
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                            data-oid="b:8wysw"
                        >
                            お問い合わせはコチラ
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-oid="gk60exi">
                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="v:9afkk"
                        >
                            <div className="flex flex-col items-center" data-oid="nhok91a">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="gfljh17"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="4c-dc26"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="ec5n_g2"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="ph0o11e"
                                >
                                    頭金
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="9fg5qvv">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="zijrl_e"
                        >
                            <div className="flex flex-col items-center" data-oid="jkni_z0">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="z0lrvbl"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="4y_yrjp"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="sje6wbt"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="qa.tfmt"
                                >
                                    ボーナス
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="klisgdn">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="0b_u-fc"
                        >
                            <div className="flex flex-col items-center" data-oid="1:ol41s">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="xx2oh:z"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="ylh.2nv"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="d9l49hm"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="net3w61"
                                >
                                    車検
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="bejvcpq">
                                    不要
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="olnz9.l"
                        >
                            <div className="flex flex-col items-center" data-oid="efm3ict">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="cc2xx4t"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="ky8rzb0"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                            data-oid="jsxu41a"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="5pgayvr"
                                >
                                    オイルメンテ
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="k6dgyw5">
                                    港南負担
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="mbtausd"
                        >
                            <div className="flex flex-col items-center" data-oid="v:vqe6c">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="ycrxwjl"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="ji:h1-g"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            data-oid="mjrdrd3"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="np9ugiq"
                                >
                                    1年間
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="79:.4.n">
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
