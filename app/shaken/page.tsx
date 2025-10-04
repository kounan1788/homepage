'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 車種タイプの定義
type CarType = 'light' | 'small' | 'medium' | 'regular';

// 料金データの定義（画像のパスを修正）
const pricingData = {
    light: {
        name: '軽自動車',
        weight: '',
        basePrice: 13900,
        treatment: 3300,
        cleaning: 3000,
        agency: 7800,
        inspection: 7500,
        subtotal: 35500,
        statutoryFees: 25740,
        total: 61240,
        image: '/cars/delicamini.jpg'
    },
    small: {
        name: '小型乗用',
        weight: '車両重量1t以下',
        basePrice: 15900,
        treatment: 3900,
        cleaning: 3800,
        agency: 7800,
        inspection: 8000,
        subtotal: 39400,
        statutoryFees: 35650,
        total: 75050,
        image: '/cars/xbee.jpg'
    },
    medium: {
        name: '中型乗用',
        weight: '車両重量1.5t以下',
        basePrice: 16900,
        treatment: 3900,
        cleaning: 3800,
        agency: 7800,
        inspection: 8000,
        subtotal: 40400,
        statutoryFees: 43850,
        total: 84250,
        image: '/cars/harrier.jpg'
    },
    regular: {
        name: '普通乗用',
        weight: '車両重量2t以下',
        basePrice: 19900,
        treatment: 3900,
        cleaning: 3800,
        agency: 7800,
        inspection: 8000,
        subtotal: 43400,
        statutoryFees: 52050,
        total: 95450,
        image: '/cars/alphard.jpg'
    }
};

// 割引オプションの定義
const discountOptions = [
    { id: 1, name: 'お持ち込みお引き取り割引', amount: 2200, description: 'お持ち込みまたはお引き取りのみの場合' },
    { id: 2, name: '代車不要割引', amount: 1100, description: '代車をご利用いただかない場合' },
    { id: 3, name: '早期予約割引', amount: 2200, description: '車検期限の2ヶ月前までにご予約' },
    { id: 4, name: '先取車検割引', amount: 4400, description: '次回車検を今回の車検終了時にご予約' },
    { id: 5, name: '新車初回車検割引', amount: 3300, description: '当社で新車をご購入された方の初回車検' },
    { id: 6, name: '12ヶ月点検割引', amount: 2200, description: '当社で12ヶ月点検を受けた方' },
    { id: 7, name: 'プレミアムパスポート割引', amount: 2200, description: '石川県発行のプレミアムカードをお持ちの方' },
    { id: 8, name: '初入庫割引', amount: 2200, description: '初回ご利用のお客様' }
];


export default function ShakenPage() {
    const [selectedCarType, setSelectedCarType] = useState<CarType>('light');
    const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // 料金計算
    const calculateTotal = () => {
        const carData = pricingData[selectedCarType];
        let total = carData.total;
        
        // 割引を適用
        selectedDiscounts.forEach(discountId => {
            const discount = discountOptions.find(d => d.id === discountId);
            if (discount) {
                total -= discount.amount;
            }
        });
        
        return Math.max(0, total);
    };

    const handleDiscountChange = (discountId: number) => {
        setSelectedDiscounts(prev => 
            prev.includes(discountId) 
                ? prev.filter(id => id !== discountId)
                : [...prev, discountId]
        );
    };

    const totalDiscount = selectedDiscounts.reduce((sum, discountId) => {
        const discount = discountOptions.find(d => d.id === discountId);
        return sum + (discount ? discount.amount : 0);
    }, 0);

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Header */}
            <header
                className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md"
                data-oid="fqghwyr"
            >
                <div
                    className="container mx-auto px-4 py-3 flex justify-between items-center"
                    data-oid="ogzl6xz"
                >
                    <Link href="/" className="flex items-center group" data-oid="0eh.y8p">
                        <div className="relative h-12 md:h-14 transition-transform group-hover:scale-105">
                            <Image
                                src="/logo.png"
                                alt="港南自動車サービス株式会社"
                                width={280}
                                height={70}
                                className="h-12 md:h-14 w-auto object-contain"
                                priority
                            />
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6" data-oid="jdpcl.f">
                        <nav className="flex items-center space-x-4" data-oid="_c2.5k6">
                            <Link
                                href="/#services"
                                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                                data-oid="g3os_w7"
                            >
                                サービス内容
                            </Link>
                            <Link
                                href="/#cases"
                                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                                data-oid="di-cil9"
                            >
                                取扱車種
                            </Link>
                            <Link
                                href="/#company"
                                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                                data-oid="pma8w:5"
                            >
                                会社情報
                            </Link>
                            <Link
                                href="/#contact"
                                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                                data-oid="epeq407"
                            >
                                お問い合わせ
                            </Link>
                        </nav>
                        <Link
                            href="/noreta"
                            className="bg-teal-600 text-white font-medium rounded-md px-4 py-2 hover:bg-teal-700 transition-colors shadow-sm"
                            data-oid="r7m-jfd"
                        >
                            ノレタ詳細
                        </Link>
                    </div>
                    <button
                        className="md:hidden px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm font-medium flex items-center"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        data-oid="av_bd._"
                    >
                        <span className="mr-2" data-oid="m:bk9_b">
                            MENU
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
                            data-oid="6_ygnjk"
                        >
                            {menuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" data-oid="a-w9x9r" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" data-oid="zayhmq9" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu, show/hide based on menu state */}
                <div
                    className={`${
                        menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
                    id="mobile-menu"
                    data-oid="zmkdp2r"
                >
                    <nav
                        className="container mx-auto px-4 py-3 bg-white shadow-lg rounded-b-lg space-y-2"
                        data-oid="72sbz7o"
                    >
                        <Link
                            href="/#services"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                            data-oid="ni56eff"
                        >
                            サービス内容
                        </Link>
                        <Link
                            href="/#cases"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                            data-oid="_mprlbv"
                        >
                            取扱車種
                        </Link>
                        <Link
                            href="/#company"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                            data-oid="x_63-n0"
                        >
                            会社情報
                        </Link>
                        <Link
                            href="/#contact"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                            data-oid="-ft-zqw"
                        >
                            お問い合わせ
                        </Link>
                        <Link
                            href="/noreta"
                            className="block px-3 py-2 rounded-md text-base font-medium bg-teal-600 text-white hover:bg-teal-700"
                            onClick={() => setMenuOpen(false)}
                            data-oid="5e69:q."
                        >
                            ノレタ詳細
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 md:pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* タイトルセクション */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-2 rounded-full mb-4">
                            90分立会い車検
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
                            ドクター車検
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-teal-500 rounded hidden md:block"></span>
                        </h1>
                        <p className="text-base text-gray-600 max-w-2xl mx-auto">
                            完全予約制・新車ご購入後の初めての車検の方限定・1日限定3台まで
                        </p>
                    </div>

                    {/* デスクトップレイアウト */}
                    <div className="hidden lg:block">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* 車種選択セクション */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">車種を選択</h2>
                                <div className="space-y-3">
                                    {Object.entries(pricingData).map(([key, data]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedCarType(key as CarType)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                                                selectedCarType === key
                                                    ? 'border-teal-500 bg-teal-50 shadow-md'
                                                    : 'border-gray-300 bg-white hover:border-teal-300 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 mr-3 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Image
                                                        src={data.image}
                                                        alt={data.name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <h3 className="font-semibold text-gray-800">{data.name}</h3>
                                                    {data.weight && (
                                                        <p className="text-xs text-gray-600">{data.weight}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-teal-600">
                                                        ¥{data.total.toLocaleString()}
                                                    </div>
                                                    <p className="text-xs text-gray-500">税込</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 料金詳細セクション */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">料金詳細</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">基本診断費用</span>
                                        <span className="font-semibold">¥{pricingData[selectedCarType].basePrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">基本治療費用</span>
                                        <span className="font-semibold">¥{pricingData[selectedCarType].treatment.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">下廻り洗浄費用</span>
                                        <span className="font-semibold">¥{pricingData[selectedCarType].cleaning.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">代行業務費用</span>
                                        <span className="font-semibold">¥{pricingData[selectedCarType].agency.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">総合検査費用</span>
                                        <span className="font-semibold">¥{pricingData[selectedCarType].inspection.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">法定費用</span>
                                        <span className="font-semibold">¥{pricingData[selectedCarType].statutoryFees.toLocaleString()}</span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-green-600">割引合計</span>
                                            <span className="font-semibold text-green-600">-¥{totalDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-3 border-b-2 border-teal-500 font-bold text-xl text-teal-600">
                                        <span>最終合計</span>
                                        <span>¥{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 割引オプションセクション */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">割引オプション</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {discountOptions.map((discount) => (
                                    <label
                                        key={discount.id}
                                        className="flex items-start p-3 border border-gray-300 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDiscounts.includes(discount.id)}
                                            onChange={() => handleDiscountChange(discount.id)}
                                            className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="font-semibold text-gray-800 text-sm">{discount.name}</span>
                                                    <p className="text-xs text-gray-600 mt-1">{discount.description}</p>
                                                </div>
                                                <span className="text-sm font-bold text-green-600 ml-2">
                                                    -¥{discount.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* モバイルレイアウト */}
                    <div className="lg:hidden space-y-6">
                        {/* 車種選択セクション */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">車種を選択</h2>
                            <div className="space-y-3">
                                {Object.entries(pricingData).map(([key, data]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedCarType(key as CarType)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                                            selectedCarType === key
                                                ? 'border-teal-500 bg-teal-50 shadow-md'
                                                : 'border-gray-300 bg-white hover:border-teal-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 mr-3 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Image
                                                    src={data.image}
                                                    alt={data.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h3 className="font-semibold text-gray-800">{data.name}</h3>
                                                {data.weight && (
                                                    <p className="text-xs text-gray-600">{data.weight}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-teal-600">
                                                    ¥{data.total.toLocaleString()}
                                                </div>
                                                <p className="text-xs text-gray-500">税込</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 料金詳細セクション */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">料金詳細</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">基本診断費用</span>
                                    <span className="font-semibold">¥{pricingData[selectedCarType].basePrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">基本治療費用</span>
                                    <span className="font-semibold">¥{pricingData[selectedCarType].treatment.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">下廻り洗浄費用</span>
                                    <span className="font-semibold">¥{pricingData[selectedCarType].cleaning.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">代行業務費用</span>
                                    <span className="font-semibold">¥{pricingData[selectedCarType].agency.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">総合検査費用</span>
                                    <span className="font-semibold">¥{pricingData[selectedCarType].inspection.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">法定費用</span>
                                    <span className="font-semibold">¥{pricingData[selectedCarType].statutoryFees.toLocaleString()}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-green-600">割引合計</span>
                                        <span className="font-semibold text-green-600">-¥{totalDiscount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-3 border-b-2 border-teal-500 font-bold text-xl text-teal-600">
                                    <span>最終合計</span>
                                    <span>¥{calculateTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* 割引オプションセクション */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">割引オプション</h2>
                            <div className="space-y-3">
                                {discountOptions.map((discount) => (
                                    <label
                                        key={discount.id}
                                        className="flex items-start p-3 border border-gray-300 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDiscounts.includes(discount.id)}
                                            onChange={() => handleDiscountChange(discount.id)}
                                            className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <span className="font-semibold text-gray-800 text-sm">{discount.name}</span>
                                                    <p className="text-xs text-gray-600 mt-1">{discount.description}</p>
                                                </div>
                                                <span className="text-sm font-bold text-green-600 ml-2 flex-shrink-0">
                                                    -¥{discount.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* お問い合わせセクション */}
                    <div className="bg-teal-50 rounded-2xl p-6 text-center mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">お問い合わせ・ご予約</h2>
                        <p className="text-gray-600 mb-4 text-sm">
                            車検のご予約やご質問がございましたら、お気軽にお電話ください。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="tel:076-268-1788"
                                className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                076-268-1788
                            </a>
                            <a
                                href="https://lin.ee/CKQM0mE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                </svg>
                                LINEで問い合わせ
                            </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            平日 9:00 〜 18:00 / 土曜 9:00 〜 17:00
                        </p>
                    </div>
                </div>
            </main>

            {/* 固定の最終合計表示（モバイルのみ） */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-4 shadow-lg z-40">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">最終合計</span>
                    <span className="text-2xl font-bold text-teal-600">¥{calculateTotal().toLocaleString()}</span>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12 lg:mt-0 mt-20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                                <span className="text-teal-600 font-bold text-sm">港南</span>
                            </div>
                            <h3 className="text-lg font-bold">株式会社港南自動車サービス</h3>
                        </div>
                        <p className="text-gray-300 text-sm">
                            〒920-0336 石川県金沢市金石本町ハ14<br />
                            TEL: <a href="tel:076-268-1788" className="hover:text-teal-300 transition-colors">076-268-1788</a> / FAX: 076-268-3163
                        </p>
                        <div className="border-t border-gray-700 mt-8 pt-8 text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights Reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
