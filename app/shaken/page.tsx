import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    // 共通テンプレートを付けない完全なtitle（料金とスピードを先頭で訴求）
    title: { absolute: '金沢市の車検 65,040円〜｜最短90分・港南自動車サービス' },
    description:
        '金沢市の車検が法定費用込み65,040円〜。新車購入後の初回車検限定・最短90分の立会い車検、完全予約制・1日3台。国家資格整備士が丁寧に対応。電話・LINEで予約できます。',
};

export default function Page() {
    return <ClientPage />;
}
