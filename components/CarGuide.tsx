import Link from 'next/link';
import { carGuides } from '@/lib/carGuides';
import { carLineup, type CarCategory } from '@/lib/carLineup';

/**
 * 車種ページの「金沢で選ぶなら」欄。
 * 文章は lib/carGuides.ts に集めてあり、ここは表示だけを受け持つ。
 *
 * 車種ページは全体が見積票の作り（罫線で区切った欄と、項目名｜内容の行）なので、
 * この欄も同じ文法にそろえ、整備工場が票に所見を書き込んだように読めるようにしている。
 *
 * route には車種ページ自身のパス（例: '/kcar/hustler'）を渡す。
 */
export default function CarGuide({ route }: { route: string }) {
    const guide = carGuides[route];
    const car = (Object.keys(carLineup) as CarCategory[])
        .flatMap((cat) => carLineup[cat])
        .find((item) => item.route === route);

    // 文章が未登録の車種では欄ごと出さない（空の見出しだけが残らないようにする）
    if (!guide || !car) return null;

    return (
        <section aria-labelledby="car-guide-heading" className="mt-10">
            <div className="rounded-2xl border border-rule bg-white">
                <h2
                    id="car-guide-heading"
                    className="text-balance border-b border-rule px-5 py-4 text-lg font-bold text-gray-900"
                >
                    {/* 1つの文字列にして、静的HTMLで見出しの文字が分断されないようにする */}
                    {`${car.maker} ${car.name}を金沢で選ぶなら`}
                </h2>

                <dl className="divide-y divide-rule">
                    <GuideRow term="冬の駆動方式">
                        <p>{guide.winter}</p>
                    </GuideRow>
                    <GuideRow term="向いている方">
                        <ul className="space-y-1.5">
                            {guide.fitFor.map((item) => (
                                <li key={item} className="flex gap-1">
                                    {/* 和文の箇条書きとして中黒を使う。読み上げでは不要なので隠す */}
                                    <span aria-hidden="true" className="text-gray-400">
                                        ・
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </GuideRow>
                    <GuideRow term="整備工場から">
                        <p>{guide.mechanic}</p>
                    </GuideRow>
                </dl>
            </div>

            <p className="mt-3 text-pretty px-1 text-sm leading-relaxed text-gray-600">
                ご購入後の点検・車検も当社の工場で承ります（
                <Link
                    href="/shaken"
                    className="font-bold text-teal-700 underline underline-offset-4 hover:text-teal-500"
                >
                    金沢市の車検
                </Link>
                ）。ほかの車種や、現金・ローン・リースの違いは
                <Link
                    href="/shinsha"
                    className="font-bold text-teal-700 underline underline-offset-4 hover:text-teal-500"
                >
                    新車販売のページ
                </Link>
                で比べられます。
            </p>
        </section>
    );
}

/** 票の1行。広い画面では項目名を左の列に置き、狭い画面では上下に積む */
function GuideRow({ term, children }: { term: string; children: React.ReactNode }) {
    return (
        <div className="px-5 py-5 md:grid md:grid-cols-[8.5rem_1fr] md:gap-6">
            <dt className="u-label md:pt-1">{term}</dt>
            {/* 和文は1行40字前後が読みやすい。広い画面で1行50字を超えないよう幅を抑える */}
            <dd className="mt-2 max-w-[42em] text-pretty text-[15px] leading-loose text-gray-700 md:mt-0">
                {children}
            </dd>
        </div>
    );
}
