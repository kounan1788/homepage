import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: '三菱 デリカミニ - ノレタ｜港南自動車',
    description: '三菱 デリカミニのカーリースなら港南自動車。月々定額、頭金なし・ボーナス払いなしで新車に乗れる！金沢市でデリカミニに乗るならノレタにお任せください。',
};

export default function Page() {
    return <ClientPage />;
}