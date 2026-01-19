import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: '採用情報 - 一緒に働く仲間を募集｜港南自動車',
    description: '港南自動車サービスでは自動車整備士・事務スタッフを募集中。未経験歓迎、資格取得支援あり。創業60年以上の安定企業で、地域のカーライフを支えませんか？',
};

export default function Page() {
    return <ClientPage />;
}
