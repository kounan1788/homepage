'use client';

import dynamic from 'next/dynamic';

/**
 * 予約フォームをブラウザ側だけで読み込むための入れ物。
 *
 * LIFFのSDKはサーバーでは動かないため ssr: false にしている。
 * ssr: false の dynamic import はサーバーコンポーネントから直接使えないので、
 * この薄いクライアントコンポーネントを挟む（車検満了日リマインダーと同じ作り）。
 */
const BookingForm = dynamic(() => import('./BookingForm'), {
    ssr: false,
    loading: () => (
        <p role="status" aria-live="polite" className="text-sm text-gray-500">
            予約フォームを読み込んでいます…
        </p>
    ),
});

export default function BookingFormLoader() {
    return <BookingForm />;
}
