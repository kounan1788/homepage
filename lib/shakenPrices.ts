/**
 * 車検の料金データを一元管理するファイル。
 *
 * 車検ページの見積りツールと、チャットボットの選択肢（lib/chatFlow.ts）の両方が読む。
 * 料金改定のときに片方だけ古くなるのを防ぐため、金額はこのファイルだけを編集すること。
 */

// 車種タイプの定義
export type CarType = 'light' | 'small' | 'medium' | 'regular';

// 料金データの定義
export const pricingData = {
    light: {
        name: '軽自動車',
        weight: '全般',
        basePrice: 15290,
        treatment: 3630,
        cleaning: 3300,
        agency: 8580,
        inspection: 8250,
        statutoryFees: 27110,
        total: 66160,
        image: '/cars/delicamini.jpg',
        description: 'ハスラー、タント、N-BOXなど'
    },
    small: {
        name: '小型乗用車',
        weight: '1.0t以下',
        basePrice: 17490,
        treatment: 4290,
        cleaning: 4180,
        agency: 8580,
        inspection: 8800,
        statutoryFees: 36810,
        total: 80150,
        image: '/cars/xbee.jpg',
        description: 'ヴィッツ、フィット、パッソなど'
    },
    medium: {
        name: '中型乗用車',
        weight: '1.5t以下',
        basePrice: 18590,
        treatment: 4290,
        cleaning: 4180,
        agency: 8580,
        inspection: 8800,
        statutoryFees: 45010,
        total: 89450,
        image: '/cars/harrier.jpg',
        description: 'カローラ、プリウス、アクセラなど'
    },
    regular: {
        name: '普通乗用車',
        weight: '2.0t以下',
        basePrice: 21890,
        treatment: 4290,
        cleaning: 4180,
        agency: 8580,
        inspection: 8800,
        statutoryFees: 53210,
        total: 100950,
        image: '/cars/alphard.jpg',
        description: 'クラウン、アルファード、エルグランドなど'
    }
};
