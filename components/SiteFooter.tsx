import Link from 'next/link';
import Image from 'next/image';

/**
 * 全ページ共通のフッター。
 * サービスの追加時にリンクの貼り忘れが起きないよう、新設ページはここに追記する。
 */
export default function SiteFooter() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container py-16">
                <div className="grid gap-12 md:grid-cols-12">
                    <div className="md:col-span-5">
                        <Image
                            src="/logo.png"
                            alt="株式会社港南自動車サービス"
                            width={280}
                            height={70}
                            className="h-9 w-auto object-contain brightness-0 invert"
                        />
                        <p className="mt-6 text-sm leading-loose text-white/70">
                            〒920-0336
                            <br />
                            石川県金沢市金石本町ハ14
                        </p>
                        <dl className="mt-6 border-t border-white/15 text-sm">
                            <div className="flex gap-4 border-b border-white/15 py-3">
                                <dt className="w-16 shrink-0 text-white/50">TEL</dt>
                                <dd>
                                    <a
                                        href="tel:076-268-1788"
                                        className="u-num text-white transition-colors hover:text-teal-300"
                                    >
                                        076-268-1788
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-4 border-b border-white/15 py-3">
                                <dt className="w-16 shrink-0 text-white/50">FAX</dt>
                                <dd className="u-num text-white/80">076-268-3163</dd>
                            </div>
                            <div className="flex gap-4 border-b border-white/15 py-3">
                                <dt className="w-16 shrink-0 text-white/50">営業</dt>
                                <dd className="text-white/80">
                                    平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                                </dd>
                            </div>
                            <div className="flex gap-4 border-b border-white/15 py-3">
                                <dt className="w-16 shrink-0 text-white/50">定休</dt>
                                <dd className="text-white/80">
                                    日曜・祝日／土曜は月により異なります
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:col-span-7">
                        <nav>
                            <h3 className="u-label border-b border-white/15 pb-3 text-white/60">
                                Services
                            </h3>
                            <ul className="mt-4 space-y-3 text-sm text-white/80">
                                <li>
                                    <Link href="/shaken" className="transition-colors hover:text-teal-300">
                                        車検・点検
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shinsha" className="transition-colors hover:text-teal-300">
                                        新車販売
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/carloan" className="transition-colors hover:text-teal-300">
                                        カーローン
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/noreta" className="transition-colors hover:text-teal-300">
                                        ノレタ（個人向けローン）
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/noridoku" className="transition-colors hover:text-teal-300">
                                        ノリドク（法人向けリース）
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <nav>
                            <h3 className="u-label border-b border-white/15 pb-3 text-white/60">
                                Company
                            </h3>
                            <ul className="mt-4 space-y-3 text-sm text-white/80">
                                <li>
                                    <Link href="/#company" className="transition-colors hover:text-teal-300">
                                        会社概要
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#contact" className="transition-colors hover:text-teal-300">
                                        お問い合わせ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/recruit" className="transition-colors hover:text-teal-300">
                                        採用情報
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="transition-colors hover:text-teal-300">
                                        プライバシーポリシー
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-white/50">
                        &copy; {new Date().getFullYear()} 株式会社港南自動車サービス All Rights
                        Reserved.
                    </p>
                    <p className="u-label text-white/60">Kohnan Auto Service ／ Kanazawa</p>
                </div>
            </div>
        </footer>
    );
}
