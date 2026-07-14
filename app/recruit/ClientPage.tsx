'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ============================================
// 求人ごとの公開フラグ
// 各求人の published を個別に切り替えて公開を制御する
//   published: true  → その求人を公開（一覧に表示）
//   published: false → その求人を非公開（一覧に表示しない）
// 例）整備士だけ公開したい場合は mechanic を true、office を false にする
// 両方 false の場合はページ全体が「準備中」表示になる
// ============================================

// 求人情報のデータ
const jobListings = [
    {
        id: 'mechanic',
        published: false, // 整備士の公開フラグ
        title: '自動車整備士',
        subtitle: '未経験スタート多数・資格取得は会社が全力サポート',
        icon: '🔧',
        highlight: '積極採用中',
        description: '「クルマが好き」──その気持ちさえあれば大丈夫。お客様の大切なお車の車検・点検・整備をお任せします。最初はできることから、経験豊富な先輩が一つひとつ丁寧に教えるので、未経験からでも着実にプロの整備士へ成長できます。18時完全退社で残業はほとんどなく、資格取得も費用は会社が負担して全力でバックアップ。腰を据えて長く技術を磨ける環境です。',
        requirements: [
            '普通自動車運転免許（AT限定可）',
            '整備士資格不問（入社後の資格取得を支援）',
            '学歴不問・未経験者歓迎',
            '10代〜50代まで幅広く採用いたします！',
        ],
        salary: {
            base: '月給 195,000円〜',
            details: '※経験・能力を考慮の上、決定いたします',
            bonus: '賞与年2回',
            raise: '昇給年1回',
        },
        benefits: [
            '社会保険完備（雇用・労災・健康・厚生年金）',
            '資格取得支援制度（費用会社負担）',
            '資格手当あり（2級：10,000円/月、検査員：20,000円/月）',
            '通勤手当支給',
            '制服貸与',
            'マイカー通勤OK（無料駐車場完備）',
            '社員割引制度あり',
        ],
        workStyle: {
            hours: '9:00〜18:00（休憩60分・18時00分完全帰宅）',
            hoursSaturday: '9:00〜17:00（休憩60分・17時00分完全帰宅）',
            holidays: '日曜・祝日、第1・第2・第4土曜日(繁忙期により変動あり)',
            vacation: '年間休日105日以上、年次有給休暇、夏季・年末年始休暇、慶弔休暇',
        },
    },
    {
        id: 'office',
        published: false, // 事務・受付スタッフの公開フラグ
        title: '事務・受付スタッフ',
        subtitle: '未経験・ブランクOK／人と接するのが好きな方歓迎',
        icon: '💼',
        highlight: '募集中',
        description: 'ご来店されたお客様の受付・電話応対、見積書や請求書の作成、データ入力など、店舗を支える事務業務全般をお任せします。特別なスキルは必要ありません。大切なのは、明るい笑顔と「人と接するのが好き」という気持ち。分からないことはすぐに聞けるアットホームな職場なので、未経験の方もブランクのある方も安心してスタートできます。',
        requirements: [
            '高卒以上',
            '基本的なPC操作ができる方（Word・Excel）',
            '普通自動車運転免許（あれば尚可）',
            '未経験者歓迎・ブランクOK',
        ],
        salary: {
            base: '月給 170,000円〜',
            details: '※経験・能力を考慮の上、決定いたします',
            bonus: '賞与年2回（実績による）',
            raise: '昇給年1回',
        },
        benefits: [
            '社会保険完備（雇用・労災・健康・厚生年金）',
            '通勤手当支給',
            '制服貸与',
            'マイカー通勤OK（無料駐車場完備）',
            '社員割引制度あり',
        ],
        workStyle: {
            hours: '9:00〜18:00（休憩60分・18時00分完全帰宅）',
            hoursSaturday: '9:00〜17:00（休憩60分・17時00分完全帰宅）',
            holidays: '日曜・祝日、第1・第2・第4土曜日',
            vacation: '年間休日105日以上、有給休暇、夏季・年末年始休暇、慶弔休暇',
        },
    },
];

// 会社の魅力ポイント
const companyFeatures = [
    {
        icon: '🏢',
        title: '創業70年の安定企業',
        description: '石川県金沢市の地で長年愛され続けてきた信頼と実績があります。車検・整備という景気に左右されにくい事業だからこそ、安定した基盤の中で腰を据えて長く働けます。',
    },
    {
        icon: '📚',
        title: '充実の教育・研修制度',
        description: '「先輩の背中を見て覚えろ」はありません。OJTで一つひとつ丁寧に指導し、資格取得の費用も会社が負担。未経験からプロの整備士へ、着実にステップアップできます。',
    },
    {
        icon: '🤝',
        title: 'アットホームな職場環境',
        description: '少数精鋭のチームだからこそ、一人ひとりの顔が見える風通しの良さ。分からないことや困ったことはすぐに相談でき、あなたの意見も届きやすい職場です。',
    },
    {
        icon: '🚗',
        title: '全メーカー対応でスキルアップ',
        description: '軽自動車から普通車まで、多彩なメーカー・車種を取り扱います。特定の車種に偏らないからこそ、どこへ行っても通用する幅広い技術と知識が自然と身につきます。',
    },
];

// 公開中（published: true）の求人だけを抽出
const visibleJobs = jobListings.filter((job) => job.published);
// 公開中の求人が1件以上あればページを表示、0件なら「準備中」を表示
const isPageReady = visibleJobs.length > 0;

export default function RecruitPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeJob, setActiveJob] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // ============================================
    // ページ準備中の表示
    // ============================================
    if (!isPageReady) {
        return (
            <div className="min-h-screen bg-neutral-50 font-sans text-slate-900 flex flex-col">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                    <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-[1.02]">
                            <Image src="/logo.png" alt="港南自動車サービス" width={180} height={45} className="w-auto h-10 md:h-12 object-contain" priority />
                        </Link>
                        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                            <Link href="/shaken" className="text-slate-600 hover:text-teal-700 transition-colors">車検</Link>
                            <Link href="/#services" className="text-slate-600 hover:text-teal-700 transition-colors">サービス内容</Link>
                            <Link href="/#cases" className="text-slate-600 hover:text-teal-700 transition-colors">取扱車種</Link>
                            <Link href="/#company" className="text-slate-600 hover:text-teal-700 transition-colors">会社情報</Link>
                            <Link href="/recruit" className="text-slate-600 hover:text-teal-700 transition-colors">採用情報</Link>
                            <Link href="/#contact" className="text-slate-600 hover:text-teal-700 transition-colors">お問い合わせ</Link>
                            <Link href="/noreta" className="text-white bg-teal-700 px-5 py-2.5 rounded-full hover:bg-teal-800 transition-all shadow-md hover:shadow-lg">
                                ノレタ詳細
                            </Link>
                            <Link href="/noridoku" className="text-white bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                                ノリドク詳細
                            </Link>
                        </nav>
                        <button
                            className="md:hidden p-2 rounded-xl bg-teal-700 text-white transition-all duration-300"
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


                {/* Coming Soon Content */}
                <main className="flex-1 flex items-center justify-center pt-20">
                    <div className="text-center px-6">
                        <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg className="w-12 h-12 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            ページ準備中
                        </h1>
                        <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
                            採用情報ページは現在準備中です。<br />
                            公開までしばらくお待ちください。
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-8 py-4 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            トップページへ戻る
                        </Link>
                    </div>
                </main>

                {/* Simple Footer */}
                <footer className="py-8 text-center text-slate-400 text-sm">
                    <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                </footer>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-slate-900 pb-20 overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-[1.02]">
                        <Image src="/logo.png" alt="港南自動車サービス" width={180} height={45} className="w-auto h-10 md:h-12 object-contain" priority />
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <Link href="/shaken" className="text-slate-600 hover:text-teal-700 transition-colors">車検</Link>
                        <Link href="/#services" className="text-slate-600 hover:text-teal-700 transition-colors">サービス内容</Link>
                        <Link href="/#cases" className="text-slate-600 hover:text-teal-700 transition-colors">取扱車種</Link>
                        <Link href="/#company" className="text-slate-600 hover:text-teal-700 transition-colors">会社情報</Link>
                        <Link href="/recruit" className="text-slate-600 hover:text-teal-700 transition-colors">採用情報</Link>
                        <Link href="/#contact" className="text-slate-600 hover:text-teal-700 transition-colors">お問い合わせ</Link>
                        <Link href="/noreta" className="text-white bg-teal-700 px-5 py-2.5 rounded-full hover:bg-teal-800 transition-all shadow-md hover:shadow-lg">
                            ノレタ詳細
                        </Link>
                        <Link href="/noridoku" className="text-white bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                            ノリドク詳細
                        </Link>
                    </nav>
                    <button
                        className="md:hidden p-2 rounded-xl bg-teal-700 text-white transition-all duration-300"
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
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs md:text-sm font-bold mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
                            RECRUIT - 採用情報
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                            <span className="text-teal-700">あなたの力</span>を、<br />
                            地域のカーライフに。
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                            港南自動車サービスでは、一緒に働く仲間を募集しています。
                            未経験の方も大歓迎。経験豊富な先輩スタッフがしっかりサポートします。
                            あなたも私たちと一緒に、地域のお客様の安心・安全なカーライフを支えませんか？
                        </p>
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40 z-[-1]"></div>
                </section>

                {/* Company Features Section */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">港南自動車で働く魅力</h2>
                        <p className="text-slate-500">私たちが大切にしていること</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {companyFeatures.map((feature, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-black mb-3 text-slate-900">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Job Listings Section */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">募集職種</h2>
                        <p className="text-slate-500">あなたに合ったポジションを見つけてください</p>
                    </div>

                    <div className="space-y-8">
                        {visibleJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-[2rem] shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                {/* Job Header */}
                                <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl">
                                                {job.icon}
                                            </div>
                                            <div>
                                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-black mb-2">
                                                    {job.highlight}
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-black text-white">{job.title}</h3>
                                                <p className="text-teal-100 text-sm">{job.subtitle}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}
                                            className="flex items-center justify-center bg-white text-teal-800 font-bold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
                                        >
                                            {activeJob === job.id ? '閉じる' : '詳細を見る'}
                                            <svg
                                                className={`w-5 h-5 ml-2 transition-transform ${activeJob === job.id ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Job Details (Expandable) */}
                                <div className={`transition-all duration-500 overflow-hidden ${activeJob === job.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-6 md:p-10 space-y-8">
                                        {/* Description */}
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 mb-3 flex items-center">
                                                <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center text-sm mr-3">📝</span>
                                                仕事内容
                                            </h4>
                                            <p className="text-slate-600 leading-relaxed pl-11">{job.description}</p>
                                        </div>

                                        {/* Requirements */}
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 mb-3 flex items-center">
                                                <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center text-sm mr-3">✅</span>
                                                応募資格
                                            </h4>
                                            <ul className="space-y-2 pl-11">
                                                {job.requirements.map((req, idx) => (
                                                    <li key={idx} className="flex items-start text-slate-600">
                                                        <svg className="w-5 h-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Salary */}
                                        <div className="bg-slate-50 rounded-2xl p-6">
                                            <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center">
                                                <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center text-sm mr-3">💰</span>
                                                給与・待遇
                                            </h4>
                                            <div className="pl-11 space-y-3">
                                                <div className="text-2xl font-black text-teal-700">{job.salary.base}</div>
                                                <p className="text-slate-500 text-sm">{job.salary.details}</p>
                                                <div className="flex flex-wrap gap-3 pt-2">
                                                    <span className="px-4 py-2 bg-white rounded-lg text-sm font-bold text-slate-700 shadow-sm">{job.salary.bonus}</span>
                                                    <span className="px-4 py-2 bg-white rounded-lg text-sm font-bold text-slate-700 shadow-sm">{job.salary.raise}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Benefits */}
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 mb-3 flex items-center">
                                                <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center text-sm mr-3">🎁</span>
                                                福利厚生
                                            </h4>
                                            <div className="pl-11 flex flex-wrap gap-2">
                                                {job.benefits.map((benefit, idx) => (
                                                    <span key={idx} className="px-3 py-1.5 bg-teal-50 text-teal-800 text-sm font-medium rounded-lg">
                                                        {benefit}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Work Style */}
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 mb-3 flex items-center">
                                                <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center text-sm mr-3">🕐</span>
                                                勤務条件
                                            </h4>
                                            <div className="pl-11 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-white p-4 rounded-xl border border-slate-200">
                                                    <div className="text-xs text-slate-400 font-bold mb-1">勤務時間</div>
                                                    <div className="text-slate-800 font-bold text-sm space-y-1">
                                                        <div>平日：{job.workStyle.hours}</div>
                                                        <div>土曜：{job.workStyle.hoursSaturday}</div>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl border border-slate-200">
                                                    <div className="text-xs text-slate-400 font-bold mb-1">定休日</div>
                                                    <div className="text-slate-800 font-bold">{job.workStyle.holidays}</div>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl border border-slate-200">
                                                    <div className="text-xs text-slate-400 font-bold mb-1">休暇</div>
                                                    <div className="text-slate-800 font-bold text-sm">{job.workStyle.vacation}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Application Section */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-700/10 rounded-full blur-2xl"></div>

                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-black mb-6">ご応募・お問い合わせ</h2>
                            <p className="text-slate-300 mb-10 leading-relaxed">
                                「まずは話を聞くだけ」「職場を見てみたい」だけでも大歓迎です。<br />
                                応募を迷っている段階でも構いません。まずはお気軽にご連絡ください。<br />
                                あなたからのご連絡を、スタッフ一同心よりお待ちしています。
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <Link
                                    href="tel:076-268-1788"
                                    className="flex items-center justify-center bg-white text-slate-900 font-black px-8 py-5 rounded-2xl transition-transform hover:scale-[1.03] active:scale-95 shadow-xl"
                                >
                                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                                    </svg>
                                    076-268-1788
                                </Link>
                                <Link
                                    href="/#contact"
                                    className="flex items-center justify-center bg-teal-700 text-white font-black px-8 py-5 rounded-2xl transition-transform hover:scale-[1.03] active:scale-95 shadow-xl hover:bg-teal-500"
                                >
                                    <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    メールで問い合わせ
                                </Link>
                            </div>

                            <div className="text-slate-400 text-sm">
                                <p>採用担当：人事部</p>
                                <p>受付時間：平日 9:00〜17:30</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Info Section */}
                <section className="container mx-auto px-4">
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12">
                        <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">会社概要</h2>
                        <div className="max-w-2xl mx-auto">
                            <dl className="space-y-4">
                                <div className="flex flex-col md:flex-row border-b border-slate-100 pb-4">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">会社名</dt>
                                    <dd className="text-slate-900">港南自動車サービス株式会社</dd>
                                </div>
                                <div className="flex flex-col md:flex-row border-b border-slate-100 pb-4">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">所在地</dt>
                                    <dd className="text-slate-900">〒920-0336 石川県金沢市金石本町ハ14</dd>
                                </div>
                                <div className="flex flex-col md:flex-row border-b border-slate-100 pb-4">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">電話番号</dt>
                                    <dd className="text-slate-900">076-268-1788</dd>
                                </div>
                                <div className="flex flex-col md:flex-row border-b border-slate-100 pb-4">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">事業内容</dt>
                                    <dd className="text-slate-900">自動車整備・車検、新車・中古車販売、カーリース「ノレタ」</dd>
                                </div>
                                <div className="flex flex-col md:flex-row">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">創業</dt>
                                    <dd className="text-slate-900">70年</dd>
                                </div>
                            </dl>
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
                                石川県金沢市で70年にわたり、地域の皆様の安全を守り続けてきました。<br />
                                丁寧な仕事、誠実な説明、そして確かな技術。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Contact Information</div>
                            <div className="text-xl font-bold">石川県金沢市金石本町ハ14</div>
                            <div className="flex flex-col space-y-2">
                                <Link href="tel:076-268-1788" className="text-3xl font-black text-teal-400 hover:text-white transition-colors">076-268-1788</Link>
                                <span className="text-slate-500 text-sm">受付：平日 9:00 - 18:00 / 土曜 9:00 - 17:00</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-6">
                        <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                        <div className="flex space-x-8">
                            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
                            <Link href="/shaken" className="hover:text-white transition-colors">車検について</Link>
                            <Link href="/noreta" className="hover:text-white transition-colors">個人リース「ノレタ」</Link>
                            <Link href="/recruit" className="hover:text-white transition-colors text-teal-400">採用情報</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
