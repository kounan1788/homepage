import { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
    // 共通テンプレートを付けない完全なtitle（料金とスピードを先頭で訴求）
    title: { absolute: '金沢市の車検 65,040円〜｜料金・流れ｜港南自動車サービス' },
    description:
        '金沢市の車検が法定費用込み65,040円〜。車種クラス別の料金表、車検の流れと所要時間、金沢市で選ばれる理由をまとめました。運輸局指定工場・代車無料・完全予約制。野々市市・白山市など近隣市にも対応。電話・LINEで予約できます。',
};

export default function Page() {
    return <ClientPage />;
}
