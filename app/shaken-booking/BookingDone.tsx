/**
 * 申込直後の画面。
 *
 * この時点ではシートに記録されただけで、お客様がLINEで申込文を送信しないと
 * お店はチャットで返事ができない（確定の連絡ができない）。
 * 「受け付けました」で安心して閉じてしまう方を出さないため、
 * 完了ではなく「あと1ステップ」として見せる。
 *
 * 画面の主役は「これから開くLINEのトーク画面の見本」。
 * 入力欄に申込文が入った状態と「送信」の位置を先に見せておくことで、
 * トーク画面が開いたときに何を押せばよいか迷わないようにする。
 */

/** LINEの送信ボタン（紙飛行機）。見本と本物のボタンで同じ形を使い、つながりを見せる */
function SendIcon({ className }: { className?: string }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z" />
        </svg>
    );
}

/** これから開くトーク画面の見本。入力欄に申込文が入り、送信ボタンに印が付いている */
function TalkPreview({ message }: { message: string }) {
    return (
        <figure className="overflow-hidden rounded-2xl border border-gray-300 shadow-sm">
            {/* トーク画面の上部（相手の名前） */}
            <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-2.5">
                <span aria-hidden="true" className="text-xl leading-none text-gray-500">
                    ‹
                </span>
                <span className="text-[13px] font-bold text-gray-900">港南自動車サービス</span>
            </div>

            {/* トークの背景。LINEの標準の背景色に近い淡い青灰 */}
            <div className="bg-[#B9CBE8] px-3 pb-3 pt-10">
                {/* 入力欄。申込文が入っている */}
                <div className="flex items-end gap-2 rounded-xl bg-white p-2">
                    <p className="max-h-44 flex-1 overflow-hidden whitespace-pre-wrap break-words rounded-lg bg-gray-100 px-3 py-2 text-[12px] leading-[1.55] text-gray-900">
                        {message}
                    </p>
                    {/* 送信ボタン。朱の輪と吹き出しで「ここを押す」を示す */}
                    <span className="relative mb-0.5 shrink-0">
                        <span
                            aria-hidden="true"
                            className="absolute -inset-1.5 rounded-full border-[3px] border-red-600"
                        />
                        <span className="flex size-9 items-center justify-center rounded-full bg-[#06C755] text-white">
                            <SendIcon className="size-5" />
                        </span>
                    </span>
                </div>
                <p className="mt-2 text-right text-[13px] font-bold text-red-700">
                    最後にここ（送信）を押してください ↑
                </p>
            </div>

            <figcaption className="sr-only">
                LINEのトーク画面の見本。入力欄に申込内容が入った状態で開くので、右下の送信ボタンを押してください。
            </figcaption>
        </figure>
    );
}

export default function BookingDone({
    bookingNumber,
    sendHref,
    message,
}: {
    bookingNumber: string;
    sendHref: string;
    /** トーク画面に入力済みになる申込文（見本に表示する） */
    message: string;
}) {
    return (
        <div className="grid gap-6">
            {/* 今どこにいるか。2つ目が未完了であることを見せる */}
            <ol className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold leading-tight" aria-label="申込の手順">
                <li className="rounded-lg bg-teal-50 px-2 py-2 text-teal-700">
                    <span className="block text-base">✓</span>
                    フォーム入力
                </li>
                <li className="rounded-lg bg-red-600 px-2 py-2 text-white" aria-current="step">
                    <span className="block text-base">2</span>
                    LINEで送信
                    <span className="block">（今ここ）</span>
                </li>
                <li className="rounded-lg bg-gray-100 px-2 py-2 text-gray-500">
                    <span className="block text-base">3</span>
                    当店から
                    <span className="block">確定のご連絡</span>
                </li>
            </ol>

            <div role="status" aria-live="polite">
                <p className="text-[26px] font-bold leading-snug text-red-700">あと1ステップです</p>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-900">
                    下のボタンでLINEを開き、
                    <strong className="font-bold">入力済みの申込内容を送信</strong>
                    してください。送信すると、お申し込みが当店に届きます。
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    送信していただかないと、当店から確定のご連絡ができません。
                </p>
            </div>

            <TalkPreview message={message} />

            {/* 送信ボタン。周りの枠を点滅させて目を引く（動きを減らす設定の端末では止める）。
                拡大する動きは画面幅からはみ出して横スクロールが出るため使わない */}
            <div className="relative">
                <span
                    aria-hidden="true"
                    className="absolute -inset-1.5 rounded-[22px] border-4 border-[#06C755] motion-safe:animate-pulse"
                />
                <a
                    href={sendHref}
                    className="relative flex min-h-[72px] items-center justify-between gap-4 rounded-2xl bg-[#06C755] px-6 py-4 text-lg font-bold text-white shadow-lg transition-[background-color,transform] duration-200 hover:bg-[#05b04c] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-teal-700 active:scale-[0.98]"
                >
                    <span className="flex flex-col leading-tight">
                        LINEを開いて送信する
                        <span className="mt-1 text-xs font-medium text-white/90">ここを押してください（必須）</span>
                    </span>
                    <SendIcon className="size-7 shrink-0" />
                </a>
            </div>

            <p className="text-xs text-gray-500">
                受付番号 <span className="u-num font-bold text-gray-700">{bookingNumber}</span>
            </p>
        </div>
    );
}
