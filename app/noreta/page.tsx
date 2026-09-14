import ClientPage from './ClientPage';

// metadata は layout.tsx に一本化している。
// page.tsx 側にも title を書くと layout の title を上書きし、さらに共通テンプレートが付いて
// 「…｜港南自動車 | 港南自動車サービス - 金沢市」と社名が二重になっていたため
export default function Page() {
    return <ClientPage />;
}
