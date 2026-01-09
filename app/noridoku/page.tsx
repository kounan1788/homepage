'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ============================================
// ページ公開フラグ
// true: ノリドクページを表示
// false: 「ページ準備中」を表示
// ============================================
const IS_PAGE_READY = true;

// 車両耐用年数データ
const VEHICLE_TYPES = [
    { category: '一般用', name: '小型車（総排気量0.66L以下）', years: 4 },
    { category: '一般用', name: '貨物自動車（ダンプ式）', years: 4 },
    { category: '一般用', name: '貨物自動車（その他）', years: 5 },
    { category: '一般用', name: '報道通信用のもの', years: 5 },
    { category: '一般用', name: 'その他のもの（普通乗用車）', years: 6 },
    { category: '一般用', name: '2輪・3輪自動車', years: 3 },
    { category: '運送事業用', name: '小型車（積載量2トン以下）', years: 3 },
    { category: '運送事業用', name: '大型乗用車（総排気量3L以上）', years: 5 },
    { category: '運送事業用', name: 'その他のもの', years: 4 },
    { category: '運送事業用', name: '乗合自動車', years: 5 },
];

// 200%定率法のデータ（償却率・改定償却率・保証率）
// 国税庁 減価償却資産の耐用年数等に関する省令 別表より
const DECLINING_DATA: { [key: number]: { rate: number; revisedRate: number; guarantee: number } } = {
    2: { rate: 1.000, revisedRate: 1.000, guarantee: 0.000 },
    3: { rate: 0.667, revisedRate: 1.000, guarantee: 0.11089 },
    4: { rate: 0.500, revisedRate: 1.000, guarantee: 0.12499 },
    5: { rate: 0.400, revisedRate: 0.500, guarantee: 0.10800 },
    6: { rate: 0.333, revisedRate: 0.334, guarantee: 0.09911 },
    7: { rate: 0.286, revisedRate: 0.334, guarantee: 0.08680 },
};

export default function NoridokuPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    // シミュレーター用state
    const [activeTab, setActiveTab] = useState<'depreciation' | 'compare' | 'interest'>('depreciation');
    const [vehiclePrice, setVehiclePrice] = useState<number>(300);
    const [selectedVehicleType, setSelectedVehicleType] = useState<number>(4);
    const [customYears, setCustomYears] = useState<number | null>(null);
    const [depreciationMethod, setDepreciationMethod] = useState<'straight' | 'declining'>('straight');
    const [interestRateA, setInterestRateA] = useState<number>(1.9);
    const [interestRateB, setInterestRateB] = useState<number>(3.5);
    const [leasePeriod, setLeasePeriod] = useState<number>(5);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const usefulLife = customYears || selectedVehicleType;
    const priceInYen = vehiclePrice * 10000;

    // 定額法計算
    const calcStraightLine = () => {
        const annual = Math.floor(priceInYen / usefulLife);
        return Array.from({ length: usefulLife }, (_, i) => ({
            year: i + 1,
            depreciation: annual,
            accumulated: annual * (i + 1),
            remaining: priceInYen - annual * (i + 1)
        }));
    };

    // 定率法計算（200%定率法：償却保証額・改定償却率対応）
    const calcDeclining = () => {
        const data = DECLINING_DATA[usefulLife] || { rate: 0.333, revisedRate: 0.334, guarantee: 0.09911 };
        const guaranteeAmount = Math.floor(priceInYen * data.guarantee); // 償却保証額
        let remaining = priceInYen;
        let revisedAcquisition = 0; // 改定取得価額
        let useRevised = false;
        const results = [];

        for (let i = 0; i < usefulLife; i++) {
            let dep: number;

            if (useRevised) {
                // 改定償却率による計算
                dep = Math.floor(revisedAcquisition * data.revisedRate);
            } else {
                // 通常の定率法計算
                dep = Math.floor(remaining * data.rate);

                // 調整前償却額が償却保証額を下回った場合
                if (dep < guaranteeAmount) {
                    useRevised = true;
                    revisedAcquisition = remaining; // この時点の未償却残高が改定取得価額
                    dep = Math.floor(revisedAcquisition * data.revisedRate);
                }
            }

            // 最終年度は残存価額1円を残す
            if (i === usefulLife - 1) {
                dep = remaining - 1;
            } else if (dep > remaining - 1) {
                dep = remaining - 1;
            }

            remaining -= dep;
            results.push({
                year: i + 1,
                depreciation: dep,
                accumulated: priceInYen - remaining,
                remaining
            });
        }
        return results;
    };

    const depreciationData = depreciationMethod === 'straight' ? calcStraightLine() : calcDeclining();
    const maxDepreciation = Math.max(...depreciationData.map(d => d.depreciation));

    // リース vs 購入比較
    const leaseMonthly = Math.floor(priceInYen / (usefulLife * 12));
    const leaseAnnual = leaseMonthly * 12;

    // 金利計算
    const calcInterest = (rate: number, years: number) => {
        const monthlyRate = rate / 100 / 12;
        const months = years * 12;
        const monthly = Math.floor((priceInYen * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
        const total = monthly * months;
        return { monthly, total, interest: total - priceInYen };
    };

    const interestA = calcInterest(interestRateA, leasePeriod);
    const interestB = calcInterest(interestRateB, leasePeriod);


    // ============================================
    // ページ準備中の表示
    // ============================================
    if (!IS_PAGE_READY) {
        return (
            <div className="min-h-screen bg-neutral-50 font-sans text-slate-900 flex flex-col">
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                    <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-[1.02]">
                            <Image src="/logo.png" alt="港南自動車サービス" width={180} height={45} className="w-auto h-10 md:h-12 object-contain" priority />
                        </Link>
                        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                            <Link href="/" className="text-slate-600 hover:text-teal-600 transition-colors">ホーム</Link>
                            <Link href="/#services" className="text-slate-600 hover:text-teal-600 transition-colors">サービス</Link>
                            <Link href="/noreta" className="text-white bg-teal-600 px-5 py-2.5 rounded-full hover:bg-teal-700 transition-all shadow-md hover:shadow-lg">
                                ノレタ詳細
                            </Link>
                        </nav>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center pt-20">
                    <div className="text-center px-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">ページ準備中</h1>
                        <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
                            ノリドクページは現在準備中です。<br />公開までしばらくお待ちください。
                        </p>
                        <Link href="/" className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            トップページへ戻る
                        </Link>
                    </div>
                </main>
                <footer className="py-8 text-center text-slate-400 text-sm">
                    <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-slate-900 overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-[1.02]">
                        <Image src="/logo.png" alt="港南自動車サービス" width={180} height={45} className="w-auto h-10 md:h-12 object-contain" priority />
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">ホーム</Link>
                        <Link href="/#services" className="text-slate-600 hover:text-blue-600 transition-colors">サービス</Link>
                        <Link href="/noreta" className="text-slate-600 hover:text-blue-600 transition-colors">ノレタ</Link>
                        <Link href="/noridoku" className="text-white bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                            ノリドク詳細
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="pt-20 md:pt-24">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 py-20 md:py-32 overflow-hidden">
                    {/* Decorative geometric shapes */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rotate-45 transform"></div>
                        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-white/10 rotate-12 transform"></div>
                        <div className="absolute -bottom-10 left-1/4 w-48 h-48 bg-white/5 rotate-45 transform"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="text-center mb-8">
                                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full mb-6">
                                    個人事業主・法人限定リース
                                </span>
                                <p className="text-white/90 text-lg md:text-xl mb-4">
                                    まだ「損なリース」を使ってるの？
                                </p>
                                <p className="text-white text-xl md:text-2xl font-bold mb-6">
                                    財務を最適化するなら
                                </p>
                                <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
                                    ノリドク
                                </h1>
                            </div>

                            <div className="max-w-3xl mx-auto text-center text-white/90 space-y-3">
                                <p className="text-lg">事業に営業車は付き物。</p>
                                <p>その営業車を、<span className="font-bold text-white">金利1.9%〜</span>と財務提案で「負担」から「経営の力」へ。</p>
                                <p><span className="font-bold text-white">解約金ゼロ</span>の自由さが、変化の多い御社の挑戦を支えます。</p>
                                <p>コストとリスクを抑え、経営者様に一番近くて寄り添います。</p>
                            </div>

                            <div className="flex justify-center mt-12">
                                <a href="#contact" className="group px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-lg shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all duration-300">
                                    <span className="flex items-center">
                                        お問い合わせ・ご相談
                                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Wave decoration */}
                    <div className="absolute -bottom-1 left-0 w-full">
                        <svg viewBox="0 0 1440 120" className="w-full h-auto">
                            <path fill="#fafafa" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                        </svg>
                    </div>
                </section>

                {/* Feature 01: Cost Reduction */}
                <section className="py-20 md:py-32 bg-neutral-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl font-black mb-6">
                                01
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-blue-600 mb-4 leading-relaxed">
                                「コスト削減」は、利益の創出です。<br />
                                <span className="text-slate-900">業界常識を覆す金利1.9%〜で、現預金を最大限に守る調達を。</span>
                            </h2>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-center mb-10">
                                <div className="w-64 h-64 relative">
                                    <Image
                                        src="/images/noridoku_hero.png"
                                        alt="ビジネスでのコスト削減イメージ"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-100 space-y-4 text-slate-600 leading-relaxed">
                                <p>ビジネスにおいて、調達コストの抑制は利益率に直結します。</p>
                                <p>本サービスでは、<span className="font-bold text-slate-900">業界最安水準となる金利「1.9%〜」</span>を実現しました。一般的なディーラーローンやリース金利（通常3%〜5%程度）と比較してください。長期的な支払い総額において、その差は歴然です。</p>
                                <p>低金利で調達することで、手元のキャッシュフローを圧迫せず、浮いた資金を新たな事業投資や人材採用へと回すことが可能になります。</p>
                                <p className="font-bold text-slate-900">「車にお金をかけすぎない」。これも一つの立派な経営戦略です。</p>
                                <div className="bg-blue-50 rounded-xl p-6 mt-6">
                                    <p className="text-sm text-blue-800">
                                        ※リース金利や与信枠は審査によって変動いたします。<br />
                                        ・リース金利1.9%・与信枠1,000万円〜無制限（会社規模と車両台数によります）<br />
                                        ・リース金利2.3%・与信枠500万円<br />
                                        のどちらかとなりますのでご了承くださいませ。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 02: Financial Strategy */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl font-black mb-6">
                                02
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-blue-600 mb-4 leading-relaxed">
                                ただ車を借りるのではなく、「財務戦略」として導入する。<br />
                                <span className="text-slate-900">御社のBS/PLを最適化する、専属の車両財務コンサルタント。</span>
                            </h2>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-center mb-10">
                                <div className="w-64 h-64 relative">
                                    <Image
                                        src="/images/noridoku_consultation.png"
                                        alt="財務コンサルティングイメージ"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-8 md:p-10 shadow-lg border border-slate-100 space-y-4 text-slate-600 leading-relaxed mb-12">
                                <p>「ただの移動手段」を、戦略的な「財務ソリューション」へ。</p>
                                <p>車両導入の際、現金・ローン購入とリースで最も異なるのは<span className="font-bold text-slate-900">「経費化のスピード」と「事務管理の効率」</span>です。</p>
                                <p>現金購入の場合、車両本体は「固定資産」となり、6年かけて減価償却しなければなりません。一方「ノリドク」のリースなら、車両代・税金・保険のすべてをパッケージ化し、導入初月から<span className="font-bold text-slate-900">「支払額＝全額経費」</span>として処理できます。</p>
                            </div>

                            {/* Comparison Table */}
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6">
                                    <h3 className="text-xl font-black text-white text-center">現金・ローン購入と「ノリドク」（リース）の違い</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-100">
                                                <th className="py-4 px-6 text-left font-bold text-slate-700 border-b border-slate-200">項目</th>
                                                <th className="py-4 px-6 text-center font-bold text-slate-700 border-b border-slate-200">現金・ローン購入</th>
                                                <th className="py-4 px-6 text-center font-bold text-blue-600 border-b border-slate-200 bg-blue-50">ノリドク（リース）</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-4 px-6 border-b border-slate-100 font-medium text-slate-700">経費処理の形</td>
                                                <td className="py-4 px-6 border-b border-slate-100 text-center text-slate-600">減価償却（分割）+諸費用（都度）</td>
                                                <td className="py-4 px-6 border-b border-slate-100 text-center text-blue-700 font-bold bg-blue-50/50">毎月のリース料（全額経費）</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 px-6 border-b border-slate-100 font-medium text-slate-700">経理事務の負担</td>
                                                <td className="py-4 px-6 border-b border-slate-100 text-center text-slate-600">煩雑（資産管理・納税・保険管理）</td>
                                                <td className="py-4 px-6 border-b border-slate-100 text-center text-blue-700 font-bold bg-blue-50/50">極めて簡単（月1回の仕訳のみ）</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 px-6 border-b border-slate-100 font-medium text-slate-700">消費税の扱い</td>
                                                <td className="py-4 px-6 border-b border-slate-100 text-center text-slate-600">購入時に一括で課税仕入</td>
                                                <td className="py-4 px-6 border-b border-slate-100 text-center text-blue-700 font-bold bg-blue-50/50">毎月の支払ごとに分散</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 px-6 font-medium text-slate-700">資産計上（B/S）</td>
                                                <td className="py-4 px-6 text-center text-slate-600">あり（固定資産が増え、比率が悪化）</td>
                                                <td className="py-4 px-6 text-center text-blue-700 font-bold bg-blue-50/50">なし（オフバランスで財務健全）</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Why Choose Noridoku */}
                            <div className="mt-12 bg-slate-50 rounded-3xl p-8 md:p-10 border border-slate-100">
                                <h4 className="text-xl font-black text-slate-900 mb-6">なぜ「ノリドク」が選ばれるのか？</h4>
                                <div className="space-y-6 text-slate-600">
                                    <div className="flex items-start">
                                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-4">1</span>
                                        <div>
                                            <p className="font-bold text-slate-900 mb-1">経費の平準化で、利益予測を確実に</p>
                                            <p className="text-sm">現金購入では車検月や納税月に支出が跳ね上がりますが、リースなら毎月決まった額が経費になるだけ。コストが「一定の線」になるため、月次の利益管理が極めてシンプルになり、中長期的な事業計画が立てやすくなります。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-4">2</span>
                                        <div>
                                            <p className="font-bold text-slate-900 mb-1">管理コストをゼロへ</p>
                                            <p className="text-sm">自動車税の納付、任意保険の更新、車検の支払い……。バラバラに発生する事務作業は、経営者の貴重な時間を奪います。「ノリドク」はこれらを一本化。経理は「月1回の振込を確認するだけ」になります。</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-4">3</span>
                                        <div>
                                            <p className="font-bold text-slate-900 mb-1">銀行融資を有利に（オフバランス化）</p>
                                            <p className="text-sm">車両を「資産」として持つと、貸借対照表上の負債も増え、自己資本比率に影響します。リースなら資産に計上されないため、財務体質をきれいに保ち、いざという時の銀行融資枠を温存できます。</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-6 text-slate-700 font-medium">
                                    「長く乗って資産にしたい」なら現金購入。しかし、「利益をコントロールし、本業のキャッシュフローを最大化したい」なら、<span className="text-blue-600 font-bold">「ノリドク」が正解</span>です。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 03: Zero Cancellation Fee */}

                <section className="py-20 md:py-32 bg-neutral-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl font-black mb-6">
                                03
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-blue-600 mb-4 leading-relaxed">
                                ビジネスの変化に、契約が足かせになってはいけない。<br />
                                <span className="text-slate-900">「違約金ゼロ」がもたらす、攻めと守りの経営スピード。</span>
                            </h2>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-center mb-10">
                                <div className="w-64 h-64 relative">
                                    <Image
                                        src="/images/noridoku_cost.png"
                                        alt="違約金ゼロのイメージ"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-100 space-y-4 text-slate-600 leading-relaxed">
                                <p>経営の足かせにならない。時代に合わせて「乗り換え・返却」を自在に。</p>
                                <p>ビジネスの世界に「絶対」はありません。急激な社会情勢の変化、事業の転換、予期せぬ拠点の統合。あるいは、想像以上の急成長によって、今の車両スペックでは足りなくなることもあるでしょう。</p>
                                <p>従来のカーリースにおける最大の懸念点は、数年単位の長期契約に縛られ、途中でやめる際には「残りの期間の支払額」にプラスして中途解約金を請求されるという<span className="font-bold text-slate-900">「リスク」</span>でした。これでは、経営の柔軟性を奪う「重荷」を背負っているのと変わりません。</p>

                                <div className="bg-blue-50 rounded-xl p-6 my-6 border-l-4 border-blue-500">
                                    <p className="text-blue-800 font-bold text-lg">「ノリドク」は、その常識を根底から変えます。</p>
                                </div>

                                <p>当サービスでは、<span className="font-bold text-slate-900">中途解約時の解約料（違約金）をいただきません</span>。</p>
                                <ul className="list-none space-y-2 ml-4">
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        「事業が軌道に乗るまで、まずは1台導入したい。でも、もしもの時は手放したい」
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        「スタッフが増えたから、軽自動車を返却してすぐにハイエースに乗り換えたい」
                                    </li>
                                </ul>
                                <p>そんな経営判断のスピードに、私たちはどこまでも追従します。</p>
                                <p><span className="font-bold text-slate-900">必要な時に、必要な分だけ利用し、不要になればコストを即座にカットできる。</span></p>
                                <p>この圧倒的な「身軽さ」は、変化の激しい現代において、経営者様が持つべき最大の武器になります。</p>
                                <p className="pt-4 text-slate-700">「契約に縛られる不安」から経営者を解放し、常に最適な資産状態で、攻めの経営に集中していただくこと。リスクを最小限に抑え、経営のフリーハンドを確保する<span className="font-bold text-blue-600">「ノリドク」</span>の自由設計は、挑戦し続ける個人事業主様・法人様への、私たちからの最大のエールです。</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Simulator Section */}
                <section id="simulator" className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-sky-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">財務シミュレーター</h2>
                            <p className="text-slate-500">減価償却・リース比較・金利比較を計算できます</p>
                            <p className="text-xs text-slate-400 mt-2">※計算結果は参考値です。実際の税務計算とは異なる場合があります。</p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            {/* Tabs */}
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {[{ id: 'depreciation', label: '減価償却' }, { id: 'compare', label: '購入vsリース' }, { id: 'interest', label: '金利比較' }].map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{tab.label}</button>
                                ))}
                            </div>

                            {/* Common Input */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">車両金額（万円）</label>
                                        <input type="number" value={vehiclePrice} onChange={e => setVehiclePrice(Number(e.target.value) || 0)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg font-bold" min="0" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">車種区分（耐用年数）</label>
                                        <select value={customYears ? 'custom' : selectedVehicleType} onChange={e => { if (e.target.value === 'custom') { setCustomYears(6); } else { setCustomYears(null); setSelectedVehicleType(Number(e.target.value)); } }} className="w-full px-4 py-3 border border-slate-300 rounded-xl">
                                            {VEHICLE_TYPES.map((v, i) => (<option key={i} value={v.years}>{v.name}（{v.years}年）</option>))}
                                            <option value="custom">カスタム入力</option>
                                        </select>
                                    </div>
                                    {customYears !== null && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">カスタム耐用年数</label>
                                            <input type="number" value={customYears} onChange={e => setCustomYears(Math.max(1, Math.min(10, Number(e.target.value))))} className="w-full px-4 py-3 border border-slate-300 rounded-xl" min="1" max="10" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tab: Depreciation */}
                            {activeTab === 'depreciation' && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                                    <div className="flex gap-4 mb-6">
                                        <button onClick={() => setDepreciationMethod('straight')} className={`px-4 py-2 rounded-lg font-bold ${depreciationMethod === 'straight' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>定額法</button>
                                        <button onClick={() => setDepreciationMethod('declining')} className={`px-4 py-2 rounded-lg font-bold ${depreciationMethod === 'declining' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>定率法</button>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-4">年度別 減価償却費</h4>
                                    <div className="space-y-3">
                                        {depreciationData.map(d => (
                                            <div key={d.year} className="flex items-center gap-4">
                                                <span className="w-16 text-sm font-bold text-slate-600">{d.year}年目</span>
                                                <div className="flex-1 bg-slate-100 rounded-full h-8"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${(d.depreciation / maxDepreciation) * 100}%` }}></div></div>
                                                <span className="w-28 text-right text-sm font-bold text-blue-600">{(d.depreciation / 10000).toFixed(1)}万円</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4 text-center">
                                        <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500">取得価額</p><p className="text-xl font-black">{vehiclePrice}万円</p></div>
                                        <div className="bg-blue-50 rounded-xl p-4"><p className="text-xs text-slate-500">耐用年数</p><p className="text-xl font-black text-blue-600">{usefulLife}年</p></div>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Compare */}
                            {activeTab === 'compare' && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-4">購入（減価償却）vs リース（全額経費）</h4>
                                    <div className="space-y-4">
                                        {depreciationData.map(d => (
                                            <div key={d.year} className="grid grid-cols-[60px_1fr_1fr] gap-4 items-center">
                                                <span className="text-sm font-bold">{d.year}年目</span>
                                                <div><div className="bg-slate-200 rounded-full h-6"><div className="bg-slate-500 h-full rounded-full" style={{ width: `${(d.depreciation / Math.max(d.depreciation, leaseAnnual)) * 100}%` }}></div></div><p className="text-xs text-slate-500 mt-1">償却: {(d.depreciation / 10000).toFixed(1)}万</p></div>
                                                <div><div className="bg-blue-100 rounded-full h-6"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${(leaseAnnual / Math.max(d.depreciation, leaseAnnual)) * 100}%` }}></div></div><p className="text-xs text-blue-600 mt-1">リース: {(leaseAnnual / 10000).toFixed(1)}万</p></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 bg-blue-50 rounded-xl p-4 text-center"><p className="text-blue-800">リースなら毎月<span className="font-black text-xl mx-1">{(leaseMonthly / 10000).toFixed(2)}万円</span>が経費計上可能</p></div>
                                </div>
                            )}

                            {/* Tab: Interest */}
                            {activeTab === 'interest' && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div><label className="block text-sm font-bold mb-2">期間（年）</label><input type="number" value={leasePeriod} onChange={e => setLeasePeriod(Math.max(1, Math.min(10, Number(e.target.value))))} className="w-full px-4 py-3 border rounded-xl" /></div>
                                        <div><label className="block text-sm font-bold mb-2">金利A（%）</label><input type="number" step="0.1" value={interestRateA} onChange={e => setInterestRateA(Number(e.target.value))} className="w-full px-4 py-3 border rounded-xl" /></div>
                                        <div><label className="block text-sm font-bold mb-2">金利B（%）</label><input type="number" step="0.1" value={interestRateB} onChange={e => setInterestRateB(Number(e.target.value))} className="w-full px-4 py-3 border rounded-xl" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-blue-50 rounded-xl p-6 text-center border-2 border-blue-200"><p className="text-sm text-blue-600 font-bold mb-2">金利A（{interestRateA}%）</p><p className="text-3xl font-black text-blue-700">{(interestA.total / 10000).toFixed(1)}万円</p><p className="text-xs text-slate-500 mt-2">金利: {(interestA.interest / 10000).toFixed(1)}万円</p></div>
                                        <div className="bg-slate-100 rounded-xl p-6 text-center border-2 border-slate-300"><p className="text-sm font-bold mb-2">金利B（{interestRateB}%）</p><p className="text-3xl font-black">{(interestB.total / 10000).toFixed(1)}万円</p><p className="text-xs text-slate-500 mt-2">金利: {(interestB.interest / 10000).toFixed(1)}万円</p></div>
                                    </div>
                                    <div className="mt-6 bg-green-50 rounded-xl p-4 text-center border border-green-200"><p className="text-green-800">金利差による節約額: <span className="font-black text-2xl text-green-600">{((interestB.interest - interestA.interest) / 10000).toFixed(1)}万円</span></p></div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}

                <section id="contact" className="py-20 md:py-32 bg-gradient-to-br from-slate-900 to-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">お問い合わせ・ご相談</h2>
                            <p className="text-slate-300 mb-10 leading-relaxed">
                                ノリドクについてのご質問やお見積りなど、<br />
                                お気軽にお問い合わせください。
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
                                    className="flex items-center justify-center bg-blue-600 text-white font-black px-8 py-5 rounded-2xl transition-transform hover:scale-[1.03] active:scale-95 shadow-xl hover:bg-blue-500"
                                >
                                    <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    メールで問い合わせ
                                </Link>
                            </div>

                            <div className="text-slate-400 text-sm space-y-1">
                                <p>営業時間：AM 8:30〜PM 6:00</p>
                                <p>定休日：日曜・祝日、第2・4土曜日</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Info */}
                <section className="py-16 bg-slate-950 text-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
                                    <Image src="/logo.png" alt="港南自動車サービス" width={60} height={30} className="object-contain" />
                                </div>
                                <div>
                                    <p className="text-lg font-black">（株）港南自動車サービス</p>
                                    <p className="text-sm text-slate-400">石川県金沢市金石本町ハ14番地</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <Link href="tel:076-268-1788" className="text-3xl md:text-4xl font-black text-blue-400 hover:text-white transition-colors">
                                    TEL 076-268-1788
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-white py-8 border-t border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-4">
                        <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                        <div className="flex space-x-6">
                            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
                            <Link href="/shaken" className="hover:text-white transition-colors">車検について</Link>
                            <Link href="/noreta" className="hover:text-white transition-colors">ノレタ</Link>
                            <Link href="/noridoku" className="hover:text-white transition-colors text-blue-400">ノリドク</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
