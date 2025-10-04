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
        image: '/cars/nbox.jpg'
    },
    small: {
        name: '小型',
        weight: '車両重量1t以下',
        basePrice: 15900,
        treatment: 3900,
        cleaning: 3800,
        agency: 7800,
        inspection: 8000,
        subtotal: 39400,
        statutoryFees: 35650,
        total: 75050,
        image: '/cars/swift.jpg'
    },
    medium: {
        name: '中型',
        weight: '車両重量1.5t以下',
        basePrice: 16900,
        treatment: 3900,
        cleaning: 3800,
        agency: 7800,
        inspection: 8000,
        subtotal: 40400,
        statutoryFees: 43850,
        total: 84250,
        image: '/cars/corolla.jpg'
    },
    regular: {
        name: '普通',
        weight: '車両重量2t以下',
        basePrice: 19900,
        treatment: 3900,
        cleaning: 3800,
        agency: 7800,
        inspection: 8000,
        subtotal: 43400,
        statutoryFees: 52050,
        total: 95450,
        image: '/cars/cx5.jpg'
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

// メンテナンスパックの定義
const maintenancePacks = {
    comfort: {
        name: '快適パック',
        originalPrice: 7865,
        packPrice: 7080,
        description: '3つのオプションを付けて',
        items: ['キーレス電池交換', 'ワイパーブレード交換(3本)', 'エアコンフィルター交換']
    },
    safety: {
        name: '安心パック',
        originalPrice: 19261,
        packPrice: 17400,
        description: '「快適パック」に追加して',
        items: ['快適パック内容', '下回りサビ止め塗装', 'オイル交換']
    }
};

export default function ShakenPage() {
    const [selectedCarType, setSelectedCarType] = useState<CarType>('light');
    const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
    const [selectedPacks, setSelectedPacks] = useState<string[]>([]);

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
        
        // メンテナンスパックを追加
        selectedPacks.forEach(packId => {
            const pack = maintenancePacks[packId as keyof typeof maintenancePacks];
            if (pack) {
                total += pack.packPrice;
            }
        });
        
        return Math.max(0, total);
    };

    // 基本料金の合計（割引前）
    const getBaseTotal = () => {
        return pricingData[selectedCarType].total;
    };

    const handleDiscountChange = (discountId: number) => {
        setSelectedDiscounts(prev => 
            prev.includes(discountId) 
                ? prev.filter(id => id !== discountId)
                : [...prev, discountId]
        );
    };

    const handlePackChange = (packId: string) => {
        setSelectedPacks(prev => 
            prev.includes(packId) 
                ? prev.filter(id => id !== packId)
                : [...prev, packId]
        );
    };

    const totalDiscount = selectedDiscounts.reduce((sum, discountId) => {
        const discount = discountOptions.find(d => d.id === discountId);
        return sum + (discount ? discount.amount : 0);
    }, 0);

    const totalPacks = selectedPacks.reduce((sum, packId) => {
        const pack = maintenancePacks[packId as keyof typeof maintenancePacks];
        return sum + (pack ? pack.packPrice : 0);
    }, 0);

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center group">
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
                    <Link
                        href="/"
                        className="bg-teal-600 text-white font-medium rounded-md px-4 py-2 hover:bg-teal-700 transition-colors shadow-sm"
                    >
                        ホームに戻る
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* タイトルセクション */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-2 rounded-full mb-4">
                            90分立会い車検
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                            ドクター車検
                        </h1>
                        <p className="text-base text-gray-600 max-w-2xl mx-auto">
                            完全予約制・新車ご購入後の初めての車検の方限定・1日限定3台まで
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 左側：車種選択と料金表示 */}
                        <div className="lg:col-span-1 space-y-6">
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

                            {/* 料金計算結果 */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">料金詳細</h3>
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
                                    {totalPacks > 0 && (
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-blue-600">メンテナンスパック</span>
                                            <span className="font-semibold text-blue-600">+¥{totalPacks.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between py-3 border-b-2 border-teal-500 font-bold text-xl text-teal-600">
                                        <span>最終合計</span>
                                        <span>¥{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 右側：割引オプションとメンテナンスパック */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 割引オプションセクション */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">割引オプション</h2>
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

                            {/* メンテナンスパックセクション */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">メンテナンスパック</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(maintenancePacks).map(([key, pack]) => (
                                        <label
                                            key={key}
                                            className="flex items-start p-4 border border-gray-300 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPacks.includes(key)}
                                                onChange={() => handlePackChange(key)}
                                                className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                            />
                                            <div className="ml-3 flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-gray-800">{pack.name}</h3>
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500 line-through">¥{pack.originalPrice.toLocaleString()}</div>
                                                        <div className="text-sm font-bold text-teal-600">¥{pack.packPrice.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-2">{pack.description}</p>
                                                <ul className="text-xs text-gray-600 space-y-1">
                                                    {pack.items.map((item, index) => (
                                                        <li key={index} className="flex items-center">
                                                            <span className="w-1 h-1 bg-teal-500 rounded-full mr-2"></span>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* お問い合わせセクション */}
                            <div className="bg-teal-50 rounded-2xl p-6 text-center">
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
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
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
