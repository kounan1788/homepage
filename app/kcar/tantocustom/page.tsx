import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    title: 'ダイハツ タントカスタム - ノレタ｜港南自動車',
    description: 'ダイハツ タントカスタムのカーリースなら港南自動車。月々定額、頭金なし・ボーナス払いなしで新車に乗れる！金沢市でタントカスタムに乗るならノレタにお任せください。',
};

export default function Page() {
    return <ClientPage />;
}
