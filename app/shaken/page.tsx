import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: '車検 - 最短90分スピード車検｜港南自動車',
    description: '石川県金沢市の港南自動車サービスで車検を。創業70年の実績、新車購入後の初回車検の方限定・最短90分の立会い車検。軽自動車65,040円〜。完全予約制・1日限定3台の丁寧なサービス。',
};

export default function Page() {
    return <ClientPage />;
}
