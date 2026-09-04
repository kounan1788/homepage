/**
 * 求人データ。
 *
 * 採用ページ（app/recruit/ClientPage.tsx）の表示と、
 * Google しごと検索向けの構造化データ（app/recruit/layout.tsx）の両方がここを読む。
 * 掲載内容と構造化データがずれないよう、必ずこのファイルだけを編集すること。
 *
 * 公開の切り替え:
 *   published: true  → その求人を公開（一覧に表示し、構造化データも出力する）
 *   published: false → その求人を非公開（一覧にも構造化データにも出さない）
 *   すべて false の場合はページ全体が「準備中」表示になる。
 */

export interface JobListing {
    id: string;
    published: boolean;
    /** ページ見出しに出す職種名 */
    title: string;
    /** 構造化データ用の職種名。検索結果で読みやすい表記にする */
    schemaTitle: string;
    subtitle: string;
    highlight: string;
    description: string;
    requirements: string[];
    salary: {
        /** 月給の下限（円）。表示と構造化データの両方でこの値を使う */
        monthlyMin: number;
        per: string;
        details: string;
        bonus: string;
        raise: string;
    };
    benefits: string[];
    workStyle: {
        holidays: string;
        vacation: string;
    };
}

export const jobListings: JobListing[] = [
    {
        id: 'mechanic',
        published: true, // 整備士の公開フラグ
        title: 'ピットエンジニア-自動車整備士-',
        schemaTitle: 'ピットエンジニア（自動車整備士）',
        subtitle: '未経験スタート多数・資格取得は会社が全力サポート',
        highlight: '積極採用中',
        description:
            '「クルマが好き」──その気持ちさえあれば大丈夫。お客様の大切なお車の車検・点検・整備をお任せします。最初はできることから、経験豊富な先輩が一つひとつ丁寧に教えるので、未経験からでも着実にプロの整備士へ成長できます。国の指定工場としてリフト4基・検査ラインを備え、スキャンツールも完備。HV・EVまで扱えるので、これからの時代に通用する技術が身につきます。そして残業は完全ゼロ。繁忙期であっても、平日は18時・土曜は17時にきちんと帰れます。腰を据えて長く技術を磨ける環境です。',
        requirements: [
            '普通自動車運転免許（AT限定可）',
            '整備士資格不問（入社後の資格取得を支援）',
            '学歴不問・未経験者歓迎',
            '10代〜50代まで幅広く採用いたします！',
        ],
        salary: {
            monthlyMin: 195000,
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
            holidays: '日曜・祝日、月2〜4回の土曜日(繁忙期により変動あり)',
            vacation: '年次有給休暇（確実に取得できます）、夏季・年末年始休暇、慶弔休暇',
        },
    },
    {
        id: 'office',
        published: false, // 事務・受付スタッフの公開フラグ
        title: '事務・受付スタッフ',
        schemaTitle: '事務・受付スタッフ',
        subtitle: '未経験・ブランクOK／人と接するのが好きな方歓迎',
        highlight: '募集中',
        description:
            'ご来店されたお客様の受付・電話応対、見積書や請求書の作成、データ入力など、店舗を支える事務業務全般をお任せします。特別なスキルは必要ありません。大切なのは、明るい笑顔と「人と接するのが好き」という気持ち。分からないことはすぐに聞けるアットホームな職場なので、未経験の方もブランクのある方も安心してスタートできます。',
        requirements: [
            '高卒以上',
            '基本的なPC操作ができる方（Word・Excel）',
            '普通自動車運転免許（あれば尚可）',
            '未経験者歓迎・ブランクOK',
        ],
        salary: {
            monthlyMin: 170000,
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
            holidays: '日曜・祝日、月2〜4回の土曜日',
            vacation: '有給休暇（確実に取得できます）、夏季・年末年始休暇、慶弔休暇',
        },
    },
];

/** 公開中（published: true）の求人だけを抽出 */
export const visibleJobs = jobListings.filter((job) => job.published);

/** 公開中の求人が1件以上あればページを表示、0件なら「準備中」を表示 */
export const isPageReady = visibleJobs.length > 0;

/** 月給の表示文字列（例: ¥195,000） */
export function formatMonthlySalary(job: JobListing): string {
    return `¥${job.salary.monthlyMin.toLocaleString()}`;
}
