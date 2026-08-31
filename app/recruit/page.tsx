import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: '採用情報 - 一緒に働く仲間を募集｜港南自動車',
    description: '港南自動車サービスでは自動車整備士を募集中。繁忙期も残業完全ゼロ、年間休日110日。未経験歓迎、資格取得費用は会社が全額負担。創業70年の指定工場で、地域のカーライフを支えませんか？',
};

export default function Page() {
    return <ClientPage />;
}
