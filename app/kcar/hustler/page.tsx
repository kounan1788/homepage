import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'スズキ ハスラー - ノレタ｜港南自動車',
    description: 'スズキ ハスラーのカーリースなら港南自動車。月々定額、頭金なし・ボーナス払いなしで新車に乗れる！金沢市でハスラーに乗るならノレタにお任せください。',
};

export default function Page() {
    return <ClientPage />;
}
