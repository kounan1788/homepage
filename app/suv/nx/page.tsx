import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'レクサス NX - ノレタ｜港南自動車',
    description: 'レクサス NXのカーリースなら港南自動車。月々定額、頭金なし・ボーナス払いなしで新車に乗れる！金沢市でNXに乗るならノレタにお任せください。',
};

export default function Page() {
    return <ClientPage />;
}