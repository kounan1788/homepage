/**
 * チャットボット（components/ServiceChat.tsx）の会話シナリオ。
 *
 * 自由入力は受け付けず、選択肢をたどる形にしている。
 * 料金や制度の文面を取り違えると金額の話なので信用に直結するため、
 * 回答は lib/serviceFaq.ts の文面をキーで引いて使い、ここに書き写さない。
 *
 * ノードを追加・変更したら、すべての next の行き先が存在することを確認すること
 * （行き先が無いノードは選んでも最初に戻ってしまう）。
 */

import { carloanFaq, noretaFaq, noridokuFaq, shakenFaq, shinshaFaq, topFaq } from './serviceFaq';
import { carBasePrices } from './carPrices';
import { sortedCarLineup } from './carLineup';
import { pricingData } from './shakenPrices';

/** 電話番号。ヘッダー・MobileActionBar と同じ番号 */
export const TEL = '076-268-1788';

/** LINE の友だち追加リンク。MobileActionBar と同じURL */
export const LINE_URL = 'https://lin.ee/CKQM0mE';

/** Googleマップ上の店舗。app/layout.tsx の hasMap と同じ場所を指す */
export const MAP_URL = 'https://www.google.com/maps?cid=707585838331583289';

export type ChatAction =
    /** 次のノードへ進む。fact は選択肢の右端に等幅で添える事実（料金・対応範囲） */
    | { kind: 'next'; label: string; to: string; fact?: string }
    /** サイト内のページ、または外部ページへ移動する */
    | { kind: 'link'; label: string; href: string }
    /** トップページの問い合わせフォームへ、ジャンルと相談内容を入れた状態で移動する */
    | { kind: 'form'; label: string; category: string; lines: string[] }
    /** 電話をかける */
    | { kind: 'tel'; label: string }
    /** LINE を開く */
    | { kind: 'line'; label: string };

export interface ChatNode {
    /**
     * 受付票の欄名。この質問に答えると「欄名｜選んだ答え」の1行として控えに残る。
     * 答えを返すだけのノードでは省略してよい（既定の欄名を使う）
     */
    field?: string;
    /** ボットの発言。1要素が1つの段落になる */
    says: string[];
    /** 選択肢。上から順に並ぶ */
    actions: ChatAction[];
}

/**
 * フォームへの引き継ぎ。
 * category は app/actions/sendEmail.ts の ALLOWED_CATEGORIES と完全に一致させること。
 * context は「どの話の続きか」を担当者が読めるようにする1行。
 */
const toForm = (category: string, context: string, label = 'フォームで相談する'): ChatAction => ({
    kind: 'form',
    label,
    category,
    lines: [`チャットでのご相談: ${context}`],
});

/** 軽自動車の車検総額。車検ページの見積りと同じ数字を出す */
const SHAKEN_FROM = `${pricingData.light.total.toLocaleString()}円〜`;

/** ノレタの最安月額（軽自動車）。車種データから出すので改定しても食い違わない */
const NORETA_FROM = `月々${carBasePrices[sortedCarLineup.KCAR[0].route].toLocaleString()}円〜`;

const CALL: ChatAction = { kind: 'tel', label: '電話で聞く' };
const LINE: ChatAction = { kind: 'line', label: 'LINEで送る' };

export const chatNodes: Record<string, ChatNode> = {
    root: {
        field: 'ご用件',
        says: ['金沢市の港南自動車サービスです。承るご用件をお選びください。'],
        actions: [
            { kind: 'next', label: '車検・点検', to: 'shaken', fact: SHAKEN_FROM },
            { kind: 'next', label: '整備・修理・板金', to: 'seibi', fact: '全車種対応' },
            { kind: 'next', label: '新車・中古車を買いたい', to: 'kuruma', fact: '全メーカー' },
            { kind: 'next', label: 'ノレタ（カーローン）', to: 'noreta', fact: NORETA_FROM },
            { kind: 'next', label: 'ノリドク（法人リース）', to: 'noridoku', fact: '法人・個人事業主' },
            { kind: 'next', label: '自動車保険', to: 'hoken' },
            { kind: 'next', label: '採用・求人', to: 'recruit' },
            { kind: 'next', label: '場所・営業時間', to: 'access', fact: '金石本町' },
            // 当てはまるものが無い方の逃げ道。選択肢をたどらずフォームへ直行させる
            toForm('その他', 'そのほかのご相談', 'そのほかのご相談'),
        ],
    },

    // ── 車検・点検 ──
    shaken: {
        field: 'お聞きになりたいこと',
        says: ['車検・点検についてお答えします。', '知りたいことをお選びください。'],
        actions: [
            { kind: 'next', label: '費用の目安', to: 'shaken-cost' },
            { kind: 'next', label: 'かかる時間', to: 'shaken-duration' },
            { kind: 'next', label: 'いつから受けられるか', to: 'shaken-timing' },
            { kind: 'next', label: '代車のこと', to: 'shaken-loaner' },
            { kind: 'next', label: '立会い車検とは', to: 'shaken-witness' },
            { kind: 'next', label: '予約したい', to: 'shaken-reserve' },
            { kind: 'next', label: 'そのほかの確認', to: 'shaken-other' },
        ],
    },
    'shaken-cost': {
        says: [
            shakenFaq.cost.answer,
            '車検ページでは、お車の区分と使う割引を選ぶと総額の概算がその場で出ます。',
        ],
        actions: [
            { kind: 'link', label: '車検ページで概算を出す', href: '/shaken' },
            toForm('車検', '車検の費用について'),
            CALL,
        ],
    },
    'shaken-duration': {
        says: [shakenFaq.duration.answer],
        actions: [
            { kind: 'next', label: '予約したい', to: 'shaken-reserve' },
            { kind: 'link', label: '車検ページを見る', href: '/shaken' },
            CALL,
        ],
    },
    'shaken-timing': {
        says: [shakenFaq.timing.answer],
        actions: [
            { kind: 'next', label: '予約したい', to: 'shaken-reserve' },
            toForm('車検', '車検を受ける時期について'),
            CALL,
        ],
    },
    'shaken-loaner': {
        says: [shakenFaq.loaner.answer],
        actions: [
            { kind: 'next', label: '予約したい', to: 'shaken-reserve' },
            toForm('車検', '代車について'),
            CALL,
        ],
    },
    'shaken-witness': {
        says: [shakenFaq.witness.answer],
        actions: [
            { kind: 'link', label: '車検ページを見る', href: '/shaken' },
            toForm('車検', '立会い車検について'),
            CALL,
        ],
    },
    'shaken-reserve': {
        says: [
            '車検は完全予約制・1日限定3台で承っています。',
            'ご希望の日時とお車がわかればお取りできます。お電話・LINE・フォームのいずれでもどうぞ。',
        ],
        actions: [
            toForm('車検', '車検の予約希望'),
            CALL,
            LINE,
            { kind: 'link', label: '車検ページで概算を出す', href: '/shaken' },
        ],
    },
    'shaken-other': {
        field: '確認したいこと',
        says: ['どちらについてお答えしましょうか。'],
        actions: [
            { kind: 'next', label: '輸入車・4WD・ディーゼル', to: 'shaken-imported' },
            { kind: 'next', label: 'OBD車検とは', to: 'shaken-obd' },
            { kind: 'next', label: '支払い方法', to: 'shaken-payment' },
            { kind: 'next', label: '法定点検をお願いしたい', to: 'shaken-tenken' },
        ],
    },
    'shaken-imported': {
        says: [shakenFaq.imported.answer],
        actions: [toForm('車検', '輸入車・4WD・ディーゼル車の車検'), CALL],
    },
    'shaken-obd': {
        says: [shakenFaq.obd.answer],
        actions: [{ kind: 'link', label: '車検ページを見る', href: '/shaken' }, CALL],
    },
    'shaken-payment': {
        says: [shakenFaq.payment.answer],
        actions: [toForm('車検', '車検費用のお支払い方法'), CALL],
    },
    'shaken-tenken': {
        says: [
            '法定点検も承っています。当社は金沢市金石本町の運輸局指定工場（民間車検場）です。',
            'お車とご希望の時期をうかがってご案内します。',
        ],
        actions: [toForm('点検', '法定点検の相談'), CALL, LINE],
    },

    // ── 整備・修理・板金 ──
    seibi: {
        field: 'お車の状態',
        says: ['お車の状態を教えてください。'],
        actions: [
            { kind: 'next', label: '動かない・事故にあった', to: 'seibi-breakdown' },
            { kind: 'next', label: '異音・警告灯・調子が悪い', to: 'seibi-warning' },
            { kind: 'next', label: 'ぶつけた・傷やへこみ', to: 'seibi-body' },
            { kind: 'next', label: 'オイル交換などの消耗品', to: 'seibi-consumable' },
        ],
    },
    'seibi-breakdown': {
        says: [topFaq.trouble.answer, 'お急ぎのご用件は、お電話がいちばん早く届きます。'],
        actions: [CALL, toForm('整備・修理', '故障・事故のご相談')],
    },
    'seibi-warning': {
        says: [
            'メーカー・車種を問わず対応します。診断機と整備士の目の両方で不具合の原因を確かめ、必要な作業だけをお見積りします。',
            'いつ・どんなときに起きるかを教えていただけると、確認が早くなります。',
        ],
        actions: [toForm('整備・修理', '異音・警告灯・不調のご相談'), CALL, LINE],
    },
    'seibi-body': {
        says: [
            '板金修理も承ります。',
            '傷やへこみは程度によって費用が大きく変わるため、お車を見せていただくか、LINEでお写真をお送りいただくのが確実です。',
        ],
        actions: [LINE, toForm('板金修理', '傷・へこみの修理のご相談'), CALL],
    },
    'seibi-consumable': {
        says: [
            'オイル交換などの消耗品の交換も承っています。',
            'ご希望の内容とお車をうかがってご案内します。',
        ],
        actions: [toForm('整備・修理', '消耗品の交換のご相談'), CALL, LINE],
    },

    // ── 新車・中古車 ──
    kuruma: {
        field: 'ご検討の内容',
        says: ['お車のご購入についてお答えします。'],
        actions: [
            { kind: 'next', label: '新車を買いたい', to: 'kuruma-new' },
            { kind: 'next', label: '中古車を探したい', to: 'kuruma-used' },
            { kind: 'next', label: '今の車を下取りに出したい', to: 'kuruma-tradein' },
            { kind: 'next', label: '扱っているメーカー', to: 'kuruma-makers' },
            { kind: 'next', label: '納車までの期間', to: 'kuruma-delivery' },
            { kind: 'next', label: '月々の支払いで買いたい', to: 'noreta' },
        ],
    },
    'kuruma-new': {
        says: [shinshaFaq.recommend.answer],
        actions: [
            { kind: 'link', label: '取扱車種と買い方を見る', href: '/shinsha' },
            toForm('新車販売', '新車の購入相談'),
            CALL,
        ],
    },
    'kuruma-used': {
        says: [
            '中古車もお探しします。状態を確認したお車のみをご案内しています。',
            'ご予算と、お使いになる場面（通勤・送り迎え・雪道など）を教えてください。',
        ],
        actions: [toForm('中古車販売', '中古車を探したい'), CALL, LINE],
    },
    'kuruma-tradein': {
        says: [shinshaFaq.tradeIn.answer],
        actions: [
            toForm('新車販売', '下取り査定の相談'),
            { kind: 'link', label: '新車販売のページを見る', href: '/shinsha' },
            CALL,
        ],
    },
    'kuruma-makers': {
        says: [shinshaFaq.makers.answer],
        actions: [
            { kind: 'link', label: '取扱車種を見る', href: '/shinsha' },
            toForm('新車販売', '取扱車種について'),
        ],
    },
    'kuruma-delivery': {
        says: [shinshaFaq.delivery.answer],
        actions: [toForm('新車販売', '納期の確認'), CALL],
    },

    // ── ノレタ（カーローン） ──
    noreta: {
        field: 'お聞きになりたいこと',
        says: [topFaq.noreta.answer, '知りたいことをお選びください。'],
        actions: [
            { kind: 'next', label: '月々いくらから？', to: 'noreta-monthly' },
            { kind: 'next', label: '金利と支払回数', to: 'noreta-rate' },
            { kind: 'next', label: '3年後はどうなる？', to: 'noreta-after3' },
            { kind: 'next', label: '何が含まれる？', to: 'noreta-included' },
            { kind: 'next', label: '審査のこと', to: 'noreta-screening' },
            { kind: 'next', label: 'リースとの違い', to: 'noreta-vs-lease' },
        ],
    },
    'noreta-monthly': {
        says: [noretaFaq.monthly.answer],
        actions: [
            { kind: 'link', label: '車種ごとの月額を見る', href: '/noreta' },
            toForm('ノレタ', '月々の支払いについて'),
            CALL,
        ],
    },
    'noreta-rate': {
        says: [carloanFaq.rate.answer, carloanFaq.downPayment.answer],
        actions: [
            { kind: 'link', label: '金利と返済額の表を見る', href: '/carloan' },
            toForm('ローン仮審査', '金利・支払回数について'),
            CALL,
        ],
    },
    'noreta-after3': {
        says: [noretaFaq.afterThreeYears.answer],
        actions: [
            { kind: 'link', label: 'ノレタのページを見る', href: '/noreta' },
            toForm('ノレタ', '3年後の選択肢について'),
        ],
    },
    'noreta-included': {
        says: [noretaFaq.maintenance.answer, carloanFaq.prepayment.answer],
        actions: [
            { kind: 'link', label: 'ノレタのページを見る', href: '/noreta' },
            toForm('ノレタ', '含まれる費用について'),
            CALL,
        ],
    },
    'noreta-screening': {
        says: [carloanFaq.documents.answer],
        actions: [
            toForm('ローン仮審査', '仮審査を申し込みたい'),
            { kind: 'link', label: '審査の流れを見る', href: '/carloan' },
            CALL,
        ],
    },
    'noreta-vs-lease': {
        says: [carloanFaq.loanVsLease.answer],
        actions: [
            { kind: 'next', label: '法人リースを詳しく', to: 'noridoku' },
            toForm('ローン・リース全般', 'ローンとリースの比較'),
            CALL,
        ],
    },

    // ── ノリドク（法人リース） ──
    noridoku: {
        field: 'お聞きになりたいこと',
        says: ['法人・個人事業主向けカーリース「ノリドク」についてお答えします。'],
        actions: [
            { kind: 'next', label: '法人リースの利点', to: 'noridoku-merit' },
            { kind: 'next', label: 'リース料率はどれくらい？', to: 'noridoku-rate' },
            { kind: 'next', label: '途中解約はできる？', to: 'noridoku-cancel' },
            { kind: 'next', label: '使える車種', to: 'noridoku-vehicles' },
            { kind: 'next', label: '見積りが欲しい', to: 'noridoku-quote' },
        ],
    },
    'noridoku-merit': {
        says: [noridokuFaq.merit.answer],
        actions: [
            { kind: 'link', label: 'ノリドクのページを見る', href: '/noridoku' },
            toForm('ノリドク（法人向けリース）', '法人リースの利点について'),
        ],
    },
    'noridoku-rate': {
        says: [noridokuFaq.rate.answer],
        actions: [
            { kind: 'link', label: 'ノリドクのページを見る', href: '/noridoku' },
            toForm('ノリドク（法人向けリース）', 'リース料率について'),
            CALL,
        ],
    },
    'noridoku-cancel': {
        says: [noridokuFaq.cancel.answer],
        actions: [toForm('ノリドク（法人向けリース）', '中途解約について'), CALL],
    },
    'noridoku-vehicles': {
        says: [noridokuFaq.vehicles.answer],
        actions: [
            { kind: 'link', label: 'ノリドクのページを見る', href: '/noridoku' },
            toForm('ノリドク（法人向けリース）', '対応車種について'),
        ],
    },
    'noridoku-quote': {
        says: [
            '御社名・ご希望の車種・台数・ご希望のリース期間をうかがってお見積りします。',
            'フォームなら、会社情報もあわせてお送りいただけます。',
        ],
        actions: [
            toForm('ノリドク（法人向けリース）', 'リースの見積り希望'),
            CALL,
            { kind: 'link', label: '減価償却の試算を見る', href: '/noridoku' },
        ],
    },

    // ── 自動車保険 ──
    hoken: {
        says: [
            'お車のご購入や車検とあわせて、自動車保険のご相談も承っています。',
            '現在のご契約内容がわかるものをお手元にご用意いただくと、比較が早くなります。',
        ],
        actions: [toForm('自動車保険', '自動車保険の相談'), CALL, LINE],
    },

    // ── 採用 ──
    recruit: {
        says: [
            '採用情報は求人ページに掲載しています。',
            '職種・待遇・休日はページでご確認いただけます。ご質問やご応募はフォームからどうぞ。',
        ],
        actions: [
            { kind: 'link', label: '求人ページを見る', href: '/recruit' },
            toForm('採用・応募', '採用についての問い合わせ'),
            CALL,
        ],
    },

    // ── 場所・営業時間 ──
    access: {
        says: [
            topFaq.hours.answer,
            `所在地は石川県金沢市金石本町ハ14です。お電話は${TEL}で承ります。`,
        ],
        actions: [
            { kind: 'link', label: 'Googleマップで開く', href: MAP_URL },
            { kind: 'link', label: '営業カレンダーを見る', href: '/#company' },
            CALL,
        ],
    },
};
