'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { sendEmail } from '@/app/actions/sendEmail';

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
        message: '',
    });

    const [menuOpen, setMenuOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeIn = (section: 'hero' | 'services' | 'cases' | 'company' | 'instagram' | 'reviews' | 'contact') => {
        return visibleSections[section] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';
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

        try {
            const result = await sendEmail(formData);

            if (result.success) {
                alert('お問い合わせありがとうございます。メッセージが正常に送信されました。');
                setFormData({
                    name: '',
                    email: '',
                    category: '',
                    message: '',
                });
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

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-teal-100 italic-none" data-oid="31zkqzo">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-lg py-2'
                    : 'bg-transparent py-5'
                    }`}
                data-oid="fqghwyr"
            >
                <div
                    className="container mx-auto px-6 flex justify-between items-center"
                    data-oid="ogzl6xz"
                >
                    <Link href="/" className="flex items-center group" data-oid="0eh.y8p">
                        <div className={`relative transition-all duration-500 ${scrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}>
                            <Image
                                src="/logo.png"
                                alt="港南自動車サービス株式会社｜石川県金沢市の車検・整備・新車販売"
                                width={280}
                                height={70}
                                className={`h-full w-auto object-contain transition-all duration-500 ${!scrolled && 'brightness-0 invert'}`}
                                priority
                            />
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center space-x-8" data-oid="jdpcl.f">
                        <nav className={`flex items-center space-x-8 transition-colors duration-500 ${scrolled ? 'text-slate-700' : 'text-white'}`} data-oid="_c2.5k6">
                            {['サービス内容', '取扱車種', '会社情報', 'お問い合わせ', '採用情報'].map((item, i) => (
                                <a
                                    key={i}
                                    href={`${['#services', '#cases', '#company', '#contact', '/recruit'][i]}`}
                                    className="relative font-medium hover:text-teal-500 transition-colors group overflow-hidden"
                                >
                                    {item}
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300"></span>
                                </a>
                            ))}
                        </nav>
                        <Link
                            href="/noreta"
                            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5 ${scrolled
                                ? 'bg-teal-600 text-white hover:bg-teal-700'
                                : 'bg-white text-teal-700 hover:bg-slate-100'
                                }`}
                            data-oid="r7m-jfd"
                        >
                            ノレタ詳細
                        </Link>
                        <Link
                            href="/noridoku"
                            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 ${scrolled
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            ノリドク詳細
                        </Link>
                    </div>

                    <button
                        className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${scrolled ? 'bg-teal-600 text-white' : 'bg-white/20 text-white backdrop-blur-sm'
                            }`}
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        data-oid="av_bd._"
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

            {/* Mobile menu - headerの外に配置してスクロール時の影響を受けないようにする */}
            <div
                className={`fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[60] lg:hidden transition-all duration-500 flex flex-col items-center justify-center space-y-8 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                {['サービス内容', '取扱車種', '会社情報', 'お問い合わせ', '採用情報'].map((item, i) => (
                    <a
                        key={i}
                        href={`${['#services', '#cases', '#company', '#contact', '/recruit'][i]}`}
                        className="text-2xl font-bold text-white hover:text-teal-400 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        {item}
                    </a>
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

            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden flex items-center justify-center" data-oid="_blp.bc">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/mechanic.jpg"
                        alt="Background"
                        fill
                        className="object-cover animate-slow-zoom"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-white z-10"></div>
                </div>

                {/* Hero Content */}
                <div className="container mx-auto px-6 relative z-20 text-center">
                    <div className={`transition-all duration-1000 transform ${visibleSections.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="inline-flex items-center space-x-2 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 px-4 py-2 rounded-full text-teal-300 text-sm font-bold mb-8 tracking-widest uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                            </span>
                            <span>Premium Car Life Support</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                            安心・快適な<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
                                カーライフを
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                            創業60年。私たちが守るのは、お客様の大切な移動の時間と笑顔です。<br className="hidden md:block" />
                            最新の技術と真心で、お車のあらゆるニーズにお応えします。
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a
                                href="#services"
                                className="group relative px-10 py-5 bg-teal-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-teal-500 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center">
                                    サービスを見る
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </a>
                            <a
                                href="/shaken"
                                className="group px-10 py-5 bg-white text-teal-900 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 shadow-2xl relative overflow-hidden"
                            >
                                <span className="relative z-10">車検シミュレーター</span>
                                <div className="absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </a>
                        </div>
                    </div>
                </div>



                {/* Decoration */}
                <div className="absolute -bottom-1 left-0 w-full z-10">
                    <svg viewBox="0 0 1440 320" className="w-full h-auto">
                        <path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,133.3C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </section>



            {/* Services Section */}
            <section
                id="services"
                className="py-32 relative bg-white overflow-hidden"
                data-oid="vp4fc4m"
            >
                {/* 装飾要素 - 丸い形の装飾 */}
                <div
                    className="absolute top-20 right-10 w-64 h-64 rounded-full bg-teal-100 opacity-50"
                    data-oid="55r8cpk"
                ></div>
                <div
                    className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-blue-100 opacity-40"
                    data-oid="0--u96f"
                ></div>
                <div
                    className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-yellow-100 opacity-30"
                    data-oid="y45npow"
                ></div>

                <div className="container mx-auto px-4 relative z-10" data-oid="zvu:q62">
                    <div className="text-center mb-12" data-oid="d0snta5">
                        <span className="text-teal-600 font-semibold" data-oid="sxr0.v9">
                            OUR SERVICES
                        </span>
                        <h2
                            className="text-4xl font-bold mt-2 mb-4"
                            data-oid="54kaojv"
                        >
                            サービス内容
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto" data-oid="zvjt13e">
                            お客様のカーライフを総合的にサポートいたします
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" data-oid="hil2ukq">
                        {/* ノレタ - 強調されたカード */}
                        <div className="lg:col-span-6" data-oid=":2lpi6n">
                            <div
                                className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden h-full border border-white/60 transform transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_20px_60px_-15px_rgba(45,150,140,0.3)] group"
                                data-oid="pezj9ya"
                            >
                                <div className="bg-teal-600/90 py-4 px-8 backdrop-blur-md" data-oid="yedwz7m">
                                    <div className="flex items-center justify-between" data-oid="q:vvet3">
                                        <div className="flex items-center">
                                            <span
                                                className="text-white font-black tracking-widest text-sm mr-3"
                                                data-oid="m9hb3fr"
                                            >
                                                RECOMMENDED
                                            </span>
                                            <div
                                                className="bg-yellow-400 text-[10px] text-teal-900 font-black rounded-full px-3 py-1 uppercase"
                                                data-oid="w:ymx5:"
                                            >
                                                人気No.1
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="p-10 flex flex-col h-full" data-oid="uk4dwlp">
                                    <div className="flex items-center mb-6" data-oid="-sb5l-w">
                                        <div
                                            className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mr-4"
                                            data-oid="2g98uj3"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 text-teal-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                data-oid="m6ugcb0"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    data-oid="x_f9sbr"
                                                />
                                            </svg>
                                        </div>
                                        <h3
                                            className="text-3xl font-bold text-teal-600"
                                            data-oid="i6ngfk:"
                                        >
                                            ノレタ
                                        </h3>
                                    </div>
                                    <p
                                        className="text-gray-700 mb-8 text-lg leading-relaxed flex-grow"
                                        data-oid="o82q7g8"
                                    >
                                        <span className="font-semibold" data-oid=".e_aoj_">
                                            港南自動車サービスの新しい乗り方「ノレタ」。
                                        </span>
                                        <br data-oid="td3_7.j" />
                                        車検も、オイル交換も、故障修理もまるごとカバー。急な出費に悩まされず、ずっと安心・快適なカーライフをお過ごしいただけます。月々定額でラクラク、余計な心配をせずにお車をお楽しみください。
                                    </p>
                                    <div className="mt-auto" data-oid="9k7sj68">
                                        <div
                                            className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-1"
                                            data-oid="w95d82e"
                                        >
                                            <div
                                                className="flex items-center bg-teal-50 p-3 rounded-lg"
                                                data-oid="nwjxy19"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-teal-600 mr-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    data-oid=":n0-r:i"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                        data-oid="7qehygh"
                                                    />
                                                </svg>
                                                <span
                                                    className="text-sm font-medium"
                                                    data-oid="zvpp73j"
                                                >
                                                    頭金なし
                                                </span>
                                            </div>
                                            <div
                                                className="flex items-center bg-teal-50 p-3 rounded-lg"
                                                data-oid="1us9gpv"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-teal-600 mr-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    data-oid="ynysiex"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                        data-oid="1lc-s_1"
                                                    />
                                                </svg>
                                                <span
                                                    className="text-sm font-medium"
                                                    data-oid="dtu.bkj"
                                                >
                                                    ボーナス払いなし
                                                </span>
                                            </div>
                                            <div
                                                className="flex items-center bg-teal-50 p-3 rounded-lg"
                                                data-oid="6htdxf6"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-teal-600 mr-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    data-oid="icvlq_."
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                        data-oid="deu.x-d"
                                                    />
                                                </svg>
                                                <span
                                                    className="text-sm font-medium"
                                                    data-oid="f-le.39"
                                                >
                                                    3年契約
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href="/noreta"
                                            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-center w-full shadow-md hover:shadow-lg mt-4 mb-9"
                                            data-oid="6ybwf61"
                                        >
                                            詳細を見る
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6" data-oid="6y:ft3f">
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full"
                                data-oid="j8sn:fz"
                            >
                                {/* 車検・点検 */}
                                <div className="h-full" data-oid="2su7qzq">
                                    <div
                                        className="bg-slate-50/50 backdrop-blur-md rounded-[2rem] border border-white/80 shadow-lg overflow-hidden h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group"
                                        data-oid="wvpa-nd"
                                    >
                                        <div
                                            className="p-8 flex flex-col h-full"
                                            data-oid="uwv7u.c"
                                        >
                                            <div
                                                className="flex items-center mb-6"
                                                data-oid="_8e5qo3"
                                            >
                                                <div
                                                    className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:rotate-12 transition-transform duration-500"
                                                    data-oid="ckh8tto"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        data-oid="5.mila:"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                            data-oid="d4sd-xw"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3
                                                    className="text-2xl font-black text-gray-900"
                                                    data-oid="grgahvt"
                                                >
                                                    車検・点検
                                                </h3>
                                            </div>
                                            <p
                                                className="text-gray-600 mb-8 text-base leading-relaxed flex-grow"
                                                data-oid="9kgg544"
                                            >
                                                経験豊富な整備士が、最新設備を駆使してお客様の愛車を精密に診断。最短90分のスピード車検から、徹底的なメンテナンスまで。
                                            </p>
                                            <div className="mt-auto" data-oid="ltpdzhx">
                                                <Link
                                                    href="/shaken"
                                                    className="group/btn inline-flex items-center justify-center px-6 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300 font-bold w-full shadow-lg shadow-teal-600/20"
                                                    data-oid="77hqg-d"
                                                >
                                                    詳しく見る
                                                    <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 新車・中古車販売 */}
                                <div className="h-full" data-oid="63jbl32">
                                    <div
                                        className="bg-slate-50/50 backdrop-blur-md rounded-[2rem] border border-white/80 shadow-lg overflow-hidden h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group"
                                        data-oid="-tu:g12"
                                    >
                                        <div
                                            className="p-8 flex flex-col h-full"
                                            data-oid="cer6ob-"
                                        >
                                            <div
                                                className="flex items-center mb-6"
                                                data-oid="qogacuv"
                                            >
                                                <div
                                                    className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:rotate-12 transition-transform duration-500"
                                                    data-oid="wy4l:e3"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        data-oid="iv_2ims"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            data-oid="pwgvdva"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3
                                                    className="text-2xl font-black text-gray-900"
                                                    data-oid="r1a9shb"
                                                >
                                                    車両販売
                                                </h3>
                                            </div>
                                            <p
                                                className="text-gray-600 mb-8 text-base leading-relaxed flex-grow"
                                                data-oid="3zblmks"
                                            >
                                                全メーカーの新車から、厳選された高品質な中古車まで。お客様のご予算とライフスタイルに最適な一台をご提案します。
                                            </p>
                                            <div className="mt-auto" data-oid=".cdc81:">
                                                <a
                                                    href="#contact"
                                                    className="group/btn inline-flex items-center justify-center px-6 py-4 bg-slate-200 text-slate-800 rounded-xl hover:bg-slate-300 transition-all duration-300 font-bold w-full"
                                                    data-oid="i1d:4ew"
                                                >
                                                    相談してみる
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 整備・修理 */}
                                <div className="h-full md:col-span-2" data-oid="yhpit6m">
                                    <div
                                        className="bg-slate-50/50 backdrop-blur-md rounded-[2rem] border border-white/80 shadow-lg overflow-hidden h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group"
                                        data-oid="wy:s-g1"
                                    >
                                        <div
                                            className="p-8 flex flex-col h-full"
                                            data-oid="ky_-f.w"
                                        >
                                            <div
                                                className="flex items-center mb-6"
                                                data-oid="gw22_:."
                                            >
                                                <div
                                                    className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:rotate-12 transition-transform duration-500"
                                                    data-oid="0wex3mn"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-7 w-7 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        data-oid="9osh:gh"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                            data-oid="5o919mc"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3
                                                    className="text-2xl font-black text-gray-900"
                                                    data-oid=":dyiilg"
                                                >
                                                    整備・一般修理
                                                </h3>
                                            </div>
                                            <p
                                                className="text-gray-600 mb-8 text-base leading-relaxed flex-grow"
                                                data-oid="x08gh9-"
                                            >
                                                あらゆるメーカー・車種に対応。熟練の技術と最新の診断機で、故障の根本原因を特定し、安心のクオリティで修理いたします。
                                            </p>
                                            <div className="mt-auto" data-oid="hb9kutf">
                                                <a
                                                    href="#contact"
                                                    className="group/btn inline-flex items-center justify-center px-6 py-4 bg-slate-200 text-slate-800 rounded-xl hover:bg-slate-300 transition-all duration-300 font-bold w-full"
                                                    data-oid="xqc:he."
                                                >
                                                    お問い合わせ
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cases Section */}
            <section
                id="cases"
                className="py-32 relative bg-slate-50 overflow-hidden"
                data-oid="fpg1z7h"
            >
                {/* 装飾要素 - 幾何学模様 */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none" data-oid="wgcy0x4">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10" data-oid="-efx.9k">
                    <div className="text-center mb-20" data-oid="sogg.k8">
                        <span className="text-teal-600 font-black tracking-[0.3em] uppercase text-sm block mb-4" data-oid="187h1cd">
                            VEHICLE LINEUP
                        </span>
                        <h2
                            className="text-5xl font-black mt-2 mb-6 text-gray-900"
                            data-oid="qz69gm:"
                        >
                            取扱車種
                        </h2>
                        <div className="w-20 h-1.5 bg-teal-600 mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium" data-oid="5bf8vnu">
                            全国産メーカーから輸入車まで、<br />プロの視点で選んだ一台をご提案。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10" data-oid="mbz_2:i">
                        {/* スズキ */}
                        <div className="group" data-oid="c342c2e">
                            <div
                                className="bg-white rounded-3xl shadow-xl overflow-hidden h-full transform transition-all duration-700 hover:shadow-2xl hover:-translate-y-4"
                                data-oid="c3v0u3n"
                            >
                                <div
                                    className="relative aspect-[4/3] overflow-hidden"
                                    data-oid="_p-00fc"
                                >
                                    <Image
                                        src="/cars/jimny.jpg"
                                        alt="金沢市で人気のスズキ・ジムニー｜港南自動車サービス取扱車種"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                        data-oid="aflv8po"
                                    />

                                    <div
                                        className="absolute inset-x-4 bottom-4 p-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                                        data-oid="vv7t0x3"
                                    >
                                        <div className="w-full text-center" data-oid="4aa4h-4">
                                            <h4
                                                className="text-white font-black text-xl mb-1 drop-shadow-lg"
                                                data-oid=":cqc.ef"
                                            >
                                                JIMNY
                                            </h4>
                                            <p className="text-white/90 text-sm font-bold" data-oid="4jew..q">
                                                本格派4WDの頂点
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8" data-oid="_bo59d7">
                                    <h3
                                        className="text-2xl font-black mb-4 text-gray-900 flex items-center"
                                        data-oid="q..bfr_"
                                    >
                                        スズキ
                                    </h3>
                                    <p className="text-gray-500 mb-6 font-medium leading-relaxed" data-oid="psny4xi">
                                        ハスラー、スイフト、ワゴンRなど。金沢の雪道にも強い確かな足回り。
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8" data-oid="szyaex.">
                                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black rounded-full uppercase tracking-widest">SUV / Compact</span>
                                    </div>
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center text-teal-600 font-black text-sm uppercase tracking-widest hover:text-teal-800 transition-colors group/link"
                                        data-oid="ow1w84f"
                                    >
                                        More Info
                                        <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* 三菱 */}
                        <div className="group" data-oid="n0c.vx5">
                            <div
                                className="bg-white rounded-3xl shadow-xl overflow-hidden h-full transform transition-all duration-700 hover:shadow-2xl hover:-translate-y-4"
                                data-oid="qnonjn-"
                            >
                                <div
                                    className="relative aspect-[4/3] overflow-hidden"
                                    data-oid="v6ttp17"
                                >
                                    <Image
                                        src="/cars/delicamini.jpg"
                                        alt="三菱・デリカミニ｜港南自動車サービスで新車・中古車販売対応"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                        data-oid="7loicjh"
                                    />

                                    <div
                                        className="absolute inset-x-4 bottom-4 p-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                                        data-oid="_i3kypa"
                                    >
                                        <div className="w-full text-center" data-oid="7s_gz71">
                                            <h4
                                                className="text-white font-black text-xl mb-1 drop-shadow-lg"
                                                data-oid="95w:yx5"
                                            >
                                                DELICA MINI
                                            </h4>
                                            <p className="text-white/90 text-sm font-bold" data-oid="3r:zvnu">
                                                遊び心をフル装備
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8" data-oid="j6i88zl">
                                    <h3
                                        className="text-2xl font-black mb-4 text-gray-900 flex items-center"
                                        data-oid="bctq14a"
                                    >
                                        三菱
                                    </h3>
                                    <p className="text-gray-500 mb-6 font-medium leading-relaxed" data-oid="og5tevt">
                                        デリカミニ、アウトランダーなど。タフでアクティブなライフスタイルを。
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8" data-oid="xs7jd2y">
                                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black rounded-full uppercase tracking-widest">Outdoor / SUV</span>
                                    </div>
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center text-teal-600 font-black text-sm uppercase tracking-widest hover:text-teal-800 transition-colors group/link"
                                        data-oid="y-q270n"
                                    >
                                        More Info
                                        <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* トヨタ */}
                        <div className="group" data-oid="q_03:90">
                            <div
                                className="bg-white rounded-3xl shadow-xl overflow-hidden h-full transform transition-all duration-700 hover:shadow-2xl hover:-translate-y-4"
                                data-oid="tqrh5f6"
                            >
                                <div
                                    className="relative aspect-[4/3] overflow-hidden"
                                    data-oid="r6s7x:b"
                                >
                                    <Image
                                        src="/cars/alphard.jpg"
                                        alt="トヨタ・アルファード｜金沢市の港南自動車サービスで高級ミニバンの購入・整備も対応"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                        data-oid="t1cxanx"
                                    />

                                    <div
                                        className="absolute inset-x-4 bottom-4 p-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                                        data-oid="b7pc-y7"
                                    >
                                        <div className="w-full text-center" data-oid="q.r6vd.">
                                            <h4
                                                className="text-white font-black text-xl mb-1 drop-shadow-lg"
                                                data-oid="v0csx7c"
                                            >
                                                ALPHARD
                                            </h4>
                                            <p className="text-white/90 text-sm font-bold" data-oid="ierfeor">
                                                究極のファーストクラス
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8" data-oid="b06417g">
                                    <h3
                                        className="text-2xl font-black mb-4 text-gray-900 flex items-center"
                                        data-oid="bgnsd0e"
                                    >
                                        トヨタ
                                    </h3>
                                    <p className="text-gray-500 mb-6 font-medium leading-relaxed" data-oid="95sk_in">
                                        ハリアー、アルファードなど。圧倒的な信頼とプレミアムな体験を。
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8" data-oid="gd3:7__">
                                        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black rounded-full uppercase tracking-widest">Premium / Hybrid</span>
                                    </div>
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center text-teal-600 font-black text-sm uppercase tracking-widest hover:text-teal-800 transition-colors group/link"
                                        data-oid="11ye-4a"
                                    >
                                        More Info
                                        <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12" data-oid="133zyu8">
                        <a
                            href="#contact"
                            className="inline-block px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 font-medium shadow-lg transform hover:-translate-y-1"
                            data-oid="n9p-vyk"
                        >
                            車種について問い合わせる
                        </a>
                        <p className="text-gray-500 mt-3 text-sm" data-oid="986e50:">
                            お気軽にお問い合わせください。専門スタッフが丁寧にご案内いたします。
                        </p>
                    </div>
                </div>
            </section>

            {/* Company Section */}
            <section
                id="company"
                className="py-32 bg-white"
                data-oid="3.0m87b"
            >
                <div className="container mx-auto px-4" data-oid="28o256i">
                    <div className="text-center mb-20" data-oid="3q7q:er">
                        <span className="text-teal-600 font-black tracking-[0.3em] uppercase text-sm block mb-4" data-oid="187h1cd">
                            COMPANY INFO
                        </span>
                        <h2
                            className="text-5xl font-black mt-2 mb-6 text-gray-900"
                            data-oid="17r:dsh"
                        >
                            会社情報
                        </h2>
                        <div className="w-20 h-1.5 bg-teal-600 mx-auto rounded-full mb-8"></div>
                    </div>

                    <div
                        className="max-w-6xl mx-auto bg-slate-50/50 backdrop-blur-md rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden"
                        data-oid="v_2:680"
                    >
                        <div className="flex flex-col lg:flex-row" data-oid="e1834_j">
                            <div
                                className="w-full lg:w-5/12 p-10 lg:p-16 bg-white"
                                data-oid="h18f__h"
                            >
                                <div className="mb-12" data-oid="2z-0.q_">
                                    <h3
                                        className="text-3xl font-black text-gray-900 mb-2"
                                        data-oid="9r-1s.8"
                                    >
                                        港南自動車サービス
                                        <span className="block text-lg font-bold text-teal-600 mt-1">株式会社</span>
                                    </h3>
                                </div>

                                <div className="space-y-10" data-oid="iheycqr">
                                    <div data-oid="z:przrj">
                                        <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-4 flex items-center">
                                            <span className="w-8 h-px bg-teal-600 mr-3"></span>
                                            Address
                                        </h4>
                                        <div className="pl-11 relative">
                                            <div className="absolute left-0 top-0 w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 font-bold mb-1">〒920-0336</p>
                                            <p className="text-gray-900 font-black text-lg">石川県金沢市金石本町ハ14</p>
                                        </div>
                                    </div>

                                    <div data-oid="f05uljd">
                                        <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-4 flex items-center">
                                            <span className="w-8 h-px bg-teal-600 mr-3"></span>
                                            Contact
                                        </h4>
                                        <div className="pl-11 space-y-4">
                                            <div className="relative">
                                                <div className="absolute left-[-44px] top-0 w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <a href="tel:076-268-1788" className="text-gray-900 font-black text-2xl hover:text-teal-600 transition-colors">076-268-1788</a>
                                            </div>
                                            <p className="text-gray-500 font-bold">FAX: 076-268-3163</p>
                                        </div>
                                    </div>

                                    <div data-oid="9xkwcsq">
                                        <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-4 flex items-center">
                                            <span className="w-8 h-px bg-teal-600 mr-3"></span>
                                            Business Hours
                                        </h4>
                                        <div className="pl-11 space-y-4">
                                            <div className="flex items-center">
                                                <div className="w-20 text-gray-500 font-bold">平日</div>
                                                <div className="text-gray-900 font-black">9:00 〜 18:00</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-20 text-gray-500 font-bold">土曜</div>
                                                <div className="text-gray-900 font-black">9:00 〜 17:00</div>
                                            </div>
                                            <div className="flex items-start text-red-500">
                                                <div className="w-20 font-bold">定休日</div>
                                                <div className="font-black">第2・第4土曜日<br />日曜・祝日</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-7/12 relative h-[500px] lg:h-auto" data-oid="ej:xfek">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102498.79916169232!2d136.51245513968695!3d36.600202237727785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff9cc85432c3f01%3A0x9d1d9922dd9db39!2z5riv5Y2X6Ieq5YuV6LuK44K144O844OT44K5!5e0!3m2!1sja!2sjp!4v1744335562038!5m2!1sja!2sjp"
                                    className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[1.1]"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="港南自動車サービス地図"
                                    data-oid="x7m2rxr"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instagram Section */}
            <section id="instagram" className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-20">
                        <span className="text-teal-600 font-black tracking-[0.3em] uppercase text-sm block mb-4">
                            FOLLOW US
                        </span>
                        <h2 className="text-5xl font-black mt-2 mb-6 text-gray-900">
                            Instagram
                        </h2>
                        <div className="w-20 h-1.5 bg-teal-600 mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
                            港南自動車の日常や最新情報をお届けしています
                        </p>
                    </div>

                    {/* Instagram Profile Embed */}
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-2 md:p-4">
                        <iframe
                            src="https://www.instagram.com/kounanj1788/embed/"
                            width="100%"
                            height="600"
                            frameBorder="0"
                            scrolling="no"
                            allowTransparency={true}
                            className="rounded-xl w-full"
                            title="Kounan Auto Instagram Feed"
                        ></iframe>
                    </div>

                    {/* Instagramフォローリンク */}
                    <div className="mt-12">
                        <a
                            href="https://www.instagram.com/kounanj1788"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <svg
                                className="w-6 h-6 mr-3"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            @kounanj1788 をフォロー
                        </a>
                        <p className="text-gray-500 mt-4 text-sm">
                            クリックしてInstagramで最新の投稿をチェック！
                        </p>
                    </div>
                </div>
            </section>

            {/* Google Reviews Section */}
            <section id="reviews" className={`py-32 bg-slate-50 transition-all duration-1000 ${fadeIn('reviews')}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <span className="text-teal-600 font-black tracking-[0.3em] uppercase text-sm block mb-4">
                            CUSTOMER VOICE
                        </span>
                        <h2 className="text-5xl font-black mt-2 mb-6 text-gray-900">
                            お客様の声
                        </h2>
                        <div className="w-20 h-1.5 bg-teal-600 mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
                            Googleマップに寄せられた、<br />温かいメッセージの数々。
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="elfsight-app-b145ba87-fa56-4270-a4cc-ac300fb7c24a" data-elfsight-app-lazy></div>
                    </div>

                    <Script
                        src="https://static.elfsight.com/platform/platform.js"
                        strategy="lazyOnload"
                        data-use-service-core
                    />
                </div>
            </section>

            {/* Contact Section */}
            <section
                id="contact"
                className="py-32 relative bg-white overflow-hidden"
                data-oid="-2x4u4d"
            >
                {/* 装飾要素 */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 z-0 hidden lg:block" />

                <div className="container mx-auto px-4 relative z-10" data-oid="7o_lrwj">
                    <div className="flex flex-col lg:flex-row gap-16 lg:items-stretch" data-oid="3_2k_q4">
                        {/* 左側：連絡先情報 */}
                        <div className="w-full lg:w-5/12" data-oid="w2lv4ug">
                            <div className="sticky top-32">
                                <span className="text-teal-600 font-black tracking-[0.3em] uppercase text-sm block mb-4" data-oid="a7z6127">
                                    CONTACT US
                                </span>
                                <h2 className="text-5xl font-black mt-2 mb-8 text-gray-900" data-oid="uwhd9t3">
                                    お問い合わせ
                                </h2>
                                <p className="text-gray-500 mb-12 text-lg font-medium leading-relaxed" data-oid="x1wsvqw">
                                    「車検の相談」「ノレタの詳細を知りたい」「新車を探している」など、何でもお気軽にご相談ください。専門スタッフが親身になってお答えします。
                                </p>

                                <div className="space-y-6" data-oid="p8a4w1i">
                                    {/* 電話ボタン */}
                                    <div className="p-8 bg-slate-50/50 backdrop-blur-md rounded-[2rem] border border-white shadow-lg group hover:bg-teal-600 transition-all duration-500 cursor-pointer" onClick={() => (window as any).location.href = 'tel:076-268-1788'}>
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:bg-white transition-colors duration-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white group-hover:text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-1 group-hover:text-white/80">Phone</p>
                                                <a href="tel:076-268-1788" className="text-3xl font-black text-gray-900 group-hover:text-white transition-colors">076-268-1788</a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* LINEボタン */}
                                    <div className="p-8 bg-green-50/50 backdrop-blur-md rounded-[2rem] border border-white shadow-lg group hover:bg-[#00b900] transition-all duration-500 cursor-pointer" onClick={() => (window as any).open('https://lin.ee/CKQM0mE', '_blank')}>
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 bg-[#00b900] rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:bg-white transition-colors duration-500">
                                                <svg className="w-7 h-7 text-white group-hover:text-[#00b900]" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1 group-hover:text-white/80">Official LINE</p>
                                                <span className="text-2xl font-black text-gray-900 group-hover:text-white transition-colors">LINEでお問い合わせ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 右側：フォーム */}
                        <div className="w-full lg:w-7/12" data-oid="m7t:6i8">
                            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 lg:p-16 border border-white shadow-2xl">
                                <h3 className="text-2xl font-black mb-10 text-gray-900" data-oid="o8nnnkk">
                                    メールフォーム
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-8" data-oid="xtfo009">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-900 ml-1" htmlFor="name">
                                            お名前<span className="text-teal-600 ml-1">●</span>
                                        </label>
                                        <input
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-5 px-6 text-gray-900 font-bold focus:outline-none focus:border-teal-600 focus:bg-white transition-all duration-300 placeholder:text-slate-300"
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="山田 太郎"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-900 ml-1" htmlFor="email">
                                            メールアドレス<span className="text-teal-600 ml-1">●</span>
                                        </label>
                                        <input
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-5 px-6 text-gray-900 font-bold focus:outline-none focus:border-teal-600 focus:bg-white transition-all duration-300 placeholder:text-slate-300"
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-900 ml-1" htmlFor="category">
                                            お問い合わせジャンル<span className="text-teal-600 ml-1">●</span>
                                        </label>
                                        <select
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-5 px-6 text-gray-900 font-bold focus:outline-none focus:border-teal-600 focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="" disabled>選択してください</option>
                                            <option value="車検">車検</option>
                                            <option value="点検">点検</option>
                                            <option value="整備・修理">整備・修理</option>
                                            <option value="板金修理">板金修理</option>
                                            <option value="新車販売">新車販売</option>
                                            <option value="中古車販売">中古車販売</option>
                                            <option value="ノレタ（個人向けリース）">ノレタ（個人向けリース）</option>
                                            <option value="ノリドク（法人向けリース）">ノリドク（法人向けリース）</option>
                                            <option value="リース全般">リース全般</option>
                                            <option value="自動車保険">自動車保険</option>
                                            <option value="その他">その他</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-900 ml-1" htmlFor="message">
                                            お問い合わせ内容<span className="text-teal-600 ml-1">●</span>
                                        </label>
                                        <textarea
                                            className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-5 px-6 text-gray-900 font-bold focus:outline-none focus:border-teal-600 focus:bg-white transition-all duration-300 min-h-[160px] placeholder:text-slate-300"
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="ご相談内容を入力してください"
                                        />
                                    </div>

                                    <button
                                        className={`w-full group relative overflow-hidden bg-teal-600 text-white font-black py-6 rounded-2xl transition-all duration-500 shadow-xl shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-1 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <span className="relative z-10 flex items-center justify-center text-lg">
                                            {isSubmitting ? '送信中...' : 'メッセージを送信する'}
                                            {!isSubmitting && (
                                                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </button>

                                    <input type="hidden" name="recipient" value="kounan.lease@gmail.com" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12" data-oid="vqco2zx">
                <div className="container mx-auto px-4" data-oid="uvp170x">
                    <div className="flex flex-col md:flex-row justify-between" data-oid=".2old5u">
                        <div className="mb-8 md:mb-0" data-oid="h34fryn">
                            <div className="flex items-center mb-4" data-oid="merpy8s">
                                <div
                                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3"
                                    data-oid="nkz2rg_"
                                >
                                    <span
                                        className="text-teal-600 font-bold text-sm"
                                        data-oid="uvqt7yh"
                                    >
                                        港南
                                    </span>
                                </div>
                                <div data-oid="z_zqb_y">
                                    <h3 className="text-lg font-bold" data-oid="26ce:b:">
                                        株式会社港南自動車サービス
                                    </h3>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm" data-oid="f7ww89t">
                                〒920-0336
                                <br data-oid="pgyzchx" />
                                石川県金沢市金石本町ハ14
                                <br data-oid="uh:lu45" />
                                TEL:{' '}
                                <a
                                    href="tel:076-268-1788"
                                    className="hover:text-teal-300 transition-colors"
                                    data-oid="eycpyvv"
                                >
                                    076-268-1788
                                </a>
                                <br data-oid="zrp5wng" />
                                FAX: 076-268-3163
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8" data-oid="cfrlowo">
                            <div data-oid="pt1vfwt">
                                <h4
                                    className="text-lg font-bold mb-4 text-teal-300"
                                    data-oid="ze:ausp"
                                >
                                    サービス
                                </h4>
                                <ul className="space-y-2 text-gray-300" data-oid="fh4ryrt">
                                    <li data-oid="jvm44g3">
                                        <a
                                            href="#services"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="qmgv:w0"
                                        >
                                            車検・点検
                                        </a>
                                    </li>
                                    <li data-oid="6h3_uf0">
                                        <a
                                            href="/noreta"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="ls0suaz"
                                        >
                                            ノレタ
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/noridoku"
                                            className="hover:text-teal-300 transition-colors"
                                        >
                                            ノリドク
                                        </a>
                                    </li>
                                    <li data-oid="ggexpgn">
                                        <a
                                            href="#services"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="xm.-ekq"
                                        >
                                            新車・中古車販売
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div data-oid="39:o8:_">
                                <h4
                                    className="text-lg font-bold mb-4 text-teal-300"
                                    data-oid="1uupgfl"
                                >
                                    会社情報
                                </h4>
                                <ul className="space-y-2 text-gray-300" data-oid="ayx0qj2">
                                    <li data-oid="dhya:kv">
                                        <a
                                            href="#company"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="609uby2"
                                        >
                                            会社概要
                                        </a>
                                    </li>
                                    <li data-oid="k:4tpw4">
                                        <a
                                            href="#contact"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="klfka:v"
                                        >
                                            お問い合わせ
                                        </a>
                                    </li>
                                    <li data-oid="-whd5i-">
                                        <a
                                            href="#"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="on9cjd1"
                                        >
                                            プライバシーポリシー
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/recruit"
                                            className="hover:text-teal-300 transition-colors"
                                        >
                                            採用情報
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div
                        className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm"
                        data-oid="xz:r0q_"
                    >
                        &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights
                        Reserved.
                    </div>
                </div>
            </footer>

            {/* Floating Contact Button */}
            <div className="fixed bottom-8 right-8 z-50 group" data-oid="ia5c0ck">
                <div
                    className="bg-white rounded-lg shadow-lg p-2 mb-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    data-oid="5se0-6w"
                >
                    <p className="text-xs text-center font-medium text-gray-700" data-oid="5ug.6ow">
                        お問い合わせ
                    </p>
                </div>
                <a
                    href="#contact"
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="お問い合わせセクションへ移動"
                    data-oid="xobsylp"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        data-oid="vms49x2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            data-oid="uv2p4o3"
                        />
                    </svg>
                </a>
            </div>
        </div >
    );
}
