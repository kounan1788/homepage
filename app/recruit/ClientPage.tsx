'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buildContactUrl } from '@/lib/contactHandoff';

// ============================================
// 求人ごとの公開フラグ
// 各求人の published を個別に切り替えて公開を制御する
//   published: true  → その求人を公開（一覧に表示）
//   published: false → その求人を非公開（一覧に表示しない）
// 例）整備士だけ公開したい場合は mechanic を true、office を false にする
// 両方 false の場合はページ全体が「準備中」表示になる
// ============================================

// 求人情報のデータ
const jobListings = [
    {
        id: 'mechanic',
        published: true, // 整備士の公開フラグ
        title: 'ピットエンジニア-自動車整備士-',
        subtitle: '未経験スタート多数・資格取得は会社が全力サポート',
        highlight: '積極採用中',
        description: '「クルマが好き」──その気持ちさえあれば大丈夫。お客様の大切なお車の車検・点検・整備をお任せします。最初はできることから、経験豊富な先輩が一つひとつ丁寧に教えるので、未経験からでも着実にプロの整備士へ成長できます。国の指定工場としてリフト4基・検査ラインを備え、スキャンツールも完備。HV・EVまで扱えるので、これからの時代に通用する技術が身につきます。そして残業は完全ゼロ。繁忙期であっても、平日は18時・土曜は17時にきちんと帰れます。腰を据えて長く技術を磨ける環境です。',
        requirements: [
            '普通自動車運転免許（AT限定可）',
            '整備士資格不問（入社後の資格取得を支援）',
            '学歴不問・未経験者歓迎',
            '10代〜50代まで幅広く採用いたします！',
        ],
        salary: {
            amount: '¥195,000',
            per: '／月〜',
            details: '※経験・能力を考慮の上、決定いたします',
            bonus: '賞与年2回',
            raise: '昇給年1回',
        },
        benefits: [
            '社会保険完備（雇用・労災・健康・厚生年金）',
            '資格取得支援制度（費用会社負担）',
            '資格手当あり（2級：5,000円/月、検査員：5,000円/月）',
            '通勤手当支給',
            '制服貸与',
            'マイカー通勤OK（無料駐車場完備）',
            '社員割引制度あり',
        ],
        workStyle: {
            holidays: '日曜・祝日、第1・第2・第4土曜日(繁忙期により変動あり)',
            vacation: '年次有給休暇（確実に取得できます）、夏季・年末年始休暇、慶弔休暇',
        },
    },
    {
        id: 'office',
        published: false, // 事務・受付スタッフの公開フラグ
        title: '事務・受付スタッフ',
        subtitle: '未経験・ブランクOK／人と接するのが好きな方歓迎',
        highlight: '募集中',
        description: 'ご来店されたお客様の受付・電話応対、見積書や請求書の作成、データ入力など、店舗を支える事務業務全般をお任せします。特別なスキルは必要ありません。大切なのは、明るい笑顔と「人と接するのが好き」という気持ち。分からないことはすぐに聞けるアットホームな職場なので、未経験の方もブランクのある方も安心してスタートできます。',
        requirements: [
            '高卒以上',
            '基本的なPC操作ができる方（Word・Excel）',
            '普通自動車運転免許（あれば尚可）',
            '未経験者歓迎・ブランクOK',
        ],
        salary: {
            amount: '¥170,000',
            per: '／月〜',
            details: '※経験・能力を考慮の上、決定いたします',
            bonus: '賞与年2回（実績による）',
            raise: '昇給年1回',
        },
        benefits: [
            '社会保険完備（雇用・労災・健康・厚生年金）',
            '通勤手当支給',
            '制服貸与',
            'マイカー通勤OK（無料駐車場完備）',
            '社員割引制度あり',
        ],
        workStyle: {
            holidays: '日曜・祝日、第1・第2・第4土曜日',
            vacation: '有給休暇（確実に取得できます）、夏季・年末年始休暇、慶弔休暇',
        },
    },
];

// 役員メッセージの本文を構成するブロック
//   p     … 通常の段落
//   quote … 強調して見せたい一文（読み飛ばす人にも目に留まるように大きく表示）
//   list  … 短い文を並べた箇条書き
type MessageBlock =
    | { type: 'p'; text: string }
    | { type: 'quote'; text: string }
    | { type: 'list'; items: string[] };

// 役員メッセージ（ページ冒頭に表示）
// 顔写真は public/images/recruit-message.jpg に配置する
const executiveMessage = {
    photo: '/images/recruit-message.jpg',
    name: '藤田 大貴',
    position: '取締役',
    // 写真の横に大きく置くリード文
    lead: '働く人が笑顔だからこそ、お客様も笑顔にできる会社でありたい。',
    // 章ごとに区切って表示する。heading が空の章は見出しなしで本文から始まる
    chapters: [
        {
            heading: '',
            blocks: [
                { type: 'p', text: '私は、従業員とお客様、その両方を笑顔にできる会社をつくりたいと思っています。' },
                { type: 'p', text: 'お客様に喜んでいただくことは、もちろん私たちにとって一番大切なことです。でも、そのために働いている人が疲れ切っていたり、家族との時間を犠牲にしていたり、仕事を楽しめなくなってしまっていたら、私はそれを本当に良い会社だとは思いません。' },
                { type: 'p', text: 'だから港南自動車では、' },
                { type: 'quote', text: '「定時に帰れる整備士」を、当たり前にしたい。' },
                { type: 'p', text: 'そう本気で考えています。' },
                { type: 'p', text: 'この業界を知っている方ほど、「自動車整備の仕事で残業がないなんて本当？」と思われるかもしれません。' },
                {
                    type: 'list',
                    items: [
                        '繁忙期になれば夜遅くまで仕事をする。',
                        '休みの日でも仕事のことを考える。',
                        '整備士ならそれくらい当たり前。',
                    ],
                },
                { type: 'p', text: '私自身も、そういう話をたくさん聞いてきました。でも、港南自動車ではそれを「当たり前」にしたくありません。' },
                { type: 'p', text: '繁忙期であっても、絶対に残業はありません。平日は18時、土曜日は17時に仕事を終えて帰ります。' },
                { type: 'p', text: 'これは単なる努力目標ではありません。会社として「時間になったら帰る」と決め、そのために仕事の量や予約、段取りを考える。それも経営の仕事だと思っています。' },
                { type: 'p', text: '年間休日は110日。有給休暇もしっかり取ってもらいたいと考えています。' },
                { type: 'p', text: 'なぜ、そこまで働く環境を大切にするのか。理由はとてもシンプルです。働く人自身の生活が充実していなければ、お客様を心から笑顔にする仕事はできないと思っているからです。' },
                {
                    type: 'list',
                    items: [
                        '家族と過ごす時間。',
                        '友人と遊ぶ時間。',
                        '趣味を楽しむ時間。',
                        '自分自身を成長させる時間。',
                    ],
                },
                { type: 'p', text: 'そうした時間があるからこそ、仕事にも前向きに向き合える。そして心に余裕があるからこそ、お客様の話を丁寧に聞いたり、安全に関わる整備にしっかり向き合ったりできる。' },
                { type: 'p', text: 'だから私は、社員の働きやすさと、お客様へのサービスは別々のものではないと思っています。社員を大切にすることが、結果としてお客様を大切にすることにつながる。そんな会社をつくっていきたいです。' },
            ] as MessageBlock[],
        },
        {
            heading: '70年続いてきた会社だからこそ、これからは新しいことにも挑戦したい。',
            blocks: [
                { type: 'p', text: '港南自動車サービスは、1956年の創業から約70年、この金石の地で車検・整備・車両販売を続けてきました。長く続いてきた会社だからこそ、大切にしなければならないものがあります。' },
                { type: 'p', text: '一方で、私は「昔からこうだから」という理由だけで、すべてをそのまま続ける必要はないとも思っています。' },
                { type: 'p', text: '私自身、現在32歳です。自動車業界の会社経営者としては、比較的若い世代だと思います。だからこそ、' },
                {
                    type: 'list',
                    items: [
                        '「こんなことをやってみたい」',
                        '「もっとこうした方が働きやすい」',
                        '「こんなサービスがあったらお客様が喜ぶんじゃないか」',
                        '「こういう工具や仕組みを導入したい」',
                    ],
                },
                { type: 'p', text: 'そんな社員からのアイデアを、できる限り形にしていきたいと思っています。' },
                { type: 'p', text: '年齢や社歴、役職は関係ありません。入社したばかりの人から出たアイデアであっても、良いと思えばやってみる。失敗したとしても、「じゃあ次はどうする？」と一緒に考えられる会社でありたい。' },
                { type: 'quote', text: '経営者が全部を決めて社員がそれに従う会社ではなく、働いているみんなで港南自動車をつくっていける会社にしたい。' },
                { type: 'p', text: 'そう思っています。' },
            ] as MessageBlock[],
        },
        {
            heading: '業界未経験でも、女性でも、大歓迎です。',
            blocks: [
                { type: 'p', text: '今回の採用では、自動車業界で長く働いてきた経験者だけを求めているわけではありません。むしろ私たちは、完全な業界未経験の方も、女性の方も、積極的に仲間になってほしいと思っています。' },
                { type: 'p', text: '今まで自動車業界にいなかったからこそ、「なんでこのやり方なんだろう？」と気付けることがあります。これまで男性が多かった職場だからこそ、女性の視点から変えられることもあると思います。' },
                { type: 'p', text: '違う業界で働いていた人だからこそ持っている考え方や経験も、港南自動車にとっては大きな財産です。' },
                { type: 'p', text: '私たちは、「今の自動車業界に合う人」だけを集めたいわけではありません。いろいろな人に入ってきてもらうことで、港南自動車そのものを、もっと新しい会社に変えていきたい。そう考えています。' },
                { type: 'p', text: 'もちろん、未経験であれば最初は分からないことばかりだと思います。' },
                {
                    type: 'list',
                    items: [
                        '工具の名前も分からない。',
                        '車の構造も分からない。',
                        '整備士として働いた経験もない。',
                    ],
                },
                { type: 'p', text: 'それで構いません。先輩が横について、一つずつ仕事を覚えてもらいます。整備士資格の取得についても、費用を含め会社がしっかりサポートします。指定工場として働くための設備も環境も、会社が用意します。' },
                { type: 'quote', text: '最初から完璧な人を探しているわけではありません。' },
            ] as MessageBlock[],
        },
        {
            heading: '私たちが探しているのは、「これから一緒に会社をつくってくれる人」です。',
            blocks: [
                {
                    type: 'list',
                    items: [
                        '「クルマが好き」',
                        '「機械を触ることが好き」',
                        '「手に職をつけたい」',
                        '「地元で長く働きたい」',
                        '「今までとは違う仕事に挑戦してみたい」',
                        '「せっかく働くなら、自分の意見も聞いてくれる会社がいい」',
                    ],
                },
                { type: 'p', text: 'そんな気持ちが少しでもあれば、ぜひ一度、港南自動車に来てみてください。会社の雰囲気を見て、働いているスタッフと話をして、それから考えてもらって構いません。' },
                { type: 'p', text: '私たちも、採用する人と会社がお互いに長く気持ちよく付き合っていけることを何より大切にしています。' },
                { type: 'p', text: '創業70年。これまで港南自動車を支えてくださったお客様や地域の方々を、これからも大切にしていきます。でも同時に、これからの10年、20年に向けて、会社も変わっていかなければならないと思っています。' },
                { type: 'p', text: 'その変化を、私一人で起こしたいわけではありません。これから入ってくる皆さんと一緒に、新しい港南自動車をつくりたい。' },
                {
                    type: 'list',
                    items: [
                        '働く人が笑顔になれる。',
                        'その笑顔がお客様にも伝わる。',
                        'そして、お客様から「港南自動車にお願いしてよかった」と言っていただける。',
                    ],
                },
                { type: 'p', text: 'そんな会社を、本気でつくっていきたいと思っています。' },
                { type: 'p', text: '経験や性別は問いません。あなたにまず持ってきてほしいのは、「ちょっとやってみたい」という気持ちです。その気持ちを、私たちは全力で応援します。' },
                { type: 'quote', text: '一緒に、これからの港南自動車を作ってくれませんか。' },
            ] as MessageBlock[],
        },
    ],
};

// 会社の魅力ポイント
// 絵文字アイコンではなく実測値を先頭に置く。整備工場の点検記録票と同じ書式で
// 条件を提示することで、広告文句ではなく「測った値」として読ませる
const companyFeatures = [
    {
        figure: '0.0',
        unit: 'h ／月',
        label: '時間外労働',
        title: '繁忙期も、残業完全ゼロ',
        description: '「忙しい時期だけは仕方ない」がありません。平日は18時、土曜は17時に帰ります。年間休日は110日、有給も確実に取得できます。予定が立てられるから、家族との時間も勉強の時間も守れます。',
    },
    {
        figure: '4+1',
        unit: '基 ／ライン',
        label: '整備設備',
        title: '国の指定工場・充実の設備',
        description: 'リフト4基と検査ライン1基を自社に備えた指定工場です。車検を工場内で完結できるため、検査員資格を実務の中で目指せます。スキャンツールも完備しています。',
    },
    {
        figure: 'HV·EV',
        unit: '整備対応',
        label: '取扱範囲',
        title: 'HV・EVまで扱える技術力',
        description: '軽自動車から普通車まで全メーカーに対応し、ハイブリッド・EVの整備も手がけます。特定の車種に偏らず、これからの時代に通用する技術と知識が自然と身につきます。',
    },
    {
        figure: '¥0',
        unit: '自己負担',
        label: '資格取得費用',
        title: '資格取得は会社が全額負担',
        description: '「先輩の背中を見て覚えろ」はありません。OJTで一つひとつ丁寧に指導し、資格取得の費用も会社が負担。取得後は資格手当（2級10,000円／検査員20,000円）で毎月の給与に反映されます。',
    },
    {
        figure: '70',
        unit: '年',
        label: '創業',
        title: '創業70年の安定企業',
        description: '石川県金沢市の地で長年愛され続けてきた信頼と実績があります。車検・整備という景気に左右されにくい事業だからこそ、安定した基盤の中で腰を据えて長く働けます。',
    },
    {
        figure: '3',
        unit: '領域',
        label: '事業',
        title: '整備だけの会社ではありません',
        description: '自社のカーローン「ノレタ」とリース「ノリドク」を運営し、新車・中古車の販売まで手がけています。整備の腕を磨きながら、クルマがお客様に届くまでの全体が見える。ここは他の整備工場にはない環境です。',
    },
];

// 就業記録：このページ最大の主張である労働条件を、測定値の書式でまとめたもの
// ヒーローでは highlight: true の3項目だけを帯で表示する
//
// 注意：font-mono（IBM Plex Mono）にかなの字形は無い。和文に当てると
// システムの等幅フォントに落ちて字面が崩れるため、value（数字）だけを mono にし、
// label と suffix（和文）は font-sans のまま扱う
const workRecord = [
    { label: '平日 退社時刻', value: '18:00', suffix: '', highlight: true },
    { label: '土曜 退社時刻', value: '17:00', suffix: '', highlight: true },
    { label: '時間外労働', value: '0.0', suffix: 'h／月', highlight: true },
    { label: '年間休日', value: '110', suffix: '日' },
    { label: '平日 実働', value: '7:30', suffix: '' },
    { label: '土曜 実働', value: '6:30', suffix: '' },
    { label: '休憩', value: '90', suffix: '分' },
];

// 役員メッセージの1章分を描画する
function MessageChapter({ chapter }: { chapter: { heading: string; blocks: MessageBlock[] } }) {
    return (
        <div>
            {chapter.heading && (
                <h3 className="mt-14 pt-14 border-t border-slate-200 text-lg md:text-xl font-bold text-slate-900 leading-[1.7]">
                    {chapter.heading}
                </h3>
            )}
            <div className="mt-6 space-y-6">
                {chapter.blocks.map((block, blockIdx) => {
                    if (block.type === 'quote') {
                        return (
                            <p
                                key={blockIdx}
                                className="py-2 text-lg md:text-[22px] font-bold text-teal-800 leading-[1.8]"
                            >
                                {block.text}
                            </p>
                        );
                    }
                    if (block.type === 'list') {
                        return (
                            <ul
                                key={blockIdx}
                                className="border-l-2 border-teal-200 pl-5 space-y-2 text-slate-600 leading-[1.8]"
                            >
                                {block.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>{item}</li>
                                ))}
                            </ul>
                        );
                    }
                    return (
                        <p key={blockIdx} className="text-slate-600 leading-[2]">
                            {block.text}
                        </p>
                    );
                })}
            </div>
        </div>
    );
}

// 選考フロー（応募のハードルを下げるため、所要期間まで明示する）
const selectionSteps = [
    {
        step: '01',
        title: 'ご応募・お問い合わせ',
        description: 'フォームかお電話でご連絡ください。履歴書は後日で構いません。「まず話を聞きたい」「工場を見たい」だけでも大歓迎です。',
    },
    {
        step: '02',
        title: '面接（1回のみ）',
        description: '面接は1回だけです。何度も足を運んでいただくことはありません。工場もご案内しますので、働く場所を実際に見てから判断してください。',
    },
    {
        step: '03',
        title: '5営業日以内に結果をご連絡',
        description: '合否は5営業日以内に必ずお伝えします。長くお待たせしません。在職中の方の応募も歓迎しており、入社日はご相談の上で決めます。',
    },
];

// 公開中（published: true）の求人だけを抽出
const visibleJobs = jobListings.filter((job) => job.published);
// 公開中の求人が1件以上あればページを表示、0件なら「準備中」を表示
const isPageReady = visibleJobs.length > 0;

export default function RecruitPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeJob, setActiveJob] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    // 役員メッセージの2節目以降の開閉
    const [messageOpen, setMessageOpen] = useState(false);

    // Escapeキーでメニューを閉じ、開閉ボタンにフォーカスを戻す
    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setMenuOpen(false);
            document.getElementById('menu-toggle')?.focus();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen]);


    // 応募と見学で入口を分ける（docs/blueprints/ux-recruit-application.md）
    const applyUrl = buildContactUrl({
        category: "採用・応募",
        lines: ["ご希望の内容: 自動車整備士に応募したい"],
    });
    const visitUrl = buildContactUrl({
        category: "採用・応募",
        lines: ["ご希望の内容: まず職場を見たい・話を聞きたい"],
    });

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // ============================================
    // ページ準備中の表示
    // ============================================
    if (!isPageReady) {
        return (
            <div className="min-h-dvh bg-neutral-50 font-sans text-slate-900 flex flex-col">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
                    <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2 transition-transform">
                            <Image src="/logo.png" alt="港南自動車サービス" width={180} height={45} className="w-auto h-10 md:h-12 object-contain" priority />
                        </Link>
                        <nav className="hidden xl:flex items-center gap-7 whitespace-nowrap text-[15px]">
                            <Link href="/shaken" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">車検</Link>
                            <Link href="/#services" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">サービス内容</Link>
                            <Link href="/#cases" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">取扱車種</Link>
                            <Link href="/#company" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">会社情報</Link>
                            <Link href="/recruit" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">採用情報</Link>
                            <Link href="/#contact" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">お問い合わせ</Link>
                            <Link href="/noreta" className="flex h-11 items-center rounded-full bg-teal-700 px-5 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.97]">
                                ノレタ詳細
                            </Link>
                            <Link href="/noridoku" className="flex h-11 items-center rounded-full border border-blue-600 px-5 font-bold text-blue-600 transition-[background-color,color,transform] duration-200 hover:bg-blue-600 hover:text-white active:scale-[0.97]">
                                ノリドク詳細
                            </Link>
                        </nav>
                        <button
                            className="xl:hidden flex size-11 items-center justify-center rounded border border-gray-300 text-gray-900 transition-colors"
                            id="menu-toggle"
                            aria-controls="mobile-menu"
                            onClick={toggleMenu}
                            aria-expanded={menuOpen}
                        aria-label="メニューを開く"
                        >
                            <svg aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`}
                            >
                                {menuOpen ? (
                                    <path d="M18 6L6 18M6 6l12 12" />
                                ) : (
                                    <path d="M3 12h18M3 6h18M3 18h18" />
                                )}
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Mobile menu */}
                <div
                    id="mobile-menu"
                    className={`fixed inset-0 overscroll-contain bg-gray-900 z-50 xl:hidden transition-opacity duration-200 flex flex-col items-center justify-center space-y-7 px-6 ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
                >
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    aria-label="メニューを閉じる"
                    >
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                    {[
                        { name: '車検', href: '/shaken' },
                        { name: 'サービス内容', href: '/#services' },
                        { name: '取扱車種', href: '/#cases' },
                        { name: '会社情報', href: '/#company' },
                        { name: '採用情報', href: '/recruit' },
                        { name: 'お問い合わせ', href: '/#contact' }
                    ].map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="text-xl font-bold text-white hover:text-teal-300 transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        href="/noreta"
                        className="flex h-14 w-full max-w-xs items-center justify-center rounded bg-teal-700 font-bold text-white"
                        onClick={() => setMenuOpen(false)}
                    >
                        ノレタ詳細
                    </Link>
                    <Link
                        href="/noridoku"
                        className="flex h-14 w-full max-w-xs items-center justify-center rounded border border-white/50 font-bold text-white"
                        onClick={() => setMenuOpen(false)}
                    >
                        ノリドク詳細
                    </Link>
                </div>


                {/* Coming Soon Content */}
                <main id="main" tabIndex={-1} className="flex-1 flex items-center justify-center pt-20">
                    <div className="text-center px-6">
                        <div className="size-24 bg-teal-100 rounded flex items-center justify-center mx-auto mb-8">
                            <svg aria-hidden="true" className="size-12 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h1 className="text-[30px] md:text-[40px] font-bold text-gray-900 mb-4 leading-[1.35]">
                            ページ準備中
                        </h1>
                        <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
                            採用情報ページは現在準備中です。<br />
                            公開までしばらくお待ちください。
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-8 py-4 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 transition-colors shadow-lg"
                        >
                            <svg aria-hidden="true" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            トップページへ戻る
                        </Link>
                    </div>
                </main>

                {/* Simple Footer */}
                <footer className="py-8 text-center text-white/60 text-sm">
                    <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                </footer>
            </div>
        );
    }


    return (
        <div className="min-h-dvh bg-neutral-50 font-sans text-slate-900 pb-20 overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
                <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 transition-transform">
                        <Image src="/logo.png" alt="港南自動車サービス" width={180} height={45} className="w-auto h-10 md:h-12 object-contain" priority />
                    </Link>
                    <nav className="hidden xl:flex items-center gap-7 whitespace-nowrap text-[15px]">
                        <Link href="/shaken" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">車検</Link>
                        <Link href="/#services" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">サービス内容</Link>
                        <Link href="/#cases" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">取扱車種</Link>
                        <Link href="/#company" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">会社情報</Link>
                        <Link href="/recruit" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">採用情報</Link>
                        <Link href="/#contact" className="text-gray-700 hover:text-teal-700 transition-colors border-b border-transparent hover:border-teal-700 pb-0.5">お問い合わせ</Link>
                        <Link href="/noreta" className="flex h-11 items-center rounded-full bg-teal-700 px-5 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.97]">
                            ノレタ詳細
                        </Link>
                        <Link href="/noridoku" className="flex h-11 items-center rounded-full border border-blue-600 px-5 font-bold text-blue-600 transition-[background-color,color,transform] duration-200 hover:bg-blue-600 hover:text-white active:scale-[0.97]">
                            ノリドク詳細
                        </Link>
                    </nav>
                    <button
                        className="xl:hidden flex size-11 items-center justify-center rounded border border-gray-300 text-gray-900 transition-colors"
                        id="menu-toggle"
                        aria-controls="mobile-menu"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                    aria-label="メニューを開く"
                    >
                        <svg aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-200 ${menuOpen ? 'rotate-90' : ''}`}
                        >
                            {menuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile menu */}
            <div
                id="mobile-menu"
                className={`fixed inset-0 overscroll-contain bg-gray-900 z-50 xl:hidden transition-opacity duration-200 flex flex-col items-center justify-center space-y-7 px-6 ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
            >
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                aria-label="メニューを閉じる"
                >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
                {[
                    { name: '車検', href: '/shaken' },
                    { name: 'サービス内容', href: '/#services' },
                    { name: '取扱車種', href: '/#cases' },
                    { name: '会社情報', href: '/#company' },
                    { name: '採用情報', href: '/recruit' },
                    { name: 'お問い合わせ', href: '/#contact' }
                ].map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="text-xl font-bold text-white hover:text-teal-300 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        {item.name}
                    </Link>
                ))}
                <Link
                    href="/noreta"
                    className="flex h-14 w-full max-w-xs items-center justify-center rounded bg-teal-700 font-bold text-white"
                    onClick={() => setMenuOpen(false)}
                >
                    ノレタ詳細
                </Link>
                <Link
                    href="/noridoku"
                    className="flex h-14 w-full max-w-xs items-center justify-center rounded border border-white/50 font-bold text-white"
                    onClick={() => setMenuOpen(false)}
                >
                    ノリドク詳細
                </Link>
            </div>

            <main className="pt-24 md:pt-32">
                {/* Hero Section */}
                <section className="container mx-auto px-4 mb-16 relative">
                    <div className={`transition-ui duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <p className="u-label mb-5">RECRUIT</p>
                        <h1 className="text-[32px] md:text-[48px] font-bold tracking-ja text-gray-900 mb-6 leading-[1.35]">
                            <span className="text-teal-700">あなたの力</span>を、<br />
                            地域のカーライフに。
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                            港南自動車サービスでは、一緒に働く仲間を募集しています。
                            繁忙期でも残業は完全ゼロ、年間休日110日。未経験の方も大歓迎で、資格取得の費用は会社が負担します。
                            あなたも私たちと一緒に、地域のお客様の安心・安全なカーライフを支えませんか？
                        </p>

                        {/* 就業記録の帯：このページ最大の主張を、広告文句ではなく測定値として最初に見せる */}
                        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-rule pt-6 max-w-2xl">
                            {workRecord
                                .filter((row) => row.highlight)
                                .map((row) => (
                                    <div key={row.label}>
                                        <dt className="text-[11px] tracking-[0.12em] text-slate-500 mb-1.5">
                                            {row.label}
                                        </dt>
                                        <dd className="flex items-baseline gap-1.5">
                                            <span className="u-num text-2xl md:text-[28px] font-medium text-teal-800 leading-none">
                                                {row.value}
                                            </span>
                                            {row.suffix && (
                                                <span className="text-xs text-slate-500">{row.suffix}</span>
                                            )}
                                        </dd>
                                    </div>
                                ))}
                        </dl>
                    </div>
                </section>

                {/* 役員メッセージ：抽象的な「アットホーム」に代えて、書き手の顔と考え方を最初に見せる */}
                <section className="container mx-auto px-4 mb-24">
                    {/* 長文のため、スマホでは余白を詰めて1行あたりの文字数を確保する */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-12">
                        <div className="text-center mb-10">
                            <p className="u-label mb-3">MESSAGE</p>
                            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900">役員からのメッセージ</h2>
                        </div>

                        {/* 導入：顔写真とリード文。本文が長いため、ここだけで誰の何の話かが伝わるようにする */}
                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-center max-w-3xl mx-auto mb-14">
                            <figure className="mx-auto md:mx-0 w-[180px] md:w-full">
                                <Image
                                    src={executiveMessage.photo}
                                    alt={`${executiveMessage.position} ${executiveMessage.name}`}
                                    width={440}
                                    height={550}
                                    className="w-full aspect-[4/5] object-cover rounded-2xl bg-slate-100"
                                />
                                <figcaption className="mt-4 text-center md:text-left">
                                    <span className="block text-sm text-slate-500">{executiveMessage.position}</span>
                                    <span className="block text-lg font-bold text-slate-900">{executiveMessage.name}</span>
                                </figcaption>
                            </figure>
                            <p className="text-xl md:text-[26px] font-bold text-slate-900 leading-[1.7] text-center md:text-left">
                                「{executiveMessage.lead}」
                            </p>
                        </div>

                        {/* 本文：長文のため1行あたりの文字数を抑え、行間を広めに取る。
                            1節目だけを常に見せ、2節目以降はボタンで開く。
                            閉じている間は消さずに高さを詰めるだけなので、2節目の冒頭が
                            半透明の膜ごしにうっすら見え、検索エンジンにも全文が読まれる */}
                        <div className="max-w-[42rem] mx-auto">
                            <MessageChapter chapter={executiveMessage.chapters[0]} />

                            <div className="relative">
                                <div
                                    id="executive-message-rest"
                                    className={messageOpen ? undefined : 'max-h-[280px] overflow-hidden'}
                                >
                                    {executiveMessage.chapters.slice(1).map((chapter, chapterIdx) => (
                                        <MessageChapter key={chapterIdx} chapter={chapter} />
                                    ))}

                                    {messageOpen && (
                                        <div className="mt-12 border-t border-rule pt-10 text-center">
                                            <button
                                                onClick={() => setMessageOpen(false)}
                                                aria-expanded={true}
                                                aria-controls="executive-message-rest"
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-7 py-3.5 font-bold text-slate-600 transition-colors duration-200 hover:bg-slate-50"
                                            >
                                                メッセージを閉じる
                                                <svg
                                                    aria-hidden="true"
                                                    className="size-5 rotate-180"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* 閉じている間だけ重ねる膜。下へいくほど白を強めて切れ目を隠し、
                                    ボタン自体も半透明にして、奥の文字が透けて見えるようにする */}
                                {!messageOpen && (
                                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-white/50 via-white/60 to-white/90 pb-3">
                                        <button
                                            onClick={() => setMessageOpen(true)}
                                            aria-expanded={false}
                                            aria-controls="executive-message-rest"
                                            className="inline-flex items-center gap-2 rounded-full border border-teal-700 bg-white/50 px-7 py-3.5 font-bold text-teal-700 backdrop-blur-[1px] transition-colors duration-200 hover:bg-white/80"
                                        >
                                            メッセージを開く
                                            <svg
                                                aria-hidden="true"
                                                className="size-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Features Section */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="text-center mb-12">
                        <p className="u-label mb-3">WHY KOUNAN</p>
                        <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900">港南自動車で働く魅力</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companyFeatures.map((feature, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-ui duration-200"
                            >
                                {/* 絵文字の代わりに実測値を置く。整備工場の記録票の見え方に合わせる */}
                                <p className="text-[11px] tracking-[0.12em] text-slate-500 mb-2">
                                    {feature.label}
                                </p>
                                <p className="flex items-baseline gap-2 border-b border-rule pb-5 mb-5">
                                    <span className="u-num text-[34px] font-medium leading-none text-teal-800">
                                        {feature.figure}
                                    </span>
                                    <span className="text-xs text-slate-500">{feature.unit}</span>
                                </p>
                                <h3 className="text-lg font-bold mb-3 text-slate-900">{feature.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Job Listings Section */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="text-center mb-12">
                        <p className="u-label mb-3">POSITIONS</p>
                        <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 mb-4">募集職種</h2>
                        <p className="text-slate-500">あなたに合ったポジションを見つけてください</p>
                    </div>

                    <div className="space-y-8">
                        {visibleJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-ui duration-200"
                            >
                                {/* Job Header */}
                                <div className="bg-teal-800 p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-[11px] tracking-[0.12em] text-teal-100 mb-3">
                                                {job.highlight}
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-white">{job.title}</h3>
                                            <p className="text-teal-100 text-sm mt-1">{job.subtitle}</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveJob(activeJob === job.id ? null : job.id)}
                                            className="flex items-center justify-center bg-white text-teal-800 font-bold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
                                        >
                                            {activeJob === job.id ? '閉じる' : '詳細を見る'}
                                            <svg aria-hidden="true"
                                                className={`size-5 ml-2 transition-transform ${activeJob === job.id ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Job Details (Expandable) */}
                                <div className={`transition-ui duration-500 overflow-hidden ${activeJob === job.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-6 md:p-10 space-y-8">
                                        {/* Description */}
                                        <div>
                                            <h4 className="text-[11px] tracking-[0.12em] text-slate-500 mb-4 pb-2 border-b border-rule">仕事内容</h4>
                                            <p className="text-slate-600 leading-relaxed">{job.description}</p>
                                        </div>

                                        {/* Requirements */}
                                        <div>
                                            <h4 className="text-[11px] tracking-[0.12em] text-slate-500 mb-4 pb-2 border-b border-rule">応募資格</h4>
                                            <ul className="space-y-2">
                                                {job.requirements.map((req, idx) => (
                                                    <li key={idx} className="flex items-start text-slate-600">
                                                        <svg aria-hidden="true" className="size-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Salary */}
                                        <div className="bg-slate-50 rounded-2xl p-6">
                                            <h4 className="text-[11px] tracking-[0.12em] text-slate-500 mb-4 pb-2 border-b border-rule">給与・待遇</h4>
                                            <div className="space-y-3">
                                                <div className="u-num text-[28px] font-medium text-teal-800 leading-none">
                                                    {job.salary.amount}
                                                    <span className="ml-2 font-sans text-sm text-slate-500">
                                                        {job.salary.per}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 text-sm">{job.salary.details}</p>
                                                <div className="flex flex-wrap gap-3 pt-2">
                                                    <span className="px-4 py-2 bg-white rounded-lg text-sm font-bold text-slate-700 shadow-sm">{job.salary.bonus}</span>
                                                    <span className="px-4 py-2 bg-white rounded-lg text-sm font-bold text-slate-700 shadow-sm">{job.salary.raise}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Benefits */}
                                        <div>
                                            <h4 className="text-[11px] tracking-[0.12em] text-slate-500 mb-4 pb-2 border-b border-rule">福利厚生</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {job.benefits.map((benefit, idx) => (
                                                    <span key={idx} className="px-3 py-1.5 bg-teal-50 text-teal-800 text-sm font-medium rounded-lg">
                                                        {benefit}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Work Style */}
                                        <div>
                                            <h4 className="text-[11px] tracking-[0.12em] text-slate-500 mb-4 pb-2 border-b border-rule">勤務条件</h4>
                                            {/* 就業記録：測定値の書式で並べる。数字だけを mono にする */}
                                            <dl className="bg-white rounded-2xl border border-slate-200 divide-y divide-rule">
                                                {workRecord.map((row) => (
                                                    <div
                                                        key={row.label}
                                                        className="flex items-baseline justify-between gap-4 px-5 py-3.5"
                                                    >
                                                        <dt className="text-[11px] tracking-[0.12em] text-slate-500 shrink-0">
                                                            {row.label}
                                                        </dt>
                                                        <dd className="flex items-baseline gap-1.5">
                                                            <span className="u-num text-lg font-medium text-teal-800 leading-none">
                                                                {row.value}
                                                            </span>
                                                            {row.suffix && (
                                                                <span className="text-xs text-slate-500">
                                                                    {row.suffix}
                                                                </span>
                                                            )}
                                                        </dd>
                                                    </div>
                                                ))}
                                                {/* 定休日はロゴの朱。tailwind.config.ts が朱の用途を
                                                    「定休日・必須・注意」に限定しているため、その1つとして使う */}
                                                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4 px-5 py-3.5">
                                                    <dt className="text-[11px] tracking-[0.12em] text-slate-500 shrink-0">
                                                        定休日
                                                    </dt>
                                                    <dd className="text-sm font-bold text-vermilion md:text-right">
                                                        {job.workStyle.holidays}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4 px-5 py-3.5">
                                                    <dt className="text-[11px] tracking-[0.12em] text-slate-500 shrink-0">
                                                        休暇
                                                    </dt>
                                                    <dd className="text-sm text-slate-800 md:text-right">
                                                        {job.workStyle.vacation}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 選考フロー：先が見えないことが応募をためらわせるため、回数と所要期間を先に示す */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="text-center mb-12">
                        <p className="u-label mb-3">PROCESS</p>
                        <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 mb-4">選考の流れ</h2>
                        <p className="text-slate-500">面接は1回だけ。結果は5営業日以内にお伝えします</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {selectionSteps.map((item) => (
                            <div key={item.step} className="bg-white p-8 rounded-3xl border border-slate-200">
                                {/* 実際に順序のある工程なので番号を残す。番号は数字なので mono */}
                                <span className="u-label block border-b border-rule pb-3 mb-5">
                                    {item.step}
                                </span>
                                <h3 className="text-lg font-bold mb-3 text-slate-900">{item.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-center text-slate-600">
                        在職中の方のご応募も歓迎しています。面接の日程は、ご都合に合わせて調整いたします。
                    </p>
                </section>

                {/* Application Section */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="bg-gray-900 rounded p-10 md:p-16 text-white relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 size-64 bg-teal-500/10 rounded hidden"></div>
                        <div className="absolute bottom-0 left-0 size-48 bg-teal-700/10 rounded hidden"></div>

                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                            <p className="u-label text-teal-300 mb-3">CONTACT</p>
                            <h2 className="text-[26px] md:text-[32px] font-bold mb-6">ご応募・お問い合わせ</h2>
                            <p className="text-slate-300 mb-10 leading-relaxed">
                                「まずは話を聞くだけ」「職場を見てみたい」だけでも大歓迎です。<br />
                                応募を迷っている段階でも構いません。まずはお気軽にご連絡ください。<br />
                                あなたからのご連絡を、スタッフ一同心よりお待ちしています。
                            </p>

                            {/* 応募と見学で入口を分ける。迷っている段階の人を応募の重さで引き返させない
                                （docs/blueprints/ux-recruit-application.md） */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Link
                                    href={applyUrl}
                                    className="flex flex-col items-center justify-center rounded-2xl bg-teal-700 px-8 py-5 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                                >
                                    整備士に応募する
                                    <span className="mt-1 text-xs font-normal text-teal-100">
                                        履歴書は後日で構いません
                                    </span>
                                </Link>
                                <Link
                                    href={visitUrl}
                                    className="flex flex-col items-center justify-center rounded-2xl border border-white/40 px-8 py-5 font-bold text-white transition-[background-color,transform] duration-200 hover:bg-white/10 active:scale-[0.98]"
                                >
                                    まず話を聞いてみる
                                    <span className="mt-1 text-xs font-normal text-slate-300">
                                        職場見学だけでも歓迎です
                                    </span>
                                </Link>
                            </div>

                            <div className="mb-8">
                                <Link
                                    href="tel:076-268-1788"
                                    className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 font-bold text-slate-900 transition-transform duration-200 active:scale-[0.98]"
                                >
                                    <svg aria-hidden="true" className="size-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                                    </svg>
                                    電話で相談する（076-268-1788）
                                </Link>
                            </div>

                            <div className="text-white/60 text-sm">
                                <p>採用担当：人事部</p>
                                <p>受付時間：平日 9:00〜17:30</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Info Section */}
                <section className="container mx-auto px-4">
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">会社概要</h2>
                        <div className="max-w-2xl mx-auto">
                            <dl className="space-y-4">
                                <div className="flex flex-col md:flex-row border-b border-slate-100 pb-4">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">会社名</dt>
                                    <dd className="text-slate-900">港南自動車サービス株式会社</dd>
                                </div>
                                <div className="flex flex-col md:flex-row border-b border-slate-100 pb-4">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">所在地</dt>
                                    <dd className="text-slate-900">〒920-0336 石川県金沢市金石本町ハ14</dd>
                                </div>
                                <div className="flex flex-col md:flex-row border-b border-slate-100 pb-4">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">電話番号</dt>
                                    <dd className="text-slate-900">076-268-1788</dd>
                                </div>
                                <div className="flex flex-col md:flex-row border-b border-slate-100 pb-4">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">事業内容</dt>
                                    <dd className="text-slate-900">自動車整備・車検、新車・中古車販売、カーローン「ノレタ」</dd>
                                </div>
                                <div className="flex flex-col md:flex-row">
                                    <dt className="font-bold text-slate-600 md:w-40 mb-1 md:mb-0">創業</dt>
                                    <dd className="text-slate-900">70年</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-24 bg-gray-900 text-white pt-16 pb-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                        <div>
                            <div className="flex items-center space-x-3 mb-8">
                                <Image
                                    src="/logo.png"
                                    alt="株式会社港南自動車サービス"
                                    width={280}
                                    height={70}
                                    className="h-9 w-auto object-contain brightness-0 invert"
                                />
                                <h3 className="sr-only">港南自動車サービス</h3>
                            </div>
                            <p className="text-white/70 max-w-sm text-sm leading-loose">
                                石川県金沢市で70年にわたり、地域の皆様の安全を守り続けてきました。<br />
                                丁寧な仕事、誠実な説明、そして確かな技術。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="u-label mb-6 block text-gray-500">Contact Information</div>
                            <div className="text-xl font-bold">石川県金沢市金石本町ハ14</div>
                            <div className="flex flex-col space-y-2">
                                <Link href="tel:076-268-1788" className="u-num text-3xl font-medium text-teal-300 hover:text-white transition-colors">076-268-1788</Link>
                                <span className="text-white/60 text-sm">受付：平日 9:00 - 18:00 / 土曜 9:00 - 17:00</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-white/15 flex flex-col md:flex-row justify-between items-center text-white/50 text-xs gap-6">
                        <p>© {new Date().getFullYear()} Kounan Jidosha Service. All Rights Reserved.</p>
                        <div className="flex space-x-8">
                            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
                            <Link href="/shaken" className="hover:text-white transition-colors">車検について</Link>
                            <Link href="/noreta" className="hover:text-white transition-colors">個人ローン「ノレタ」</Link>
                            <Link href="/recruit" className="hover:text-white transition-colors text-teal-400">採用情報</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
