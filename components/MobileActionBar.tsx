// スマホ画面下部に固定表示する電話・LINEのアクションバー（md以上では非表示）
export default function MobileActionBar() {
    return (
        <>
            {/* 固定バーがページ末尾のコンテンツを隠さないよう余白を確保 */}
            <div className="h-16 md:hidden" aria-hidden="true" />
            <div className="fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
                <a
                    href="tel:076-268-1788"
                    className="flex items-center justify-center bg-teal-600 text-white font-bold py-4 text-sm active:bg-teal-700"
                >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                    </svg>
                    電話する
                </a>
                <a
                    href="https://lin.ee/CKQM0mE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-[#00b900] text-white font-bold py-4 text-sm active:bg-green-700"
                >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    LINEで予約
                </a>
            </div>
        </>
    );
}
