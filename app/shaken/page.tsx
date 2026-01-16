'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

// 車種タイプの定義
type CarType = 'light' | 'small' | 'medium' | 'regular';

// 料金データの定義
const pricingData = {
    light: {
        name: '軽自動車',
        weight: '全般',
        basePrice: 15290,
        treatment: 3630,
        cleaning: 3300,
        agency: 8580,
        inspection: 8250,
        statutoryFees: 26040,
        total: 65090,
        image: '/cars/delicamini.jpg',
        description: 'ハスラー、タント、N-BOXなど'
    },
    small: {
        name: '小型乗用車',
        weight: '1.0t以下',
        basePrice: 17490,
        treatment: 4290,
        cleaning: 4180,
        agency: 8580,
        inspection: 8800,
        statutoryFees: 35850,
        total: 79190,
        image: '/cars/xbee.jpg',
        description: 'ヴィッツ、フィット、パッソなど'
    },
    medium: {
        name: '中型乗用車',
        weight: '1.5t以下',
        basePrice: 18590,
        treatment: 4290,
        cleaning: 4180,
        agency: 8580,
        inspection: 8800,
        statutoryFees: 44050,
        total: 88490,
        image: '/cars/harrier.jpg',
        description: 'カローラ、プリウス、アクセラなど'
    },
    regular: {
        name: '普通乗用車',
        weight: '2.0t以下',
        basePrice: 21890,
        treatment: 4290,
        cleaning: 4180,
        agency: 8580,
        inspection: 8800,
        statutoryFees: 52250,
        total: 99990,
        image: '/cars/alphard.jpg',
        description: 'クラウン、アルファード、エルグランドなど'
    }
};

// 割引オプションの定義
const discountOptions = [
    { id: 1, name: '持込・引取割引', amount: 2200, icon: '🚗', description: 'ご自身でのお持ち込み・お引き取り' },
    { id: 2, name: '代車不要割引', amount: 1100, icon: '✨', description: '代車を使用されない場合' },
    { id: 3, name: '早期予約割引', amount: 2200, icon: '📅', description: '2ヶ月前までのご予約' },
    { id: 4, name: '先取車検割引', amount: 4400, icon: '🎟️', description: '次回車検を今回予約される場合' },
    { id: 5, name: '新車初回割引', amount: 3300, icon: '🆕', description: '当社ご購入車の初回車検' },
    { id: 6, name: '点検実施割引', amount: 2200, icon: '🛠️', description: '12ヶ月点検を受けられた方' },
    { id: 7, name: 'プレミアムパス', amount: 2200, icon: '💳', description: 'プレミアムカードをお持ちの方' },
    { id: 8, name: '初入庫割引', amount: 2200, icon: '🤝', description: '初めてご利用のお客様' }
];

// FAQ データ（構造化データ用）
const faqData = [
    {
        question: '金沢市で車検を受けるならどこがおすすめですか？',
        answer: '港南自動車サービスは創業60年以上の実績があり、金沢市で信頼できる車検サービスを提供しています。最短90分のスピード車検、国家資格を持つ整備士による丁寧な診断が特徴です。'
    },
    {
        question: '車検にかかる時間はどれくらいですか？',
        answer: '港南自動車サービスでは、追加整備がない場合、最短90分で車検が完了します。完全予約制・1日限定3台で、お客様をお待たせしません。'
    },
    {
        question: '車検費用はいくらくらいかかりますか？',
        answer: '軽自動車で約65,090円〜、普通乗用車で約99,990円〜となります。各種割引制度もご用意しており、最大で約20,000円以上お得になる場合もあります。'
    },
    {
        question: '代車を借りることはできますか？',
        answer: 'はい、代車をご用意しております。代車が不要な場合は1,100円の割引が適用されます。'
    }
];

export default function ShakenPage() {
    const [selectedCarType, setSelectedCarType] = useState<CarType>('light');
    const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const carData = useMemo(() => pricingData[selectedCarType], [selectedCarType]);

    const totalDiscount = useMemo(() => {
        return selectedDiscounts.reduce((sum, id) => {
            const discount = discountOptions.find(d => d.id === id);
            return sum + (discount ? discount.amount : 0);
        }, 0);
    }, [selectedDiscounts]);

    const finalTotal = useMemo(() => {
        return Math.max(0, carData.total - totalDiscount);
    }, [carData, totalDiscount]);

    const handleDiscountToggle = (id: number) => {
        setSelectedDiscounts(prev =>
            prev.includes(id) ? prev.filter(dId => dId !== id) : [...prev, id]
        );
    };

    // LocalBusiness + AutoRepair 構造化データ
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'AutoRepair'],
        name: '港南自動車サービス株式会社',
        image: 'https://kounan-auto.jp/logo.png',
        '@id': 'https://kounan-auto.jp',
        url: 'https://kounan-auto.jp/shaken',
        telephone: '076-268-1788',
        priceRange: '¥65,090〜',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '金石本町ハ14番地',
            addressLocality: '金沢市',
            addressRegion: '石川県',
            postalCode: '920-0336',
            addressCountry: 'JP'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 36.6268,
            longitude: 136.6406
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00'
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '09:00',
                closes: '17:00'
            }
        ],
        description: '石川県金沢市の車検・自動車整備専門店。創業60年以上の実績。最短90分スピード車検、国家資格整備士による安心の点検・診断。',
        areaServed: {
            '@type': 'City',
            name: '金沢市'
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: '車検サービス',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: '軽自動車車検',
                        description: '軽自動車（ハスラー、タント、N-BOX等）の車検'
                    },
                    price: '65090',
                    priceCurrency: 'JPY'
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: '普通乗用車車検',
                        description: '普通乗用車（クラウン、アルファード等）の車検'
                    },
                    price: '99990',
                    priceCurrency: 'JPY'
                }
            ]
        }
    };

    // FAQPage 構造化データ
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqData.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-slate-900 pb-20 overflow-x-hidden">
            {/* 構造化データ */}
            <Script
                id="local-business-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Header - Fixed & Glassmorphism */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-[1.02]">
                        <Image src="/logo.png" alt="港南自動車サービス｜石川県金沢市の車検・自動車整備" width={180} height={45} className="w-auto h-10 md:h-12 object-contain" priority />
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <Link href="/#services" className="text-slate-600 hover:text-teal-600 transition-colors">サービス内容</Link>
                        <Link href="/#cases" className="text-slate-600 hover:text-teal-600 transition-colors">取扱車種</Link>
                        <Link href="/#company" className="text-slate-600 hover:text-teal-600 transition-colors">会社情報</Link>
                        <Link href="/#contact" className="text-slate-600 hover:text-teal-600 transition-colors">お問い合わせ</Link>
                        <Link href="/shaken" className="text-slate-600 hover:text-teal-600 transition-colors">車検</Link>
                        <Link href="/recruit" className="text-slate-600 hover:text-teal-600 transition-colors">採用情報</Link>
                        <Link href="/noreta" className="text-white bg-teal-600 px-5 py-2.5 rounded-full hover:bg-teal-700 transition-all shadow-md hover:shadow-lg">
                            ノレタ詳細
                        </Link>
                        <Link href="/noridoku" className="text-white bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                            ノリドク詳細
                        </Link>
                    </nav>
                    <button
                        className="md:hidden p-2 rounded-xl bg-teal-600 text-white transition-all duration-300"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-label="メニューを開く"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
                        >
                            {menuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile menu */}
            <div
                className={`fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[60] md:hidden transition-all duration-500 flex flex-col items-center justify-center space-y-8 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    aria-label="メニューを閉じる"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                {[
                    { name: 'サービス内容', href: '/#services' },
                    { name: '取扱車種', href: '/#cases' },
                    { name: '会社情報', href: '/#company' },
                    { name: 'お問い合わせ', href: '/#contact' },
                    { name: '車検', href: '/shaken' },
                    { name: '採用情報', href: '/recruit' }
                ].map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="text-2xl font-bold text-white hover:text-teal-400 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        {item.name}
                    </Link>
                ))}
                <Link
                    href="/noreta"
                    className="px-10 py-4 bg-teal-500 text-white rounded-full font-bold text-xl shadow-2xl"
                    onClick={() => setMenuOpen(false)}
                >
                    ノレタ詳細
                </Link>
                <Link
                    href="/noridoku"
                    className="px-10 py-4 bg-blue-500 text-white rounded-full font-bold text-xl shadow-2xl"
                    onClick={() => setMenuOpen(false)}
                >
                    ノリドク詳細
                </Link>
            </div>

            <main className="pt-24 md:pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-4 mb-16 relative">
                    <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs md:text-sm font-bold mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                            90分立会い車検：ドクター車検
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                            金沢市の<span className="text-teal-600">車検</span>なら<br />
                            港南自動車サービス
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                            石川県金沢市で創業60年以上。国家資格を持つ整備士が、あなたの愛車を徹底的にチェック。完全予約制・1日限定3台、最短90分で完了するプレミアム車検サービスです。※最短90分で車検を完了させる場合は、追加整備が一切ない場合のみになります。
                        </p>
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40 z-[-1]"></div>
                </section>

                {/* Main Simulator Section */}
                <section className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Left: Input Sidebar */}
                        <div className="lg:col-span-12 space-y-10">
                            {/* Step 1: Car Selection */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-bold">1</span>
                                    <h2 className="text-xl font-bold">車種を選択</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(pricingData).map(([key, data]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedCarType(key as CarType)}
                                            className={`relative overflow-hidden group p-4 rounded-2xl border-2 text-left transition-all duration-300 ${selectedCarType === key
                                                ? 'border-teal-500 bg-white ring-4 ring-teal-500/10'
                                                : 'border-white bg-white hover:border-teal-200'
                                                }`}
                                        >
                                            <div className="relative z-10">
                                                <h3 className={`font-bold transition-colors ${selectedCarType === key ? 'text-teal-600' : 'text-slate-800'}`}>{data.name}</h3>
                                                <p className="text-xs text-slate-400 mt-1">{data.weight}</p>
                                                <div className="mt-4 flex items-end justify-between">
                                                    <span className="text-sm font-semibold text-slate-600">¥{data.total.toLocaleString()}~</span>
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedCarType === key ? 'bg-teal-500 scale-110' : 'bg-slate-100'}`}>
                                                        <svg className={`w-3.5 h-3.5 ${selectedCarType === key ? 'text-white' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-12 h-12 bg-teal-50 rounded-tl-full transition-transform duration-500 ${selectedCarType === key ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Summary Floating Card */}
                        <div className="lg:col-span-12 space-y-6 mt-10">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                {/* Discount Selector Left */}
                                <div className="md:col-span-5 space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-bold">2</span>
                                        <h2 className="text-xl font-bold">割引を適用</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {discountOptions.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleDiscountToggle(opt.id)}
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${selectedDiscounts.includes(opt.id)
                                                    ? 'border-green-400 bg-green-50/50'
                                                    : 'border-white bg-white hover:border-slate-200 shadow-sm'
                                                    }`}
                                            >
                                                <div className="text-2xl mr-4">{opt.icon}</div>
                                                <div className="flex-1 text-left">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-sm font-bold text-slate-800">{opt.name}</h3>
                                                        <span className="text-xs font-black text-green-600 bg-green-100 px-2 py-1 rounded">-{opt.amount.toLocaleString()}円</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1">{opt.description}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Results Card Right */}
                                <div className="md:col-span-7 md:sticky md:top-32">
                                    <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-teal-900/20 overflow-hidden text-white border border-slate-800">
                                        <div className="p-8 md:p-12">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                                <div>
                                                    <p className="text-teal-400 text-xs font-black tracking-widest uppercase mb-2">Estimate Total</p>
                                                    <div className="flex items-baseline">
                                                        <span className="text-lg font-bold mr-1">¥</span>
                                                        <span className="text-6xl md:text-7xl font-black tracking-tighter transition-all duration-500">
                                                            {finalTotal.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-400 text-xs mt-2 font-medium italic">※部品代・追加整備分は別途となります</p>
                                                </div>
                                                <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700 w-full md:w-auto text-center md:text-left">
                                                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Selected Car</div>
                                                    <div className="text-xl font-black">{carData.name}</div>
                                                    <div className="text-xs text-teal-400 mt-1 font-bold">{carData.weight}</div>
                                                </div>
                                            </div>

                                            {/* Detailed Breakdown */}
                                            <div className="space-y-4 mb-10">
                                                <div className="flex justify-between text-sm py-4 border-b border-slate-800">
                                                    <span className="text-slate-400 font-medium">基本点検・診断費用</span>
                                                    <span className="font-bold">¥{(carData.basePrice + carData.treatment + carData.cleaning + carData.agency + carData.inspection).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm py-4 border-b border-slate-800">
                                                    <span className="text-slate-400 font-medium flex items-center">
                                                        法定費用
                                                        <span className="ml-2 w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] cursor-help" title="重量税・自賠責保険料・印紙代が含まれます">?</span>
                                                    </span>
                                                    <span className="font-bold text-slate-300">¥{carData.statutoryFees.toLocaleString()}</span>
                                                </div>
                                                {totalDiscount > 0 && (
                                                    <div className="flex justify-between text-sm py-4 border-b border-slate-800">
                                                        <span className="text-green-400 font-bold italic">適用された割引合計</span>
                                                        <span className="font-black text-green-400">−¥{totalDiscount.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Link href="tel:076-268-1788" className="flex items-center justify-center bg-white text-slate-900 font-black px-8 py-5 rounded-2xl transition-transform hover:scale-[1.03] active:scale-95 shadow-xl">
                                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" /></svg>
                                                    お電話で予約
                                                </Link>
                                                <Link href="https://lin.ee/CKQM0mE" className="flex items-center justify-center bg-green-500 text-white font-black px-8 py-5 rounded-2xl transition-transform hover:scale-[1.03] active:scale-95 shadow-xl">
                                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
                                                    LINEで予約
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info Sections: Why Choose Us & Flow */}
                <section className="container mx-auto px-4 mt-32 space-y-32">
                    {/* Unique Value Props */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <article className="bg-white p-8 rounded-3xl border border-slate-200">
                            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6">🩺</div>
                            <h3 className="text-xl font-black mb-4">精密な「対面」診断</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">ただ車を通すだけではありません。お客様と一緒に車を見ながら、現在の状態と必要な処置を「クルマのプロフェッショナル」が専門用語を使わずに優しく解説します。</p>
                        </article>
                        <article className="bg-white p-8 rounded-3xl border border-slate-200">
                            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6">⚡</div>
                            <h3 className="text-xl font-black mb-4">驚きのスピード (90分)</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">最新の診断機と効率化されたオペレーションにより、最短90分で完了。店内の待合ペースでゆっくり寛いでいる間に、すべてが終わります。</p>
                        </article>
                        <article className="bg-white p-8 rounded-3xl border border-slate-200">
                            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6">💎</div>
                            <h3 className="text-xl font-black mb-4">地域密着の安心保証</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">創業から続く信頼と確かな技術。車検後も1年間の点検保証をお付けし、地域の皆様の安全なカーライフを末永くサポートさせていただきます。</p>
                        </article>
                    </div>

                    {/* Flow Section */}
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">車検当日の流れ</h2>
                            <p className="text-slate-500">ご予約からお引き渡しまで、スムーズで快適な体験をご提供します。</p>
                        </div>
                        <div className="relative">
                            {/* Connection Line (Desktop) */}
                            <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-slate-200 z-0"></div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                                {[
                                    { step: '01', title: '受付', desc: 'お車をお預かりし、おクルマの健康状態をお伺いします。' },
                                    { step: '02', title: '検査・問診', desc: '整備士が全項目を丁寧にチェック。お客様にもご確認いただきます。' },
                                    { step: '03', title: '処置・メンテナンス', desc: '必要な処置を迅速に行い、最高のコンディションに調整します。' },
                                    { step: '04', title: 'ご精算', desc: '診断結果とメンテナンスのアドバイスをお伝えし完了です。' }
                                ].map((item, idx) => (
                                    <article key={idx} className="bg-white md:bg-transparent p-6 rounded-2xl border border-slate-100 md:border-none">
                                        <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-black mb-6 shadow-lg shadow-teal-200">
                                            {item.step}
                                        </div>
                                        <h4 className="text-lg font-black mb-2">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">よくある質問</h2>
                            <p className="text-slate-500">金沢市での車検に関するご質問にお答えします</p>
                        </div>
                        <div className="max-w-3xl mx-auto space-y-6">
                            {faqData.map((item, idx) => (
                                <article key={idx} className="bg-white p-8 rounded-2xl border border-slate-200">
                                    <h3 className="text-lg font-black text-slate-800 mb-4 flex items-start">
                                        <span className="text-teal-600 mr-3">Q.</span>
                                        {item.question}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed pl-8">
                                        <span className="text-teal-600 font-bold mr-2">A.</span>
                                        {item.answer}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-40 bg-slate-950 text-white pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                        <div>
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-slate-950 font-black text-[10px]">KONAN</span>
                                </div>
                                <h3 className="text-2xl font-black">港南自動車サービス</h3>
                            </div>
                            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                                石川県金沢市で半世紀以上にわたり、地域の皆様の安全を守り続けてきました。<br />
                                丁寧な仕事、誠実な説明、そして確かな技術。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Contact Information</div>
                            <address className="text-xl font-bold not-italic">石川県金沢市金石本町ハ14</address>
                            <div className="flex flex-col space-y-2">
                                <Link href="tel:076-268-1788" className="text-3xl font-black text-teal-400 hover:text-white transition-colors">076-268-1788</Link>
                                <span className="text-slate-500 text-sm">受付：平日 9:00 - 18:00 / 土曜 9:00 - 17:00</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-6">
                        <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                        <nav className="flex space-x-8">
                            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
                            <Link href="/shaken" className="hover:text-white transition-colors">車検について</Link>
                            <Link href="/noreta" className="hover:text-white transition-colors">個人リース「ノレタ」</Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}
