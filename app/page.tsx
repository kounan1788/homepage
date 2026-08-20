'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { sendEmail } from '@/app/actions/sendEmail';
import MobileActionBar from '@/components/MobileActionBar';

// 祝日・特別休業日の名称（カレンダーに表示する）
const JAPANESE_HOLIDAYS: Record<string, string> = {
    '2026-04-29': '昭和の日',
    '2026-05-03': '憲法記念日',
    '2026-05-04': 'みどりの日',
    '2026-05-05': 'こどもの日',
    '2026-05-06': '振替休日',
    '2026-07-20': '海の日',
    '2026-08-11': '山の日',
    '2026-08-12': 'お盆休み',
    '2026-08-13': 'お盆休み',
    '2026-08-14': 'お盆休み',
    '2026-09-21': '敬老の日',
    '2026-09-22': '国民の休日',
    '2026-09-23': '秋分の日',
    '2026-10-12': 'スポーツの日',
    '2026-11-03': '文化の日',
    '2026-11-23': '勤労感謝の日',
    '2026-12-30': '年末休業',
    '2026-12-31': '年末休業',
    '2027-01-01': '元日',
    '2027-01-04': '年始休業',
    '2027-01-11': '成人の日',
    '2027-02-11': '建国記念日',
    '2027-02-23': '天皇誕生日',
    '2027-03-21': '春分の日',
    '2027-03-22': '振替休日',
};

// 年間休日カレンダー（画像）で赤く表示されている定休日をそのまま列挙
const CLOSED_DATES = new Set<string>([
    // 4月
    '2026-04-05', '2026-04-11', '2026-04-12', '2026-04-19', '2026-04-25', '2026-04-26', '2026-04-29',
    // 5月
    '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05', '2026-05-06', '2026-05-09', '2026-05-10',
    '2026-05-17', '2026-05-23', '2026-05-24', '2026-05-31',
    // 6月
    '2026-06-06', '2026-06-07', '2026-06-13', '2026-06-14', '2026-06-21', '2026-06-27', '2026-06-28',
    // 7月
    '2026-07-04', '2026-07-05', '2026-07-11', '2026-07-12', '2026-07-19', '2026-07-20', '2026-07-25', '2026-07-26',
    // 8月
    '2026-08-02', '2026-08-08', '2026-08-09', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14',
    '2026-08-15', '2026-08-16', '2026-08-22', '2026-08-23', '2026-08-30',
    // 9月
    '2026-09-05', '2026-09-06', '2026-09-12', '2026-09-13', '2026-09-20', '2026-09-21', '2026-09-22',
    '2026-09-23', '2026-09-26', '2026-09-27',
    // 10月
    '2026-10-03', '2026-10-04', '2026-10-10', '2026-10-11', '2026-10-12', '2026-10-18', '2026-10-24', '2026-10-25',
    // 11月
    '2026-11-01', '2026-11-03', '2026-11-08', '2026-11-14', '2026-11-15', '2026-11-22', '2026-11-23',
    '2026-11-28', '2026-11-29',
    // 12月
    '2026-12-06', '2026-12-12', '2026-12-13', '2026-12-20', '2026-12-26', '2026-12-27', '2026-12-30', '2026-12-31',
    // 1月
    '2027-01-01', '2027-01-02', '2027-01-03', '2027-01-04', '2027-01-09', '2027-01-10', '2027-01-11',
    '2027-01-17', '2027-01-23', '2027-01-24', '2027-01-31',
    // 2月
    '2027-02-06', '2027-02-07', '2027-02-11', '2027-02-13', '2027-02-14', '2027-02-21', '2027-02-23',
    '2027-02-27', '2027-02-28',
    // 3月
    '2027-03-07', '2027-03-13', '2027-03-14', '2027-03-21', '2027-03-22', '2027-03-27', '2027-03-28',
]);

// 月の最初の土曜日の日付(1始まり)を返す（範囲外フォールバック用）
function getFirstSaturdayOfMonth(year: number, month: number): number {
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    return 1 + ((6 - firstDayOfWeek + 7) % 7);
}

// 定休日判定: 2026年度は画像どおりの休日セット、範囲外は日曜・祝日・第2/第4土曜で代替
function isClosedDay(year: number, month: number, day: number): boolean {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (dateStr >= '2026-04-01' && dateStr <= '2027-03-31') {
        return CLOSED_DATES.has(dateStr);
    }

    const dow = new Date(year, month, day).getDay();
    if (dow === 0) return true;
    if (JAPANESE_HOLIDAYS[dateStr]) return true;
    if (dow === 6) {
        const firstSat = getFirstSaturdayOfMonth(year, month);
        const satNum = Math.floor((day - firstSat) / 7) + 1;
        return satNum === 2 || satNum === 4;
    }
    return false;
}

// お問い合わせフォームの希望時間の選択肢（9:00〜17:00 を30分間隔で生成）
const TIME_SLOTS: string[] = [];
for (let hour = 9; hour < 17; hour++) {
    TIME_SLOTS.push(`${hour}:00`, `${hour}:30`);
}
TIME_SLOTS.push('17:00');

// トップページ FAQ データ（表示と FAQPage 構造化データの両方で使用）
const topFaqData = [
    {
        question: '営業時間と定休日を教えてください。',
        answer: '営業時間は平日9:00〜18:00、土曜9:00〜17:00です。日曜・祝日はお休みをいただいております。詳しくはトップページの営業カレンダーをご確認ください。',
    },
    {
        question: '車検はどのくらいの時間で終わりますか？',
        answer: '追加整備がない場合、最短90分で完了します。完全予約制・1日限定3台で対応しているため、お待たせしません。なお、90分立会い車検は新車ご購入後、初めての車検の方限定のサービスです。',
    },
    {
        question: '車検の費用はいくらかかりますか？',
        answer: '法定費用込みの総額で、軽自動車65,040円〜、普通乗用車100,040円〜です。持込・引取割引や早期予約割引など各種割引制度の組み合わせで、最大約20,000円お得になります。',
    },
    {
        question: 'カーリース「ノレタ」とはどんなサービスですか？',
        answer: '月々定額・頭金なし・ボーナス払いなしで新車に乗れる3年リースプランです。車検費用・オイル交換・故障修理もすべてコミコミ。3年後は「乗り換え」「継続利用」「返却」から選べます。',
    },
    {
        question: '法人向けのカーリースはありますか？',
        answer: 'はい、法人・個人事業主向けカーリース「ノリドク」をご用意しています。月々定額で経費処理が簡単になり、車両管理の手間も削減できます。全メーカー対応・メンテナンスパック付きです。',
    },
    {
        question: 'どのメーカーの車でも対応できますか？',
        answer: 'はい、全メーカーに対応しています。車検・整備はもちろん、新車・中古車販売もメーカーを問わずご相談いただけます。',
    },
    {
        question: '故障や事故のときはどうすればいいですか？',
        answer: 'まずはお電話（076-268-1788）でご連絡ください。状況をお伺いし、修理・点検のご案内をいたします。自走できない場合は、ご加入の自動車保険のロードサービスをご利用のうえ、搬入先として当社をご指定いただけます。',
    },
];

export default function Page() {
    const [visibleSections, setVisibleSections] = useState({
        hero: true,
        services: false,
        cases: false,
        company: false,
        instagram: false,
        reviews: false,
        contact: false,
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        preferredDate: '',
        preferredTime: '',
        message: '',
    });

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

    const [isSubmitting, setIsSubmitting] = useState(false);
    // 送信結果はフォーム内（送信ボタンのすぐ上）に表示する
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [calendarDate, setCalendarDate] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;

            setScrolled(scrollPosition > 50);

            setVisibleSections({
                hero: true,
                services: scrollPosition > windowHeight * 0.1,
                cases: scrollPosition > windowHeight * 0.5,
                company: scrollPosition > windowHeight * 0.7,
                instagram: scrollPosition > windowHeight * 0.8,
                reviews: scrollPosition > windowHeight * 0.85,
                contact: scrollPosition > windowHeight * 0.9,
            });
        };

        window.addEventListener('scroll', handleScroll);
        // #cases などへ直接アクセスした場合はスクロールが起きず、
        // 見出しが透明のまま残ってしまうため初回に一度評価しておく
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeIn = (section: 'hero' | 'services' | 'cases' | 'company' | 'instagram' | 'reviews' | 'contact') => {
        return visibleSections[section] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const result = await sendEmail(formData);

            if (result.success) {
                setSubmitStatus({
                    type: 'success',
                    message: '送信しました。営業日中に担当者よりご返信します。',
                });
                setFormData({
                    name: '',
                    email: '',
                    category: '',
                    preferredDate: '',
                    preferredTime: '',
                    message: '',
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: `送信できませんでした（${result.error}）。もう一度お試しいただくか、お急ぎの場合は 076-268-1788 へお電話ください。`,
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitStatus({
                type: 'error',
                message: '送信できませんでした。通信状況をご確認のうえ、もう一度お試しください。お急ぎの場合は 076-268-1788 へお電話ください。',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const goPrevMonth = () => {
        setCalendarDate(prev =>
            prev.month === 0
                ? { year: prev.year - 1, month: 11 }
                : { year: prev.year, month: prev.month - 1 }
        );
    };

    const goNextMonth = () => {
        setCalendarDate(prev =>
            prev.month === 11
                ? { year: prev.year + 1, month: 0 }
                : { year: prev.year, month: prev.month + 1 }
        );
    };

    // カレンダーのセルを生成する
    const buildCalendarCells = () => {
        const { year, month } = calendarDate;
        const firstDow = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayDate = new Date();
        const cells: React.ReactNode[] = [];

        // 月初前の空白
        for (let i = 0; i < firstDow; i++) {
            cells.push(
                <div
                    key={`pre-${i}`}
                    className="min-h-[58px] border-b border-r border-gray-200 bg-gray-50"
                />
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dow = date.getDay();
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSaturday = dow === 6;
            const holidayName = JAPANESE_HOLIDAYS[dateStr] ?? null;
            const isHoliday = !!holidayName;
            const isToday =
                day === todayDate.getDate() &&
                month === todayDate.getMonth() &&
                year === todayDate.getFullYear();

            const isClosed = isClosedDay(year, month, day);
            // 営業土曜日（定休日ではない土曜。9:00〜17:00営業）
            const isOpenSat = isSaturday && !isClosed;

            const numColor = isClosed
                ? 'text-red-600'
                : isOpenSat
                ? 'text-blue-600'
                : 'text-gray-900';

            cells.push(
                <div
                    key={day}
                    className={`min-h-[58px] border-b border-r border-gray-200 p-1.5
                        ${isClosed ? 'bg-red-50' : 'bg-white'}
                        ${isToday ? 'ring-2 ring-inset ring-teal-700' : ''}
                    `}
                >
                    <span className={`u-num text-sm font-medium ${numColor}`}>{day}</span>
                    {isHoliday && (
                        <span className="mt-0.5 block break-all text-[10px] leading-tight text-red-600">
                            {holidayName}
                        </span>
                    )}
                    {isClosed && !isHoliday && (
                        <span className="mt-0.5 block text-[10px] leading-tight text-red-600">
                            定休
                        </span>
                    )}
                </div>
            );
        }

        // 末尾の空白（行を揃える）
        const total = firstDow + daysInMonth;
        const trailing = (7 - (total % 7)) % 7;
        for (let i = 0; i < trailing; i++) {
            cells.push(
                <div
                    key={`post-${i}`}
                    className="min-h-[58px] border-b border-r border-gray-200 bg-gray-50"
                />
            );
        }

        return cells;
    };

    // ヘッダー・モバイルメニュー共通のナビゲーション項目
    const navItems = [
        { name: '車検', href: '/shaken' },
        { name: 'サービス内容', href: '#services' },
        { name: '取扱車種', href: '#cases' },
        { name: '会社情報', href: '#company' },
        { name: '採用情報', href: '/recruit' },
        { name: 'お問い合わせ', href: '#contact' },
    ];

    return (
        <div className="min-h-dvh bg-white text-gray-900">
            {/* Header */}
            <header
                className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
                    scrolled
                        ? 'border-b border-gray-200 bg-white/95 backdrop-blur'
                        : 'border-b border-white/20 bg-gray-950/35'
                }`}
            >
                <div className="container flex h-16 items-center justify-between gap-6 md:h-20">
                    <Link href="/" className="flex shrink-0 items-center">
                        <Image
                            src="/logo.png"
                            alt="港南自動車サービス株式会社｜石川県金沢市の車検・整備・新車販売"
                            width={280}
                            height={70}
                            className={`h-8 w-auto object-contain transition-ui duration-200 md:h-10 ${
                                scrolled ? '' : 'brightness-0 invert'
                            }`}
                            priority
                        />
                    </Link>

                    <nav
                        className={`hidden items-center gap-6 whitespace-nowrap text-[15px] transition-colors duration-200 xl:flex ${
                            scrolled ? 'text-gray-700' : 'text-white'
                        }`}
                        aria-label="メインメニュー"
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`group relative py-1.5 transition-colors ${scrolled ? 'hover:text-teal-700' : 'hover:text-teal-300'}`}
                            >
                                {item.name}
                                <span
                                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100"
                                    aria-hidden="true"
                                />
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-5 whitespace-nowrap xl:flex">
                        <a
                            href="tel:076-268-1788"
                            className={`flex flex-col leading-none transition-colors ${
                                scrolled
                                    ? 'text-gray-900 hover:text-teal-700'
                                    : 'text-white hover:text-teal-300'
                            }`}
                        >
                            <span className="u-num text-lg font-medium tracking-wide">
                                076-268-1788
                            </span>
                            <span
                                className={`mt-1 text-[10px] ${
                                    scrolled ? 'text-gray-500' : 'text-white/70'
                                }`}
                            >
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
                                className={`flex h-11 items-center rounded-full border px-5 text-sm font-bold transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
                                    scrolled
                                        ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                                        : 'border-white/60 text-white hover:bg-white hover:text-gray-900'
                                }`}
                            >
                                ノリドク
                            </Link>
                        </div>
                    </div>

                    <button
                        className={`flex size-11 items-center justify-center rounded border transition-colors xl:hidden ${
                            scrolled ? 'border-gray-300 text-gray-900' : 'border-white/50 text-white'
                        }`}
                        id="menu-toggle"
                        aria-controls="mobile-menu"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-label="メニューを開く"
                    >
                        <svg aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
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

            {/* Mobile menu - headerの外に配置してスクロール時の影響を受けないようにする */}
            <div
                id="mobile-menu"
                className={`fixed inset-0 overscroll-contain z-50 overflow-y-auto bg-gray-900 pb-16 transition-opacity duration-200 xl:hidden ${
                    menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            >
                <div className="container flex h-16 items-center justify-between md:h-20">
                    <Image
                        src="/logo.png"
                        alt=""
                        width={280}
                        height={70}
                        className="h-8 w-auto object-contain brightness-0 invert"
                    />
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="flex size-11 items-center justify-center rounded border border-white/40 text-white"
                        aria-label="メニューを閉じる"
                    >
                        <svg aria-hidden="true"
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
                                <a
                                    href={item.href}
                                    className="flex items-center justify-between border-b border-white/15 py-5 text-lg font-bold text-white"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.name}
                                    <ArrowRight className="text-white/50" />
                                </a>
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

            {/* Hero Section */}
            <section id="main" tabIndex={-1} className="relative flex min-h-dvh flex-col overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/mechanic.jpg"
                        alt="石川県金沢市の港南自動車サービス - 車検・整備・新車販売"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gray-950/55" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-gray-950/25" />
                </div>

                {/* Hero Content */}
                <div className="container relative z-20 flex flex-1 items-center pb-12 pt-28 md:pt-32">
                    <div className="max-w-3xl">
                        <p
                            className="animate-fade-in-up flex items-center gap-4 text-xs text-white/85 opacity-0 md:text-sm"
                            style={{ animationDelay: '0.1s' }}
                        >
                            <span className="h-px w-10 bg-teal-300" aria-hidden="true" />
                            <span>
                                <span className="u-num">1956</span>年創業 ／ 石川県金沢市金石本町
                            </span>
                        </p>

                        <h1
                            className="animate-fade-in-up mt-7 text-[34px] font-bold leading-[1.35] tracking-ja text-white opacity-0 sm:text-5xl md:text-[56px]"
                            style={{ animationDelay: '0.2s' }}
                        >
                            <span className="sr-only">金沢市の港南自動車 - </span>
                            安心・快適な
                            <br />
                            カーライフを。
                        </h1>

                        <p
                            className="animate-fade-in-up mt-7 max-w-xl text-[15px] leading-loose text-white/85 opacity-0 md:text-base"
                            style={{ animationDelay: '0.3s' }}
                        >
                            車検・整備から新車販売、月々定額のカーリースまで。
                            <br className="hidden md:block" />
                            金沢・金石の町で70年、同じ場所でお客様のお車をお預かりしています。
                        </p>

                        <div
                            className="animate-fade-in-up mt-10 flex flex-col gap-3 opacity-0 sm:flex-row"
                            style={{ animationDelay: '0.4s' }}
                        >
                            <a
                                href="/shaken"
                                className="group flex h-14 items-center justify-between gap-8 rounded-xl bg-teal-700 px-7 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                            >
                                車検の料金を調べる
                                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                            </a>
                            <a
                                href="#services"
                                className="group flex h-14 items-center justify-between gap-8 rounded-xl border border-white/70 px-7 text-[15px] font-bold text-white transition-[background-color,color,transform] duration-200 hover:bg-white hover:text-gray-900 active:scale-[0.98]"
                            >
                                サービスを見る
                                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 指標帯：確認できる数値だけを並べる */}
                <div className="relative z-20 border-t border-white/20 bg-gray-950/50 backdrop-blur-sm">
                    <div className="container">
                        <dl className="grid grid-cols-2 divide-x divide-y divide-white/15 md:grid-cols-4 md:divide-y-0">
                            {[
                                { term: '創業', value: '1956', unit: '年' },
                                { term: '車検 総額', value: '65,040', unit: '円〜' },
                                { term: 'ノレタ 月々', value: '27,000', unit: '円〜' },
                                { term: '取扱メーカー', value: '全', unit: 'メーカー' },
                            ].map((item) => (
                                <div key={item.term} className="px-4 py-5 md:px-6">
                                    <dt className="text-[11px] text-white/75">{item.term}</dt>
                                    <dd className="mt-1.5 flex items-baseline gap-1 text-white">
                                        <span className="u-num text-2xl font-medium md:text-[28px]">
                                            {item.value}
                                        </span>
                                        <span className="text-xs text-white/80">{item.unit}</span>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="bg-white py-20 md:py-28">
                <div className="container">
                    <header className={`transition-ui duration-700 ${fadeIn('services')}`}>
                        <hr className="u-road" aria-hidden="true" />
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                            <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                サービス内容
                            </h2>
                            <span className="u-chip">Services</span>
                        </div>
                        <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                            車検・整備、新車と中古車の販売、個人向け・法人向けのカーリース。お車に関わることは一通りお引き受けします。
                        </p>
                    </header>

                    <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 md:mt-14 lg:grid-cols-12">
                        {/* ノレタ - 主力サービス */}
                        <div className="flex flex-col bg-teal-900 p-8 md:p-10 lg:col-span-7">
                            <div className="flex items-baseline justify-between gap-4 border-b border-white/20 pb-4">
                                <span className="u-label text-teal-200">月々定額カーリース</span>
                                <span className="text-[11px] text-white/60">個人のお客様向け</span>
                            </div>

                            <h3 className="mt-7 text-3xl font-bold text-white">ノレタ</h3>
                            <p className="mt-4 max-w-lg text-[15px] leading-loose text-white/80">
                                車検も、オイル交換も、故障修理も月々の定額に含まれます。急な出費に備えなくてよいので、家計の見通しが立ちます。3年後は「乗り換え」「継続」「返却」からお選びいただけます。
                            </p>

                            <dl className="mt-8 border-t border-white/15">
                                {[
                                    { term: '頭金', value: 'なし' },
                                    { term: 'ボーナス払い', value: 'なし' },
                                    { term: '契約期間', value: '3年' },
                                    { term: '月々', value: '27,000円〜' },
                                ].map((row) => (
                                    <div
                                        key={row.term}
                                        className="flex items-baseline justify-between gap-4 border-b border-white/15 py-3"
                                    >
                                        <dt className="text-sm text-white/70">{row.term}</dt>
                                        <dd className="u-num text-[15px] font-medium text-white">
                                            {row.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <Link
                                href="/noreta"
                                className="group mt-10 flex h-14 items-center justify-between gap-6 rounded-xl bg-white px-6 text-[15px] font-bold text-teal-900 transition-[background-color,transform] duration-200 hover:bg-mint-50 active:scale-[0.98]"
                            >
                                ノレタの料金と車種を見る
                                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* その他のサービス */}
                        <div className="grid gap-px bg-gray-200 lg:col-span-5">
                            {[
                                {
                                    title: '車検・点検',
                                    fact: '軽 65,040円〜',
                                    body: '経験豊富な整備士が、最新設備でお車を精密に診断します。最短90分の立会い車検（新車購入後の初回車検限定）から、徹底したメンテナンスまで承ります。',
                                    href: '/shaken',
                                    cta: '料金とご予約',
                                    internal: true,
                                },
                                {
                                    title: '車両販売',
                                    fact: '全メーカー',
                                    body: '全メーカーの新車から、状態を確認した中古車まで。ご予算とお使いになる場面をうかがったうえで、無理のない一台をご提案します。',
                                    href: '#contact',
                                    cta: '車種を相談する',
                                    internal: false,
                                },
                                {
                                    title: '整備・一般修理',
                                    fact: '全車種対応',
                                    body: 'メーカー・車種を問わず対応します。診断機と整備士の目の両方で不具合の原因を確かめ、必要な作業だけをお見積りします。',
                                    href: '#contact',
                                    cta: '症状を相談する',
                                    internal: false,
                                },
                            ].map((s) => (
                                <article key={s.title} className="flex flex-col bg-white p-8 transition-colors duration-200 hover:bg-mint-50">
                                    <div className="flex items-baseline justify-between gap-4 border-b border-gray-200 pb-3">
                                        <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                                        <span className="u-num shrink-0 text-[11px] text-gray-500">
                                            {s.fact}
                                        </span>
                                    </div>
                                    <p className="mt-4 flex-1 text-[15px] leading-loose text-gray-600">
                                        {s.body}
                                    </p>
                                    {s.internal ? (
                                        <Link
                                            href={s.href}
                                            className="group mt-6 inline-flex items-center gap-2 self-start border-b border-teal-700 pb-1 text-sm font-bold text-teal-700 transition-colors hover:border-teal-500 hover:text-teal-500"
                                        >
                                            {s.cta}
                                            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                        </Link>
                                    ) : (
                                        <a
                                            href={s.href}
                                            className="group mt-6 inline-flex items-center gap-2 self-start border-b border-teal-700 pb-1 text-sm font-bold text-teal-700 transition-colors hover:border-teal-500 hover:text-teal-500"
                                        >
                                            {s.cta}
                                            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* 金沢市で新車をお探しの方向けの説明（「新車 金沢」検索対策） */}
                    <div className="mt-12 max-w-3xl rounded-2xl border-l-4 border-mint-400 bg-mint-50 p-7 md:p-9">
                        <h3 className="text-lg font-bold text-gray-900">金沢市で新車をお探しの方へ</h3>
                        <p className="mt-4 text-[15px] leading-loose text-gray-600">
                            港南自動車サービスは、石川県金沢市で創業70年、トヨタ・ホンダ・スズキ・ダイハツなど全メーカーの新車を取り扱う自動車販売店です。ご購入のほか、頭金なし・ボーナス払いなしの月々定額で新車に乗れる新車リース「ノレタ」もご用意。車検やオイル交換などの維持費もコミコミなので、初めて新車に乗る方にも安心です。
                        </p>
                        <p className="mt-4 text-[15px] leading-loose text-gray-600">
                            <Link
                                href="/noreta"
                                className="font-bold text-teal-700 underline underline-offset-4 hover:text-teal-500"
                            >
                                金沢市の新車リース「ノレタ」の料金・取扱車種はこちら
                            </Link>
                            。ご予算に合わせた一台のご提案は
                            <a
                                href="#contact"
                                className="font-bold text-teal-700 underline underline-offset-4 hover:text-teal-500"
                            >
                                お問い合わせ
                            </a>
                            からお気軽にどうぞ。
                        </p>
                    </div>
                </div>
            </section>

            {/* Cases Section */}
            <section id="cases" className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                <div className="container">
                    <header className={`transition-ui duration-700 ${fadeIn('cases')}`}>
                        <hr className="u-road" aria-hidden="true" />
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                            <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                取扱車種
                            </h2>
                            <span className="u-chip">Lineup</span>
                        </div>
                        <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                            国産全メーカーから輸入車まで取り扱っています。金沢の冬道での扱いやすさまで含めて、一台ずつご説明します。
                        </p>
                    </header>

                    <div className="mt-12 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3">
                        {[
                            {
                                maker: 'スズキ',
                                model: 'JIMNY',
                                tagline: '本格派4WD',
                                image: '/cars/jimny.jpg',
                                alt: '金沢市で人気のスズキ・ジムニー｜港南自動車サービス取扱車種',
                                body: 'ハスラー、スイフト、ワゴンRなど。金沢の雪道にも強い確かな足回り。',
                            },
                            {
                                maker: '三菱',
                                model: 'DELICA MINI',
                                tagline: 'アウトドア向け軽',
                                image: '/cars/delicamini.jpg',
                                alt: '三菱・デリカミニ｜港南自動車サービスで新車・中古車販売対応',
                                body: 'デリカミニ、アウトランダーなど。タフでアクティブなライフスタイルに。',
                            },
                            {
                                maker: 'トヨタ',
                                model: 'ALPHARD',
                                tagline: '上級ミニバン',
                                image: '/cars/alphard.jpg',
                                alt: 'トヨタ・アルファード｜金沢市の港南自動車サービスで高級ミニバンの購入・整備も対応',
                                body: 'ハリアー、アルファードなど。長く乗るほど価値の伝わる一台を。',
                            },
                        ].map((car) => (
                            <article key={car.maker} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg">
                                <div className="relative aspect-[4/3] overflow-hidden border-b border-gray-200">
                                    <Image
                                        src={car.image}
                                        alt={car.alt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-200 group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 py-2.5">
                                        <span className="u-num text-sm font-medium tracking-wide text-gray-900">
                                            {car.model}
                                        </span>
                                        <span className="text-[11px] text-gray-500">{car.tagline}</span>
                                    </div>
                                </div>
                                <div className="p-7">
                                    <h3 className="text-xl font-bold text-gray-900">{car.maker}</h3>
                                    <p className="mt-3 text-[15px] leading-loose text-gray-600">
                                        {car.body}
                                    </p>
                                    <a
                                        href="#contact"
                                        className="group/link mt-6 inline-flex items-center gap-2 border-b border-teal-700 pb-1 text-sm font-bold text-teal-700 transition-colors hover:border-teal-500 hover:text-teal-500"
                                    >
                                        この車種について相談する
                                        <ArrowRight className="transition-transform duration-200 group-hover/link:translate-x-1" />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <a
                            href="#contact"
                            className="group flex h-14 items-center justify-between gap-8 rounded-xl bg-teal-700 px-7 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                        >
                            車種について問い合わせる
                            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                        <p className="text-sm text-gray-500">
                            ご希望の車種が一覧にない場合もお取り寄せできます。
                        </p>
                    </div>
                </div>
            </section>

            {/* Company Section */}
            <section id="company" className="border-t border-gray-200 bg-white py-20 md:py-28">
                <div className="container">
                    <header className={`transition-ui duration-700 ${fadeIn('company')}`}>
                        <hr className="u-road" aria-hidden="true" />
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                            <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                会社情報
                            </h2>
                            <span className="u-chip">Company</span>
                        </div>
                    </header>

                    <div className="mt-12 grid overflow-hidden rounded-2xl border border-gray-200 md:mt-14 lg:grid-cols-12">
                        <div className="border-b border-gray-200 p-8 md:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
                            <h3 className="text-2xl font-bold text-gray-900">
                                株式会社港南自動車サービス
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                自動車整備・車両販売・カーリース
                            </p>

                            <dl className="mt-8 border-t border-gray-200">
                                <div className="flex flex-col gap-1 border-b border-gray-200 py-4 sm:flex-row sm:gap-6">
                                    <dt className="shrink-0 text-xs font-bold text-teal-700 sm:w-24 sm:pt-1">
                                        所在地
                                    </dt>
                                    <dd className="text-[15px] text-gray-900">
                                        <span className="u-num text-gray-500">〒920-0336</span>
                                        <br />
                                        石川県金沢市金石本町ハ14
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1 border-b border-gray-200 py-4 sm:flex-row sm:gap-6">
                                    <dt className="shrink-0 text-xs font-bold text-teal-700 sm:w-24 sm:pt-1">
                                        電話
                                    </dt>
                                    <dd>
                                        <a
                                            href="tel:076-268-1788"
                                            className="u-num text-2xl font-medium text-gray-900 transition-colors hover:text-teal-700"
                                        >
                                            076-268-1788
                                        </a>
                                        <span className="u-num mt-1 block text-sm text-gray-500">
                                            FAX 076-268-3163
                                        </span>
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1 border-b border-gray-200 py-4 sm:flex-row sm:gap-6">
                                    <dt className="shrink-0 text-xs font-bold text-teal-700 sm:w-24 sm:pt-1">
                                        営業時間
                                    </dt>
                                    <dd className="text-[15px] text-gray-900">
                                        <span className="inline-block w-12 text-gray-500">平日</span>
                                        <span className="u-num">9:00 〜 18:00</span>
                                        <br />
                                        <span className="inline-block w-12 text-gray-500">土曜</span>
                                        <span className="u-num">9:00 〜 17:00</span>
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1 border-b border-gray-200 py-4 sm:flex-row sm:gap-6">
                                    <dt className="shrink-0 text-xs font-bold text-teal-700 sm:w-24 sm:pt-1">
                                        定休日
                                    </dt>
                                    <dd className="text-[15px] text-red-600">
                                        第1・第2・第4土曜日／日曜・祝日
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1 border-b border-gray-200 py-4 sm:flex-row sm:gap-6">
                                    <dt className="shrink-0 text-xs font-bold text-teal-700 sm:w-24 sm:pt-1">
                                        創業
                                    </dt>
                                    <dd className="text-[15px] text-gray-900">
                                        <span className="u-num">1956</span>年（昭和31年）
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="relative min-h-[360px] lg:col-span-7">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102498.79916169232!2d136.51245513968695!3d36.600202237727785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff9cc85432c3f01%3A0x9d1d9922dd9db39!2z5riv5Y2X6Ieq5YuV6LuK44K144O844OT44K5!5e0!3m2!1sja!2sjp!4v1744335562038!5m2!1sja!2sjp"
                                className="absolute inset-0 h-full w-full"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="港南自動車サービス地図"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* 休日カレンダー Section */}
            <section className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                <div className="container">
                    <header>
                        <hr className="u-road" aria-hidden="true" />
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                            <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                営業カレンダー
                            </h2>
                            <span className="u-chip">Calendar</span>
                        </div>
                        <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                            ご来店前に定休日をご確認ください。土曜日は月によって営業日と定休日が変わります。
                        </p>
                    </header>

                    <div className="mx-auto mt-12 max-w-xl">
                        {/* 月ナビゲーション */}
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={goPrevMonth}
                                className="flex h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-[border-color,color,transform] duration-200 hover:border-teal-700 hover:text-teal-700 active:scale-[0.97]"
                            >
                                <svg aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.75}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                前の月
                            </button>
                            <h3 className="text-center">
                                <span className="u-num text-2xl font-medium text-gray-900">
                                    {calendarDate.year}
                                </span>
                                <span className="ml-1 text-sm text-gray-500">年</span>
                                <span className="u-num ml-3 text-2xl font-medium text-gray-900">
                                    {calendarDate.month + 1}
                                </span>
                                <span className="ml-1 text-sm text-gray-500">月</span>
                            </h3>
                            <button
                                onClick={goNextMonth}
                                className="flex h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-[border-color,color,transform] duration-200 hover:border-teal-700 hover:text-teal-700 active:scale-[0.97]"
                            >
                                翌月
                                <svg aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.75}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* カレンダー本体 */}
                        <div className="mt-5 overflow-hidden rounded-2xl border-l border-t border-gray-200 bg-white">
                            <div className="grid grid-cols-7 border-b border-r border-gray-200 bg-gray-900">
                                {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
                                    <div
                                        key={d}
                                        className={`py-2.5 text-center text-xs font-bold ${
                                            i === 0
                                                ? 'text-red-300'
                                                : i === 6
                                                ? 'text-blue-300'
                                                : 'text-white/80'
                                        }`}
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7">{buildCalendarCells()}</div>
                        </div>

                        {/* 凡例 */}
                        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <span
                                    className="size-4 border border-red-200 bg-red-50"
                                    aria-hidden="true"
                                />
                                <dt className="font-bold text-red-600">定休日</dt>
                                <dd className="text-gray-600">日曜・祝日・休業日</dd>
                            </div>
                            <div className="flex items-center gap-2">
                                <dt className="u-num font-bold text-blue-600">土</dt>
                                <dd className="text-gray-600">営業土曜日（9:00〜17:00）</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* Instagram Section */}
            <section id="instagram" className="border-t border-gray-200 bg-white py-20 md:py-28">
                <div className="container">
                    <header>
                        <hr className="u-road" aria-hidden="true" />
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                            <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                最近の様子
                            </h2>
                            <span className="u-chip">Instagram</span>
                        </div>
                        <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                            入庫した車、店舗の日常、キャンペーンのお知らせを投稿しています。
                        </p>
                    </header>

                    <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-200 bg-white p-3 md:p-6">
                        {/* スクロールでセクションが近づくまでiframeを生成せず初期表示を軽くする（高さ分は確保してCLSを防ぐ） */}
                        {visibleSections.instagram ? (
                            <iframe
                                src="https://www.instagram.com/kounanj1788/embed/"
                                width="100%"
                                height="600"
                                frameBorder="0"
                                scrolling="yes"
                                allowTransparency={true}
                                loading="lazy"
                                className="w-full"
                                title="Kounan Auto Instagram Feed"
                            ></iframe>
                        ) : (
                            <div
                                role="status"
                                className="flex w-full items-center justify-center bg-gray-50 text-sm text-gray-500"
                                style={{ height: 600 }}
                            >
                                Instagramを読み込み中…
                            </div>
                        )}

                        <a
                            href="https://www.instagram.com/kounanj1788"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-4 flex h-14 items-center justify-between gap-6 rounded-xl border border-gray-300 px-6 text-[15px] font-bold text-gray-900 transition-colors hover:border-teal-700 hover:text-teal-700"
                        >
                            <span className="flex items-center gap-3">
                                <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <span className="u-num">@kounanj1788</span>
                                をフォローする
                            </span>
                            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Google Reviews Section */}
            <section
                id="reviews"
                className={`border-t border-gray-200 bg-gray-50 py-20 transition-ui duration-700 md:py-28 ${fadeIn('reviews')}`}
            >
                <div className="container">
                    <header>
                        <hr className="u-road" aria-hidden="true" />
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                            <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                お客様の声
                            </h2>
                            <span className="u-chip">Reviews</span>
                        </div>
                        <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                            Googleマップに投稿された口コミをそのまま掲載しています。
                        </p>
                    </header>

                    <div className="mt-12">
                        {/* セクションが画面に近づくまでウィジェットと外部スクリプトを生成せず、初期表示のメインスレッド負荷を減らす */}
                        {visibleSections.reviews ? (
                            <>
                                <div
                                    className="elfsight-app-b145ba87-fa56-4270-a4cc-ac300fb7c24a"
                                    data-elfsight-app-lazy
                                ></div>
                                <Script
                                    src="https://static.elfsight.com/platform/platform.js"
                                    strategy="lazyOnload"
                                    data-use-service-core
                                />
                            </>
                        ) : (
                            <div
                                role="status"
                                className="flex items-center justify-center border border-gray-200 bg-white text-sm text-gray-500"
                                style={{ minHeight: 400 }}
                            >
                                お客様の声を読み込み中…
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Game Banner Section */}
            <section className="border-t border-gray-200 bg-white py-16 md:py-20">
                <div className="container">
                    <Link href="/game" className="group grid overflow-hidden rounded-2xl border border-gray-200 md:grid-cols-12">
                        <div className="bg-teal-900 p-8 md:col-span-8 md:p-10">
                            <span className="u-label text-teal-200">無料ミニゲーム</span>
                            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                                港南ドライブチャレンジ
                            </h2>
                            <p className="mt-4 max-w-xl text-[15px] leading-loose text-white/80">
                                ガードレールをよけて走るだけ。走った距離に応じて、車検やリースに使える割引コードがもらえます。PC・スマホどちらでも遊べます。
                            </p>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-gray-200 bg-white p-8 md:col-span-4 md:border-l md:border-t-0 md:p-10">
                            <div>
                                <p className="text-xs text-gray-500">走行距離に応じて</p>
                                <p className="mt-1 text-lg font-bold text-gray-900">割引コード進呈</p>
                            </div>
                            <span className="flex size-12 shrink-0 items-center justify-center rounded bg-teal-700 text-white transition-colors group-hover:bg-teal-600">
                                <ArrowRight />
                            </span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="border-t border-gray-200 bg-gray-50 py-20 md:py-28">
                {/* FAQPage 構造化データ */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'FAQPage',
                            mainEntity: topFaqData.map((item) => ({
                                '@type': 'Question',
                                name: item.question,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: item.answer,
                                },
                            })),
                        }),
                    }}
                />

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
                            車検・カーリースについて、お客様からよくいただくご質問にお答えします。
                        </p>
                    </header>

                    <div className="mt-12">
                        {topFaqData.map((item, index) => (
                            <details key={index} className="group mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors duration-200 hover:border-mint-300">
                                <summary className="flex cursor-pointer items-start gap-4 p-5 md:p-6">
                                    <span className="u-num mt-0.5 shrink-0 text-sm font-medium text-teal-700">
                                        Q
                                    </span>
                                    <span className="flex-1 font-bold text-gray-900">
                                        {item.question}
                                    </span>
                                    <svg aria-hidden="true"
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

            {/* Contact Section */}
            <section id="contact" className="border-t border-gray-200 bg-white py-20 md:py-28">
                <div className="container">
                    <header>
                        <hr className="u-road" aria-hidden="true" />
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                            <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                                お問い合わせ
                            </h2>
                            <span className="u-chip">Contact</span>
                        </div>
                        <p className="mt-5 max-w-2xl text-[15px] leading-loose text-gray-600">
                            「車検の相談」「ノレタの詳細を知りたい」「新車を探している」など、内容が決まっていなくてもかまいません。担当者がお答えします。
                        </p>
                    </header>

                    <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 md:mt-14 lg:grid-cols-12">
                        {/* 左側：連絡先情報 */}
                        <div className="bg-gray-50 p-8 md:p-10 lg:col-span-5">
                            <a
                                href="tel:076-268-1788"
                                className="block rounded-xl border border-gray-300 bg-white p-6 transition-[border-color,background-color] duration-200 hover:border-teal-700 hover:bg-mint-50"
                            >
                                <span className="text-xs font-bold text-teal-700">お電話</span>
                                <span className="u-num mt-2 block text-3xl font-medium text-gray-900">
                                    076-268-1788
                                </span>
                                <span className="mt-2 block text-xs text-gray-500">
                                    平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                                </span>
                            </a>

                            <a
                                href="https://lin.ee/CKQM0mE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-gray-300 bg-white p-6 transition-[border-color,background-color] duration-200 hover:border-[#06C755] hover:bg-[#F2FBF5]"
                            >
                                <span>
                                    <span className="text-xs font-bold text-[#04803A]">公式LINE</span>
                                    <span className="mt-2 block text-lg font-bold text-gray-900">
                                        LINEで相談する
                                    </span>
                                    <span className="mt-1 block text-xs text-gray-500">
                                        写真を送っていただくと見積りが早くなります
                                    </span>
                                </span>
                                <svg aria-hidden="true"
                                    className="size-8 shrink-0 text-[#06C755]"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                </svg>
                            </a>

                            <dl className="mt-8 border-t border-gray-200 pt-6 text-sm">
                                <div className="flex gap-4 py-2">
                                    <dt className="w-20 shrink-0 text-gray-500">来店</dt>
                                    <dd className="text-gray-900">
                                        金沢市金石本町ハ14（駐車場あり）
                                    </dd>
                                </div>
                                <div className="flex gap-4 py-2">
                                    <dt className="w-20 shrink-0 text-gray-500">定休日</dt>
                                    <dd className="text-red-600">第1・第2・第4土曜日／日曜・祝日</dd>
                                </div>
                                <div className="flex gap-4 py-2">
                                    <dt className="w-20 shrink-0 text-gray-500">返信</dt>
                                    <dd className="text-gray-900">
                                        営業日中にご返信します（定休日の場合は翌営業日）
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* 右側：フォーム */}
                        <div className="bg-white p-8 md:p-10 lg:col-span-7">
                            <h3 className="border-b border-gray-200 pb-4 text-lg font-bold text-gray-900">
                                メールフォーム
                            </h3>
                            <form onSubmit={handleSubmit} className="mt-8 space-y-7">
                                <div className="space-y-2">
                                    <label
                                        className="flex items-center gap-2 text-sm font-bold text-gray-900"
                                        htmlFor="name"
                                    >
                                        お名前
                                        <span className="u-chip bg-red-50 py-1 text-red-700">必須</span>
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-[15px] text-gray-900 transition-colors placeholder:text-gray-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="山田 太郎…"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        className="flex items-center gap-2 text-sm font-bold text-gray-900"
                                        htmlFor="email"
                                    >
                                        メールアドレス
                                        <span className="u-chip bg-red-50 py-1 text-red-700">必須</span>
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-[15px] text-gray-900 transition-colors placeholder:text-gray-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        inputMode="email"
                                        spellCheck={false}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="example@email.com…"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        className="flex items-center gap-2 text-sm font-bold text-gray-900"
                                        htmlFor="category"
                                    >
                                        お問い合わせジャンル
                                        <span className="u-chip bg-red-50 py-1 text-red-700">必須</span>
                                    </label>
                                    <select
                                        className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-white px-4 py-3.5 text-[15px] text-gray-900 transition-colors focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            選択してください
                                        </option>
                                        <option value="車検">車検</option>
                                        <option value="点検">点検</option>
                                        <option value="整備・修理">整備・修理</option>
                                        <option value="板金修理">板金修理</option>
                                        <option value="新車販売">新車販売</option>
                                        <option value="中古車販売">中古車販売</option>
                                        <option value="ノレタ">ノレタ</option>
                                        <option value="ノリドク（法人向けリース）">
                                            ノリドク（法人向けリース）
                                        </option>
                                        <option value="リース全般">リース全般</option>
                                        <option value="自動車保険">自動車保険</option>
                                        <option value="その他">その他</option>
                                    </select>
                                </div>

                                {/* 車検・点検などの希望日時（任意） */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label
                                            className="flex items-center gap-2 text-sm font-bold text-gray-900"
                                            htmlFor="preferredDate"
                                        >
                                            ご希望日
                                            <span className="u-chip bg-gray-100 py-1 text-gray-600">任意</span>
                                        </label>
                                        <input
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-[15px] text-gray-900 transition-colors focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                                            id="preferredDate"
                                            name="preferredDate"
                                            type="date"
                                            value={formData.preferredDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            className="flex items-center gap-2 text-sm font-bold text-gray-900"
                                            htmlFor="preferredTime"
                                        >
                                            ご希望の時間
                                            <span className="u-chip bg-gray-100 py-1 text-gray-600">任意</span>
                                        </label>
                                        <select
                                            className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-white px-4 py-3.5 text-[15px] text-gray-900 transition-colors focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                                            id="preferredTime"
                                            name="preferredTime"
                                            aria-describedby="preferredTime-help"
                                            value={formData.preferredTime}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">指定なし</option>
                                            {TIME_SLOTS.map((slot) => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                        <p id="preferredTime-help" className="text-xs text-gray-500">
                                            土曜の営業は17:00まで、日曜・祝日は定休日です。
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        className="flex items-center gap-2 text-sm font-bold text-gray-900"
                                        htmlFor="message"
                                    >
                                        お問い合わせ内容
                                        <span className="u-chip bg-red-50 py-1 text-red-700">必須</span>
                                    </label>
                                    <textarea
                                        className="min-h-[160px] w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-[15px] leading-loose text-gray-900 transition-colors placeholder:text-gray-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="例）ハスラー 2020年式／エンジンから異音がします…"
                                    />
                                </div>

                                {submitStatus && (
                                    <p
                                        id="contact-status"
                                        role="status"
                                        aria-live="polite"
                                        className={`border-l-2 px-4 py-3 text-sm leading-loose ${
                                            submitStatus.type === 'success'
                                                ? 'border-teal-700 bg-teal-50 text-teal-900'
                                                : 'border-red-600 bg-red-50 text-red-800'
                                        }`}
                                    >
                                        {submitStatus.message}
                                    </p>
                                )}

                                <button
                                    className={`group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-teal-700 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98] ${
                                        isSubmitting ? 'cursor-not-allowed opacity-60' : ''
                                    }`}
                                    type="submit"
                                    disabled={isSubmitting}
                                    aria-busy={isSubmitting}
                                    aria-describedby={submitStatus ? 'contact-status' : undefined}
                                >
                                    {isSubmitting ? '送信中…' : '送信する'}
                                    {!isSubmitting && (
                                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                                    )}
                                </button>

                                <input
                                    type="hidden"
                                    name="recipient"
                                    value="kounan.lease@gmail.com"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </section>

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
                                        <a
                                            href="/shaken"
                                            className="transition-colors hover:text-teal-300"
                                        >
                                            車検・点検
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/noreta"
                                            className="transition-colors hover:text-teal-300"
                                        >
                                            ノレタ（個人向けリース）
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/noridoku"
                                            className="transition-colors hover:text-teal-300"
                                        >
                                            ノリドク（法人向けリース）
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#services"
                                            className="transition-colors hover:text-teal-300"
                                        >
                                            新車・中古車販売
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/game"
                                            className="transition-colors hover:text-teal-300"
                                        >
                                            ゲームで遊ぶ
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            <nav>
                                <h3 className="u-label border-b border-white/15 pb-3 text-white/60">
                                    Company
                                </h3>
                                <ul className="mt-4 space-y-3 text-sm text-white/80">
                                    <li>
                                        <a
                                            href="#company"
                                            className="transition-colors hover:text-teal-300"
                                        >
                                            会社概要
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#contact"
                                            className="transition-colors hover:text-teal-300"
                                        >
                                            お問い合わせ
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="transition-colors hover:text-teal-300">
                                            プライバシーポリシー
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/recruit"
                                            className="transition-colors hover:text-teal-300"
                                        >
                                            採用情報
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/it-support"
                                            className="transition-colors hover:text-teal-300"
                                        >
                                            ITサポート
                                        </a>
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

            {/* Floating Contact Button（スマホでは下部固定バーがあるため非表示） */}
            <div className="fixed bottom-6 right-6 z-30 hidden md:block">
                <a
                    href="#contact"
                    className="group flex h-12 items-center gap-3 rounded-full bg-teal-700 px-5 text-sm font-bold text-white shadow-lg transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.97]"
                >
                    <svg aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                    </svg>
                    お問い合わせ
                </a>
            </div>

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
