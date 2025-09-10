'use client';

import Link from 'next/link';

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    レクサス NX
                </h1>
                <p className="text-gray-600 mb-8">
                    このページは準備中です
                </p>
                <Link 
                    href="/"
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
                >
                    ホームに戻る
                </Link>
            </div>
        </div>
    );
}
