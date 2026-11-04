'use client';

import dynamic from 'next/dynamic';

/**
 * 登録フォームをブラウザ側だけで読み込むための入れ物。
 *
 * LIFFのSDKはサーバーでは動かないため ssr: false にしている。
 * ssr: false の dynamic import はサーバーコンポーネントから直接使えないので、
 * この薄いクライアントコンポーネントを挟む。
 * こうするとページ本文（見出し・説明・構造化データ）はサーバーで描画されるため、
 * liff.init() の完了を待たずにクローラーが本文を取得できる。
 */
const ReminderForm = dynamic(() => import('./ReminderForm'), {
    ssr: false,
    loading: () => (
        <p role="status" aria-live="polite" className="text-sm text-gray-500">
            登録フォームを読み込んでいます…
        </p>
    ),
});

export default function ReminderFormLoader() {
    return <ReminderForm />;
}
