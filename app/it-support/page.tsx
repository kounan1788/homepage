'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sendEmail } from '@/app/actions/sendEmail';

export default function ITSupportPage() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [visibleSections, setVisibleSections] = useState({
        hero: true,
        problems: false,
        strength: false,
        ai: false,
        web: false,
        templates: false,
        contact: false,
    });

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        interest: '無料相談（AI・Web全般）',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;

            setScrolled(scrollPosition > 50);

            setVisibleSections({
                hero: true,
                problems: scrollPosition > windowHeight * 0.2,
                strength: scrollPosition > windowHeight * 0.8,
                ai: scrollPosition > windowHeight * 1.5,
                web: scrollPosition > windowHeight * 2.2,
                templates: scrollPosition > windowHeight * 3.0,
                contact: scrollPosition > windowHeight * 3.5,
            });
        };

        window.addEventListener('scroll', handleScroll);
        // trigger once on mount
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Map the form data to what sendEmail expects
            const emailData = {
                name: formData.name,
                email: formData.email,
                category: formData.interest,
                message: `会社名: ${formData.company}\n電話番号: ${formData.phone}\n\n${formData.message}`
            };

            const result = await sendEmail(emailData);

            if (result.success) {
                alert('お問い合わせありがとうございます。担当者より折り返しご連絡いたします。');
                setFormData({ name: '', company: '', email: '', phone: '', interest: '無料相談（AI・Web全般）', message: '' });
            } else {
                alert(`送信に失敗しました: ${result.error}`);
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('予期せぬエラーが発生しました。もう一度お試しください。');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-slate-900/50 backdrop-blur-sm py-5'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center group">
                        <div className={`relative transition-all duration-500 ${scrolled ? 'h-8 md:h-10' : 'h-10 md:h-12'}`}>
                            {/* NOTE: If you have a white version of the logo, use it when !scrolled. Here we use CSS filters to invert if needed. */}
                            <Image
                                src="/logo.png"
                                alt="港南自動車サービス株式会社｜IT・Webサポート"
                                width={240}
                                height={60}
                                className={`h-full w-auto object-contain transition-all duration-500 ${!scrolled && 'brightness-0 invert'}`}
                                priority
                            />
                        </div>
                    </Link>

                    <nav className={`hidden lg:flex items-center space-x-8 transition-colors duration-500 ${scrolled ? 'text-slate-700' : 'text-white'}`}>
                        {['強み', 'AI講座', 'Web制作', 'テンプレート'].map((item, i) => (
                            <a
                                key={i}
                                href={`#${['strength', 'ai', 'web', 'templates'][i]}`}
                                className="relative font-bold hover:text-teal-400 transition-colors group overflow-hidden"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300"></span>
                            </a>
                        ))}
                        <a
                            href="#contact"
                            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg hover:-translate-y-0.5 ${scrolled ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-teal-500 text-white hover:bg-teal-400'}`}
                        >
                            無料相談
                        </a>
                    </nav>

                    <button
                        className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${scrolled ? 'bg-teal-600 text-white' : 'bg-white/20 text-white backdrop-blur-sm'}`}
                        onClick={toggleMenu}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}>
                            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[60] lg:hidden transition-all duration-500 flex flex-col items-center justify-center space-y-8 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                {['強み', 'AI講座', 'Web制作', 'テンプレート'].map((item, i) => (
                    <a
                        key={i}
                        href={`#${['strength', 'ai', 'web', 'templates'][i]}`}
                        className="text-2xl font-bold text-white hover:text-teal-400 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        {item}
                    </a>
                ))}
                <a
                    href="#contact"
                    className="px-10 py-4 bg-teal-500 text-white rounded-full font-bold text-xl shadow-2xl"
                    onClick={() => setMenuOpen(false)}
                >
                    無料相談に申し込む
                </a>
            </div>

            {/* 1. Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-slate-900">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-slate-900 to-blue-900/80 z-10"></div>
                    <Image src="/images/mechanic.jpg" alt="港南自動車サービス" fill className="object-cover animate-slow-zoom mix-blend-overlay" priority />
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className={`transition-all duration-1000 transform ${visibleSections.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="inline-flex items-center space-x-2 bg-teal-500/20 border border-teal-500/30 px-5 py-2.5 rounded-full text-teal-300 text-sm font-bold mb-8 backdrop-blur-md">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                            </span>
                            <span>港南自動車サービスの新規事業サポート</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
                            地域のビジネスの<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">足回り</span>と、<br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">IT基盤</span>をダブルでサポートします。
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                            自動車業界・店舗ビジネスに強い！<br />
                            AI導入からWeb活用まで、二人三脚で伴走します。
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a href="#contact" className="group relative px-10 py-5 bg-teal-600 text-white rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(20,184,166,0.4)] hover:shadow-[0_0_60px_rgba(20,184,166,0.6)] transition-all duration-300 overflow-hidden w-full sm:w-auto">
                                <span className="relative z-10 flex items-center justify-center">
                                    対面での無料相談へ
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </span>
                            </a>
                            <a href="#ai" className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto">
                                サービス詳細
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Curve */}
                <div className="absolute -bottom-1 left-0 w-full z-10">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto text-slate-50 fill-current">
                        <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </section>

            {/* 2. 課題提起セクション */}
            <section id="problems" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className={`transition-all duration-1000 transform ${visibleSections.problems ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="text-center mb-16">
                            <span className="text-teal-600 font-bold tracking-widest text-sm mb-2 block">PROBLEMS</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-800">こんなお悩みありませんか？</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { title: 'IT化に踏み出せない', desc: '業務効率化やAI活用を進めたいが、何から始めればいいか分からない。', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
                                { title: 'オンライン学習に抵抗がある', desc: '動画学習だけでは不安。直接顔を合わせて、自身の業務の悩みを質問しながら学びたい。', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
                                { title: 'Webサイトの運用が負担', desc: 'ホームページは作りたいが、制作にかかる予算や、公開後の保守・運用が心配。', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100 relative overflow-hidden group">
                                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-slate-800">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. 強み・シナジーセクション */}
            <section id="strength" className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className={`transition-all duration-1000 transform ${visibleSections.strength ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="text-center mb-16">
                            <span className="text-teal-600 font-bold tracking-widest text-sm mb-2 block">OUR STRENGTHS</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-6">港南自動車ならではの独自サービス</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">自動車関連事業との相乗効果を最大限に活かし、お客様のビジネス成長を加速させます。</p>
                        </div>

                        <div className="space-y-8 max-w-5xl mx-auto">
                            {/* Strength 1 */}
                            <div className="flex flex-col md:flex-row bg-slate-50 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group">
                                <div className="md:w-1/3 bg-teal-600 p-8 flex flex-col justify-center text-white relative overflow-hidden">
                                    <div className="absolute inset-0 bg-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <div className="text-teal-200 font-bold mb-2">強み 01</div>
                                        <h3 className="text-2xl font-black">IT化応援割引</h3>
                                    </div>
                                </div>
                                <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                                    <p className="text-slate-700 text-lg leading-relaxed font-medium">
                                        車検・整備・車両購入などをご利用の既存顧客のお客様には、<span className="text-teal-600 font-bold">AI講座の入門講座を初回半額</span>でご提供いたします。既存のお客様への還元を通して、IT活用の第一歩を負担なくスタートしていただけます。
                                    </p>
                                </div>
                            </div>

                            {/* Strength 2 */}
                            <div className="flex flex-col md:flex-row bg-slate-50 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group">
                                <div className="md:w-1/3 bg-blue-600 p-8 flex flex-col justify-center text-white relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <div className="text-blue-200 font-bold mb-2">強み 02</div>
                                        <h3 className="text-2xl font-black">スタートダッシュパック</h3>
                                    </div>
                                </div>
                                <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                                    <p className="text-slate-700 text-lg leading-relaxed font-medium mb-4">
                                        法人設立や新規事業立ち上げ時に必要なリソースをワンストップで提供する特別セットプランです。
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center text-slate-700"><svg className="w-6 h-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> <span className="font-bold mr-2">車両調達:</span> 営業車（商用車）の購入またはリース</li>
                                        <li className="flex items-center text-slate-700"><svg className="w-6 h-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> <span className="font-bold mr-2">Web制作:</span> コーポレートサイト・LPの初期制作の費用が10％OFF</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Strength 3 */}
                            <div className="flex flex-col md:flex-row bg-slate-50 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group">
                                <div className="md:w-1/3 bg-slate-800 p-8 flex flex-col justify-center text-white relative overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <div className="text-slate-400 font-bold mb-2">強み 03</div>
                                        <h3 className="text-2xl font-black">現場ビジネス特化</h3>
                                    </div>
                                </div>
                                <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                                    <p className="text-slate-700 text-lg leading-relaxed font-medium">
                                        自動車整備業や店舗ビジネスの業務効率化に特化しています。自社業務でのAI活用実績や、自社管理システム作成や自社Webサイト作成を手掛け、自社IT・アプリ開発ノウハウを元に、現場の真の課題に寄り添った解決策をご提案します。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. 提供サービス①：AI講座 */}
            <section id="ai" className="py-24 bg-teal-50 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className={`transition-all duration-1000 transform ${visibleSections.ai ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="text-center mb-16">
                            <span className="text-teal-600 font-bold tracking-widest text-sm mb-2 block">SERVICE 01</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-6">対面特化型 AI活用講座</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">中小企業の実務に直結するAI活用法を、顔を合わせて何度でも質問できる環境でマンツーマン・グループ対応で提供します。</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Course 1 */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-teal-100 relative flex flex-col h-full">
                                <div className="absolute -top-5 left-8 bg-teal-600 text-white font-bold py-1.5 px-4 rounded-full text-sm shadow-md">STEP 1</div>
                                <div className="mt-4 mb-6">
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">入門講座</h3>
                                    <div className="text-teal-600 font-medium text-sm">対象: AI未経験者</div>
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">AIの基本概念から、ChatGPTなどのツールを使った基本的な質問の仕方など、基礎からしっかり学べる第一歩です。</p>
                                <ul className="space-y-2 border-t border-slate-100 pt-6 mt-auto">
                                    <li className="flex text-sm text-slate-600"><svg className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> アカウント作成サポート</li>
                                    <li className="flex text-sm text-slate-600"><svg className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 基本的なプロンプト作成</li>
                                </ul>
                            </div>

                            {/* Course 2 */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-teal-100 relative flex flex-col h-full">
                                <div className="absolute -top-5 left-8 bg-emerald-600 text-white font-bold py-1.5 px-4 rounded-full text-sm shadow-md">STEP 2</div>
                                <div className="mt-4 mb-6">
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">中級講座</h3>
                                    <div className="text-emerald-600 font-medium text-sm">対象: 入門修了者・AI経験者</div>
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">日常の業務フローにAIを組み込み、文書作成やデータ整理などの実業務を大幅に効率化する実践ノウハウを身につけます。</p>
                                <ul className="space-y-2 border-t border-slate-100 pt-6 mt-auto">
                                    <li className="flex text-sm text-slate-600"><svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 業務マニュアルの自動生成</li>
                                    <li className="flex text-sm text-slate-600"><svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 議事録・メール作成の自動化</li>
                                </ul>
                            </div>

                            {/* Course 3 */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-teal-100 relative flex flex-col h-full">
                                <div className="absolute -top-5 left-8 bg-blue-600 text-white font-bold py-1.5 px-4 rounded-full text-sm shadow-md">STEP 3</div>
                                <div className="mt-4 mb-6">
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">発展講座</h3>
                                    <div className="text-blue-600 font-medium text-sm">対象: 中級修了者</div>
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">プログラミング知識がなくても、AIを使ってWebサイト・アプリ作成や高度な画像生成など、クリエイティブな制作を行う手法を学びます。</p>
                                <ul className="space-y-2 border-t border-slate-100 pt-6 mt-auto">
                                    <li className="flex text-sm text-slate-600"><svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> ノーコードツールとの連携</li>
                                    <li className="flex text-sm text-slate-600"><svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> プロジェクト単位での実践開発</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. 提供サービス②：Webサイト制作 */}
            <section id="web" className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className={`transition-all duration-1000 transform ${visibleSections.web ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="text-center mb-16">
                            <span className="text-teal-600 font-bold tracking-widest text-sm mb-2 block">SERVICE 02</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-6">Webサイト制作・運用</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">小規模コーポレートサイトやLPに特化し、「名刺代わり」のサイトを短納期・低コストでご提供します。</p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                            <div className="lg:w-1/2">
                                <h3 className="text-2xl font-bold mb-6 flex items-center"><svg className="w-6 h-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 当社の強み</h3>
                                <ul className="space-y-4 mb-10">
                                    <li className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <div className="font-bold text-lg mb-1 text-slate-800">完成イメージの事前共有</div>
                                        <div className="text-slate-600 text-sm">高品質なテンプレートをベースに活用するため、完成前にデザインイメージを共有可能。ミスマッチを防ぎます。</div>
                                    </li>
                                    <li className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <div className="font-bold text-lg mb-1 text-slate-800">短納期・低コストの実現</div>
                                        <div className="text-slate-600 text-sm">複雑なシステムを省略し、集客や会社案内に必要な機能に絞ることで、素早い立ち上げとコスト削減を実現します。</div>
                                    </li>
                                </ul>
                            </div>

                            <div className="lg:w-1/2">
                                <h3 className="text-2xl font-bold mb-6 flex items-center"><svg className="w-6 h-6 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 運用・保守プラン</h3>
                                <div className="space-y-6">
                                    <div className="border-l-4 border-teal-500 bg-teal-50/50 p-6 rounded-r-2xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg text-teal-900">自社運用サポート</h4>
                                            <span className="bg-white text-teal-600 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">都度対応</span>
                                        </div>
                                        <p className="text-slate-600 text-sm">お知らせなど、お客様自身での簡単な更新作業を行えるようサポートします。どうしても困った時だけご相談いただけるプランです。</p>
                                    </div>
                                    <div className="border-l-4 border-blue-500 bg-blue-50/50 p-6 rounded-r-2xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg text-blue-900">保守・サポート代行</h4>
                                            <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">月額費用制</span>
                                        </div>
                                        <p className="text-slate-600 text-sm">サーバーの維持から定期的な更新作業、トラブル時の対応まで、弊社にてすべて代行する安心のフルサポートプランです。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. 制作テンプレート紹介 */}
            <section id="templates" className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-6">
                    <div className={`transition-all duration-1000 transform ${visibleSections.templates ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="text-center mb-16">
                            <span className="text-teal-600 font-bold tracking-widest text-sm mb-2 block">TEMPLATE SITES</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-6">制作テンプレート例</h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">以下の高品質なテンプレートをベースに、お客様専用のWebサイトを素早く構築いたします。</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Dummy templates to map out design */}
                            {[
                                {
                                    siteName: "コーヒー豆 ECサイト",
                                    image: "/images/coffee/mainimgh.jpg", // テンプレート画像のパス
                                    title: "ECサイト制作",
                                    text: "清潔感とオシャレ感のあるデザイン構成です。",
                                    link: "/coffee-site-template" // テンプレート確認用URL
                                },
                                {
                                    siteName: "ハウスメーカー・工務店",
                                    image: "/images/housemaker/1h.jpg", // テンプレート画像のパス
                                    title: "住宅・建築系サイト制作",
                                    text: "安心感と信頼感を伝える、施工事例やモデルハウス案内が映えるデザイン構成です。",
                                    link: "/housemaker-site-template" // テンプレート確認用URL
                                },
                                {
                                    siteName: "ギャラリー・ポートフォリオ",
                                    image: "/images/gallery/10h.jpg", // テンプレート画像のパス
                                    title: "クリエイター・アーティスト向け",
                                    text: "作品の魅力がダイレクトに伝わるMasonry（レンガ状）ギャラリーを備えた、洗練されたダークテーマデザインです。",
                                    link: "/gallery-site-template" // テンプレート確認用URL
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                    {/* Image Placeholder */}
                                    <div className="relative w-full aspect-[4/3] bg-slate-200 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold group-hover:scale-105 transition-transform duration-500">
                                            <Image src={item.image} alt={item.siteName} fill className="object-cover" />
                                        </div>
                                    </div>
                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="mb-4">
                                            <div className="font-bold text-slate-800 text-lg mb-1">{item.siteName}</div>
                                            <div className="text-teal-600 text-sm font-bold bg-teal-50 px-3 py-1 rounded-full inline-block">{item.title}</div>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{item.text}</p>

                                        <div className="mt-auto border-t border-slate-100 pt-4 pb-1">
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-bold text-sm tracking-widest hover:text-teal-700 transition-colors flex items-center cursor-pointer group/link w-fit">
                                                デモサイトを見る
                                                <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. CTA / Contact */}
            <section id="contact" className="py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-0 w-96 h-96 bg-teal-600 rounded-full blur-[128px] opacity-30 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[128px] opacity-20 translate-x-1/2"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className={`transition-all duration-1000 transform max-w-4xl mx-auto ${visibleSections.contact ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">無料相談・ヒアリングのお申し込み</h2>
                            <p className="text-slate-300 text-lg">
                                IT化にお悩みの方、Webページを作りたい方、まずはお気軽にご連絡ください。<br />
                                専門スタッフが対面でしっかりと課題をヒアリングいたします。
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">お名前 <span className="text-red-500">*</span></label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" placeholder="山田 太郎" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">貴社名 / 屋号</label>
                                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" placeholder="株式会社〇〇" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">メールアドレス <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" placeholder="mail@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">電話番号 <span className="text-red-500">*</span></label>
                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow" placeholder="090-1234-5678" />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-slate-700 mb-2">ご相談内容の分類 <span className="text-red-500">*</span></label>
                                <select name="interest" required value={formData.interest} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow">
                                    <option value="無料相談（AI・Web全般）">無料相談（AI・Web全般について）</option>
                                    <option value="AI講座について">AI活用講座について</option>
                                    <option value="Web制作について">ホームページ制作・改善について</option>
                                    <option value="スタートダッシュパックについて">スタートダッシュパックについて</option>
                                </select>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-slate-700 mb-2">ご相談内容（詳細）</label>
                                <textarea name="message" rows={4} value={formData.message} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow resize-none" placeholder="現在のお悩みや、知りたいことなどをご自由にお書きください。"></textarea>
                            </div>

                            <div className="text-center">
                                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-10 py-5 bg-teal-600 text-white rounded-2xl font-black text-lg w-full md:w-auto hover:bg-teal-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            送信中...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            対面での無料相談を申し込む
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                    )}
                                </button>
                                <p className="mt-4 text-xs text-slate-500">送信後、原則2営業日以内に担当者よりご返答いたします。</p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center mb-6">
                        <Link href="/">
                            <Image src="/logo.png" alt="港南自動車サービス" width={180} height={45} className="brightness-0 invert opacity-50 hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                    <div className="text-slate-500 text-sm mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
                        <span>〒920-0336 石川県金沢市金石本町ハ14番地</span>
                        <span className="hidden md:inline">|</span>
                        <span>TEL: 076-268-1788</span>
                        <span className="hidden md:inline">|</span>
                        <span>定休日: 第2土曜・日祝・GW・お盆・年末年始</span>
                    </div>
                    <div className="text-slate-600 text-xs">
                        &copy; {new Date().getFullYear()} KOUNAN AUTO SERVICE INC.
                    </div>
                </div>
            </footer>
        </div>
    );
}

