import type { Config } from 'tailwindcss';

/**
 * 港南自動車サービス デザイントークン
 *
 * 配色はロゴ（/public/logo.png）から採取した実ブランド色を基準にしている。
 *   ティール #15777E ／ 朱 #CF1F27
 * teal / gray / slate / red / blue の各スケールをブランド値で上書きすることで、
 * 既存ページのクラス名を書き換えずに全体の色調を統一している。
 */
const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1.25rem',
                md: '2rem',
                lg: '2.5rem',
            },
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1200px',
                '2xl': '1200px',
            },
        },
        extend: {
            fontFamily: {
                // 本文・見出し：Zen Kaku Gothic New（看板の角ゴシックに連なる書体）
                sans: [
                    '"Zen Kaku Gothic New"',
                    '"Hiragino Kaku Gothic ProN"',
                    '"Hiragino Sans"',
                    '"Yu Gothic Medium"',
                    'Meiryo',
                    'system-ui',
                    'sans-serif',
                ],
                // 見出し：Zen Maru Gothic（ロゴ「KOUNAN」の角の丸い字形に由来する丸ゴシック）
                display: [
                    '"Zen Maru Gothic"',
                    '"Hiragino Maru Gothic ProN"',
                    '"Zen Kaku Gothic New"',
                    '"Hiragino Kaku Gothic ProN"',
                    'system-ui',
                    'sans-serif',
                ],
                // 数値・ラベル：IBM Plex Mono（点検記録・計測伝票の質感）
                mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            // 角のとれたやわらかい輪郭に。小さなラベル類は完全な丸（ピル）にする
            borderRadius: {
                none: '0px',
                sm: '6px',
                DEFAULT: '10px',
                md: '10px',
                lg: '14px',
                xl: '16px',
                '2xl': '20px',
                '3xl': '28px',
                full: '9999px',
            },
            // やわらかく拡散する影。輪郭を締めるのではなく、ふわりと浮かせる
            boxShadow: {
                sm: '0 1px 2px rgb(16 22 21 / 0.05)',
                DEFAULT: '0 2px 6px rgb(16 22 21 / 0.06)',
                md: '0 2px 4px rgb(16 22 21 / 0.05), 0 6px 14px rgb(16 22 21 / 0.06)',
                lg: '0 4px 10px rgb(16 22 21 / 0.06), 0 12px 28px rgb(16 22 21 / 0.07)',
                xl: '0 6px 14px rgb(16 22 21 / 0.07), 0 20px 44px rgb(16 22 21 / 0.08)',
                '2xl': '0 10px 24px rgb(16 22 21 / 0.08), 0 30px 60px rgb(16 22 21 / 0.09)',
                inner: 'inset 0 1px 2px rgb(16 22 21 / 0.06)',
                none: 'none',
            },
            colors: {
                // ── ブランド ─────────────────────────────
                // ロゴのティール。teal-700 を主要色として使う
                teal: {
                    50: '#EEF6F6',
                    100: '#D6E9E9',
                    200: '#AED4D5',
                    300: '#7FB9BC',
                    400: '#4A9AA0',
                    500: '#1E828A',
                    600: '#17757C',
                    700: '#0E6469',
                    800: '#0B5054',
                    900: '#0A4044',
                    950: '#062A2D',
                },
                // 店舗看板のミント。ロゴのティール(#15777E)と同系で明度を上げた色。
                // 面のほんのりした色づけ・チップ・アイコンなど、やわらかい用途に使う
                mint: {
                    50: '#F0F9F7',
                    100: '#E0F2EE',
                    200: '#C2E5DE',
                    300: '#9BD4C9',
                    400: '#59B1A5',
                    500: '#3E9A8E',
                    600: '#2F8378',
                },
                // ロゴの朱。定休日・必須・注意の3用途に限定して使う
                red: {
                    50: '#FDF2F2',
                    100: '#FBE0E1',
                    200: '#F6C2C4',
                    300: '#EE9497',
                    400: '#E15F64',
                    500: '#D3323A',
                    600: '#C0202A',
                    700: '#A0171F',
                    800: '#83161C',
                    900: '#6D171C',
                    950: '#3C0709',
                },
                // ノリドク（法人リース）用の紺
                blue: {
                    50: '#EFF4FA',
                    100: '#DBE7F5',
                    200: '#BACFEA',
                    300: '#8CADD9',
                    400: '#5484C1',
                    500: '#2F63A8',
                    600: '#1E4E8C',
                    700: '#163C6B',
                    800: '#123055',
                    900: '#102741',
                    950: '#0A1929',
                },
                // ── 無彩色 ───────────────────────────────
                // gray と slate は同一ランプに統一（わずかに青緑を含む石色）
                gray: {
                    50: '#F6F8F7',
                    100: '#EDF1F0',
                    200: '#DDE3E2',
                    300: '#C6CFCD',
                    400: '#97A3A1',
                    500: '#667370',
                    600: '#5A6664',
                    700: '#414B49',
                    800: '#2C3534',
                    900: '#1B2322',
                    950: '#101615',
                },
                slate: {
                    50: '#F6F8F7',
                    100: '#EDF1F0',
                    200: '#DDE3E2',
                    300: '#C6CFCD',
                    400: '#97A3A1',
                    500: '#667370',
                    600: '#5A6664',
                    700: '#414B49',
                    800: '#2C3534',
                    900: '#1B2322',
                    950: '#101615',
                },
                // ── 意味づけした別名（新規コード用） ────────
                ink: '#1B2322',
                paper: '#F6F8F7',
                rule: '#DDE3E2',
                'rule-strong': '#C6CFCD',
                brand: {
                    DEFAULT: '#0E6469',
                    deep: '#0A4044',
                    light: '#1E828A',
                },
                vermilion: '#C0202A',
                // ── shadcn 互換 ─────────────────────────
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
            },
            // transition-all（全プロパティ）は避け、実際に変化するものだけを列挙する
            transitionProperty: {
                ui: 'color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, padding, height',
            },
            letterSpacing: {
                // 和文見出しは詰めるより開いたほうが誠実に見える
                tightja: '0.01em',
                ja: '0.03em',
                label: '0.18em',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
export default config;
