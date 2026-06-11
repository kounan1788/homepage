import { Metadata } from 'next';
import ClientPage from './ClientPage';
import { buildCarMetadata, CarJsonLd, type CarSeoInfo } from '@/lib/carSeo';

// 車種のSEO情報（メタデータと構造化データで共通利用）
const car: CarSeoInfo = {
    path: '/suv/vezel',
    name: 'ホンダ VEZEL（ヴェゼル）',
    brand: 'ホンダ',
    image: '/cars/vezel.jpg',
};

const description =
    'ホンダ VEZELのカーリースなら港南自動車。月々定額、頭金なし・ボーナス払いなしで新車に乗れる！金沢市でヴェゼルに乗るならノレタにお任せください。';

export const metadata: Metadata = buildCarMetadata(car, description);

export default function Page() {
    return (
        <>
            <CarJsonLd car={car} description={description} />
            <ClientPage />
        </>
    );
}
