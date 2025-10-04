'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
    const [visibleSections, setVisibleSections] = useState({
        hero: true,
        services: false,
        cases: false,
        company: false,
        contact: false,
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setVisibleSections({
            hero: true,
            services: false,
            cases: false,
            company: false,
            contact: false,
        });

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;

            setVisibleSections({
                hero: true,
                services: scrollPosition > windowHeight * 0.1,
                cases: scrollPosition > windowHeight * 0.5,
                company: scrollPosition > windowHeight * 0.7,
                contact: scrollPosition > windowHeight * 0.9,
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeIn = (section: 'hero' | 'services' | 'cases' | 'company' | 'contact') => {
        return visibleSections[section] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Here you would typically send the form data to your backend or email service
        const recipientEmail = 'kounan.lease@gmail.com';

        // For now, we'll just log the data that would be sent
        console.log('Sending form data to:', recipientEmail);
        console.log('Form data:', formData);

        // In a real implementation, you would use an API call here
        alert(`お問い合わせを受け付けました。${recipientEmail}に送信されます。`);

        // Reset the form
        setFormData({
            name: '',
            email: '',
            message: '',
        });
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans" data-oid="31zkqzo">
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
                            <a
                                href="#services"
                                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                                data-oid="g3os_w7"
                            >
                                サービス内容
                            </a>
                            <a
                                href="#cases"
                                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                                data-oid="di-cil9"
                            >
                                取扱車種
                            </a>
                            <a
                                href="#company"
                                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                                data-oid="pma8w:5"
                            >
                                会社情報
                            </a>
                            <a
                                href="#contact"
                                className="text-gray-700 hover:text-teal-600 font-medium transition-colors px-2 py-1"
                                data-oid="epeq407"
                            >
                                お問い合わせ
                            </a>
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
                        <a
                            href="#services"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                            data-oid="ni56eff"
                        >
                            サービス内容
                        </a>
                        <a
                            href="#cases"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                            data-oid="_mprlbv"
                        >
                            取扱車種
                        </a>
                        <a
                            href="#company"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                            data-oid="x_63-n0"
                        >
                            会社情報
                        </a>
                        <a
                            href="#contact"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                            data-oid="-ft-zqw"
                        >
                            お問い合わせ
                        </a>
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

            {/* Hero Section */}
            <section
                className="relative h-screen flex items-center"
                data-oid="_blp.bc"
            >
                {/* Hero Background */}
                <div
                    className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-teal-600 to-teal-800 rounded-bl-[20%] z-0"
                    data-oid="endv:k9"
                ></div>

                {/* Dark overlay for better text contrast */}
                <div
                    className="absolute top-0 right-0 w-full h-full bg-black opacity-40 z-[1]"
                    data-oid="kzmmpyn"
                ></div>

                {/* Wave decoration */}
                <div
                    className="absolute bottom-0 left-0 w-full z-[2] overflow-hidden"
                    data-oid="om3hugm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        className="w-full h-auto translate-y-1/2"
                        data-oid="opybbl8"
                    >
                        <path
                            fill="#ffffff"
                            fillOpacity="1"
                            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            data-oid="zavdr0p"
                        ></path>
                    </svg>
                </div>

                <div
                    className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center"
                    data-oid="l.8_6bb"
                >
                    <div className="w-full md:w-1/2 text-white" data-oid="b10vkh6">
                        <h2
                            className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-md"
                            data-oid="58man--"
                        >
                            安心・快適な
                            <br data-oid="25r5iw1" />
                            カーライフを
                            <br data-oid="uox7y-c" />
                            <span className="text-yellow-300" data-oid="k7r0.ze">
                                サポート
                            </span>
                        </h2>
                        <p
                            className="text-xl mb-8 max-w-lg text-white drop-shadow-md"
                            data-oid="7kctojp"
                        >
                            私たちは地域の皆様の安全な移動をサポートします。
                            <br data-oid="mp721sb" />
                            車検・整備から新車販売まで、お客様のニーズにお応えします。
                        </p>
                        <div className="flex flex-wrap gap-4" data-oid="ra4uwuy">
                            <a
                                href="#services"
                                className="px-8 py-4 bg-white text-teal-700 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg flex items-center justify-center transform hover:-translate-y-1"
                                data-oid="5x6ctnl"
                            >
                                <span data-oid="anzfk49">サービスを見る</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    data-oid=":mn62ek"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        data-oid="tw1lnnx"
                                    />
                                </svg>
                            </a>
                            <a
                                href="/noreta"
                                className="px-8 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300 font-medium shadow-lg flex items-center justify-center transform hover:-translate-y-1"
                                data-oid="9m.9ku2"
                            >
                                <span data-oid="6phxbfw">ノレタについて</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    data-oid="fej2r:r"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        data-oid="p0-wj8j"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div
                        className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center relative"
                        data-oid="49fezpj"
                    >
                        <div className="w-full max-w-xl relative z-10" data-oid="n_fy0u4">
                            <div
                                className="bg-white rounded-lg shadow-2xl overflow-hidden transform md:rotate-3"
                                data-oid="3y.kp98"
                            >
                                <div
                                    className="relative w-full h-64 md:h-auto md:aspect-[16/9]"
                                    data-oid=".l4c7.z"
                                >
                                    <Image
                                        src="/images/mechanic.jpg"
                                        alt="自動車整備"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                        className="object-cover"
                                        data-oid="wfem0-7"
                                    />
                                </div>

                            </div>

                            {/* Decorative elements */}
                            <div
                                className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-400 rounded-lg z-[-1] hidden md:block"
                                data-oid="22s8axb"
                            ></div>
                            <div
                                className="absolute -top-4 -right-4 w-16 h-16 bg-teal-300 rounded-full z-[-1] hidden md:block"
                                data-oid="b38e3kz"
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators Section - Enhanced */}
            <section className="bg-white py-12 border-b border-gray-100" data-oid="upwvaj-">
                <div className="container mx-auto px-4" data-oid="o:6tvj9">
                    <div
                        className="flex flex-wrap justify-center md:justify-between items-center gap-8"
                        data-oid="yglil0m"
                    >
                        <div className="flex items-center" data-oid="o_0z9ps">
                            <div
                                className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mr-3"
                                data-oid="gjcnhd:"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-teal-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    data-oid="ay4nrds"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="s-bi9fi"
                                    />
                                </svg>
                            </div>
                            <div data-oid="s7a0grm">
                                <p className="text-sm text-gray-500 font-medium" data-oid="_kae6kx">
                                    創業
                                </p>
                                <p className="text-2xl font-bold text-gray-800" data-oid="oj_g6:5">
                                    60年以上
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center" data-oid="h6ix853">
                            <div
                                className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mr-3"
                                data-oid="n.ykti6"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-teal-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    data-oid="voo-o8q"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        data-oid="3mh-i:3"
                                    />
                                </svg>
                            </div>
                            <div data-oid="pfs.icu">
                                <p className="text-sm text-gray-500 font-medium" data-oid="zpzd--2">
                                    お客様
                                </p>
                                <p className="text-2xl font-bold text-gray-800" data-oid="-958irc">
                                    2,000名以上
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center" data-oid="7wb7j2r">
                            <div
                                className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mr-3"
                                data-oid="ajo0l80"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-teal-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    data-oid="7.bdqhv"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                        data-oid="g2dk209"
                                    />
                                </svg>
                            </div>
                            <div data-oid="cjorniv">
                                <p className="text-sm text-gray-500 font-medium" data-oid="h:lifxp">
                                    対応実績
                                </p>
                                <p className="text-2xl font-bold text-gray-800" data-oid="xfr0ta4">
                                    全メーカー
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section
                id="services"
                className="py-20 relative bg-white overflow-hidden"
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
                                className="bg-white rounded-xl shadow-xl overflow-hidden h-full border-2 border-teal-500 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                                data-oid="pezj9ya"
                            >
                                <div className="bg-teal-500 py-3 px-6" data-oid="yedwz7m">
                                    <div className="flex items-center" data-oid="q:vvet3">
                                        <span
                                            className="text-white font-bold mr-2"
                                            data-oid="m9hb3fr"
                                        >
                                            おすすめ
                                        </span>
                                        <div
                                            className="bg-yellow-400 text-xs text-teal-800 font-bold rounded px-2 py-1"
                                            data-oid="w:ymx5:"
                                        >
                                            人気No.1
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col h-full" data-oid="uk4dwlp">
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
                                        className="bg-white rounded-xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px]"
                                        data-oid="wvpa-nd"
                                    >
                                        <div
                                            className="p-6 flex flex-col h-full"
                                            data-oid="uwv7u.c"
                                        >
                                            <div
                                                className="flex items-center mb-4"
                                                data-oid="_8e5qo3"
                                            >
                                                <div
                                                    className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-3"
                                                    data-oid="ckh8tto"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 text-teal-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        data-oid="5.mila:"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                            data-oid="d4sd-xw"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3
                                                    className="text-xl font-bold text-gray-800"
                                                    data-oid="grgahvt"
                                                >
                                                    車検・点検
                                                </h3>
                                            </div>
                                            <p
                                                className="text-gray-600 mb-6 text-base leading-relaxed flex-grow"
                                                data-oid="9kgg544"
                                            >
                                                車検・整備は経験豊富な整備士が丁寧に対応。お客様の大切な愛車を最新の設備と技術でメンテナンス。定期点検から緊急修理まで、迅速かつ確実なサービスを提供します。
                                            </p>
                                            <div className="mt-auto" data-oid="ltpdzhx">
                                                <Link
                                                    href="/shaken"
                                                    className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-center w-full"
                                                    data-oid="77hqg-d"
                                                >
                                                    詳細を見る
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 新車・中古車販売 */}
                                <div className="h-full" data-oid="63jbl32">
                                    <div
                                        className="bg-white rounded-xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px]"
                                        data-oid="-tu:g12"
                                    >
                                        <div
                                            className="p-6 flex flex-col h-full"
                                            data-oid="cer6ob-"
                                        >
                                            <div
                                                className="flex items-center mb-4"
                                                data-oid="qogacuv"
                                            >
                                                <div
                                                    className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-3"
                                                    data-oid="wy4l:e3"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 text-teal-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        data-oid="iv_2ims"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            data-oid="pwgvdva"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3
                                                    className="text-xl font-bold text-gray-800"
                                                    data-oid="r1a9shb"
                                                >
                                                    新車・中古車販売
                                                </h3>
                                            </div>
                                            <p
                                                className="text-gray-600 mb-6 text-base leading-relaxed flex-grow"
                                                data-oid="3zblmks"
                                            >
                                                新車は全メーカー取扱い、豊富なラインナップからお選びいただけます。中古車はお客様のご予算やご要望に合わせて、経験豊富なスタッフが最適な一台をご提案します。
                                            </p>
                                            <div className="mt-auto" data-oid=".cdc81:">
                                                <a
                                                    href="#contact"
                                                    className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center w-full"
                                                    data-oid="i1d:4ew"
                                                >
                                                    お問い合わせ
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 整備・修理 */}
                                <div className="h-full md:col-span-2" data-oid="yhpit6m">
                                    <div
                                        className="bg-white rounded-xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px]"
                                        data-oid="wy:s-g1"
                                    >
                                        <div
                                            className="p-6 flex flex-col h-full"
                                            data-oid="ky_-f.w"
                                        >
                                            <div
                                                className="flex items-center mb-4"
                                                data-oid="gw22_:."
                                            >
                                                <div
                                                    className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-3"
                                                    data-oid="0wex3mn"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 text-teal-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        data-oid="9osh:gh"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                            data-oid="5o919mc"
                                                        />

                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            data-oid="7n:.d-w"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3
                                                    className="text-xl font-bold text-gray-800"
                                                    data-oid=":dyiilg"
                                                >
                                                    整備・修理
                                                </h3>
                                            </div>
                                            <p
                                                className="text-gray-600 mb-6 text-base leading-relaxed flex-grow"
                                                data-oid="x08gh9-"
                                            >
                                                故障修理から日常のメンテナンスまで、お車の状態に合わせた最適な整備サービスをご提供。熟練の技術者と最新の診断機器で、あらゆるメーカーの車種に対応いたします。安心の技術力と迅速な対応でお客様のカーライフをサポートします。
                                            </p>
                                            <div className="mt-auto" data-oid="hb9kutf">
                                                <a
                                                    href="#contact"
                                                    className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center w-full"
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
                className="py-20 relative bg-white overflow-hidden"
                data-oid="fpg1z7h"
            >
                {/* 装飾要素 - 波形のSVG */}
                <div className="absolute top-0 left-0 w-full overflow-hidden" data-oid="8r1u3g3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        className="w-full h-auto opacity-30"
                        data-oid="wgcy0x4"
                    >
                        <path
                            fill="#4fd1c5"
                            fillOpacity="0.2"
                            d="M0,256L48,229.3C96,203,192,149,288,138.7C384,128,480,160,576,192C672,224,768,256,864,240C960,224,1056,160,1152,149.3C1248,139,1344,181,1392,202.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                            data-oid="a_x-ga6"
                        ></path>
                    </svg>
                </div>

                <div
                    className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-amber-100 opacity-30"
                    data-oid="xawi:fk"
                ></div>

                <div className="container mx-auto px-4 relative z-10" data-oid="-efx.9k">
                    <div className="text-center mb-12" data-oid="sogg.k8">
                        <span className="text-teal-600 font-semibold" data-oid="187h1cd">
                            VEHICLE LINEUP
                        </span>
                        <h2
                            className="text-4xl font-bold mt-2 mb-4"
                            data-oid="qz69gm:"
                        >
                            取扱車種
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto" data-oid="5bf8vnu">
                            全国産メーカーと海外メーカーの車両を取り扱っております
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-oid="mbz_2:i">
                        {/* スズキ */}
                        <div className="group" data-oid="c342c2e">
                            <div
                                className="bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2"
                                data-oid="c3v0u3n"
                            >
                                <div
                                    className="relative aspect-[16/9] overflow-hidden"
                                    data-oid="_p-00fc"
                                >
                                    <Image
                                        src="/cars/jimny.jpg"
                                        alt="スズキ車"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        data-oid="aflv8po"
                                    />

                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end"
                                        data-oid="vv7t0x3"
                                    >
                                        <div className="p-6 w-full" data-oid="4aa4h-4">
                                            <span
                                                className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block"
                                                data-oid="_kule9r"
                                            >
                                                人気車種
                                            </span>
                                            <h4
                                                className="text-white font-bold text-lg mb-1"
                                                data-oid=":cqc.ef"
                                            >
                                                ジムニー
                                            </h4>
                                            <p className="text-white/90 text-sm" data-oid="4jew..q">
                                                軽自動車ながらも本格派4WD
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6" data-oid="_bo59d7">
                                    <h3
                                        className="text-xl font-bold mb-3 text-gray-800 flex items-center"
                                        data-oid="q..bfr_"
                                    >
                                        <span
                                            className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3"
                                            data-oid="ei1y1q8"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-teal-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                data-oid="qde96m8"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                    data-oid="nt25_dw"
                                                />
                                            </svg>
                                        </span>
                                        スズキ
                                    </h3>
                                    <p className="text-gray-600 mb-4" data-oid="psny4xi">
                                        ハスラー、ジムニー、スイフト、ワゴンRなどの人気車種を多数取り揃えています。軽自動車からコンパクトカーまで幅広く対応。
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4" data-oid="szyaex.">
                                        <span
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            data-oid="3xs_9sa"
                                        >
                                            軽自動車
                                        </span>
                                        <span
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            data-oid="q636y92"
                                        >
                                            コンパクト
                                        </span>
                                        <span
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            data-oid="beizcx:"
                                        >
                                            4WD
                                        </span>
                                    </div>
                                    <a
                                        href="#contact"
                                        className="text-teal-600 hover:text-teal-800 font-medium flex items-center group-hover:underline"
                                        data-oid="ow1w84f"
                                    >
                                        問い合わせる
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            data-oid="73ua3nw"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="17vrhk0"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* 三菱 */}
                        <div className="group" data-oid="n0c.vx5">
                            <div
                                className="bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2"
                                data-oid="qnonjn-"
                            >
                                <div
                                    className="relative aspect-[16/9] overflow-hidden"
                                    data-oid="v6ttp17"
                                >
                                    <Image
                                        src="/cars/delicamini.jpg"
                                        alt="三菱車"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        data-oid="7loicjh"
                                    />

                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end"
                                        data-oid="_i3kypa"
                                    >
                                        <div className="p-6 w-full" data-oid="7s_gz71">
                                            <span
                                                className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block"
                                                data-oid="yfk_yol"
                                            >
                                                多目的
                                            </span>
                                            <h4
                                                className="text-white font-bold text-lg mb-1"
                                                data-oid="95w:yx5"
                                            >
                                                デリカミニ
                                            </h4>
                                            <p className="text-white/90 text-sm" data-oid="3r:zvnu">
                                                使いやすい軽ワンボックス
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6" data-oid="j6i88zl">
                                    <h3
                                        className="text-xl font-bold mb-3 text-gray-800 flex items-center"
                                        data-oid="bctq14a"
                                    >
                                        <span
                                            className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3"
                                            data-oid="d1y8oxb"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-teal-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                data-oid="ym1jpa-"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                    data-oid="3q0ee82"
                                                />
                                            </svg>
                                        </span>
                                        三菱
                                    </h3>
                                    <p className="text-gray-600 mb-4" data-oid="og5tevt">
                                        デリカミニ、ekワゴン、アウトランダーなど、軽自動車からSUVまで、様々なライフスタイルに合わせた車種をご用意しています。
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4" data-oid="xs7jd2y">
                                        <span
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            data-oid="x3b-10y"
                                        >
                                            軽自動車
                                        </span>
                                        <span
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            data-oid="0j07n2c"
                                        >
                                            SUV
                                        </span>
                                        <span
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            data-oid="26dhi5v"
                                        >
                                            多人数乗り
                                        </span>
                                    </div>
                                    <a
                                        href="#contact"
                                        className="text-teal-600 hover:text-teal-800 font-medium flex items-center group-hover:underline"
                                        data-oid="y-q270n"
                                    >
                                        問い合わせる
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            data-oid="fr.zjpl"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid="kf81_b."
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* トヨタ */}
                        <div className="group" data-oid="q_03:90">
                            <div
                                className="bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2"
                                data-oid="tqrh5f6"
                            >
                                <div
                                    className="relative aspect-[16/9] overflow-hidden"
                                    data-oid="r6s7x:b"
                                >
                                    <Image
                                        src="/cars/alphard.jpg"
                                        alt="トヨタ車"
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        data-oid="t1cxanx"
                                    />

                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end"
                                        data-oid="b7pc-y7"
                                    >
                                        <div className="p-6 w-full" data-oid="q.r6vd.">
                                            <span
                                                className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block"
                                                data-oid="3jtrjvx"
                                            >
                                                高級車
                                            </span>
                                            <h4
                                                className="text-white font-bold text-lg mb-1"
                                                data-oid="v0csx7c"
                                            >
                                                アルファード
                                            </h4>
                                            <p className="text-white/90 text-sm" data-oid="ierfeor">
                                                高級ミニバンで快適な移動を
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6" data-oid="b06417g">
                                    <h3
                                        className="text-xl font-bold mb-3 text-gray-800 flex items-center"
                                        data-oid="bgnsd0e"
                                    >
                                        <span
                                            className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3"
                                            data-oid="pcav4h9"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-teal-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                data-oid="h96m1e7"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                    data-oid="08ff7k9"
                                                />
                                            </svg>
                                        </span>
                                        トヨタ
                                    </h3>
                                    <p className="text-gray-600 mb-4" data-oid="95sk_in">
                                        アクア、ハリアー、アルファードなど、トヨタの人気車種を各種取り揃え。コンパクトカーから高級ミニバンまで幅広く対応いたします。
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4" data-oid="gd3:7__">
                                        <span
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            data-oid="tns6-v0"
                                        >
                                            コンパクト
                                        </span>
                                        <span
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            data-oid="3inm:q_"
                                        >
                                            ミニバン
                                        </span>
                                        <span
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            data-oid="n0ktsew"
                                        >
                                            ハイブリッド
                                        </span>
                                    </div>
                                    <a
                                        href="#contact"
                                        className="text-teal-600 hover:text-teal-800 font-medium flex items-center group-hover:underline"
                                        data-oid="11ye-4a"
                                    >
                                        問い合わせる
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            data-oid="p90uh6n"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                                data-oid=":ibr9d5"
                                            />
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
                className="py-20 relative bg-white overflow-hidden"
                data-oid="tdxdz.b"
            >
                {/* 装飾要素 - 四角形と丸の組み合わせ */}
                <div
                    className="absolute top-20 left-20 w-60 h-60 rotate-12 bg-blue-100 opacity-40 rounded-lg"
                    data-oid="0d278tq"
                ></div>
                <div
                    className="absolute bottom-40 right-20 w-40 h-40 rounded-full bg-teal-100 opacity-30"
                    data-oid=":_rzbam"
                ></div>
                <div
                    className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-yellow-100 opacity-40"
                    data-oid="8zru9xx"
                ></div>

                {/* Wave decoration */}
                <div
                    className="absolute top-0 left-0 right-0 h-20 overflow-hidden z-0"
                    data-oid="dj_tucd"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        className="w-full h-auto -translate-y-2/3"
                        data-oid="xn7a8ah"
                    >
                        <path
                            fill="#fcd34d"
                            fillOpacity="0.2"
                            d="M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,138.7C672,149,768,203,864,218.7C960,235,1056,213,1152,170.7C1248,128,1344,64,1392,32L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            data-oid="2:hk:6u"
                        ></path>
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10" data-oid="hintl74">
                    <div className="text-center mb-12" data-oid="9w5q6hs">
                        <span className="text-teal-600 font-semibold" data-oid="_4sik-:">
                            COMPANY INFO
                        </span>
                        <h2
                            className="text-4xl font-bold mt-2 mb-4"
                            data-oid="4xnn605"
                        >
                            会社情報
                        </h2>
                    </div>
                    <div
                        className="bg-white rounded-xl shadow-xl p-8 max-w-5xl mx-auto"
                        data-oid="3pzl:4s"
                    >
                        <div
                            className="flex flex-col md:flex-row md:items-stretch gap-8"
                            data-oid="77k0cg9"
                        >
                            <div className="w-full md:w-5/12" data-oid="bpiv.kh">
                                <div className="flex items-center mb-6" data-oid="60.ck7d">
                                    <div
                                        className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mr-4 shadow-md"
                                        data-oid="1fvu_jn"
                                    >
                                        <span
                                            className="text-white font-bold text-lg"
                                            data-oid="hmbdh5s"
                                        >
                                            港南
                                        </span>
                                    </div>
                                    <div data-oid="4ifxedi">
                                        <h3 className="text-2xl font-bold" data-oid="s4.dwu5">
                                            株式会社港南自動車サービス
                                        </h3>
                                    </div>
                                </div>

                                <div
                                    className="border rounded-lg shadow-sm overflow-hidden"
                                    data-oid="iheycqr"
                                >
                                    <div
                                        className="bg-teal-50 px-4 py-3 border-b"
                                        data-oid="z:przrj"
                                    >
                                        <h4
                                            className="text-lg font-semibold text-teal-700 flex items-center"
                                            data-oid="6xfeinm"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                data-oid="69-cb:o"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    data-oid="mfom9la"
                                                />
                                            </svg>
                                            基本情報
                                        </h4>
                                    </div>

                                    <div className="p-4 bg-white" data-oid=".9.1kb0">
                                        <ul className="space-y-3" data-oid="b4wb0f1">
                                            <li className="flex items-center" data-oid="qxh9qeb">
                                                <div
                                                    className="text-gray-500 w-24 flex-shrink-0"
                                                    data-oid="h6hyx0y"
                                                >
                                                    郵便番号:
                                                </div>
                                                <div data-oid="no.q_w8">920-0336</div>
                                            </li>
                                            <li className="flex items-start" data-oid="x3ii:iu">
                                                <div
                                                    className="text-gray-500 w-24 flex-shrink-0 pt-1"
                                                    data-oid="5ottm6o"
                                                >
                                                    住所:
                                                </div>
                                                <div data-oid="3cmbqpt">
                                                    石川県金沢市金石本町ハ14
                                                </div>
                                            </li>
                                            <li className="flex items-center" data-oid="mhl:h_e">
                                                <div
                                                    className="text-gray-500 w-24 flex-shrink-0"
                                                    data-oid="g1e73u:"
                                                >
                                                    TEL:
                                                </div>
                                                <a
                                                    href="tel:076-268-1788"
                                                    className="text-teal-600 hover:underline"
                                                    data-oid="km8hefi"
                                                >
                                                    076-268-1788
                                                </a>
                                            </li>
                                            <li className="flex items-center" data-oid="m8laftq">
                                                <div
                                                    className="text-gray-500 w-24 flex-shrink-0"
                                                    data-oid="44l25wi"
                                                >
                                                    FAX:
                                                </div>
                                                <div data-oid="6ffqquv">076-268-3163</div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div
                                        className="bg-teal-50 px-4 py-3 border-t border-b"
                                        data-oid="f05uljd"
                                    >
                                        <h4
                                            className="text-lg font-semibold text-teal-700 flex items-center"
                                            data-oid=".vfp2d_"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                data-oid="e01.xj_"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    data-oid="zjj42fv"
                                                />
                                            </svg>
                                            営業情報
                                        </h4>
                                    </div>

                                    <div className="p-4 bg-white" data-oid="9xkwcsq">
                                        <ul className="space-y-3" data-oid="wi8fgl7">
                                            <li className="flex items-center" data-oid="lja56up">
                                                <div
                                                    className="text-gray-500 w-24 flex-shrink-0"
                                                    data-oid="i:16by1"
                                                >
                                                    平日:
                                                </div>
                                                <div data-oid="a90s14z">9:00 〜 18:00</div>
                                            </li>
                                            <li className="flex items-center" data-oid="ofxlv5:">
                                                <div
                                                    className="text-gray-500 w-24 flex-shrink-0"
                                                    data-oid="s411qyy"
                                                >
                                                    土曜:
                                                </div>
                                                <div data-oid="me88m1.">9:00 〜 17:00</div>
                                            </li>
                                            <li className="flex items-start" data-oid="bl00ajd">
                                                <div
                                                    className="text-gray-500 w-24 flex-shrink-0 pt-1 flex items-center"
                                                    data-oid="ss0ru5i"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 mr-1 text-red-500"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        data-oid="z48aihz"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                            data-oid="p:hue:9"
                                                        />
                                                    </svg>
                                                    定休日:
                                                </div>
                                                <div className="text-gray-700" data-oid="iqklyma">
                                                    第2・第4土曜日、日曜、祝日
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-7/12" data-oid="ej:xfek">
                                <div
                                    className="bg-gray-100 rounded-lg overflow-hidden shadow-md w-full h-full"
                                    style={{ minHeight: '450px', position: 'relative' }}
                                    data-oid="nk7m_a3"
                                >
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102498.79916169232!2d136.51245513968695!3d36.600202237727785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff9cc85432c3f01%3A0x9d1d9922dd9db39!2z5riv5Y2X6Ieq5YuV6LuK44K144O844OT44K5!5e0!3m2!1sja!2sjp!4v1744335562038!5m2!1sja!2sjp"
                                        style={{
                                            border: 0,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        aria-label="港南自動車サービスの地図"
                                        title="港南自動車サービス地図"
                                        className="rounded-lg"
                                        data-oid="x7m2rxr"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section
                id="contact"
                className="py-20 relative bg-white overflow-hidden"
                data-oid="-2x4u4d"
            >
                {/* 装飾要素 - 対角線グラデーション */}
                <div
                    className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent via-green-100 to-transparent opacity-50 z-0"
                    data-oid="_0uyu6z"
                ></div>

                {/* 装飾用の丸 */}
                <div
                    className="absolute top-10 left-10 w-32 h-32 rounded-full bg-green-100 opacity-40"
                    data-oid="tawellk"
                ></div>
                <div
                    className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-blue-100 opacity-30"
                    data-oid="yuytvlm"
                ></div>

                <div className="container mx-auto px-4 relative z-10" data-oid="7o_lrwj">
                    <div className="text-center mb-12" data-oid=":68pz:9">
                        <span className="text-teal-600 font-semibold" data-oid="a7z6127">
                            GET IN TOUCH
                        </span>
                        <h2
                            className="text-4xl font-bold mt-2 mb-4"
                            data-oid="uwhd9t3"
                        >
                            お問い合わせ
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto" data-oid="-bqi13o">
                            ご質問やご相談など、お気軽にお問い合わせください
                        </p>
                    </div>
                    <div
                        className="bg-white rounded-xl shadow-xl p-8 max-w-5xl mx-auto"
                        data-oid="vf8qawn"
                    >
                        <div className="flex flex-col md:flex-row" data-oid="3_2k_q4">
                            <div
                                className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-8"
                                data-oid="w2lv4ug"
                            >
                                <div
                                    className="text-4xl text-teal-600 font-light mb-6"
                                    data-oid="-eunx51"
                                >
                                    contact
                                </div>
                                <p
                                    className="text-gray-700 mb-8 leading-relaxed"
                                    data-oid="x1wsvqw"
                                >
                                    車検・点検、ノレタ、新車・中古車販売についてなど、お気軽にご質問・ご相談ください。専門スタッフが丁寧にご対応いたします。
                                </p>

                                <div
                                    className="bg-teal-50 rounded-lg p-6 mb-6 hover:shadow-md transition-shadow"
                                    data-oid="p8a4w1i"
                                >
                                    <div className="flex items-center mb-4" data-oid="r:-3s68">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-teal-600 mr-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            data-oid="o7lwvsc"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                data-oid="kc332ev"
                                            />
                                        </svg>
                                        <a
                                            href="tel:076-268-1788"
                                            className="text-xl font-bold text-teal-700 hover:underline"
                                            data-oid="ro1n.8f"
                                        >
                                            076-268-1788
                                        </a>
                                    </div>
                                    <div className="ml-9 space-y-2" data-oid="c8kt7:c">
                                        <div className="text-gray-700 text-sm" data-oid=":s02kns">
                                            <span className="font-semibold" data-oid="y62ds2q">
                                                営業時間:
                                            </span>{' '}
                                            平日 9:00 〜 18:00 / 土曜 9:00 〜 17:00
                                        </div>
                                        <div className="text-gray-700 text-sm" data-oid="i-lpaqb">
                                            <span className="font-semibold" data-oid="_rfphm.">
                                                定休日:
                                            </span>{' '}
                                            第2・第4土曜日、日曜、祝日
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="bg-green-50 rounded-lg p-6 mb-6 hover:shadow-md transition-shadow"
                                    data-oid="o7r29s4"
                                >
                                    <div className="flex items-center mb-4" data-oid="-8kdgy7">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-green-600 mr-3"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            data-oid="gpczkad"
                                        >
                                            <path
                                                d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                                                data-oid="7xzefnw"
                                            ></path>
                                        </svg>
                                        <span
                                            className="text-lg font-bold text-green-700"
                                            data-oid="oy7fv4z"
                                        >
                                            LINE
                                        </span>
                                    </div>
                                    <div className="ml-9" data-oid="vce2w3z">
                                        <p
                                            className="text-gray-700 text-sm mb-3"
                                            data-oid="w-vkk5_"
                                        >
                                            LINEでもお問い合わせいただけます。下のボタンから友だち追加してください。
                                        </p>
                                        <a
                                            href="https://lin.ee/CKQM0mE"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                            data-oid="h9sgblm"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                data-oid="37y28bf"
                                            >
                                                <path
                                                    d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                                                    data-oid="739ud_7"
                                                ></path>
                                            </svg>
                                            友だち追加
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 bg-white rounded-lg" data-oid="m7t:6i8">
                                <h3
                                    className="text-xl font-bold mb-6 text-gray-800"
                                    data-oid="o8nnnkk"
                                >
                                    メールでのお問い合わせ
                                </h3>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                    data-oid="xtfo009"
                                >
                                    <div data-oid="z9gk.8s">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="name"
                                            data-oid="ckkzor2"
                                        >
                                            お名前{' '}
                                            <span className="text-red-500" data-oid="-85n66a">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            aria-required="true"
                                            placeholder="山田 太郎"
                                            data-oid="eh4rrrz"
                                        />

                                        <p
                                            className="text-sm text-gray-500 mt-1"
                                            data-oid="fmuhxlg"
                                        >
                                            例: 山田 太郎
                                        </p>
                                    </div>
                                    <div data-oid="7_24rmb">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="email"
                                            data-oid="7kugoah"
                                        >
                                            メールアドレス{' '}
                                            <span className="text-red-500" data-oid="1vpkphf">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            aria-required="true"
                                            placeholder="example@email.com"
                                            data-oid="q31lam2"
                                        />

                                        <p
                                            className="text-sm text-gray-500 mt-1"
                                            data-oid="grjdh::"
                                        >
                                            例: example@email.com
                                        </p>
                                    </div>
                                    <div data-oid="v.3q_5p">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="message"
                                            data-oid="ybog_mf"
                                        >
                                            お問い合わせ内容{' '}
                                            <span className="text-red-500" data-oid="zpbbvrk">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                            id="message"
                                            name="message"
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            aria-required="true"
                                            placeholder="お問い合わせ内容をご記入ください"
                                            data-oid="qcw6oyk"
                                        ></textarea>
                                    </div>
                                    <div className="flex flex-col space-y-4" data-oid="_az9lup">
                                        <button
                                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors w-full flex items-center justify-center"
                                            type="submit"
                                            data-oid="wu1cavh"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                data-oid="73z_bih"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    data-oid="bozu9kq"
                                                />
                                            </svg>
                                            送信する
                                        </button>
                                        <p
                                            className="text-sm text-gray-500 text-center"
                                            data-oid="2.2ur-3"
                                        >
                                            <span className="text-red-500" data-oid="te5xy7z">
                                                *
                                            </span>{' '}
                                            は必須項目です
                                        </p>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="recipient"
                                        value="kounan.lease@gmail.com"
                                        data-oid="xm.donb"
                                    />
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
        </div>
    );
}
