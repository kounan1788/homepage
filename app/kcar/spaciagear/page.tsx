import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { buildCarMetadata, CarJsonLd, type CarSeoInfo } from '@/lib/carSeo';

// 車種のSEO情報（メタデータと構造化データで共通利用）
const car: CarSeoInfo = {
    path: '/kcar/spaciagear',
    name: 'スズキ スペーシアギア',
    brand: 'スズキ',
    image: '/cars/spaciagear.jpg',
};

const description =
    'スペーシアギアに月々29,000円・頭金0円・ボーナス払い0円で乗れる3年カーリース「ノレタ」。車検・オイル交換もコミコミ。金沢市の港南自動車サービス。';

export const metadata: Metadata = buildCarMetadata(
    car,
    description,
    'スペーシアギア 月々29,000円リース｜金沢の港南自動車サービス',
);

export default function Page() {
    return (
        <>
            <CarJsonLd car={car} description={description} />
            <ClientPage />
        </>
    );
}
