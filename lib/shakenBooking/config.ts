/**
 * 車検のLINE予約の設定。
 */

/**
 * 予約フォームを公開するかどうか。false の間は、カレンダーの「LINEで予約する」は今まで通り友だち追加リンクへ飛ぶ。
 * 公開するときは Vercel の環境変数 NEXT_PUBLIC_SHAKEN_BOOKING_ENABLED に true を設定して再デプロイする。
 * （NEXT_PUBLIC_ の値はビルド時に画面側へ埋め込まれるため、変更後は再デプロイが必要）
 */
export const SHAKEN_BOOKING_PUBLISHED = process.env.NEXT_PUBLIC_SHAKEN_BOOKING_ENABLED === 'true';

/** 項目ごとの最大文字数。長文で申込文やシートが崩れないようにする */
export const BOOKING_LIMITS = {
    displayName: 100,
    carModel: 50,
    note: 200,
} as const;
