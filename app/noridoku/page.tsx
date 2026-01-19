import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'ノリドク - 法人向けカーリース｜港南自動車',
    description: '港南自動車の法人・個人事業主向けカーリース「ノリドク」。金利1.9%〜、違約金ゼロで経営をサポート。金沢市で法人リースをお探しならノリドクへ。',
};

export default function Page() {
    return <ClientPage />;
}
