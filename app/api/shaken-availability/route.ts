import { NextResponse } from 'next/server';
import { getAvailability } from '@/lib/shakenCalendar/service';

// リクエストごとに実行する（シートの読み取りは service.ts 側で数分キャッシュしている）
export const dynamic = 'force-dynamic';

/** 車検の受け入れ状況（日付・ステータスのみ。社内メモや認証情報は含めない） */
export async function GET() {
    const body = await getAvailability();
    return NextResponse.json(body, {
        // 取得失敗時は 503 にして監視で気づけるようにする（本文は安全な代替データ）
        status: body.source === 'error' ? 503 : 200,
        headers: { 'Cache-Control': 'no-store' },
    });
}
