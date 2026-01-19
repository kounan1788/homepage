import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: '車検 - 最短90分スピード車検｜港南自動車',
    description: '石川県金沢市の港南自動車サービスで車検を。創業60年以上の実績、最短90分のスピード車検。軽自動車65,090円〜。完全予約制・1日限定3台の丁寧なサービス。',
};

export default function Page() {
    return <ClientPage />;
}
