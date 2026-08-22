'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import MobileActionBar from '@/components/MobileActionBar';
import { readUrlParam, writeUrlParams } from '@/lib/urlState';
import { buildContactUrl, handoffToShareText } from '@/lib/contactHandoff';

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
        statutoryFees: 25990,
        total: 65040,
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
        statutoryFees: 35900,
        total: 79240,
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
        statutoryFees: 44100,
        total: 88540,
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
        statutoryFees: 52300,
        total: 100040,
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
        answer: '港南自動車サービスは創業70年の実績があり、金沢市で信頼できる車検サービスを提供しています。最短90分の立会い車検（新車ご購入後の初回車検の方限定）、国家資格を持つ整備士による丁寧な診断が特徴です。'
    },
    {
        question: '車検にかかる時間はどれくらいですか？',
        answer: '港南自動車サービスでは、追加整備がない場合、最短90分で車検が完了します。完全予約制・1日限定3台で、お客様をお待たせしません。なお、90分立会い車検は新車ご購入後、初めての車検の方限定のサービスです。'
    },
    {
        question: '車検費用はいくらくらいかかりますか？',
        answer: '軽自動車で約65,040円〜、普通乗用車で約100,040円〜となります。各種割引制度もご用意しており、最大で約20,000円以上お得になる場合もあります。'
    },
    {
        question: '代車を借りることはできますか？',
        answer: 'はい、代車をご用意しております。当社の代車は全車保険完備で安心です。代車が不要な場合は1,100円の割引が適用されます。'
    },
    {
        question: '立会い車検とはなんですか？',
        answer: 'お客様にお立ち会いいただき、整備士と一緒に愛車の状態を確認しながら進める車検です。現在の状態と必要な処置を専門用語を使わずにご説明するので、納得したうえで整備を進められます。'
    },
    {
        question: 'OBD車検には対応していますか？',
        answer: 'はい、対応しています。令和3年10月以降に登録された国産車（輸入車は令和4年10月以降）はOBD検査が義務化されており、自動ブレーキやレーンキープアシストなどの電子制御装置が正常に作動しているかをコンピューター診断でチェックします。'
    },
    {
        question: '車検費用の支払い方法は何が使えますか？',
        answer: '現金のほか、カード払い、当社ローンがご利用いただけます。車検シール（検査標章）は後日郵送いたします。'
    },
    {
        question: '輸入車や4WD車・ディーゼル車の車検もできますか？',
        answer: 'はい、全メーカー対応しています。なお、輸入車は基本診断費用・基本治療費用がそれぞれ2,200円、フルタイム4WD車・ディーゼル車は総合検査費用が1,100円追加となります。'
    },
    {
        question: '車検はいつから受けられますか？',
        answer: '車検満了日の2ヶ月前から受けられます。2025年4月の制度改正により、満了日の2ヶ月前以降に受ければ次回の有効期間は短縮されません。さらに、満了日の2ヶ月前までにご予約いただくと早期予約割引（2,200円引き）が適用されてお得です。'
    }
];

// 車検費用の内訳の解説データ（チラシ準拠）
const costBreakdownData = [
    {
        no: '01',
        name: '基本診断費用',
        description: '安全にお乗り頂けるよう、法定で定められている項目をチェックし、おクルマの状態を把握します。さらに、コンピューターにより制御される各種装置の故障の有無（OBD検査）も診断します。',
    },
    {
        no: '02',
        name: '基本治療費用',
        description: '安全確保のために最小限必要な治療を行います。ベルト類の調整、ブレーキの清掃及び調整、エアクリーナーの清掃が含まれます。',
    },
    {
        no: '03',
        name: '下廻り洗浄費用',
        description: '不具合箇所の発見をしやすくし、確実に検査を行うために愛車の下廻りの洗浄を行います。',
    },
    {
        no: '04',
        name: '総合検査費用',
        description: '道路運送車両法に基づいた保安基準に適合するかを、検査員が検査機器類を用いて判断・確認を行います。',
    },
    {
        no: '05',
        name: 'OSS申請費用',
        description: '継続検査OSS申請における「申請依頼データ」を作成し、送信する費用です。',
    },
    {
        no: '06',
        name: '法定費用',
        description: '重量税・自賠責保険・印紙代の合計です。次世代自動車（電気自動車・ハイブリッド車・クリーンディーゼル車）は重量税がお安くなります。登録後13年経過した車は重量税が異なります。',
    },
];

export default function ShakenPage() {
    const [selectedCarType, setSelectedCarType] = useState<CarType>('light');
    const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Escapeキーでメニューを閉じ、開閉ボタンにフォーカスを戻す
    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setMenuOpen(false);
            document.getElementById('menu-toggle')?.focus();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen]);


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // ── 見積り条件をURLに反映する（共有・ブックマーク・再読み込みで復元できるように） ──
    // 例: /shaken?type=regular&discounts=1,3,5
    // マウント後にURLを読んで復元する（静的HTMLは既定値のままなので不一致は起きない）
    useEffect(() => {
        const type = readUrlParam('type');
        if (type && type in pricingData) {
            setSelectedCarType(type as CarType);
        }

        const discounts = readUrlParam('discounts');
        if (discounts) {
            const validIds = discounts
                .split(',')
                .map((v) => Number(v))
                .filter((id) => discountOptions.some((opt) => opt.id === id));
            if (validIds.length > 0) setSelectedDiscounts(validIds);
        }
    }, []);

    // 条件が変わったらURLを書き換える。初回はURLからの復元を上書きしないよう飛ばす
    const skipFirstUrlWrite = useRef(true);
    useEffect(() => {
        if (skipFirstUrlWrite.current) {
            skipFirstUrlWrite.current = false;
            return;
        }
        writeUrlParams({
            // 既定値（軽自動車・割引なし）のときはURLに出さない
            type: selectedCarType === 'light' ? null : selectedCarType,
            discounts:
                selectedDiscounts.length > 0
                    ? [...selectedDiscounts].sort((a, b) => a - b).join(',')
                    : null,
        });
    }, [selectedCarType, selectedDiscounts]);

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

    // ── 見積り条件を相談へ引き継ぐための組み立て（docs/blueprints/ux-estimate-handoff.md） ──
    const [lineCopied, setLineCopied] = useState(false);

    // 条件が変わったらコピー済み表示を戻す
    useEffect(() => {
        setLineCopied(false);
    }, [selectedCarType, selectedDiscounts]);

    const estimateLines = useMemo(() => {
        const names = selectedDiscounts
            .map((id) => discountOptions.find((opt) => opt.id === id)?.name)
            .filter(Boolean) as string[];
        return [
            `車種クラス: ${carData.name}（${carData.weight}）`,
            `車検総額の概算: ${finalTotal.toLocaleString()}円`,
            names.length > 0
                ? `適用した割引: ${names.join('・')}（−${totalDiscount.toLocaleString()}円）`
                : '適用した割引: なし',
        ];
    }, [carData, finalTotal, selectedDiscounts, totalDiscount]);

    const estimateContactUrl = useMemo(
        () => buildContactUrl({ category: '車検', lines: estimateLines }),
        [estimateLines]
    );

    // LINEは本文を渡せないため、条件をコピーしてからトーク画面を開く
    const handleLineHandoff = async () => {
        const text = handoffToShareText({ category: '車検', lines: estimateLines });
        try {
            await navigator.clipboard.writeText(text);
            setLineCopied(true);
        } catch {
            // クリップボードが使えない環境でも遷移自体は妨げない
        }
        window.open('https://lin.ee/CKQM0mE', '_blank', 'noopener,noreferrer');
    };


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
        image: 'https://www.kounan-auto.jp/logo.png',
        '@id': 'https://www.kounan-auto.jp',
        url: 'https://www.kounan-auto.jp/shaken',
        telephone: '076-268-1788',
        priceRange: '¥65,040〜',
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
        description: '石川県金沢市の車検・自動車整備専門店。創業70年の実績。最短90分立会い車検（新車購入後の初回車検の方限定）、国家資格整備士による安心の点検・診断。',
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
                    price: '65040',
                    priceCurrency: 'JPY'
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: '普通乗用車車検',
                        description: '普通乗用車（クラウン、アルファード等）の車検'
                    },
                    price: '100040',
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
        <div className="min-h-dvh bg-neutral-50 font-sans text-slate-900 pb-20 overflow-x-hidden">
            {/* 構造化データ（AIクローラーにも見えるよう静的HTMLに含める） */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Header - Fixed & Glassmorphism */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
                <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 transition-transform">
                        <Image src="/logo.png" alt="港南自動車サービス｜石川県金沢市の車検・自動車整備" width={180} height={45} className="w-auto h-10 md:h-12 object-contain" priority />
                    </Link>
                    <nav className="hidden xl:flex items-center gap-7 whitespace-nowrap text-[15px]">
                        <Link href="/shaken" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">車検</Link>
                        <Link href="/#services" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">サービス内容</Link>
                        <Link href="/#cases" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">取扱車種</Link>
                        <Link href="/#company" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">会社情報</Link>
                        <Link href="/recruit" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">採用情報</Link>
                        <Link href="/#contact" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">お問い合わせ</Link>
                        <Link href="/noreta" className="flex h-11 items-center rounded-full bg-teal-700 px-5 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.97]">
                            ノレタ詳細
                        </Link>
                        <Link href="/noridoku" className="flex h-11 items-center rounded-full border border-blue-600 px-5 font-bold text-blue-600 transition-[background-color,color,transform] duration-200 hover:bg-blue-600 hover:text-white active:scale-[0.97]">
                            ノリドク詳細
                        </Link>
                    </nav>
                    <button
                        className="xl:hidden flex size-11 items-center justify-center rounded border border-gray-300 text-gray-900 transition-colors"
                        id="menu-toggle"
                        aria-controls="mobile-menu"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-label="メニューを開く"
                    >
                        <svg aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`}
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
                id="mobile-menu"
                className={`fixed inset-0 overscroll-contain bg-gray-900 z-50 xl:hidden transition-opacity duration-200 flex flex-col items-center justify-center space-y-7 px-6 ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
            >
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    aria-label="メニューを閉じる"
                >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                {[
                    { name: '車検', href: '/shaken' },
                    { name: 'サービス内容', href: '/#services' },
                    { name: '取扱車種', href: '/#cases' },
                    { name: '会社情報', href: '/#company' },
                    { name: '採用情報', href: '/recruit' },
                    { name: 'お問い合わせ', href: '/#contact' }
                ].map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="text-xl font-bold text-white hover:text-teal-300 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        {item.name}
                    </Link>
                ))}
                <Link
                    href="/noreta"
                    className="flex h-14 w-full max-w-xs items-center justify-center rounded bg-teal-700 font-bold text-white"
                    onClick={() => setMenuOpen(false)}
                >
                    ノレタ詳細
                </Link>
                <Link
                    href="/noridoku"
                    className="flex h-14 w-full max-w-xs items-center justify-center rounded border border-white/50 font-bold text-white"
                    onClick={() => setMenuOpen(false)}
                >
                    ノリドク詳細
                </Link>
            </div>

            <main id="main" tabIndex={-1} className="pt-24 md:pt-32">
                {/* パンくずリスト */}
                <Breadcrumb
                    items={[
                        { name: 'ホーム', href: '/' },
                        { name: '車検', href: '/shaken' },
                    ]}
                />
                {/* Hero Section */}
                <section className="container mx-auto px-4 mb-16 relative">
                    <div className={`transition-ui duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="inline-flex items-center px-4 py-1.5 rounded bg-teal-50 text-teal-800 text-xs md:text-sm font-bold mb-6">
                            <span className="flex size-2 bg-teal-700 mr-2"></span>
                            90分立会い車検：ドクター車検
                        </div>
                        <h1 className="text-[32px] md:text-[48px] font-bold tracking-ja text-gray-900 mb-6 leading-[1.35]">
                            金沢市の<span className="text-teal-700">車検</span>なら<br />
                            港南自動車サービス
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                            石川県金沢市で創業70年。国家資格を持つ整備士が、あなたの愛車を徹底的にチェック。完全予約制・1日限定3台、最短90分で完了するプレミアム車検サービスです。※90分立会い車検は、新車ご購入後初めての車検の方限定です。※最短90分で車検を完了させる場合は、追加整備が一切ない場合のみになります。
                        </p>
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute -top-24 -right-24 size-96 bg-teal-100 rounded hidden opacity-40 z-0"></div>
                </section>

                {/* Main Simulator Section */}
                <section className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Left: Input Sidebar */}
                        <div className="lg:col-span-12 space-y-10">
                            {/* Step 1: Car Selection */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <span className="flex items-center justify-center size-8 rounded bg-teal-700 text-white text-sm font-bold">1</span>
                                    <h2 className="text-xl font-bold">車種を選択</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(pricingData).map(([key, data]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedCarType(key as CarType)}
                                            className={`relative overflow-hidden group p-4 rounded-2xl border-2 text-left transition-ui duration-200 ${selectedCarType === key
                                                ? 'border-teal-500 bg-white ring-1 ring-teal-700'
                                                : 'border-white bg-white hover:border-teal-200'
                                                }`}
                                        >
                                            <div className="relative z-10">
                                                <h3 className={`font-bold transition-colors ${selectedCarType === key ? 'text-teal-700' : 'text-slate-800'}`}>{data.name}</h3>
                                                <p className="text-xs text-slate-500 mt-1">{data.weight}</p>
                                                <div className="mt-4 flex items-end justify-between">
                                                    <span className="text-sm font-semibold text-slate-600">¥{data.total.toLocaleString()}~</span>
                                                    <div className={`size-6 rounded-full flex items-center justify-center transition-ui ${selectedCarType === key ? 'bg-teal-500 scale-110' : 'bg-slate-100'}`}>
                                                        <svg aria-hidden="true" className={`size-3.5 ${selectedCarType === key ? 'text-white' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`absolute bottom-0 right-0 size-12 bg-teal-50 rounded-tl-full transition-transform duration-500 ${selectedCarType === key ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}></div>
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
                                        <span className="flex items-center justify-center size-8 rounded bg-teal-700 text-white text-sm font-bold">2</span>
                                        <h2 className="text-xl font-bold">割引を適用</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {discountOptions.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleDiscountToggle(opt.id)}
                                                className={`flex items-center p-4 rounded-xl border-2 transition-ui duration-200 ${selectedDiscounts.includes(opt.id)
                                                    ? 'border-teal-700 bg-teal-50'
                                                    : 'border-white bg-white hover:border-slate-200 shadow-sm'
                                                    }`}
                                            >
                                                <div className="text-2xl mr-4">{opt.icon}</div>
                                                <div className="flex-1 text-left">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-sm font-bold text-slate-800">{opt.name}</h3>
                                                        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded">-{opt.amount.toLocaleString()}円</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Results Card Right */}
                                <div className="md:col-span-7 md:sticky md:top-32">
                                    <div className="bg-slate-900 rounded shadow-2xl overflow-hidden text-white border border-slate-800">
                                        <div className="p-8 md:p-12">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                                <div>
                                                    <p className="u-label mb-2 block text-teal-300">Estimate Total</p>
                                                    <div className="flex items-baseline">
                                                        <span className="text-lg font-bold mr-1">¥</span>
                                                        <span className="text-6xl md:text-7xl font-bold tracking-jaer transition-ui duration-500">
                                                            {finalTotal.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-500 text-xs mt-2 font-medium italic">※部品代・追加整備分は別途となります</p>
                                                </div>
                                                <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-4 border border-slate-700 w-full md:w-auto text-center md:text-left">
                                                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Selected Car</div>
                                                    <div className="text-xl font-bold">{carData.name}</div>
                                                    <div className="text-xs text-teal-400 mt-1 font-bold">{carData.weight}</div>
                                                </div>
                                            </div>

                                            {/* Detailed Breakdown */}
                                            <div className="space-y-4 mb-10">
                                                <div className="flex justify-between text-sm py-4 border-b border-slate-800">
                                                    <span className="text-slate-500 font-medium">基本点検・診断費用</span>
                                                    <span className="font-bold">¥{(carData.basePrice + carData.treatment + carData.cleaning + carData.agency + carData.inspection).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm py-4 border-b border-slate-800">
                                                    <span className="text-slate-500 font-medium flex items-center">
                                                        法定費用
                                                        <span className="ml-2 size-4 rounded bg-slate-700 flex items-center justify-center text-[10px] cursor-help" title="重量税・自賠責保険料・印紙代が含まれます">?</span>
                                                    </span>
                                                    <span className="font-bold text-slate-300">¥{carData.statutoryFees.toLocaleString()}</span>
                                                </div>
                                                {totalDiscount > 0 && (
                                                    <div className="flex justify-between text-sm py-4 border-b border-slate-800">
                                                        <span className="text-teal-300 font-bold italic">適用された割引合計</span>
                                                        <span className="font-bold text-teal-300">−¥{totalDiscount.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* 見積り条件を持ったまま相談へ進む導線
                                                （docs/blueprints/ux-estimate-handoff.md） */}
                                            <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                                                <p className="text-sm font-bold text-white">この条件のまま相談する</p>
                                                <ul className="mt-3 space-y-1 text-xs text-slate-300">
                                                    {estimateLines.map((line, index) => (
                                                        <li key={`${index}-${line}`}>{line}</li>
                                                    ))}
                                                </ul>
                                                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                                                    <Link
                                                        href={estimateContactUrl}
                                                        className="flex items-center justify-center rounded-xl bg-teal-600 px-4 py-4 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-500 active:scale-[0.98]"
                                                    >
                                                        メールで相談
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={handleLineHandoff}
                                                        className="flex items-center justify-center rounded-xl bg-[#06C755] px-4 py-4 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-[#05b04c] active:scale-[0.98]"
                                                    >
                                                        LINEで相談
                                                    </button>
                                                    <Link
                                                        href="tel:076-268-1788"
                                                        className="flex items-center justify-center rounded-xl bg-white px-4 py-4 font-bold text-slate-900 transition-[background-color,transform] duration-200 hover:bg-slate-100 active:scale-[0.98]"
                                                    >
                                                        電話で相談
                                                    </Link>
                                                </div>
                                                {/* コピー完了は読み上げにも届くよう status で知らせる */}
                                                <p
                                                    role="status"
                                                    aria-live="polite"
                                                    className="mt-4 text-xs text-teal-300"
                                                >
                                                    {lineCopied
                                                        ? '条件をコピーしました。LINEのトーク画面に貼り付けてお送りください。'
                                                        : ''}
                                                </p>
                                                <p className="mt-2 text-xs text-slate-400">
                                                    メール・LINEは選んだ条件を引き継ぎます。お電話の場合は、上に表示されている車種と割引をそのままお伝えください。金額は概算で、追加整備があると変わります。
                                                </p>
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
                            <div className="size-14 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6">🩺</div>
                            <h3 className="text-xl font-bold mb-4">精密な「対面」診断</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">ただ車を通すだけではありません。お客様と一緒に車を見ながら、現在の状態と必要な処置を「クルマのプロフェッショナル」が専門用語を使わずに優しく解説します。</p>
                        </article>
                        <article className="bg-white p-8 rounded-3xl border border-slate-200">
                            <div className="size-14 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6">⚡</div>
                            <h3 className="text-xl font-bold mb-4">驚きのスピード (90分)</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">最新の診断機と効率化されたオペレーションにより、最短90分で完了（新車ご購入後の初回車検の方限定）。店内の待合スペースでゆっくり寛いでいる間に、すべてが終わります。</p>
                        </article>
                        <article className="bg-white p-8 rounded-3xl border border-slate-200">
                            <div className="size-14 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6">💎</div>
                            <h3 className="text-xl font-bold mb-4">地域密着の安心保証</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">創業から続く信頼と確かな技術。車検後も1年間の点検保証をお付けし、地域の皆様の安全なカーライフを末永くサポートさせていただきます。</p>
                        </article>
                    </div>

                    {/* Same-Day Section（最短90分・当日完了の案内） */}
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 mb-4">車検は即日で終わる？</h2>
                            <p className="text-slate-500">最短90分・その日のうちに完了する立会い車検をご用意しています。</p>
                        </div>
                        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200">
                            <p className="text-slate-600 leading-relaxed mb-4">
                                港南自動車サービスでは、<b className="text-slate-800">新車ご購入後はじめての車検の方限定</b>で、追加整備がない場合<b className="text-slate-800">最短90分・当日完了の「90分立会い車検」</b>を実施しています。完全予約制・1日限定3台。店内でお待ちいただく間に車検が終わり、その日のままお乗り帰りいただけます。
                            </p>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                2回目以降の車検のお客様も完全予約制で受け付けています。所要時間やお預かりの要否はお車の状態によって異なりますので、ご予約の際にご案内いたします。
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Link href="tel:076-268-1788" className="inline-flex items-center justify-center px-6 py-4 bg-teal-700 text-white rounded-xl font-bold hover:bg-teal-800 transition-colors shadow-md">
                                    お電話で予約（076-268-1788）
                                </Link>
                                <Link href="https://lin.ee/CKQM0mE" className="inline-flex items-center justify-center px-6 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md">
                                    LINEで予約する
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown Section（車検費用の内訳の解説） */}
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 mb-4">車検費用の内訳</h2>
                            <p className="text-slate-500">金沢市の「ドクター車検」の費用は、以下の項目で構成されています。<br className="hidden md:block" />何にいくらかかるのかを明確にし、納得いただける車検をご提供します。</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {costBreakdownData.map((item, idx) => (
                                <article key={idx} className="bg-white p-8 rounded-2xl border border-slate-200">
                                    <div className="flex items-center mb-4">
                                        <span className="text-3xl font-bold text-teal-700/30 mr-3">{item.no}</span>
                                        <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                                </article>
                            ))}
                        </div>
                        <div className="max-w-5xl mx-auto mt-8 bg-slate-100 rounded-2xl p-6">
                            <p className="text-slate-600 text-xs leading-relaxed">
                                ※潤滑剤・ウエス等のショートパーツ代として1,100円〜2,200円が加算されます。※交換部品代金の3%を上限として交換部品処理費を頂いております。※輸入車は基本診断費用・基本治療費用が各2,200円、フルタイム4WD車・ディーゼル車は総合検査費用が1,100円追加となります。※追加整備は別途お見積りいたします。
                            </p>
                        </div>
                    </div>

                    {/* Price Table Section（車種クラス別の車検料金表） */}
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 mb-4">金沢市の車検料金表</h2>
                            <p className="text-slate-500">法定費用込みの総額表示です（2026年4月現在）。</p>
                        </div>
                        <div className="max-w-3xl mx-auto overflow-x-auto">
                            <table className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden text-sm md:text-base">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="py-4 px-4 text-left font-bold">車種クラス</th>
                                        <th className="py-4 px-4 text-left font-bold">対象車種の例</th>
                                        <th className="py-4 px-4 text-right font-bold">車検総額（税込）</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {Object.values(pricingData).map((d) => (
                                        <tr key={d.name}>
                                            <td className="py-4 px-4 font-bold text-slate-800">
                                                {d.name}
                                                <span className="block text-xs text-slate-500 font-medium">{d.weight}</span>
                                            </td>
                                            <td className="py-4 px-4 text-slate-500">{d.description}</td>
                                            <td className="py-4 px-4 text-right font-bold text-teal-700">{d.total.toLocaleString()}円〜</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="max-w-3xl mx-auto text-xs text-slate-500 mt-4 leading-relaxed">
                            ※重量税・自賠責保険・印紙代（法定費用）を含む、割引適用前の総額です。持込・引取割引や早期予約割引など各種割引の組み合わせで最大約20,000円お得になります。交換部品代・追加整備は別途お見積りです。
                        </p>
                    </div>

                    {/* Flow Section */}
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 mb-4">車検当日の流れ</h2>
                            <p className="text-slate-500">完全予約制・1日限定3台。ご予約からお引き渡しまで、スムーズで快適な体験をご提供します。</p>
                        </div>
                        <div className="relative">
                            {/* Connection Line (Desktop) */}
                            <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-slate-200 z-0"></div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                                {[
                                    { step: '01', title: '電話予約', desc: '完全予約制です。お電話またはLINEでご希望日をご予約ください。平日・夕方・土曜の入庫もOKです。' },
                                    { step: '02', title: 'おクルマ入庫', desc: 'ご予約の日時にご来店ください。受付後、すぐに車検作業に入ります。' },
                                    { step: '03', title: '立会い車検作業', desc: '整備士がお客様と一緒に愛車の状態を確認しながら、診断・治療・総合検査を行います。' },
                                    { step: '04', title: '完了・ご精算', desc: '診断結果とアドバイスをご説明後、ご精算。現金・カード・当社ローンがご利用いただけます。' },
                                    { step: '05', title: 'お帰り', desc: '追加整備がなければ最短90分で完了。車検シール（検査標章）は後日郵送いたします。' }
                                ].map((item, idx) => (
                                    <article key={idx} className="bg-white md:bg-transparent p-6 rounded-2xl border border-slate-100 md:border-none">
                                        <div className="size-12 bg-teal-700 text-white rounded flex items-center justify-center text-xs font-bold mb-6 shadow-lg shadow-teal-200">
                                            {item.step}
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Area Section（対応エリア・アクセス） */}
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 mb-4">対応エリア・アクセス</h2>
                            <p className="text-slate-500">金沢市金石本町の整備工場です。</p>
                        </div>
                        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-slate-600 leading-relaxed space-y-3">
                            <p>
                                店舗は<b className="text-slate-800">金沢市金石本町ハ14</b>。金石・大野・寺中など金沢市西部エリアをはじめ、<b className="text-slate-800">金沢市全域の車検</b>に対応しています。
                            </p>
                            <p>
                                完全予約制のため待ち時間が少なく、<b className="text-slate-800">代車は無料</b>（全車保険完備）でご用意しています。ご自身でお持ち込み・お引き取りいただく場合は割引もございます。
                            </p>
                            <p className="text-sm text-slate-500">
                                営業時間：平日 9:00〜18:00 ／ 土曜 9:00〜17:00（日祝定休）　TEL：076-268-1788
                            </p>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div>
                        <div className="text-center mb-16">
                            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 mb-4">よくある質問</h2>
                            <p className="text-slate-500">金沢市での車検に関するご質問にお答えします</p>
                        </div>
                        <div className="max-w-3xl mx-auto space-y-6">
                            {faqData.map((item, idx) => (
                                <article key={idx} className="bg-white p-8 rounded-2xl border border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-start">
                                        <span className="text-teal-700 mr-3">Q.</span>
                                        {item.question}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed pl-8">
                                        <span className="text-teal-700 font-bold mr-2">A.</span>
                                        {item.answer}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-24 bg-gray-900 text-white pt-16 pb-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                        <div>
                            <div className="flex items-center space-x-3 mb-8">
                                <Image
                                    src="/logo.png"
                                    alt="株式会社港南自動車サービス"
                                    width={280}
                                    height={70}
                                    className="h-9 w-auto object-contain brightness-0 invert"
                                />
                                <h3 className="sr-only">港南自動車サービス</h3>
                            </div>
                            <p className="text-white/70 max-w-sm text-sm leading-loose">
                                石川県金沢市で70年にわたり、地域の皆様の安全を守り続けてきました。<br />
                                丁寧な仕事、誠実な説明、そして確かな技術。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="u-label mb-6 block text-gray-500">Contact Information</div>
                            <address className="text-xl font-bold not-italic">石川県金沢市金石本町ハ14</address>
                            <div className="flex flex-col space-y-2">
                                <Link href="tel:076-268-1788" className="u-num text-3xl font-medium text-teal-300 hover:text-white transition-colors">076-268-1788</Link>
                                <span className="text-white/60 text-sm">受付：平日 9:00 - 18:00 / 土曜 9:00 - 17:00 / 日祝定休</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-white/15 flex flex-col md:flex-row justify-between items-center text-white/50 text-xs gap-6">
                        <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                        <nav className="flex space-x-8">
                            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
                            <Link href="/shaken" className="hover:text-white transition-colors">車検について</Link>
                            <Link href="/noreta" className="hover:text-white transition-colors">個人ローン「ノレタ」</Link>
                        </nav>
                    </div>
                </div>
            </footer>

            {/* スマホ用の電話・LINE固定バー */}
            <MobileActionBar />
        </div>
    );
}
