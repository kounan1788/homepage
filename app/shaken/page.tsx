'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ShakenPage() {
    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center group">
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
                    <Link
                        href="/"
                        className="bg-teal-600 text-white font-medium rounded-md px-4 py-2 hover:bg-teal-700 transition-colors shadow-sm"
                    >
                        ホームに戻る
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* 準備中アイコン */}
                        <div className="mb-8">
                            <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-teal-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* タイトル */}
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                            車検・点検サービス
                        </h1>
                        
                        {/* サブタイトル */}
                        <div className="mb-8">
                            <span className="inline-block bg-yellow-400 text-yellow-900 text-lg font-bold px-6 py-3 rounded-full mb-4">
                                準備中
                            </span>
                        </div>

                        {/* 説明文 */}
                        <div className="bg-gray-50 rounded-xl p-8 mb-12">
                            <p className="text-xl text-gray-700 leading-relaxed mb-6">
                                申し訳ございませんが、車検・点検サービスの詳細ページは現在準備中です。
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                詳細な情報については、お電話またはお問い合わせフォームよりご連絡ください。
                            </p>
                        </div>

                        {/* 連絡先情報 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-teal-50 rounded-xl p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-teal-600 mr-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    <h3 className="text-xl font-bold text-teal-700">お電話でのお問い合わせ</h3>
                                </div>
                                <a
                                    href="tel:076-268-1788"
                                    className="text-2xl font-bold text-teal-600 hover:text-teal-800 transition-colors"
                                >
                                    076-268-1788
                                </a>
                                <p className="text-gray-600 mt-2">
                                    平日 9:00 〜 18:00 / 土曜 9:00 〜 17:00
                                </p>
                            </div>

                            <div className="bg-green-50 rounded-xl p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-green-600 mr-3"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-green-700">LINEでのお問い合わせ</h3>
                                </div>
                                <a
                                    href="https://lin.ee/CKQM0mE"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                    </svg>
                                    友だち追加
                                </a>
                            </div>
                        </div>

                        {/* アクションボタン */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 font-medium shadow-lg transform hover:-translate-y-1"
                            >
                                ホームに戻る
                            </Link>
                            <a
                                href="#contact"
                                className="px-8 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium shadow-lg transform hover:-translate-y-1"
                            >
                                お問い合わせフォーム
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                                <span className="text-teal-600 font-bold text-sm">港南</span>
                            </div>
                            <h3 className="text-lg font-bold">株式会社港南自動車サービス</h3>
                        </div>
                        <p className="text-gray-300 text-sm">
                            〒920-0336 石川県金沢市金石本町ハ14<br />
                            TEL: <a href="tel:076-268-1788" className="hover:text-teal-300 transition-colors">076-268-1788</a> / FAX: 076-268-3163
                        </p>
                        <div className="border-t border-gray-700 mt-8 pt-8 text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights Reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
