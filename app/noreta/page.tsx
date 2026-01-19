import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'ノレタ - 月々定額カーリース｜港南自動車',
    description: '港南自動車の個人向けカーリース「ノレタ」。頭金なし・ボーナス払いなし・車検費用込みで月々定額！金沢市で新車に乗るならノレタにお任せください。',
};

export default function Page() {
    return <ClientPage />;
}
