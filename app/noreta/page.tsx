'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type CarCategory = 'SUV' | 'MINIVAN' | 'KCAR';

interface Car {
    name: string;
    price: string;
    image: string;
    route?: string;
}

export default function Page() {
    const [activeCategory, setActiveCategory] = useState<CarCategory>('SUV');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 価格文字列から数値を抽出する関数
    const extractPriceNumber = (priceString: string): number => {
        return parseInt(priceString.replace(/[,円～]/g, ''), 10);
    };

    // 価格順にソートする関数
    const sortByPrice = (cars: Car[]): Car[] => {
        return [...cars].sort((a, b) => extractPriceNumber(a.price) - extractPriceNumber(b.price));
    };

    const rawCarData: Record<CarCategory, Car[]> = {
        SUV: [
            {
                name: 'ジムニーシエラ',
                price: '30,000円～',
                image: '/cars/jimnysierra.jpg',
                route: '/suv/jimnysierra',
            },
            {
                name: 'ヤリスクロス',
                price: '42,000円～',
                image: '/cars/yariscross.jpg',
                route: '/suv/yariscross',
            },
            { name: 'VEZEL', price: '49,000円～', image: '/cars/vezel.jpg', route: '/suv/vezel' },
            {
                name: 'カローラクロス',
                price: '49,000円～',
                image: '/cars/corollacross.jpg',
                route: '/suv/corollacross',
            },
            {
                name: 'ハリアー',
                price: '56,000円～',
                image: '/cars/harrier.jpg',
                route: '/suv/harrier',
            },
            { name: 'RAV4', price: '49,000円～', image: '/cars/rav4.jpg', route: '/suv/rav4' },
            {
                name: 'ランクル 250',
                price: '55,000円～',
                image: '/cars/landcruiser.jpg',
                route: '/suv/landcruiser',
            },
            { name: 'クラウン', price: '80,500円～', image: '/cars/crown.jpg', route: '/suv/crown' },
            { name: 'NX', price: '80,000円～', image: '/cars/nx.jpg', route: '/suv/nx' },
        ],

        MINIVAN: [
            { name: 'ノア', price: '58,000円～', image: '/cars/noah.jpg', route: '/minivan/noah' },
            { name: 'ヴォクシー', price: '58,000円～', image: '/cars/voxy.jpg', route: '/minivan/voxy' },
            {
                name: 'アルファード',
                price: '72,800円～',
                image: '/cars/alphard.jpg',
                route: '/minivan/alphard',
            },
        ],

        KCAR: [
            { name: 'NBOX カスタム', price: '24,000円～', image: '/cars/nbox.jpg', route: '/kcar/nbox' },
            {
                name: 'タントカスタム',
                price: '22,000円～',
                image: '/cars/tanto.jpg',
                route: '/kcar/tanto',
            },
            {
                name: 'タントファンクロス',
                price: '22,000円～',
                image: '/cars/tantofun.jpg',
                route: '/kcar/tantofun',
            },
            {
                name: 'デリカミニ',
                price: '25,000円～',
                image: '/cars/delicamini.jpg',
                route: '/kcar/delicamini',
            },
            {
                name: 'スペーシアカスタム',
                price: '22,000円～',
                image: '/cars/spacia.jpg',
                route: '/kcar/spacia',
            },
            {
                name: 'スペーシアギア',
                price: '22,000円～',
                image: '/cars/spaciagear.jpg',
                route: '/kcar/spaciagear',
            },
            {
                name: 'ハスラー',
                price: '22,000円～',
                image: '/cars/hustler.jpg',
                route: '/kcar/hustler',
            },
            { name: 'ジムニー', price: '22,000円～', image: '/cars/jimny.jpg', route: '/kcar/jimny' },
        ],
    };

    // 各カテゴリの車種を価格順（安い順）にソート
    const carData: Record<CarCategory, Car[]> = {
        SUV: sortByPrice(rawCarData.SUV),
        MINIVAN: sortByPrice(rawCarData.MINIVAN),
        KCAR: sortByPrice(rawCarData.KCAR),
    };

    return (
        <div className="min-h-screen bg-white" data-oid="dn0w-eo">
            {/* Header */}
            <header
                className={`bg-white shadow-md fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}
                data-oid=":2:5r8i"
            >
                <div className="container mx-auto px-4" data-oid="ign035k">
                    <div className="flex items-center justify-between" data-oid="pqef316">
                        <Link href="/" className="flex items-center" data-oid="fn3adif">
                            <div
                                className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mr-3 shadow-md"
                                data-oid="8fux-6-"
                            >
                                <span className="text-white font-bold text-sm" data-oid="uhukf56">
                                    港南
                                </span>
                            </div>
                            <span
                                className="text-lg font-semibold text-gray-800"
                                data-oid="rxr1_cs"
                            >
                                株式会社港南自動車サービス
                            </span>
                        </Link>
                        <div className="flex items-center space-x-6" data-oid="ys9f765">
                            <Link
                                href="/#services"
                                className="text-gray-600 hover:text-teal-600 transition-colors"
                                data-oid="q91-hkk"
                            >
                                サービス一覧
                            </Link>
                            <Link
                                href="/#company"
                                className="text-gray-600 hover:text-teal-600 transition-colors"
                                data-oid="s-zq06:"
                            >
                                会社情報
                            </Link>
                            <Link
                                href="/#contact"
                                className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-md"
                                data-oid="vadbdo2"
                            >
                                お問い合わせ
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-teal-800 text-white relative" data-oid="jrqex-7">
                <div className="absolute bottom-0 left-0 w-full overflow-hidden" data-oid="yjefgz9">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        className="w-full h-auto"
                        preserveAspectRatio="none"
                        data-oid="6.:jlp4"
                    >
                        <path
                            fill="#ffffff"
                            fillOpacity="1"
                            d="M0,128L80,138.7C160,149,320,171,480,165.3C640,160,800,128,960,122.7C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                            data-oid="0qu5ux:"
                        ></path>
                    </svg>
                </div>
                <div className="container mx-auto px-4 relative z-10" data-oid="ck:_1y0">
                    <div
                        className="flex flex-col md:flex-row items-center justify-between"
                        data-oid="3.7ew-w"
                    >
                        <div className="md:w-1/2 mb-10 md:mb-0" data-oid="c6rur0z">
                            <div
                                className="inline-block px-4 py-2 bg-white text-teal-800 rounded-full mb-6 font-semibold"
                                data-oid="sxfhnl:"
                            >
                                創業60年以上の実績
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-oid="mwel:ge">
                                <span className="block mb-2" data-oid="obh5xr-">
                                    港南自動車サービスが提供する
                                </span>
                                <span className="block text-6xl" data-oid="h5sz4pl">
                                    ノレタ
                                </span>
                            </h1>
                            <p className="text-xl mb-8 opacity-90" data-oid="-jf_f9x">
                                新車に乗るなら、もっと気軽に。もっとお得に。
                            </p>
                            <div className="flex flex-wrap gap-4" data-oid="q5b3-xv">
                                <div
                                    className="bg-white px-5 py-4 rounded-lg flex items-center shadow-md border-2 border-white"
                                    data-oid="wmlvszb"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 mr-3 text-teal-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="d5xsmga"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M5 13l4 4L19 7"
                                            data-oid="04hpkcp"
                                        />
                                    </svg>
                                    <span
                                        className="text-lg font-bold text-teal-800"
                                        data-oid=":pt8sz:"
                                    >
                                        頭金なし
                                    </span>
                                </div>
                                <div
                                    className="bg-white px-5 py-4 rounded-lg flex items-center shadow-md border-2 border-white"
                                    data-oid="8lhxicm"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 mr-3 text-teal-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="f-_mbpp"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M5 13l4 4L19 7"
                                            data-oid=".h0dp2y"
                                        />
                                    </svg>
                                    <span
                                        className="text-lg font-bold text-teal-800"
                                        data-oid="e0um1wh"
                                    >
                                        ボーナス払いなし
                                    </span>
                                </div>
                                <div
                                    className="bg-white px-5 py-4 rounded-lg flex items-center shadow-md border-2 border-white"
                                    data-oid="m_1:h35"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 mr-3 text-teal-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid=":pk0dyr"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M5 13l4 4L19 7"
                                            data-oid="1ihb5uy"
                                        />
                                    </svg>
                                    <span
                                        className="text-lg font-bold text-teal-800"
                                        data-oid="zw2cypv"
                                    >
                                        3年契約
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 hidden md:block" data-oid="mqsv1l-">
                            <div
                                className="relative rounded-lg overflow-hidden shadow-2xl"
                                data-oid="u_e3qrb"
                            >
                                <Image
                                    src="/noreta-hero.jpg"
                                    alt="ノレタ - 新しい車の乗り方"
                                    width={600}
                                    height={400}
                                    className="w-full h-auto"
                                    data-oid="6849_:l"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-12 bg-white" data-oid="v3mlqst">
                <div className="container mx-auto px-4" data-oid=".8c3ry7">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-oid="molv74.">
                        <div
                            className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow"
                            data-oid="9rdc7kf"
                        >
                            <div
                                className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4"
                                data-oid="lmyrsdy"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-teal-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    data-oid="a8c0m0w"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        data-oid="x9txn9."
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-2xl font-bold text-gray-800 mb-2"
                                data-oid="j4njsk5"
                            >
                                創業60年以上
                            </h3>
                            <p className="text-gray-600" data-oid="se7nczw">
                                長年の実績と信頼
                            </p>
                        </div>
                        <div
                            className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow"
                            data-oid=":xprzcw"
                        >
                            <div
                                className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4"
                                data-oid="y79pe9j"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-teal-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    data-oid="feig2fp"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        data-oid="z8zn-q-"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-2xl font-bold text-gray-800 mb-2"
                                data-oid="mvnkiq_"
                            >
                                お客様2,000名以上
                            </h3>
                            <p className="text-gray-600" data-oid="bo9civt">
                                多くのお客様にご愛顧いただいております
                            </p>
                        </div>
                        <div
                            className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow"
                            data-oid="hbk2-6n"
                        >
                            <div
                                className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4"
                                data-oid="ikg-:9e"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-teal-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    data-oid="whans1m"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        data-oid="op7bqqm"
                                    />
                                </svg>
                            </div>
                            <h3
                                className="text-2xl font-bold text-gray-800 mb-2"
                                data-oid="58fp_4:"
                            >
                                対応実績 全メーカー
                            </h3>
                            <p className="text-gray-600" data-oid="bca_5n_">
                                国産車から輸入車まで幅広く対応
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 mt-10" data-oid="vgxn62n">
                {/* Vehicle Lineup Section */}
                <div className="mb-20" data-oid="4ni0p50">
                    <div className="text-center mb-12" data-oid="e3-q:y4">
                        <span className="text-teal-600 font-semibold" data-oid=":pu:qf-">
                            LINEUP
                        </span>
                        <h2
                            className="text-3xl font-bold mt-2 mb-4 relative inline-block"
                            data-oid="sy5_s6q"
                        >
                            ラインナップ
                            <span
                                className="absolute bottom-0 left-0 w-full h-1 bg-teal-500 rounded"
                                data-oid=":xjlhuv"
                            ></span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto" data-oid="t9gm.vc">
                            お客様のニーズに合わせた多彩な車種を取り揃えております。月々の定額でお得に新車に乗れます。
                        </p>
                    </div>

                    {/* Category Selector */}
                    <div className="flex justify-center mb-12" data-oid="gp09t-h">
                        <div
                            className="inline-flex rounded-lg border border-gray-200 shadow-sm"
                            data-oid="v36fooq"
                        >
                            <button
                                className={`px-8 py-3 rounded-l-lg ${
                                    activeCategory === 'SUV'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => setActiveCategory('SUV')}
                                aria-label="SUVカテゴリを表示"
                                data-oid="0y2xs:-"
                            >
                                SUV
                            </button>
                            <button
                                className={`px-8 py-3 border-l border-r ${
                                    activeCategory === 'MINIVAN'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => setActiveCategory('MINIVAN')}
                                aria-label="ミニバンカテゴリを表示"
                                data-oid="i89hxoi"
                            >
                                ミニバン
                            </button>
                            <button
                                className={`px-8 py-3 rounded-r-lg ${
                                    activeCategory === 'KCAR'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => setActiveCategory('KCAR')}
                                aria-label="軽自動車カテゴリを表示"
                                data-oid="9xa-tqn"
                            >
                                軽自動車
                            </button>
                        </div>
                    </div>

                    {/* Car Grid */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        data-oid="wnbbmkp"
                    >
                        {carData[activeCategory].map((car, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col"
                                data-oid="50p0a1e"
                            >
                                <Link href={car.route || '#'} data-oid="rsq6_45">
                                    <div
                                        className="relative w-full pt-[75%] overflow-hidden group"
                                        data-oid="jj074yg"
                                    >
                                        <Image
                                            src={car.image}
                                            alt={car.name}
                                            fill
                                            className="object-cover absolute top-0 left-0 group-hover:scale-105 transition-transform duration-300"
                                            data-oid=":-l:y6e"
                                        />

                                        <div
                                            className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                                            data-oid="hsfw-i4"
                                        >
                                            月々 {car.price}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow" data-oid="85w1c.a">
                                        <h4 className="text-xl font-bold mb-3" data-oid="aqc_wkg">
                                            {car.name}
                                        </h4>
                                        <div
                                            className="flex flex-wrap gap-2 mb-4"
                                            data-oid="1zq11i7"
                                        >
                                            <span
                                                className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded"
                                                data-oid="zqj0wrh"
                                            >
                                                頭金なし
                                            </span>
                                            <span
                                                className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded"
                                                data-oid="o48-k._"
                                            >
                                                ボーナス払いなし
                                            </span>
                                            <span
                                                className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded"
                                                data-oid="9drxhd-"
                                            >
                                                3年契約
                                            </span>
                                        </div>
                                        <div className="mt-auto" data-oid="hwnmccz">
                                            <span
                                                className="text-teal-600 font-medium flex items-center"
                                                data-oid="cq:nz8_"
                                            >
                                                詳細を見る
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 ml-1"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    data-oid="settcez"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                        data-oid="kftmwmq"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Question Section */}
                <div className="text-center mb-16 relative" data-oid="709fdsg">
                    <div
                        className="absolute top-0 left-0 w-full overflow-hidden"
                        data-oid="8c_f3b0"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1440 320"
                            className="w-full h-auto transform scale-x-105"
                            data-oid="uo2gmzn"
                        >
                            <path
                                fill="#f3f4f6"
                                fillOpacity="1"
                                d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,170.7C672,160,768,160,864,176C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                                data-oid="cjeyfvo"
                            ></path>
                        </svg>
                    </div>
                    <div className="relative z-10 pt-16" data-oid="46o57.p">
                        <span className="text-teal-600 font-semibold" data-oid=":lk30bf">
                            WHY SO AFFORDABLE?
                        </span>
                        <h2
                            className="text-4xl font-bold mt-2 mb-4 relative inline-block"
                            data-oid="dzihdm7"
                        >
                            なんでそんなに安く出来るの？
                            <span
                                className="absolute bottom-0 left-0 w-full h-1 bg-teal-500 rounded"
                                data-oid="fqgm6sd"
                            ></span>
                        </h2>
                        <h3
                            className="text-2xl font-semibold mt-8 mb-12 text-gray-700"
                            data-oid="2.9o5tl"
                        >
                            ポイントは3点
                        </h3>
                    </div>
                </div>

                {/* Points Section */}
                <div
                    className="space-y-16 max-w-4xl mx-auto bg-gray-50 py-12 px-6 md:px-12 rounded-xl shadow-md relative z-10"
                    data-oid="hxmpxux"
                >
                    {/* Point 1 */}
                    <div
                        className="flex flex-col md:flex-row md:items-start gap-8"
                        data-oid=".pgj:90"
                    >
                        <div className="md:w-1/4 flex justify-center" data-oid="pc8y:6s">
                            <div
                                className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center"
                                data-oid="2hs-tai"
                            >
                                <span
                                    className="text-teal-700 font-bold text-3xl"
                                    data-oid="_33zlyb"
                                >
                                    1
                                </span>
                            </div>
                        </div>
                        <div className="md:w-3/4" data-oid="y24d2wj">
                            <h3
                                className="text-xl font-bold mb-4 text-teal-700 flex items-center"
                                data-oid="krp651x"
                            >
                                <span
                                    className="px-4 py-2 bg-teal-100 rounded-lg mr-2"
                                    data-oid="wl85jl0"
                                >
                                    Point 1
                                </span>
                                3年後のリセールだけを考慮した車両設定
                            </h3>
                            <div className="space-y-4 mt-6" data-oid="y-g00bw">
                                <p className="text-gray-700 leading-relaxed" data-oid="gfdh3zz">
                                    新車を短期間で賢く乗り換える上で大切なのが、車両設定。
                                    リセールが高いと言われている車をただ乗るだけでは、お得感が減少してしまいます。
                                    これは車業界の事を熟知していないと一筋縄ではいきません。
                                </p>
                                <p
                                    className="text-red-600 font-semibold bg-red-50 p-3 rounded-lg inline-block"
                                    data-oid="lyx56dy"
                                >
                                    それは理不尽だ！
                                </p>
                                <p className="text-gray-700" data-oid=":myoqfl">
                                    という事でこの「ノレタ」を考案させて頂きました。
                                </p>
                                <div
                                    className="bg-white p-6 rounded-lg mt-4 shadow-sm"
                                    data-oid="7l16u3f"
                                >
                                    <p
                                        className="font-semibold mb-4 text-teal-700"
                                        data-oid="906.zsh"
                                    >
                                        「ノレタ」のご提案させて頂く車両設定と致しましては以下を挙げさせて頂きます。
                                    </p>
                                    <ul
                                        className="list-disc list-inside space-y-3 text-gray-700"
                                        data-oid="xaachj6"
                                    >
                                        <li className="flex items-start" data-oid=":uzdgjm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                data-oid="tk9kc1q"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                    data-oid="e7nj6hh"
                                                />
                                            </svg>
                                            <span data-oid="s__sjq.">
                                                リセールの高く、時期も考慮した車種
                                            </span>
                                        </li>
                                        <li className="flex items-start" data-oid="93xp.xo">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                data-oid="3e6lqrp"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                    data-oid="u0cuhnl"
                                                />
                                            </svg>
                                            <span data-oid="29z:cx9">リセールの高いグレード</span>
                                        </li>
                                        <li className="flex items-start" data-oid="j25n7lt">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                data-oid="b3f.9-3"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                    data-oid="1q:w613"
                                                />
                                            </svg>
                                            <span data-oid="kuwz3qc">リセールの高いカラー選択</span>
                                        </li>
                                        <li className="flex items-start" data-oid="q3k5lci">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                data-oid="rskeuwe"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                    data-oid="-bp42w."
                                                />
                                            </svg>
                                            <span data-oid="bbt:6.w">
                                                リセールの高い必須メーカーオプション
                                            </span>
                                        </li>
                                        <li className="flex items-start" data-oid="41-9vqw">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                data-oid="55flw:6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                    data-oid="b4znwl-"
                                                />
                                            </svg>
                                            <span data-oid="bdd5hl_">
                                                過去の相場を考慮した精密な残価設定
                                            </span>
                                        </li>
                                        <li className="flex items-start" data-oid="5:qy6g6">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                data-oid="kklf9qm"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                    data-oid="pvncrzk"
                                                />
                                            </svg>
                                            <span data-oid="wo:xyka">しっかりとした車両値引き</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Point 2 */}
                    <div
                        className="flex flex-col md:flex-row md:items-start gap-8"
                        data-oid="si6zjvw"
                    >
                        <div className="md:w-1/4 flex justify-center" data-oid="wt:8y_e">
                            <div
                                className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center"
                                data-oid="lq-f-k9"
                            >
                                <span
                                    className="text-teal-700 font-bold text-3xl"
                                    data-oid="sa9bx9-"
                                >
                                    2
                                </span>
                            </div>
                        </div>
                        <div className="md:w-3/4" data-oid="yjv6tmj">
                            <h3
                                className="text-xl font-bold mb-4 text-teal-700 flex items-center"
                                data-oid="obvqt1a"
                            >
                                <span
                                    className="px-4 py-2 bg-teal-100 rounded-lg mr-2"
                                    data-oid="mfdlu6x"
                                >
                                    Point 2
                                </span>
                                ローン形式と低金利2.5%
                            </h3>
                            <div className="space-y-4 mt-6" data-oid="k3fl9l4">
                                <p className="text-gray-700 leading-relaxed" data-oid="ac9ko9u">
                                    弊社サービス「ノレタ」では、残価設定型ローンではなく自由返済型ローンを採用し、ローン金利2.5%で提供させて頂いております。
                                </p>
                                <div
                                    className="bg-white p-6 rounded-lg mt-4 shadow-sm"
                                    data-oid="x.5k-dj"
                                >
                                    <h4
                                        className="font-semibold mb-6 text-teal-700 border-b border-gray-200 pb-2"
                                        data-oid="__a:0ry"
                                    >
                                        一部ディーラーさんとのメリット・デメリット比較
                                    </h4>
                                    <div className="space-y-8" data-oid="pt:2ivh">
                                        <div
                                            className="bg-blue-50 p-4 rounded-lg"
                                            data-oid="nmhqa3g"
                                        >
                                            <p
                                                className="font-semibold text-teal-700 mb-3 flex items-center"
                                                data-oid="i8z0h70"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 mr-2"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    data-oid="076n.yq"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                        data-oid="jo4ervl"
                                                    />
                                                </svg>
                                                メリット
                                            </p>
                                            <ul
                                                className="list-disc list-inside space-y-2 pl-5"
                                                data-oid="lj3a.zx"
                                            >
                                                <li className="text-gray-700" data-oid="ur0-dfp">
                                                    <span
                                                        className="font-medium"
                                                        data-oid="vw0grle"
                                                    >
                                                        月々の支払いが安くなる
                                                    </span>{' '}
                                                    →
                                                    「ノレタ」も同様＋月々の金額にオイル系メンテナンスも含めて安くなっております。
                                                </li>
                                                <li className="text-gray-700" data-oid="p6xw-ad">
                                                    <span
                                                        className="font-medium"
                                                        data-oid="31:ukyx"
                                                    >
                                                        条件を達成すると、3年後の買取保証が受けられる
                                                    </span>{' '}
                                                    → 「ノレタ」では買取保証の有無を選べます。
                                                </li>
                                            </ul>
                                        </div>
                                        <div
                                            className="bg-red-50 p-4 rounded-lg"
                                            data-oid="6zbpo6s"
                                        >
                                            <p
                                                className="font-semibold text-red-600 mb-3 flex items-center"
                                                data-oid="mm8:goj"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 mr-2"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    data-oid="svwlcy9"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd"
                                                        data-oid="odf77d1"
                                                    />
                                                </svg>
                                                デメリット
                                            </p>
                                            <ul
                                                className="list-disc list-inside space-y-2 pl-5"
                                                data-oid="ga_sn7_"
                                            >
                                                <li className="text-gray-700" data-oid="z2h6k8h">
                                                    <span
                                                        className="font-medium"
                                                        data-oid="9sw1pkc"
                                                    >
                                                        ローン金利の実質年率が高い(例：実質年率3.9%等)
                                                    </span>{' '}
                                                    → 「ノレタ」はローン金利の実質年率が2.5%と安い
                                                </li>
                                                <li className="text-gray-700" data-oid="s8.416g">
                                                    <span
                                                        className="font-medium"
                                                        data-oid="yp2hqu_"
                                                    >
                                                        車両の再ローンをする場合、より実質年率が高くなる
                                                    </span>{' '}
                                                    →
                                                    「ノレタ」で採用されている自由返済型ローンでは、車両を乗り続ける場合でも再ローンという手続きはなく、実質年率は2.5%とそのままにお車を乗り続ける事が出来ます。
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Point 3 */}
                    <div
                        className="flex flex-col md:flex-row md:items-start gap-8"
                        data-oid="lw9j4p0"
                    >
                        <div className="md:w-1/4 flex justify-center" data-oid="yf.7i3a">
                            <div
                                className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center"
                                data-oid="c_.q:fw"
                            >
                                <span
                                    className="text-teal-700 font-bold text-3xl"
                                    data-oid="x0m1zb5"
                                >
                                    3
                                </span>
                            </div>
                        </div>
                        <div className="md:w-3/4" data-oid="1-8t4mx">
                            <h3
                                className="text-xl font-bold mb-4 text-teal-700 flex items-center"
                                data-oid=".1wi25_"
                            >
                                <span
                                    className="px-4 py-2 bg-teal-100 rounded-lg mr-2"
                                    data-oid="h21qx2i"
                                >
                                    Point 3
                                </span>
                                利益率が悪くてもしっかり運営出来る
                            </h3>
                            <div className="space-y-4 mt-6" data-oid=":cp2yeq">
                                <p className="text-gray-700 leading-relaxed" data-oid="1-jo5:g">
                                    正直言いますと、「ノレタ」での儲けというのは単価で見るとかなり少ないです。
                                    ですが、「ノレタ」はしっかり運営出来ると断言できます。
                                </p>
                                <p className="text-gray-700 leading-relaxed" data-oid="b8ttpff">
                                    なぜ出来るのかというのは簡単なことで、港南自動車は開業60年以上の会社で、
                                    「ノレタ」だけをやっている会社ではないからです。
                                </p>
                                <div
                                    className="bg-white p-6 rounded-lg mt-4 shadow-sm"
                                    data-oid="szywr8a"
                                >
                                    <p className="mb-4 text-gray-700" data-oid="lfi-btc">
                                        新車販売・中古車販売・リース販売・車検・点検・板金・損害保険・生命保険
                                        この中に「ノレタ」が追加されるだけで、プラスにはなることはあってもマイナスになる事はありません。
                                    </p>
                                    <div
                                        className="bg-teal-50 p-4 rounded border-l-4 border-teal-500"
                                        data-oid="_ujr-ys"
                                    >
                                        <p className="text-gray-700 italic" data-oid=":9m.:r2">
                                            なのでお得感を強くし、利益率が悪くなっても
                                            お客様の負担を少なくし短期間での乗り換えをリピートして頂ければ、長期的に見て利益を確保できますのでご安心ください。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="text-center mt-20 relative" data-oid="._gvodc">
                    <div
                        className="absolute top-0 left-0 w-full overflow-hidden transform -translate-y-1/2"
                        data-oid="uswnepc"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1440 320"
                            className="w-full h-auto"
                            data-oid="a0_u06t"
                        >
                            <path
                                fill="#f3f4f6"
                                fillOpacity="1"
                                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                                data-oid="-q20x5p"
                            ></path>
                        </svg>
                    </div>
                    <div className="relative z-10" data-oid="skrri5s">
                        <span className="text-teal-600 font-semibold" data-oid="g2e7wpr">
                            GET IN TOUCH
                        </span>
                        <h2
                            className="text-3xl font-bold mt-2 mb-6 relative inline-block"
                            data-oid="74paijr"
                        >
                            お問い合わせ
                            <span
                                className="absolute bottom-0 left-0 w-full h-1 bg-teal-500 rounded"
                                data-oid="6n.-opa"
                            ></span>
                        </h2>
                        <p
                            className="text-lg mb-8 max-w-2xl mx-auto text-gray-700"
                            data-oid="zm9jvpt"
                        >
                            「ノレタ」がなぜ安く出来ているのかを ご覧頂きありがとうございました。
                            少しでもご興味を持って頂けましたら、 お問い合わせ頂けると幸いです。
                        </p>
                        <div
                            className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto"
                            data-oid="kp6ch1_"
                        >
                            <div
                                className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                data-oid="_sis:yn"
                            >
                                <div className="flex items-center mb-4" data-oid="bvidzx7">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-teal-600 mr-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="3gjxcvl"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            data-oid="_u4qx7."
                                        />
                                    </svg>
                                    <h3 className="text-xl font-bold" data-oid="sda_vfv">
                                        お電話でのお問い合わせ
                                    </h3>
                                </div>
                                <a
                                    href="tel:076-268-1788"
                                    className="block text-2xl font-bold text-teal-600 hover:underline text-center my-5"
                                    data-oid="l96a_oc"
                                >
                                    076-268-1788
                                </a>
                                <p className="text-sm text-gray-600 text-center" data-oid="7dop659">
                                    営業時間: 平日 9:00 〜 18:00 / 土曜 9:00 〜 17:00
                                    <br data-oid="dkc5kzp" />
                                    定休日: 第2・第4土曜日、日曜、祝日
                                </p>
                            </div>
                            <div
                                className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                data-oid="_4c975e"
                            >
                                <div className="flex items-center mb-4" data-oid="g8-z-w-">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-teal-600 mr-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        data-oid="p__w.gc"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            data-oid="e12im6y"
                                        />
                                    </svg>
                                    <h3 className="text-xl font-bold" data-oid="wt-29wd">
                                        メールでのお問い合わせ
                                    </h3>
                                </div>
                                <Link
                                    href="/#contact"
                                    className="inline-block bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors shadow-md my-5"
                                    data-oid="0yewdpl"
                                >
                                    フォームに移動する
                                </Link>
                                <p className="text-sm text-gray-600 text-center" data-oid="o8ffu9e">
                                    24時間受付中。営業時間内に返信致します。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12 mt-20" data-oid="dc3dad9">
                <div className="container mx-auto px-4" data-oid="9vfs393">
                    <div className="flex flex-col md:flex-row justify-between" data-oid="7e9u957">
                        <div className="mb-8 md:mb-0" data-oid="t.00_gu">
                            <div className="flex items-center mb-4" data-oid="8oy3-zf">
                                <div
                                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3"
                                    data-oid="8p9ado."
                                >
                                    <span
                                        className="text-teal-600 font-bold text-sm"
                                        data-oid="gialhj-"
                                    >
                                        港南
                                    </span>
                                </div>
                                <div data-oid="jur2_2h">
                                    <h3 className="text-lg font-bold" data-oid=".:1enyw">
                                        株式会社港南自動車サービス
                                    </h3>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm" data-oid="deecrz4">
                                〒920-0336
                                <br data-oid="z..qx2:" />
                                石川県金沢市金石本町ハ14
                                <br data-oid="o7v-d6g" />
                                TEL:{' '}
                                <a
                                    href="tel:076-268-1788"
                                    className="hover:text-teal-300 transition-colors"
                                    data-oid="kebaq19"
                                >
                                    076-268-1788
                                </a>
                                <br data-oid="k416jag" />
                                FAX: 076-268-3163
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8" data-oid="txvkr8t">
                            <div data-oid="u4-b:a.">
                                <h4
                                    className="text-lg font-bold mb-4 text-teal-300"
                                    data-oid="yi75k6."
                                >
                                    サービス
                                </h4>
                                <ul className="space-y-2 text-gray-300" data-oid="d5o5yl3">
                                    <li data-oid="3705fgy">
                                        <Link
                                            href="/#services"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="fu702e5"
                                        >
                                            車検・点検
                                        </Link>
                                    </li>
                                    <li data-oid="b_y1dj.">
                                        <Link
                                            href="/"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="1ff4fj2"
                                        >
                                            ノレタ
                                        </Link>
                                    </li>
                                    <li data-oid="m65ex74">
                                        <Link
                                            href="/#services"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="-qi2ptm"
                                        >
                                            新車・中古車販売
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div data-oid=".mdonh.">
                                <h4
                                    className="text-lg font-bold mb-4 text-teal-300"
                                    data-oid="4pk-6q2"
                                >
                                    会社情報
                                </h4>
                                <ul className="space-y-2 text-gray-300" data-oid="is75czj">
                                    <li data-oid="kv6o7gi">
                                        <Link
                                            href="/#company"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid=":bj83_r"
                                        >
                                            会社概要
                                        </Link>
                                    </li>
                                    <li data-oid="w4dr:r.">
                                        <Link
                                            href="/#contact"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="3z.l_jt"
                                        >
                                            お問い合わせ
                                        </Link>
                                    </li>
                                    <li data-oid="ww8v2:3">
                                        <a
                                            href="#"
                                            className="hover:text-teal-300 transition-colors"
                                            data-oid="8p99fsu"
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
                        data-oid="7vpp84k"
                    >
                        &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights
                        Reserved.
                    </div>
                </div>
            </footer>

            {/* Floating Contact Button */}
            <div className="fixed bottom-8 right-8 z-50 group" data-oid="3jfrilz">
                <div
                    className="bg-white rounded-lg shadow-lg p-2 mb-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    data-oid="icu1r5p"
                >
                    <p className="text-xs text-center font-medium text-gray-700" data-oid="3p5v2m6">
                        お問い合わせ
                    </p>
                </div>
                <Link
                    href="/#contact"
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="お問い合わせセクションへ移動"
                    data-oid="wcbuw78"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        data-oid="x56led-"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            data-oid="u2u..a2"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
