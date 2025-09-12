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
    const basePrice = 45000; // 基本月額料金

    const colors: ColorOption[] = useMemo(() => [
        { name: 'アティチュードブラックマイカ', price: 0, colorCode: '#1a1a1a' },
        { name: 'ホワイトパールクリスタルシャイン', price: 750, colorCode: '#f8f8f8' },
    ], []);

    const options: VehicleOption[] = useMemo(() => [
        { name: '快適便利パッケージ(High)', price: 0, isDefault: true, category: 'セーフティ' },
        { name: 'BSMセット', price: 0, isDefault: true, category: 'セーフティ' },
        { name: 'フロアマット', price: 0, isDefault: true, category: 'インテリア' },
        { name: 'ディスプレイオーディオPlus', price: 2800, category: 'ナビ・電装' },
        { name: 'ユニバーサルステップ', price: 2400, category: 'エクステリア' },
        { name: 'トヨタチームメイト', price: 4200, category: 'セーフティ' },
        { name: 'スタッドレスタイヤ', price: 4600, category: 'タイヤ・ホイール' },
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

    const selectedColorCode = useMemo(() => {
        return colors.find((c) => c.name === selectedColor)?.colorCode || colors[0].colorCode;
    }, [selectedColor, colors]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-oid="9s.fqfs">
            <div
                className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 border border-gray-300"
                data-oid="hjerng5"
            >
                <div className="mb-8 border-b border-gray-300 pb-4" data-oid="3o20v:8">
                    <div
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
                        data-oid="gd1os7a"
                    >
                        <div data-oid="n5gjcpt">
                            <h1
                                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                                data-oid="bcwqjl5"
                            >
                                トヨタ ヴォクシー
                            </h1>
                            <div className="flex items-center gap-3" data-oid="n4wp40-">
                                <span
                                    className="text-2xl font-bold text-teal-600"
                                    data-oid="-7_2:o1"
                                >
                                    -NoReTa-
                                </span>
                                <span className="text-lg text-gray-600" data-oid="nt6nij-">
                                    ノレタ
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1" data-oid="w6qe2n5">
                                港南自動車オリジナルサービス
                            </p>
                        </div>
                        <div
                            className="flex flex-wrap gap-6 text-base md:text-lg font-medium"
                            data-oid="vv8o4z:"
                        >
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="ar5o_jv"
                            >
                                グレード: S-Z GAS
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="34:mza0"
                            >
                                搭乗人数: 7人
                            </span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                                data-oid="5yo0-em"
                            >
                                排気量: 2,000cc
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-oid="p31ykqz">
                    <div
                        className="relative aspect-auto min-h-[350px] md:min-h-[450px] rounded-2xl overflow-hidden shadow-sm"
                        data-oid="mim598."
                    >
                        <Image
                            src="/cars/voxy.jpg"
                            alt="トヨタ ヴォクシー"
                            fill
                            className="object-contain hover:scale-105 transition-transform duration-200"
                            data-oid="w1u.8_x"
                        />
                    </div>

                    <div
                        className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm"
                        data-oid="4:la2nm"
                    >
                        <div className="mb-8" data-oid="wkdo6:o">
                            <h2
                                className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="19ulno7"
                            >
                                カラー
                            </h2>
                            <div className="space-y-4" data-oid="lets3t4">
                                {colors.map((color) => (
                                    <label
                                        key={color.name}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                            selectedColor === color.name
                                                ? 'border-blue-500 bg-white shadow-md'
                                                : 'border-gray-300'
                                        } hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer`}
                                        data-oid="zvn05:-"
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            checked={selectedColor === color.name}
                                            onChange={() => setSelectedColor(color.name)}
                                            className="w-5 h-5 accent-blue-600"
                                            data-oid="66646s_"
                                        />

                                        <div
                                            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: color.colorCode }}
                                            data-oid="udezfm5"
                                        ></div>
                                        <span
                                            className="font-medium text-gray-900"
                                            data-oid="qgvauqf"
                                        >
                                            {color.name}
                                        </span>
                                        <span
                                            className="ml-auto text-gray-700 font-medium"
                                            data-oid="tll.ka-"
                                        >
                                            {color.price > 0
                                                ? `+${color.price.toLocaleString()}円/月`
                                                : '標準'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div data-oid="7ss.8ui">
                            <h2
                                className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 border-b border-gray-300 pb-2"
                                data-oid="5nhaouc"
                            >
                                オプション
                            </h2>
                            {Object.entries(optionsByCategory).map(
                                ([category, categoryOptions]) => (
                                    <div key={category} className="mb-6" data-oid="0e0kq0s">
                                        <h3
                                            className="font-medium text-sm text-gray-500 mb-2"
                                            data-oid="88s3z8c"
                                        >
                                            {category}
                                        </h3>
                                        <div className="space-y-2" data-oid="rsr61lx">
                                            {categoryOptions.map((option) => {
                                                const isChecked = selectedOptions.includes(
                                                    option.name,
                                                );

                                                return (
                                                    <label
                                                        key={option.name}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                                            isChecked
                                                                ? 'border-blue-500 bg-white shadow-md'
                                                                : 'border-gray-300'
                                                        } hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all duration-200`}
                                                        data-oid="-::4g92"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() =>
                                                                toggleOption(option.name)
                                                            }
                                                            className="w-5 h-5 accent-blue-600"
                                                            data-oid="tibbkpu"
                                                        />

                                                        <div className="flex-1" data-oid="zf1.pps">
                                                            <div
                                                                className="font-medium text-gray-900"
                                                                data-oid="xrx826o"
                                                            >
                                                                {option.name}
                                                                {option.isDefault && (
                                                                    <span
                                                                        className="ml-2 text-xs font-normal text-blue-700 bg-white border border-blue-300 px-2 py-0.5 rounded"
                                                                        data-oid="ol:9_lo"
                                                                    >
                                                                        標準装備
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span
                                                            className="text-gray-700 font-medium whitespace-nowrap"
                                                            data-oid="v5x234u"
                                                        >
                                                            {option.price > 0
                                                                ? `+${option.price.toLocaleString()}円/月`
                                                                : '標準'}
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
                    data-oid="33c0n4u"
                >
                    <div
                        className="flex flex-col md:flex-row md:items-end justify-center gap-4 mb-8"
                        data-oid="d50lvs2"
                    >
                        <div className="text-center md:text-right" data-oid=":xgzsm4">
                            <div className="text-sm text-gray-500 mb-1" data-oid="7lfvt9x">
                                お支払い
                            </div>
                            <div
                                className="text-4xl md:text-5xl font-bold text-blue-600"
                                data-oid=":lx.du9"
                            >
                                月々 {calculateTotalPrice().toLocaleString()}円
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8" data-oid="1xvqywb">
                        <button
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                            data-oid=".sz9ih4"
                        >
                            お問い合わせはコチラ
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-oid="17hm65e">
                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="uu64n_h"
                        >
                            <div className="flex flex-col items-center" data-oid="phprxl.">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="k5o2x92"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="2wy9ema"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="q0:il48"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="a1888kv"
                                >
                                    頭金
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="ft118id">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="2vus2dd"
                        >
                            <div className="flex flex-col items-center" data-oid="hlliueb">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="e:lb1h0"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="bsu:p28"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="8nlu1uj"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="-_7gljt"
                                >
                                    ボーナス
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="p7t6r2k">
                                    無し
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="84hcoyo"
                        >
                            <div className="flex flex-col items-center" data-oid="ribjpdx">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="0uv720l"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="xegf059"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            data-oid="8b7_n80"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="_7em5yl"
                                >
                                    車検
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="c:7biz5">
                                    不要
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="nug13:2"
                        >
                            <div className="flex flex-col items-center" data-oid="ayzhcob">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid=".y4nmcq"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="m-e:ji-"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                            data-oid="c9b59_m"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="gxbp67g"
                                >
                                    オイルメンテ
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="nvnzqlf">
                                    港南負担
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            data-oid="oi1thei"
                        >
                            <div className="flex flex-col items-center" data-oid="alnvq4o">
                                <div
                                    className="w-12 h-12 bg-white border border-blue-300 rounded-full flex items-center justify-center mb-3"
                                    data-oid="76wec-o"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid=".nori3n"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            data-oid="rsaaelt"
                                        />
                                    </svg>
                                </div>
                                <div
                                    className="text-sm font-medium text-gray-500"
                                    data-oid="4t6liro"
                                >
                                    1年間
                                </div>
                                <div className="text-lg text-blue-600 font-bold" data-oid="-jyrb.g">
                                    傷保証
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="mt-8 text-center text-sm text-gray-600 border-t border-gray-200 pt-6"
                        data-oid="nfi576o"
                    >
                        <div className="mb-2" data-oid="nwe-h7r">
                            <strong data-oid="c01pmyp">株式会社港南自動車サービス</strong>
                        </div>
                        <div className="mb-1" data-oid="8nhw2oj">
                            〒920-0336 石川県金沢市金石本町ハ14番地
                        </div>
                        <div data-oid="h8k7-gk">TEL: 076-268-1788 / FAX: 076-268-3163</div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Price Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                            トヨタ ヴォクシー
                        </div>
                        <div className="text-xs text-gray-500">
                            S-Z GAS・7人・2,000cc
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-sm text-gray-500">お支払い</div>
                            <div className="text-2xl font-bold text-blue-600">
                                月々 {calculateTotalPrice().toLocaleString()}円
                            </div>
                        </div>
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                            お問い合わせ
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom padding to prevent content from being hidden behind fixed bar */}
            <div className="h-20"></div>
        </div>
    );
}
