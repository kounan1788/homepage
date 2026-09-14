import Link from 'next/link';
import { carGuides } from '@/lib/carGuides';
import { carLineup, type CarCategory } from '@/lib/carLineup';

/**
 * 車種ページの「金沢で選ぶポイント」欄。
 * 文章は lib/carGuides.ts に集めてあり、ここは表示だけを受け持つ。
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

    const carName = `${car.maker} ${car.name}`;

    return (
        <section
            aria-labelledby="car-guide-heading"
            className="mt-10 rounded-2xl border border-rule bg-white"
        >
            <div className="border-b border-rule px-5 py-4 md:px-7">
                <span className="u-label">金沢で選ぶポイント</span>
                <h2
                    id="car-guide-heading"
                    className="mt-2 text-balance text-xl font-bold text-gray-900 md:text-2xl"
                >
                    {carName}を金沢で選ぶなら
                </h2>
            </div>

            <div className="space-y-8 px-5 py-6 md:px-7 md:py-8">
                <div>
                    <h3 className="text-balance text-base font-bold text-gray-900">
                        金沢の冬と駆動方式
                    </h3>
                    <p className="mt-3 text-pretty text-[15px] leading-loose text-gray-600">
                        {guide.winter}
                    </p>
                </div>

                <div>
                    <h3 className="text-balance text-base font-bold text-gray-900">
                        こんな方に向いています
                    </h3>
                    <ul className="mt-3 space-y-2">
                        {guide.fitFor.map((item) => (
                            <li
                                key={item}
                                className="flex gap-3 text-pretty text-[15px] leading-relaxed text-gray-600"
                            >
                                <span
                                    className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-teal-700"
                                    aria-hidden="true"
                                />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-xl border-l-4 border-mint-400 bg-mint-50 p-5">
                    <h3 className="text-balance text-base font-bold text-gray-900">
                        整備工場から、長く乗るためのひとこと
                    </h3>
                    <p className="mt-3 text-pretty text-[15px] leading-loose text-gray-700">
                        {guide.mechanic}
                    </p>
                </div>

                <p className="text-pretty text-sm leading-relaxed text-gray-600">
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
            </div>
        </section>
    );
}
