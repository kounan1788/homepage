'use client';

import { useState, useMemo, useCallback } from 'react';
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
    const basePrice = 39500;
    const loanTermMonths = 36;

    const colors: ColorOption[] = useMemo(
        () => [
            { name: 'ブラック', price: 0, colorCode: '#000000' },
            { name: 'ホワイトパールクリスタルシャイン', price: 950, colorCode: '#F5F5F5' },
        ],

        [],
    );

    const options: VehicleOption[] = useMemo(
        () => [
            { name: 'フロアマット', price: 0, isDefault: true, category: 'インテリア' },
            { name: 'ハンズフリーパワーバックドア', price: 2150, category: 'エクステリア' },
            { name: 'パーキングサポートブレーキ', price: 350, category: 'ナビ・電装' },
            { name: 'パノラミックビューモニター', price: 1250, category: 'ナビ・電装' },
            { name: 'アクセサリーコンセント', price: 1300, category: 'ナビ・電装' },
            { name: 'アダプティブハイビームシステム', price: 2800, category: 'ナビ・電装' },
            { name: '寒冷地仕様', price: 600, category: 'その他' },
            { name: 'スタッドレスタイヤ', price: 5200, category: 'タイヤ・ホイール' },
        ],

        [],
    );

    const [selectedColor, setSelectedColor] = useState<string>(colors[0].name);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(
        options.filter((opt) => opt.isDefault).map((opt) => opt.name),
    );

    const calculateTotalPrice = useCallback(() => {
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
    }, [basePrice, colors, selectedColor, selectedOptions, options]);

    const totalCost = useMemo(() => {
        return calculateTotalPrice() * loanTermMonths;
    }, [calculateTotalPrice, loanTermMonths]);

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
    }, [options]);

    const selectedColorCode = useMemo(() => {
        return colors.find((c) => c.name === selectedColor)?.colorCode || colors[0].colorCode;
    }, [colors, selectedColor]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-oid="hmje3hb">
            <div
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 border border-gray-300"
                data-oid="rl3usvw"
            >
                <div className="mb-8 border-b border-gray-300 pb-4" data-oid="7_l724i">
                    <div
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
                        data-oid="0lrojor"
                    >
                        <div data-oid="qf.lxka">
                            <h1
                                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                                data-oid="o5bxkw_"
                            >
                                トヨタ ヤリスクロス
                            </h1>
                            <div className="flex items-center gap-3" data-oid="51kgh99">
                                <span
                                    className="text-2xl font-bold text-teal-600"
                                    data-oid="gx8:.ve"
                                >
                                    -NoReTa-
                                </span>
                                <span className="text-lg text-gray-600" data-oid="hdhsjhx">
                                    ノレタ
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1" data-oid="hx:ecvu">
                                港南自動車オリジナルサービス
                            </p>
                        </div>
                        <div
                            className="flex flex-wrap gap-6 text-base md:text-lg font-medium"
                            data-oid="ev5d:qs"
                        >
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="lilpoxi"
                            >
                                グレード: HYBRID Z
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="2dv57v4"
                            >
                                駆動方式: 2WD
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="_9jyjt4"
                            >
                                排気量: 1,500cc
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="5qf8-tm">
                    <div
                        className="relative aspect-auto min-h-[350px] md:min-h-[450px] rounded-2xl overflow-hidden shadow-sm"
                        data-oid="3-a7bso"
                    >
                        <Image
                            src="/cars/yariscross.jpg"
                            alt="トヨタ ヤリスクロス"
                            fill
                            className="object-contain hover:scale-105 transition-transform duration-200"
                            data-oid="_92d5:y"
                        />
                    </div>

                    <div
                        className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm"
                        data-oid="q--36o7"
                    >
                        <div className="mb-8" data-oid="vtvoj2t">
                            <h2
                                className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="t3ytkf1"
                            >
                                ボディカラー
                            </h2>
                            <div className="space-y-4" data-oid="q3xxvag">
                                {colors.map((color) => (
                                    <label
                                        key={color.name}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                            selectedColor === color.name
                                                ? 'border-blue-500 bg-white shadow-md'
                                                : 'border-gray-300'
                                        } hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer`}
                                        data-oid="yng481b"
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            checked={selectedColor === color.name}
                                            onChange={() => setSelectedColor(color.name)}
                                            className="w-5 h-5 accent-blue-600"
                                            data-oid="t4fowuz"
                                        />

                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: color.colorCode }}
                                            data-oid="mhojv5c"
                                        ></div>
                                        <span
                                            className="font-medium text-gray-900"
                                            data-oid="x7i-ann"
                                        >
                                            {color.name}
                                        </span>
                                        {color.price > 0 && (
                                            <span
                                                className="ml-auto text-gray-700 font-medium"
                                                data-oid="2809rwr"
                                            >
                                                カラーオプション: {color.price.toLocaleString()}円
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div data-oid="m6c7lx_">
                            <h2
                                className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="podl5hy"
                            >
                                オプション選択
                            </h2>
                            {Object.entries(optionsByCategory).map(
                                ([category, categoryOptions]) => (
                                    <div key={category} className="mb-6" data-oid="s3p.zpe">
                                        <h3
                                            className="font-medium text-sm text-gray-500 mb-2"
                                            data-oid=".tp6of7"
                                        >
                                            {category}
                                        </h3>
                                        <div className="space-y-2" data-oid="5tbvvmy">
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
                                                        data-oid="tymq688"
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
                                                            data-oid="pfyct21"
                                                        />

                                                        <div className="flex-1" data-oid="0-qr33u">
                                                            <div
                                                                className="font-medium text-gray-900"
                                                                data-oid="mwwzesa"
                                                            >
                                                                {option.name}
                                                                {option.isDefault && (
                                                                    <span
                                                                        className="ml-2 text-xs font-normal text-blue-700 bg-white border border-blue-300 px-2 py-0.5 rounded"
                                                                        data-oid="dnk._ge"
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
                                                                        data-oid="7l8q1i:"
                                                                    >
                                                                        ※他のオプションとの同時装着はできません
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <span
                                                            className="text-gray-700 font-medium whitespace-nowrap"
                                                            data-oid="nhuvqbp"
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
                    data-oid="3-.lilt"
                >
                    <div
                        className="flex flex-col md:flex-row md:items-end justify-center gap-4 mb-8"
                        data-oid="ujvazu5"
                    >
                        <div className="text-center md:text-right" data-oid="nt:bsus">
                            <div className="text-sm text-gray-500 mb-1" data-oid="::x-o87">
                                お支払い
                            </div>
                            <div
                                className="text-4xl md:text-5xl font-bold text-blue-600"
                                data-oid="ok_h2jm"
                            >
                                月々 {calculateTotalPrice().toLocaleString()}円
                            </div>
                            <div className="text-sm text-gray-500 mt-1" data-oid="1temq3h">
                                （{loanTermMonths}回払い / 総額 {totalCost.toLocaleString()}円）
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8" data-oid="rs6mvu3">
                        <button
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                            data-oid="bc3rbvg"
                        >
                            お問い合わせはコチラ
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-oid="c78qh5_">
                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="ehimywo"
                        >
                            <div className="flex flex-col items-center" data-oid="ckj993p">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="6j23t4z"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="ddj-gk:"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="4n4v.hx"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="a4a76-h"
                                >
                                    頭金
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid=":38gtg2">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="rkrfw4f"
                        >
                            <div className="flex flex-col items-center" data-oid=":6wbic8">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="15_rek0"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="8klxy0l"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="ts:q74g"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="ag6xkle"
                                >
                                    ボーナス
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="oyvc_bu">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="ak9:k:5"
                        >
                            <div className="flex flex-col items-center" data-oid="07n21q4">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="s987ag5"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="5ti4u3l"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="zl8515_"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="4bbaax9"
                                >
                                    車検
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="bv_0jqx">
                                    不要
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="8j893gj"
                        >
                            <div className="flex flex-col items-center" data-oid="9ph:pt.">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="vbsx7sd"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="4aq.gs9"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                            data-oid="ycavcee"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="xyohcy-"
                                >
                                    オイルメンテ
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="razr-um">
                                    港南負担
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="i_v1z0j"
                        >
                            <div className="flex flex-col items-center" data-oid="-1yinn1">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="-_inr34"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="_qss:j:"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            data-oid="ufl_f9s"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="4w40-lf"
                                >
                                    1年間
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="-5cxa4z">
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
