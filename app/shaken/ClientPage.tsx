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
    { id: 1, name: '持込・引取割引', amount: 2200, description: 'ご自身でのお持ち込み・お引き取り' },
    { id: 2, name: '代車不要割引', amount: 1100, description: '代車を使用されない場合' },
    { id: 3, name: '早期予約割引', amount: 2200, description: '2ヶ月前までのご予約' },
    { id: 4, name: '先取車検割引', amount: 4400, description: '次回車検を今回予約される場合' },
    { id: 5, name: '新車初回割引', amount: 3300, description: '当社ご購入車の初回車検' },
    { id: 6, name: '点検実施割引', amount: 2200, description: '12ヶ月点検を受けられた方' },
    { id: 7, name: 'プレミアムパス', amount: 2200, description: 'プレミアムカードをお持ちの方' },
    { id: 8, name: '初入庫割引', amount: 2200, description: '初めてご利用のお客様' }
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

// 見積書の明細行に対応する費用項目（チラシ準拠）。
// no は見積書の記載順、amountKey は pricingData のどの金額に対応するかを指す。
const costBreakdownData: {
    no: string;
    name: string;
    amountKey: 'basePrice' | 'treatment' | 'cleaning' | 'inspection' | 'agency' | 'statutoryFees';
    description: string;
}[] = [
    {
        no: '01',
        name: '基本診断費用',
        amountKey: 'basePrice',
        description: '安全にお乗り頂けるよう、法定で定められている項目をチェックし、おクルマの状態を把握します。さらに、コンピューターにより制御される各種装置の故障の有無（OBD検査）も診断します。',
    },
    {
        no: '02',
        name: '基本治療費用',
        amountKey: 'treatment',
        description: '安全確保のために最小限必要な治療を行います。ベルト類の調整、ブレーキの清掃及び調整、エアクリーナーの清掃が含まれます。',
    },
    {
        no: '03',
        name: '下廻り洗浄費用',
        amountKey: 'cleaning',
        description: '不具合箇所の発見をしやすくし、確実に検査を行うために愛車の下廻りの洗浄を行います。',
    },
    {
        no: '04',
        name: '総合検査費用',
        amountKey: 'inspection',
        description: '道路運送車両法に基づいた保安基準に適合するかを、検査員が検査機器類を用いて判断・確認を行います。',
    },
    {
        no: '05',
        name: 'OSS申請費用',
        amountKey: 'agency',
        description: '継続検査OSS申請における「申請依頼データ」を作成し、送信する費用です。',
    },
    {
        no: '06',
        name: '法定費用',
        amountKey: 'statutoryFees',
        description: '重量税・自賠責保険・印紙代の合計です。次世代自動車（電気自動車・ハイブリッド車・クリーンディーゼル車）は重量税がお安くなります。登録後13年経過した車は重量税が異なります。',
    },
];

// ヘッダー・モバイルメニュー共通のナビゲーション項目
const navItems = [
    { name: '車検', href: '/shaken' },
    { name: 'サービス内容', href: '/#services' },
    { name: '取扱車種', href: '/#cases' },
    { name: '会社情報', href: '/#company' },
    { name: '採用情報', href: '/recruit' },
    { name: 'お問い合わせ', href: '/#contact' },
];

// 車検当日の流れ。ここでの番号は実際の順序を表す
const flowSteps = [
    { step: '01', title: '電話予約', desc: '完全予約制です。お電話またはLINEでご希望日をご予約ください。平日・夕方・土曜の入庫もOKです。' },
    { step: '02', title: 'おクルマ入庫', desc: 'ご予約の日時にご来店ください。受付後、すぐに車検作業に入ります。' },
    { step: '03', title: '立会い車検作業', desc: '整備士がお客様と一緒に愛車の状態を確認しながら、診断・治療・総合検査を行います。' },
    { step: '04', title: '完了・ご精算', desc: '診断結果とアドバイスをご説明後、ご精算。現金・カード・当社ローンがご利用いただけます。' },
    { step: '05', title: 'お帰り', desc: '追加整備がなければ最短90分で完了。車検シール（検査標章）は後日郵送いたします。' },
];

// ドクター車検の特長
const featureData = [
    {
        title: '精密な「対面」診断',
        body: 'ただ車を通すだけではありません。お客様と一緒に車を見ながら、現在の状態と必要な処置を「クルマのプロフェッショナル」が専門用語を使わずに優しく解説します。',
    },
    {
        title: '驚きのスピード（90分）',
        body: '最新の診断機と効率化されたオペレーションにより、最短90分で完了（新車ご購入後の初回車検の方限定）。店内の待合スペースでゆっくり寛いでいる間に、すべてが終わります。',
    },
    {
        title: '地域密着の安心保証',
        body: '創業から続く信頼と確かな技術。車検後も1年間の点検保証をお付けし、地域の皆様の安全なカーライフを末永くサポートさせていただきます。',
    },
];

export default function ShakenPage() {
    const [selectedCarType, setSelectedCarType] = useState<CarType>('light');
    const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);

    // メニューを開いている間の焦点の扱い。
    // 背面（ヘッダー・本文・フッター・固定バー）を inert にしてタブ移動が抜け出さないようにし、
    // 開いたらメニュー内へフォーカスを移す。閉じたら開閉ボタンへ戻す。
    // inert はブラウザ標準の仕組みなので、タブ順の巡回を自前で実装する必要がない
    useEffect(() => {
        if (!menuOpen) return;

        const menu = document.getElementById('mobile-menu');
        const background = menu?.parentElement
            ? ([...menu.parentElement.children].filter(
                  (el) => el !== menu && el.tagName !== 'SCRIPT'
              ) as HTMLElement[])
            : [];

        background.forEach((el) => el.setAttribute('inert', ''));
        document.getElementById('menu-close')?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setMenuOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            // inert を外してからでないとフォーカスを戻せない
            background.forEach((el) => el.removeAttribute('inert'));
            document.getElementById('menu-toggle')?.focus();
        };
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

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

    // 見積書の明細行。費用項目の定義から選択中の車種の金額を引く
    const estimateRows = useMemo(
        () => costBreakdownData.map((item) => ({ ...item, amount: carData[item.amountKey] })),
        [carData]
    );

    // 適用中の割引（見積書の控除行として並べる）
    const appliedDiscounts = useMemo(
        () => discountOptions.filter((opt) => selectedDiscounts.includes(opt.id)),
        [selectedDiscounts]
    );

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
    // いまの条件を表す文字列。コピー済み表示はこれと突き合わせて描画時に判定するので、
    // 条件が変わればコピー済み表示は自動的に消える
    const conditionKey = `${selectedCarType}:${[...selectedDiscounts].sort((a, b) => a - b).join(',')}`;
    const [copiedCondition, setCopiedCondition] = useState<string | null>(null);
    const lineCopied = copiedCondition === conditionKey;

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
            setCopiedCondition(conditionKey);
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
        <div className="min-h-dvh bg-white text-gray-900">
            {/* 構造化データ（AIクローラーにも見えるよう静的HTMLに含める） */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Header */}
            <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between gap-6 md:h-20">
                    <Link href="/" className="flex shrink-0 items-center">
                        <Image
                            src="/logo.png"
                            alt="港南自動車サービス｜石川県金沢市の車検・自動車整備"
                            width={280}
                            height={70}
                            className="h-8 w-auto object-contain md:h-10"
                            priority
                        />
                    </Link>

                    <nav
                        className="hidden items-center gap-6 whitespace-nowrap text-[15px] text-gray-700 xl:flex"
                        aria-label="メインメニュー"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                aria-current={item.href === '/shaken' ? 'page' : undefined}
                                className={`group relative py-1.5 transition-colors hover:text-teal-700 ${
                                    item.href === '/shaken' ? 'font-bold text-teal-700' : ''
                                }`}
                            >
                                {item.name}
                                <span
                                    className={`absolute inset-x-0 bottom-0 h-px origin-left bg-current transition-transform duration-200 group-hover:scale-x-100 ${
                                        item.href === '/shaken' ? 'scale-x-100' : 'scale-x-0'
                                    }`}
                                    aria-hidden="true"
                                />
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-5 whitespace-nowrap xl:flex">
                        <a
                            href="tel:076-268-1788"
                            className="flex flex-col leading-none text-gray-900 transition-colors hover:text-teal-700"
                        >
                            <span className="u-num text-lg font-medium tracking-wide">
                                076-268-1788
                            </span>
                            <span className="mt-1 text-[10px] text-gray-500">
                                平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                            </span>
                        </a>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/noreta"
                                className="flex h-11 items-center rounded-full bg-teal-700 px-5 text-sm font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.97]"
                            >
                                ノレタ
                            </Link>
                            <Link
                                href="/noridoku"
                                className="flex h-11 items-center rounded-full border border-blue-600 px-5 text-sm font-bold text-blue-600 transition-[background-color,color,transform] duration-200 hover:bg-blue-600 hover:text-white active:scale-[0.97]"
                            >
                                ノリドク
                            </Link>
                        </div>
                    </div>

                    <button
                        className="flex size-11 items-center justify-center rounded border border-gray-300 text-gray-900 transition-colors xl:hidden"
                        id="menu-toggle"
                        aria-controls="mobile-menu"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                    >
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile menu */}
            <div
                id="mobile-menu"
                className={`fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-gray-900 pb-16 pt-6 transition-opacity duration-200 xl:hidden ${
                    menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            >
                <div className="container flex items-center justify-between">
                    <Image
                        src="/logo.png"
                        alt=""
                        width={280}
                        height={70}
                        className="h-8 w-auto object-contain brightness-0 invert"
                    />
                    <button
                        id="menu-close"
                        onClick={() => setMenuOpen(false)}
                        className="flex size-11 items-center justify-center rounded border border-white/40 text-white"
                        aria-label="メニューを閉じる"
                    >
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                        >
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="container mt-6" aria-label="メインメニュー（モバイル）">
                    <ul className="border-t border-white/15">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className="flex items-center justify-between border-b border-white/15 py-5 text-lg font-bold text-white"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.name}
                                    <ArrowRight className="text-white/50" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <Link
                            href="/noreta"
                            className="flex h-14 items-center justify-center rounded bg-teal-700 font-bold text-white"
                            onClick={() => setMenuOpen(false)}
                        >
                            ノレタ
                        </Link>
                        <Link
                            href="/noridoku"
                            className="flex h-14 items-center justify-center rounded border border-white/50 font-bold text-white"
                            onClick={() => setMenuOpen(false)}
                        >
                            ノリドク
                        </Link>
                    </div>

                    <a href="tel:076-268-1788" className="mt-8 block border-t border-white/15 pt-6">
                        <span className="text-xs text-white/60">お電話でのご相談</span>
                        <span className="u-num mt-1 block text-3xl font-medium text-white">
                            076-268-1788
                        </span>
                    </a>
                </nav>
            </div>

            <main id="main" tabIndex={-1} className="pt-16 md:pt-20">
                {/* パンくずリスト */}
                <Breadcrumb
                    items={[
                        { name: 'ホーム', href: '/' },
                        { name: '車検', href: '/shaken' },
                    ]}
                />

                {/* Hero Section */}
                <section className="bg-white pb-16 pt-6 md:pb-20 md:pt-8">
                    <div className="container">
                        <hr className="u-road" aria-hidden="true" />

                        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
                            <div className="lg:col-span-7">
                                <p
                                    className="animate-fade-in-up flex items-center gap-4 text-xs text-gray-600 opacity-0 md:text-sm"
                                    style={{ animationDelay: '0.1s' }}
                                >
                                    <span className="h-px w-10 bg-teal-700" aria-hidden="true" />
                                    <span>90分立会い車検：ドクター車検</span>
                                </p>

                                <h1
                                    className="animate-fade-in-up mt-6 text-[32px] font-bold leading-[1.35] tracking-ja text-gray-900 opacity-0 md:text-[46px]"
                                    style={{ animationDelay: '0.2s' }}
                                >
                                    金沢市の<span className="text-teal-700">車検</span>なら
                                    <br />
                                    港南自動車サービス
                                </h1>

                                <p
                                    className="animate-fade-in-up mt-7 max-w-xl text-[15px] leading-loose text-gray-600 opacity-0 md:text-base"
                                    style={{ animationDelay: '0.3s' }}
                                >
                                    石川県金沢市で創業70年。国家資格を持つ整備士が、あなたの愛車を徹底的にチェック。完全予約制・1日限定3台、最短90分で完了するプレミアム車検サービスです。
                                </p>

                                <p
                                    className="animate-fade-in-up mt-5 max-w-md border-l-2 border-mint-300 pl-4 text-[13px] leading-loose text-gray-500 opacity-0"
                                    style={{ animationDelay: '0.35s' }}
                                >
                                    ※90分立会い車検は、新車ご購入後初めての車検の方限定です。
                                    <br />
                                    ※最短90分で車検を完了させる場合は、追加整備が一切ない場合のみになります。
                                </p>

                                <div
                                    className="animate-fade-in-up mt-9 flex flex-col gap-3 opacity-0 sm:flex-row"
                                    style={{ animationDelay: '0.4s' }}
                                >
                                    <a
                                        href="#estimate"
                                        className="group flex h-14 items-center justify-between gap-8 rounded-xl bg-teal-700 px-7 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                                    >
                                        車検費用を見積もる
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </a>
                                    <a
                                        href="tel:076-268-1788"
                                        className="group flex h-14 items-center justify-between gap-8 rounded-xl border border-gray-300 px-7 text-[15px] font-bold text-gray-900 transition-[background-color,border-color,transform] duration-200 hover:border-teal-700 hover:bg-gray-50 active:scale-[0.98]"
                                    >
                                        電話で予約する
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>

                            {/* 要点の欄。記録票の「記入済みの欄」として読ませる */}
                            <div
                                className="animate-fade-in-up opacity-0 lg:col-span-5"
                                style={{ animationDelay: '0.45s' }}
                            >
                                <dl className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
                                    {[
                                        { term: '最短所要時間', value: '90分', note: '追加整備がない場合' },
                                        { term: '1日の受付台数', value: '3台', note: '完全予約制' },
                                        { term: '車検総額', value: '65,040円〜', note: '軽自動車・法定費用込み' },
                                        { term: '創業', value: '1956年', note: '金沢市金石本町' },
                                    ].map((row, index) => (
                                        <div
                                            key={row.term}
                                            className={`flex items-baseline justify-between gap-4 py-4 ${
                                                index === 0 ? 'pt-0' : 'border-t border-gray-200'
                                            }`}
                                        >
                                            <dt className="text-sm text-gray-600">
                                                {row.term}
                                                <span className="mt-0.5 block text-[11px] text-gray-500">
                                                    {row.note}
                                                </span>
                                            </dt>
                                            <dd className="u-num shrink-0 text-xl font-medium text-gray-900">
                                                {row.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 見積りセクション（車種と割引を選び、見積書として読む） */}
                <section id="estimate" className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                    車検費用を見積もる
                                </h2>
                                <span className="u-chip">Estimate</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                                車種クラスと当てはまる割引を選ぶと、見積書のかたちで概算をお出しします。そのままの条件で電話・LINE・メールのご相談に進めます。
                            </p>
                        </header>

                        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
                            {/* 選択欄 */}
                            <div className="space-y-8 lg:col-span-5">
                                <fieldset className="rounded-2xl border border-gray-200 bg-white p-6 md:p-7">
                                    <legend className="u-label px-1">車種クラス</legend>
                                    <div className="mt-4 space-y-2">
                                        {Object.entries(pricingData).map(([key, data]) => {
                                            const checked = selectedCarType === key;
                                            return (
                                                <label
                                                    key={key}
                                                    className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3.5 transition-colors duration-200 ${
                                                        checked
                                                            ? 'border-teal-700 bg-mint-50'
                                                            : 'border-gray-200 bg-white hover:border-mint-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="car-type"
                                                        value={key}
                                                        checked={checked}
                                                        onChange={() => setSelectedCarType(key as CarType)}
                                                        className="size-5 shrink-0 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white transition-colors duration-200 checked:border-[6px] checked:border-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                                    />
                                                    <span className="flex-1">
                                                        <span className="block text-[15px] font-bold text-gray-900">
                                                            {data.name}
                                                        </span>
                                                        <span className="u-num mt-0.5 block text-xs text-gray-500">
                                                            {data.weight}
                                                        </span>
                                                    </span>
                                                    <span className="u-num shrink-0 text-sm font-medium text-gray-700">
                                                        {data.total.toLocaleString()}円〜
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </fieldset>

                                <fieldset className="rounded-2xl border border-gray-200 bg-white p-6 md:p-7">
                                    <legend className="u-label px-1">割引（当てはまるものすべて）</legend>
                                    <div className="mt-4 space-y-2">
                                        {discountOptions.map((opt) => {
                                            const checked = selectedDiscounts.includes(opt.id);
                                            return (
                                                <label
                                                    key={opt.id}
                                                    className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3.5 transition-colors duration-200 ${
                                                        checked
                                                            ? 'border-teal-700 bg-mint-50'
                                                            : 'border-gray-200 bg-white hover:border-mint-300'
                                                    }`}
                                                >
                                                    <span className="relative flex size-5 shrink-0 items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => handleDiscountToggle(opt.id)}
                                                            className="peer absolute inset-0 cursor-pointer appearance-none rounded-[6px] border border-gray-300 bg-white transition-colors duration-200 checked:border-teal-700 checked:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                                                        />
                                                        <svg
                                                            aria-hidden="true"
                                                            className="pointer-events-none relative size-3 text-white opacity-0 peer-checked:opacity-100"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="3.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </span>
                                                    <span className="flex-1">
                                                        <span className="block text-[15px] font-bold text-gray-900">
                                                            {opt.name}
                                                        </span>
                                                        <span className="mt-0.5 block text-xs text-gray-500">
                                                            {opt.description}
                                                        </span>
                                                    </span>
                                                    <span className="u-num shrink-0 text-sm font-medium text-teal-700">
                                                        △{opt.amount.toLocaleString()}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </fieldset>
                            </div>

                            {/* 見積書 */}
                            <div className="lg:col-span-7">
                                <div className="lg:sticky lg:top-28">
                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-gray-200 px-6 py-4 md:px-8">
                                            <span className="u-label">Estimate</span>
                                            <span className="text-[11px] text-gray-500">
                                                {carData.name}（{carData.weight}）／ 2026年4月現在の料金
                                            </span>
                                        </div>

                                        <div className="px-6 md:px-8">
                                            {/* 明細行。番号は「車検費用の内訳」の項目と対応している */}
                                            <dl>
                                                {estimateRows.map((row) => (
                                                    <div
                                                        key={row.no}
                                                        className="flex items-baseline justify-between gap-4 border-b border-gray-200 py-3.5"
                                                    >
                                                        <dt className="flex items-baseline gap-3 text-[15px] text-gray-700">
                                                            <span className="u-num text-[11px] text-gray-500">
                                                                {row.no}
                                                            </span>
                                                            {row.name}
                                                        </dt>
                                                        <dd className="u-num shrink-0 text-[15px] font-medium text-gray-900">
                                                            {row.amount.toLocaleString()}
                                                        </dd>
                                                    </div>
                                                ))}

                                                {appliedDiscounts.map((opt) => (
                                                    <div
                                                        key={opt.id}
                                                        className="flex items-baseline justify-between gap-4 border-b border-gray-200 py-3.5"
                                                    >
                                                        <dt className="flex items-baseline gap-3 text-[15px] text-teal-700">
                                                            <span className="u-num text-[11px] text-teal-600">
                                                                割引
                                                            </span>
                                                            {opt.name}
                                                        </dt>
                                                        <dd className="u-num shrink-0 text-[15px] font-medium text-teal-700">
                                                            △{opt.amount.toLocaleString()}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>

                                            {/* 合計。会計伝票の二重罫でここだけ強く見せる */}
                                            <div className="mt-1 border-t-4 border-double border-gray-900 pb-7 pt-5">
                                                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                                                    <div>
                                                        <span className="text-sm font-bold text-gray-900">
                                                            合計（税込）
                                                        </span>
                                                        {totalDiscount > 0 && (
                                                            <span className="u-num mt-1 block text-xs text-gray-500">
                                                                <s>{carData.total.toLocaleString()}円</s>
                                                                <span className="ml-2 text-teal-700">
                                                                    {totalDiscount.toLocaleString()}円お得
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="flex items-baseline gap-1 text-gray-900">
                                                        <span className="u-num text-lg font-medium">¥</span>
                                                        <span className="u-num text-[42px] font-medium leading-none md:text-[52px]">
                                                            {finalTotal.toLocaleString()}
                                                        </span>
                                                    </p>
                                                </div>
                                                <p className="mt-3 text-xs leading-relaxed text-gray-500">
                                                    ※部品代・追加整備分は別途となります。
                                                </p>
                                            </div>
                                        </div>

                                        {/* 見積り条件を持ったまま相談へ進む導線
                                            （docs/blueprints/ux-estimate-handoff.md） */}
                                        <div className="border-t border-gray-200 bg-mint-50 px-6 py-7 md:px-8">
                                            <p className="text-sm font-bold text-gray-900">
                                                この条件のまま相談する
                                            </p>
                                            <ul className="u-num mt-3 space-y-1 text-xs leading-relaxed text-gray-700">
                                                {estimateLines.map((line, index) => (
                                                    <li key={`${index}-${line}`}>{line}</li>
                                                ))}
                                            </ul>
                                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                <Link
                                                    href={estimateContactUrl}
                                                    className="flex h-14 items-center justify-center rounded-xl bg-teal-700 px-4 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                                                >
                                                    メールで相談
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={handleLineHandoff}
                                                    className="flex h-14 items-center justify-center rounded-xl bg-[#06C755] px-4 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-[#05b04c] active:scale-[0.98]"
                                                >
                                                    LINEで相談
                                                </button>
                                                <Link
                                                    href="tel:076-268-1788"
                                                    className="flex h-14 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 font-bold text-gray-900 transition-[background-color,border-color,transform] duration-200 hover:border-teal-700 hover:bg-gray-50 active:scale-[0.98]"
                                                >
                                                    電話で相談
                                                </Link>
                                            </div>
                                            {/* コピー完了は読み上げにも届くよう status で知らせる */}
                                            <p
                                                role="status"
                                                aria-live="polite"
                                                className="mt-4 text-xs font-bold text-teal-700"
                                            >
                                                {lineCopied
                                                    ? '条件をコピーしました。LINEのトーク画面に貼り付けてお送りください。'
                                                    : ''}
                                            </p>
                                            <p className="mt-2 text-xs leading-relaxed text-gray-600">
                                                メール・LINEは選んだ条件を引き継ぎます。お電話の場合は、上に表示されている車種と割引をそのままお伝えください。金額は概算で、追加整備があると変わります。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ドクター車検の特長 */}
                <section className="border-t border-gray-200 bg-white py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                    ドクター車検の特長
                                </h2>
                                <span className="u-chip">Features</span>
                            </div>
                        </header>

                        <div className="mt-12 grid gap-5 md:grid-cols-3">
                            {featureData.map((item) => (
                                <article
                                    key={item.title}
                                    className="rounded-2xl border border-gray-200 bg-white p-7 transition-[border-color] duration-200 hover:border-mint-300 md:p-8"
                                >
                                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                    <p className="mt-4 text-[15px] leading-loose text-gray-600">
                                        {item.body}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Same-Day Section（最短90分・当日完了の案内） */}
                <section className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                    車検は即日で終わる？
                                </h2>
                                <span className="u-chip">Same Day</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                                最短90分・その日のうちに完了する立会い車検をご用意しています。
                            </p>
                        </header>

                        <div className="mt-12 max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
                            <p className="text-[15px] leading-loose text-gray-600">
                                港南自動車サービスでは、
                                <b className="font-bold text-gray-900">
                                    新車ご購入後はじめての車検の方限定
                                </b>
                                で、追加整備がない場合
                                <b className="font-bold text-gray-900">
                                    最短90分・当日完了の「90分立会い車検」
                                </b>
                                を実施しています。完全予約制・1日限定3台。店内でお待ちいただく間に車検が終わり、その日のままお乗り帰りいただけます。
                            </p>
                            <p className="mt-5 text-[15px] leading-loose text-gray-600">
                                2回目以降の車検のお客様も完全予約制で受け付けています。所要時間やお預かりの要否はお車の状態によって異なりますので、ご予約の際にご案内いたします。
                            </p>
                            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Link
                                    href="tel:076-268-1788"
                                    className="group flex h-14 items-center justify-between gap-6 rounded-xl bg-teal-700 px-6 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                                >
                                    <span className="flex flex-col leading-tight">
                                        電話で予約する
                                        <span className="u-num mt-1 text-xs font-medium text-white/80">
                                            076-268-1788
                                        </span>
                                    </span>
                                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="https://lin.ee/CKQM0mE"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-14 items-center justify-between gap-6 rounded-xl bg-[#06C755] px-6 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-[#05b04c] active:scale-[0.98]"
                                >
                                    <span className="flex flex-col leading-tight">
                                        LINEで予約する
                                        <span className="sr-only">（新しいタブで開きます）</span>
                                        <span className="mt-1 text-xs font-medium text-white/80">
                                            24時間受付
                                        </span>
                                    </span>
                                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cost Breakdown Section（車検費用の内訳の解説） */}
                <section className="border-t border-gray-200 bg-white py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                    車検費用の内訳
                                </h2>
                                <span className="u-chip">Breakdown</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                                金沢市の「ドクター車検」の費用は、以下の項目で構成されています。何にいくらかかるのかを明確にし、納得いただける車検をご提供します。
                            </p>
                        </header>

                        <div className="mt-12 max-w-4xl">
                            <p className="u-label mb-4">
                                {carData.name}の場合
                            </p>
                            <dl className="overflow-hidden rounded-2xl border border-gray-200">
                                {estimateRows.map((item, index) => (
                                    <div
                                        key={item.no}
                                        className={`gap-x-8 gap-y-3 bg-white p-6 md:grid md:grid-cols-12 md:p-8 ${
                                            index === 0 ? '' : 'border-t border-gray-200'
                                        }`}
                                    >
                                        <dt className="md:col-span-4">
                                            <span className="flex items-baseline gap-3">
                                                <span className="u-num text-xs text-teal-700">
                                                    {item.no}
                                                </span>
                                                <span className="text-[17px] font-bold text-gray-900">
                                                    {item.name}
                                                </span>
                                            </span>
                                            <span className="u-num mt-2 block text-lg font-medium text-gray-900">
                                                {item.amount.toLocaleString()}
                                                <span className="ml-1 text-xs text-gray-500">円</span>
                                            </span>
                                        </dt>
                                        <dd className="mt-4 text-[15px] leading-loose text-gray-600 md:col-span-8 md:mt-0">
                                            {item.description}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <p className="mt-6 max-w-xl rounded-2xl border-l-4 border-mint-400 bg-mint-50 p-6 text-xs leading-loose text-gray-600 md:p-7">
                                ※潤滑剤・ウエス等のショートパーツ代として1,100円〜2,200円が加算されます。※交換部品代金の3%を上限として交換部品処理費を頂いております。※輸入車は基本診断費用・基本治療費用が各2,200円、フルタイム4WD車・ディーゼル車は総合検査費用が1,100円追加となります。※追加整備は別途お見積りいたします。
                            </p>
                        </div>
                    </div>
                </section>

                {/* Price Table Section（車種クラス別の車検料金表） */}
                <section className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                    金沢市の車検料金表
                                </h2>
                                <span className="u-chip">Price</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                                法定費用込みの総額表示です（2026年4月現在）。
                            </p>
                        </header>

                        <div className="mt-12 max-w-3xl overflow-x-auto">
                            <table className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left">
                                <caption className="sr-only">車種クラス別の車検総額（税込・法定費用込み）</caption>
                                <thead>
                                    <tr className="border-b border-gray-200 bg-white">
                                        <th scope="col" className="u-label px-5 py-4">
                                            車種クラス
                                        </th>
                                        <th scope="col" className="u-label px-5 py-4">
                                            対象車種の例
                                        </th>
                                        <th scope="col" className="u-label px-5 py-4 text-right">
                                            車検総額
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(pricingData).map(([key, d]) => (
                                        <tr
                                            key={d.name}
                                            className={`border-t border-gray-200 ${
                                                selectedCarType === key ? 'bg-mint-50' : ''
                                            }`}
                                        >
                                            <th
                                                scope="row"
                                                className="px-5 py-4 text-left align-top font-bold text-gray-900"
                                            >
                                                {d.name}
                                                <span className="u-num mt-0.5 block text-xs font-medium text-gray-500">
                                                    {d.weight}
                                                </span>
                                            </th>
                                            <td className="px-5 py-4 align-top text-sm text-gray-600">
                                                {d.description}
                                            </td>
                                            <td className="u-num whitespace-nowrap px-5 py-4 text-right align-top font-medium text-gray-900">
                                                {d.total.toLocaleString()}円〜
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-5 max-w-xl text-xs leading-loose text-gray-500">
                            ※重量税・自賠責保険・印紙代（法定費用）を含む、割引適用前の総額です。持込・引取割引や早期予約割引など各種割引の組み合わせで最大約20,000円お得になります。交換部品代・追加整備は別途お見積りです。
                        </p>
                    </div>
                </section>

                {/* Flow Section */}
                <section className="border-t border-gray-200 bg-white py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                    車検当日の流れ
                                </h2>
                                <span className="u-chip">Flow</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                                完全予約制・1日限定3台。ご予約からお引き渡しまで、スムーズで快適な体験をご提供します。
                            </p>
                        </header>

                        {/* 工程は縦に並べる。横5列だと和文が1行14字まで痩せて読めないため、
                            工程をつなぐ道（ロゴのスウッシュに由来する破線）も縦に引く */}
                        <ol className="relative mt-12 max-w-3xl">
                            {flowSteps.map((item, index) => (
                                <li key={item.step} className="relative flex gap-6 pb-10 last:pb-0">
                                    {index < flowSteps.length - 1 && (
                                        <span
                                            className="absolute left-6 top-12 -ml-px h-[calc(100%-3rem)] border-l-2 border-dotted border-mint-300"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="u-num relative flex size-12 shrink-0 items-center justify-center rounded-full border border-teal-700 bg-white text-sm font-medium text-teal-700">
                                        {item.step}
                                    </span>
                                    <div className="pt-1.5">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {item.title}
                                        </h3>
                                        <p className="mt-3 text-[15px] leading-loose text-gray-600">
                                            {item.desc}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Area Section（対応エリア・アクセス） */}
                <section className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                    対応エリア・アクセス
                                </h2>
                                <span className="u-chip">Access</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                                金沢市金石本町の整備工場です。
                            </p>
                        </header>

                        <div className="mt-12 grid max-w-4xl gap-6 md:grid-cols-12">
                            <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-8 text-[15px] leading-loose text-gray-600 md:col-span-7 md:p-10">
                                <p>
                                    店舗は
                                    <b className="font-bold text-gray-900">金沢市金石本町ハ14</b>
                                    。金石・大野・寺中など金沢市西部エリアをはじめ、
                                    <b className="font-bold text-gray-900">金沢市全域の車検</b>
                                    に対応しています。
                                </p>
                                <p>
                                    完全予約制のため待ち時間が少なく、
                                    <b className="font-bold text-gray-900">代車は無料</b>
                                    （全車保険完備）でご用意しています。ご自身でお持ち込み・お引き取りいただく場合は割引もございます。
                                </p>
                            </div>

                            <dl className="rounded-2xl border border-gray-200 bg-white p-8 md:col-span-5 md:p-10">
                                {[
                                    { term: '所在地', value: '石川県金沢市金石本町ハ14' },
                                    { term: '電話', value: '076-268-1788', num: true },
                                    { term: '平日', value: '9:00〜18:00', num: true },
                                    { term: '土曜', value: '9:00〜17:00', num: true },
                                    { term: '定休', value: '日曜・祝日' },
                                ].map((row, index) => (
                                    <div
                                        key={row.term}
                                        className={`flex gap-4 py-3 text-sm ${
                                            index === 0 ? 'pt-0' : 'border-t border-gray-200'
                                        }`}
                                    >
                                        <dt className="w-16 shrink-0 text-gray-500">{row.term}</dt>
                                        <dd
                                            className={`text-gray-900 ${row.num ? 'u-num font-medium' : ''}`}
                                        >
                                            {row.term === '電話' ? (
                                                <a
                                                    href="tel:076-268-1788"
                                                    className="transition-colors hover:text-teal-700"
                                                >
                                                    {row.value}
                                                </a>
                                            ) : (
                                                row.value
                                            )}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="border-t border-gray-200 bg-white py-20 md:py-28">
                    <div className="container">
                        <header>
                            <hr className="u-road" aria-hidden="true" />
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                                <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                    よくある質問
                                </h2>
                                <span className="u-chip">FAQ</span>
                            </div>
                            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                                金沢市での車検に関するご質問にお答えします。
                            </p>
                        </header>

                        <div className="mt-12 max-w-3xl">
                            {faqData.map((item, index) => (
                                <details
                                    key={index}
                                    className="group mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors duration-200 hover:border-mint-300"
                                >
                                    <summary className="flex cursor-pointer items-start gap-4 p-5 md:p-6">
                                        <span className="u-num mt-0.5 shrink-0 text-sm font-medium text-teal-700">
                                            Q
                                        </span>
                                        <span className="flex-1 font-bold text-gray-900">
                                            {item.question}
                                        </span>
                                        <svg
                                            aria-hidden="true"
                                            className="mt-1 size-4 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.75}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </summary>
                                    <div className="flex gap-4 border-t border-gray-200 px-5 pb-6 pt-5 md:px-6">
                                        <span className="u-num shrink-0 text-sm font-medium text-gray-500">
                                            A
                                        </span>
                                        <p className="flex-1 text-[15px] leading-loose text-gray-600">
                                            {item.answer}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 予約の締め（ページ内で唯一の濃い面） */}
                <section className="bg-teal-900 py-16 md:py-20">
                    <div className="container">
                        <div className="grid gap-8 md:grid-cols-12 md:items-end">
                            <div className="md:col-span-7">
                                <span className="u-label text-teal-200">Reservation</span>
                                <h2 className="mt-4 text-[26px] font-bold leading-tight text-white md:text-[32px]">
                                    車検のご予約・お見積り
                                </h2>
                                <p className="mt-4 max-w-lg text-[15px] leading-loose text-white/80">
                                    完全予約制・1日限定3台です。お電話かLINEでご希望日をお知らせください。車検満了日の2ヶ月前までのご予約で早期予約割引が適用されます。
                                </p>
                            </div>
                            <div className="grid gap-3 md:col-span-5">
                                <a
                                    href="tel:076-268-1788"
                                    className="group flex h-16 items-center justify-between gap-6 rounded-xl bg-white px-6 font-bold text-gray-900 transition-[background-color,transform] duration-200 hover:bg-gray-50 active:scale-[0.98]"
                                >
                                    <span className="flex flex-col leading-tight">
                                        <span className="u-num text-xl">076-268-1788</span>
                                        <span className="mt-1 text-[11px] font-medium text-gray-500">
                                            平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                                        </span>
                                    </span>
                                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                </a>
                                <a
                                    href="https://lin.ee/CKQM0mE"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-16 items-center justify-between gap-6 rounded-xl border border-white/50 px-6 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-white/10 active:scale-[0.98]"
                                >
                                    <span className="flex flex-col leading-tight">
                                        LINEで予約する
                                        <span className="sr-only">（新しいタブで開きます）</span>
                                        <span className="mt-1 text-[11px] font-medium text-white/70">
                                            24時間受付
                                        </span>
                                    </span>
                                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="container py-16">
                    <div className="grid gap-12 md:grid-cols-12">
                        <div className="md:col-span-5">
                            <Image
                                src="/logo.png"
                                alt="株式会社港南自動車サービス"
                                width={280}
                                height={70}
                                className="h-9 w-auto object-contain brightness-0 invert"
                            />
                            <p className="mt-6 text-sm leading-loose text-white/70">
                                〒920-0336
                                <br />
                                石川県金沢市金石本町ハ14
                            </p>
                            <dl className="mt-6 border-t border-white/15 text-sm">
                                <div className="flex gap-4 border-b border-white/15 py-3">
                                    <dt className="w-16 shrink-0 text-white/50">TEL</dt>
                                    <dd>
                                        <a
                                            href="tel:076-268-1788"
                                            className="u-num text-white transition-colors hover:text-teal-300"
                                        >
                                            076-268-1788
                                        </a>
                                    </dd>
                                </div>
                                <div className="flex gap-4 border-b border-white/15 py-3">
                                    <dt className="w-16 shrink-0 text-white/50">FAX</dt>
                                    <dd className="u-num text-white/80">076-268-3163</dd>
                                </div>
                                <div className="flex gap-4 border-b border-white/15 py-3">
                                    <dt className="w-16 shrink-0 text-white/50">営業</dt>
                                    <dd className="text-white/80">
                                        平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                                    </dd>
                                </div>
                                <div className="flex gap-4 border-b border-white/15 py-3">
                                    <dt className="w-16 shrink-0 text-white/50">定休</dt>
                                    <dd className="text-white/80">日曜・祝日</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="grid grid-cols-2 gap-8 md:col-span-7">
                            <nav>
                                <h3 className="u-label border-b border-white/15 pb-3 text-white/60">
                                    Services
                                </h3>
                                <ul className="mt-4 space-y-3 text-sm text-white/80">
                                    <li>
                                        <Link href="/shaken" className="transition-colors hover:text-teal-300">
                                            車検・点検
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/noreta" className="transition-colors hover:text-teal-300">
                                            ノレタ（個人向けローン）
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/noridoku" className="transition-colors hover:text-teal-300">
                                            ノリドク（法人向けリース）
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/#services" className="transition-colors hover:text-teal-300">
                                            新車・中古車販売
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                            <nav>
                                <h3 className="u-label border-b border-white/15 pb-3 text-white/60">
                                    Company
                                </h3>
                                <ul className="mt-4 space-y-3 text-sm text-white/80">
                                    <li>
                                        <Link href="/#company" className="transition-colors hover:text-teal-300">
                                            会社概要
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/#contact" className="transition-colors hover:text-teal-300">
                                            お問い合わせ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/recruit" className="transition-colors hover:text-teal-300">
                                            採用情報
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
                        <p className="text-xs text-white/50">
                            &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights
                            Reserved.
                        </p>
                        <p className="u-label text-white/60">Kohnan Auto Service ／ Kanazawa</p>
                    </div>
                </div>
            </footer>

            {/* スマホ用の電話・LINE固定バー */}
            <MobileActionBar />
        </div>
    );
}

// リンク・ボタンに共通で使う矢印アイコン
function ArrowRight({ className = '' }: { className?: string }) {
    return (
        <svg
            className={className}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <path d="M4 12h15m0 0l-6-6m6 6l-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
