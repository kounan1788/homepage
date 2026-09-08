/**
 * ヘッダー・モバイルメニュー共通のナビゲーション項目。
 * 各ページで別々に持つと追加したページへの導線が抜けるため、ここに一本化しています。
 *
 * href はトップページ以外からも辿れるよう、すべて絶対パスで書くこと。
 */
export const navItems: { name: string; href: string }[] = [
    { name: '車検', href: '/shaken' },
    { name: '新車販売', href: '/shinsha' },
    { name: 'カーローン', href: '/carloan' },
    { name: '会社情報', href: '/#company' },
    { name: '採用情報', href: '/recruit' },
    { name: 'お問い合わせ', href: '/#contact' },
];
