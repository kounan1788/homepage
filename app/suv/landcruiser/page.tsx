import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'トヨタ ランドクルーザー250 - ノレタ｜港南自動車',
    description: 'トヨタ ランドクルーザー250のカーリースなら港南自動車。月々定額、頭金なし・ボーナス払いなしで新車に乗れる！金沢市でランクルに乗るならノレタにお任せください。',
};

export default function Page() {
    return <ClientPage />;
}
