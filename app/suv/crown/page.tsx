import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'トヨタ クラウン クロスオーバー - ノレタ｜港南自動車',
    description: 'トヨタ クラウン クロスオーバーのカーリースなら港南自動車。月々定額、頭金なし・ボーナス払いなしで新車に乗れる！金沢市でクラウンに乗るならノレタにお任せください。',
};

export default function Page() {
    return <ClientPage />;
}
