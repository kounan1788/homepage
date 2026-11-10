'use client';

/**
 * 車検の受け入れ状況カレンダー（/shaken に設置）。
 *
 * データは /api/shaken-availability から取得する（元はGoogleスプレッドシート）。
 * API に届かない場合も、休業日は×・それ以外は△で表示し、〇は出さない。
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import ArrowRight from '@/components/ArrowRight';
import { LINE_URL, TEL } from '@/lib/chatFlow';
import { OPENING_HOURS } from '@/lib/businessDays';
import { SHAKEN_CALENDAR_CONFIG } from '@/lib/shakenCalendar/config';
import {
    buildAvailability,
    getCalendarRange,
    STATUS_SYMBOL,
    type AvailabilityDay,
    type AvailabilityResponse,
    type AvailabilityStatus,
} from '@/lib/shakenCalendar/availability';
import {
    addMonths,
    dayOfWeek,
    daysInMonth,
    parseDateStr,
    toDateStr,
    todayInJapan,
} from '@/lib/shakenCalendar/dateUtils';

/** 曜日名（Date の getDay() の並び：0=日曜） */
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/** カレンダーの見出しの並び（月曜始まり） */
const HEADER_WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日'];

type DayStyle = {
    label: string;
    symbol: string;
    symbolClass: string;
    cellClass: string;
    badgeClass: string;
};

/** ステータスごとの表示。色だけに頼らず、記号と言葉を必ず併記する */
const STATUS_STYLE: Record<AvailabilityStatus, Omit<DayStyle, 'symbol'>> = {
    available: {
        label: '受付可能',
        symbolClass: 'text-green-700',
        cellClass: 'bg-green-50 hover:bg-green-100',
        badgeClass: 'border-green-700 bg-green-50 text-green-800',
    },
    call: {
        label: '電話で確認',
        symbolClass: 'text-orange-700',
        cellClass: 'bg-orange-50 hover:bg-orange-100',
        badgeClass: 'border-orange-700 bg-orange-50 text-orange-800',
    },
    unavailable: {
        label: '受付不可',
        symbolClass: 'text-red-600',
        cellClass: 'bg-white hover:bg-gray-50',
        badgeClass: 'border-red-600 bg-red-50 text-red-700',
    },
};

/** 定休日（シートに明示が無く、休業日判定で×になった日）はグレーで「定休日」と表示する */
const CLOSED_STYLE: DayStyle = {
    label: '定休日',
    symbol: '休',
    symbolClass: 'text-gray-700',
    cellClass: 'bg-gray-200 hover:bg-gray-300',
    badgeClass: 'border-gray-500 bg-gray-200 text-gray-800',
};

/** その日の表示方法を決める */
function styleOf(day: AvailabilityDay): DayStyle {
    if (day.reason === 'closed') return CLOSED_STYLE;
    return { ...STATUS_STYLE[day.status], symbol: STATUS_SYMBOL[day.status] };
}

/** '11月11日（水）' の形にする */
function formatDateLabel(date: string): string {
    const { month, day } = parseDateStr(date);
    return `${month}月${day}日（${WEEKDAYS[dayOfWeek(date)]}）`;
}

/** '2026年11月9日 14:32' の形（日本時間）にする */
function formatDateTime(iso: string): string {
    return new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));
}

/** API に届かなかったときの代替データ（休業日は×、それ以外は△） */
function buildOfflineFallback(today: string): AvailabilityResponse {
    const range = getCalendarRange(today);
    return {
        source: 'error',
        fetchedAt: null,
        stale: false,
        ...range,
        days: buildAvailability(range, new Map()),
    };
}

/** レスポンスの形を最低限確かめる（壊れたデータで画面を落とさないため） */
function isAvailabilityResponse(value: unknown): value is AvailabilityResponse {
    const v = value as AvailabilityResponse | null;
    return !!v && Array.isArray(v.days) && typeof v.from === 'string' && typeof v.to === 'string';
}

export default function ShakenAvailabilityCalendar() {
    // 日本時間の今日。サーバーとブラウザで日付がずれないよう、マウント後に決める
    const [today, setToday] = useState<string | null>(null);
    const [data, setData] = useState<AvailabilityResponse | null>(null);
    const [view, setView] = useState<{ year: number; month: number } | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    // 画面を占めすぎないよう、最初は閉じておきボタンで開く
    const [open, setOpen] = useState(false);
    const detailRef = useRef<HTMLDivElement>(null);

    // 開いたときに初めて読み込む（見ない人の分は API を呼ばない）
    useEffect(() => {
        if (!open || data) return;
        const now = todayInJapan();
        setToday(now);
        setView(parseDateStr(now));

        const controller = new AbortController();
        fetch('/api/shaken-availability', { cache: 'no-store', signal: controller.signal })
            .then((res) => res.json())
            .then((json: unknown) =>
                setData(isAvailabilityResponse(json) ? json : buildOfflineFallback(now)),
            )
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === 'AbortError') return;
                setData(buildOfflineFallback(now));
            });
        return () => controller.abort();
    }, [open, data]);

    const dayMap = useMemo(
        () => new Map<string, AvailabilityDay>((data?.days ?? []).map((d) => [d.date, d])),
        [data],
    );

    // 表示中の情報が古いか（取得失敗で以前のデータを出している、または最終取得から時間が経っている）
    const isStale = useMemo(() => {
        if (!data?.fetchedAt) return false;
        const ageMinutes = (Date.now() - new Date(data.fetchedAt).getTime()) / 60000;
        return data.stale || ageMinutes > SHAKEN_CALENDAR_CONFIG.staleAfterMinutes;
    }, [data]);

    const selectDate = (date: string) => {
        setSelected(date);
        // スマホでは詳細欄がカレンダーの下に隠れるため、見える位置まで寄せる
        requestAnimationFrame(() => detailRef.current?.scrollIntoView({ block: 'nearest' }));
    };

    const loading = !data || !view || !today;
    const rangeFrom = data ? parseDateStr(data.from) : null;
    const rangeTo = data ? parseDateStr(data.to) : null;
    const canGoPrev =
        !!view &&
        !!rangeFrom &&
        view.year * 12 + view.month > rangeFrom.year * 12 + rangeFrom.month;
    const canGoNext =
        !!view && !!rangeTo && view.year * 12 + view.month < rangeTo.year * 12 + rangeTo.month;
    const moveMonth = (delta: number) =>
        setView((v) => (v ? addMonths(v.year, v.month, delta) : v));

    const selectedDay = selected ? dayMap.get(selected) : undefined;

    return (
        <section id="availability" className="border-t border-gray-200 bg-white py-12 md:py-16">
            <div className="container">
                <header>
                    <hr className="u-road" aria-hidden="true" />
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                        <h2 className="text-[26px] font-bold leading-tight text-gray-900 md:text-[32px]">
                            車検の受け入れ状況
                        </h2>
                        <span className="u-chip">Availability</span>
                    </div>
                    <p className="mt-5 max-w-2xl text-base leading-loose text-gray-700">
                        車検を受け入れられる日を、カレンダーの〇・△・×でご確認いただけます。
                    </p>
                </header>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="availability-panel"
                    className="group mt-6 flex min-h-14 w-full items-center justify-between gap-4 rounded-xl border-2 border-teal-700 bg-white px-6 py-3 text-left text-lg font-bold text-teal-800 transition-[background-color,transform] duration-200 hover:bg-mint-50 active:scale-[0.99] sm:w-auto sm:min-w-[360px]"
                >
                    {open ? 'カレンダーを閉じる' : '受け入れ状況カレンダーを見る'}
                    <svg
                        aria-hidden="true"
                        className={`size-5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {open && (
                    <div id="availability-panel">
                        <p className="mt-6 text-base leading-relaxed text-gray-700">
                            ご希望の日付を押すと、その日の受け入れ状況が表示されます。
                        </p>

                        {/* 取得状況のお知らせ */}
                        <div className="mt-8 space-y-3" aria-live="polite">
                            {data?.source === 'error' && (
                                <p className="rounded-xl border border-orange-700 bg-orange-50 p-4 text-base leading-relaxed text-gray-900">
                                    <b className="font-bold">
                                        受け入れ状況を読み込めませんでした。
                                    </b>
                                    <br />
                                    休業日以外は「△（電話で確認）」で表示しています。お手数ですが、お電話でご確認ください。
                                </p>
                            )}
                            {data?.source === 'sheet' && isStale && data.fetchedAt && (
                                <p className="rounded-xl border border-orange-700 bg-orange-50 p-4 text-base leading-relaxed text-gray-900">
                                    <b className="font-bold">
                                        表示中の情報は {formatDateTime(data.fetchedAt)}{' '}
                                        時点のものです。
                                    </b>
                                    <br />
                                    最新の状況はお電話でご確認ください。
                                </p>
                            )}
                            {data?.source === 'dummy' && (
                                <p className="rounded-xl border border-dashed border-gray-500 bg-white p-4 text-sm text-gray-700">
                                    開発用のダミーデータを表示しています（本番環境では表示されません）。
                                </p>
                            )}
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:gap-10">
                            {/* カレンダー */}
                            <div className="lg:col-span-7">
                                <div className="flex items-center justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={() => moveMonth(-1)}
                                        disabled={!canGoPrev}
                                        className="flex h-12 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 text-base font-medium text-gray-700 transition-[border-color,color,transform] duration-200 hover:border-teal-700 hover:text-teal-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                                    >
                                        <span aria-hidden="true">‹</span>
                                        前の月
                                    </button>
                                    <h3 className="text-center" aria-live="polite">
                                        {view ? (
                                            <>
                                                <span className="u-num text-2xl font-medium text-gray-900">
                                                    {view.year}
                                                </span>
                                                <span className="ml-1 text-sm text-gray-600">
                                                    年
                                                </span>
                                                <span className="u-num ml-2 text-2xl font-medium text-gray-900">
                                                    {view.month}
                                                </span>
                                                <span className="ml-1 text-sm text-gray-600">
                                                    月
                                                </span>
                                            </>
                                        ) : (
                                            <span className="inline-block h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
                                        )}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => moveMonth(1)}
                                        disabled={!canGoNext}
                                        className="flex h-12 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 text-base font-medium text-gray-700 transition-[border-color,color,transform] duration-200 hover:border-teal-700 hover:text-teal-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                                    >
                                        翌月
                                        <span aria-hidden="true">›</span>
                                    </button>
                                </div>

                                <div
                                    className="mt-4 overflow-hidden rounded-2xl border-l border-t border-gray-200 bg-white"
                                    aria-busy={loading}
                                >
                                    <div
                                        className="grid grid-cols-7 border-b border-r border-gray-200 bg-gray-900"
                                        aria-hidden="true"
                                    >
                                        {HEADER_WEEKDAYS.map((d) => (
                                            <div
                                                key={d}
                                                className={`py-2.5 text-center text-sm font-bold ${
                                                    d === '日'
                                                        ? 'text-red-300'
                                                        : d === '土'
                                                          ? 'text-blue-300'
                                                          : 'text-white/85'
                                                }`}
                                            >
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                    {loading ? (
                                        <CalendarSkeleton />
                                    ) : (
                                        <MonthGrid
                                            year={view.year}
                                            month={view.month}
                                            today={today}
                                            dayMap={dayMap}
                                            selected={selected}
                                            onSelect={selectDate}
                                        />
                                    )}
                                </div>

                                {/* 凡例 */}
                                <dl className="mt-5 grid grid-cols-2 gap-3 text-base sm:grid-cols-4">
                                    {[
                                        {
                                            ...STATUS_STYLE.available,
                                            symbol: STATUS_SYMBOL.available,
                                        },
                                        { ...STATUS_STYLE.call, symbol: STATUS_SYMBOL.call },
                                        {
                                            ...STATUS_STYLE.unavailable,
                                            symbol: STATUS_SYMBOL.unavailable,
                                        },
                                        CLOSED_STYLE,
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-3">
                                            <dt
                                                className={`flex size-10 shrink-0 items-center justify-center rounded-lg border font-bold ${
                                                    item === CLOSED_STYLE ? 'text-base' : 'text-2xl'
                                                } ${item.badgeClass}`}
                                            >
                                                {item.symbol}
                                            </dt>
                                            <dd className="font-bold text-gray-900">
                                                {item.label}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                                <p className="mt-3 text-sm text-gray-600">
                                    数字がうすい灰色の日は過ぎた日です。「今日」の印が本日です。
                                </p>
                            </div>

                            {/* 選んだ日の詳細 */}
                            <div className="lg:col-span-5">
                                <div
                                    ref={detailRef}
                                    className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 lg:sticky lg:top-28"
                                    aria-live="polite"
                                >
                                    {selectedDay ? (
                                        <DayDetail day={selectedDay} />
                                    ) : (
                                        <p className="text-base leading-loose text-gray-700">
                                            カレンダーの日付を押すと、ここに受け入れ状況とご予約の方法が表示されます。
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 更新日時と注意書き */}
                        <div className="mt-8 space-y-2 text-sm leading-relaxed text-gray-700">
                            {data?.fetchedAt && (
                                <p>
                                    最終更新：
                                    <span className="u-num">{formatDateTime(data.fetchedAt)}</span>
                                </p>
                            )}
                            <p>
                                ※表示は車検の受け入れ状況の目安です。予約状況により変更となる場合があります。正式なご予約は、お電話等でご確認ください。
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

/** 1か月分の日付マス */
function MonthGrid({
    year,
    month,
    today,
    dayMap,
    selected,
    onSelect,
}: {
    year: number;
    month: number;
    today: string;
    dayMap: Map<string, AvailabilityDay>;
    selected: string | null;
    onSelect: (date: string) => void;
}) {
    // 月曜始まりなので、月初の前に置く空きマスは「月曜からの日数」
    const leading = (dayOfWeek(toDateStr(year, month, 1)) + 6) % 7;
    const total = daysInMonth(year, month);
    const trailing = (7 - ((leading + total) % 7)) % 7;
    const blank = 'min-h-[64px] border-b border-r border-gray-200 bg-gray-50 md:min-h-[76px]';

    return (
        <div className="grid grid-cols-7">
            {Array.from({ length: leading }, (_, i) => (
                <div key={`pre-${i}`} className={blank} aria-hidden="true" />
            ))}
            {Array.from({ length: total }, (_, i) => {
                const day = i + 1;
                const date = toDateStr(year, month, day);
                const info = dayMap.get(date);
                const isToday = date === today;
                const isPast = date < today;
                const base =
                    'relative flex min-h-[64px] flex-col items-center justify-start gap-1 border-b border-r border-gray-200 pb-1.5 pt-1.5 md:min-h-[76px]';
                const dayNumber = (
                    <span
                        className={`u-num flex size-7 items-center justify-center rounded-full text-base font-medium ${
                            isToday
                                ? 'bg-teal-700 text-white'
                                : isPast
                                  ? 'text-gray-500'
                                  : 'text-gray-900'
                        }`}
                    >
                        {day}
                    </span>
                );

                // 過ぎた日・表示期間外の日は押せない
                if (isPast || !info) {
                    return (
                        <div key={date} className={`${base} bg-gray-100`}>
                            {dayNumber}
                            <span className="sr-only">{isPast ? '（過ぎた日）' : ''}</span>
                        </div>
                    );
                }

                const style = styleOf(info);
                const isClosed = style === CLOSED_STYLE;
                const isSelected = date === selected;
                return (
                    <button
                        key={date}
                        type="button"
                        onClick={() => onSelect(date)}
                        aria-pressed={isSelected}
                        aria-label={`${formatDateLabel(date)}${isToday ? '（今日）' : ''} ${
                            isClosed ? style.label : `${style.label}（${style.symbol}）`
                        }`}
                        className={`${base} ${style.cellClass} transition-colors duration-150 focus-visible:z-10 focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-teal-700 ${
                            isSelected
                                ? 'z-10 outline outline-[3px] -outline-offset-[3px] outline-gray-900'
                                : ''
                        }`}
                    >
                        {dayNumber}
                        {isClosed ? (
                            <span
                                aria-hidden="true"
                                className={`mt-1 text-xs font-bold leading-none md:text-sm ${style.symbolClass}`}
                            >
                                定休日
                            </span>
                        ) : (
                            <span
                                aria-hidden="true"
                                className={`text-2xl font-bold leading-none md:text-3xl ${style.symbolClass}`}
                            >
                                {style.symbol}
                            </span>
                        )}
                        {isToday && (
                            <span
                                aria-hidden="true"
                                className="absolute right-0.5 top-0.5 hidden text-[10px] font-bold text-teal-700 sm:block"
                            >
                                今日
                            </span>
                        )}
                    </button>
                );
            })}
            {Array.from({ length: trailing }, (_, i) => (
                <div key={`post-${i}`} className={blank} aria-hidden="true" />
            ))}
        </div>
    );
}

/** 読み込み中の仮表示 */
function CalendarSkeleton() {
    return (
        <div className="grid grid-cols-7" aria-label="読み込み中">
            {Array.from({ length: 35 }, (_, i) => (
                <div
                    key={i}
                    className="flex min-h-[64px] flex-col items-center gap-2 border-b border-r border-gray-200 pt-2 md:min-h-[76px]"
                >
                    <span className="h-4 w-5 animate-pulse rounded bg-gray-200" />
                    <span className="size-6 animate-pulse rounded-full bg-gray-200" />
                </div>
            ))}
        </div>
    );
}

/** 選んだ日の詳細と問い合わせボタン */
function DayDetail({ day }: { day: AvailabilityDay }) {
    const style = styleOf(day);
    const isClosed = style === CLOSED_STYLE;
    const label = formatDateLabel(day.date);

    return (
        <div>
            <div className="flex items-center gap-4">
                <span
                    className={`flex size-14 shrink-0 items-center justify-center rounded-xl border-2 text-3xl font-bold ${style.badgeClass}`}
                    aria-hidden="true"
                >
                    {style.symbol}
                </span>
                <div>
                    <p className="text-xl font-bold text-gray-900">{label}</p>
                    <p className="mt-0.5 text-base font-bold text-gray-700">
                        {isClosed ? style.label : `${style.label}（${style.symbol}）`}
                    </p>
                </div>
            </div>

            {day.status === 'available' && (
                <>
                    <p className="mt-5 text-lg font-bold leading-relaxed text-gray-900">
                        車検の受付が可能です。
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-gray-700">
                        ご予約はお電話またはLINEで承ります。
                    </p>
                    <ContactButtons line />
                </>
            )}

            {day.status === 'call' && (
                <>
                    <p className="mt-5 text-lg font-bold leading-relaxed text-gray-900">
                        {label}は、お電話での確認をお願いいたします。
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-gray-700">
                        受け入れ状況をお電話でご確認ください。
                    </p>
                    <ContactButtons telLabel="電話で問い合わせる" />
                </>
            )}

            {day.status === 'unavailable' && (
                <>
                    <p className="mt-5 text-lg font-bold leading-relaxed text-gray-900">
                        この日は車検を受け入れできません。
                    </p>
                    {isClosed && (
                        <p className="mt-2 text-base font-bold text-gray-700">
                            この日は定休日です。
                        </p>
                    )}
                    <p className="mt-2 text-base leading-relaxed text-gray-700">
                        別の日付をお選びください。
                    </p>
                </>
            )}
        </div>
    );
}

/** 電話・LINEのボタン。電話番号やURLが未設定なら出さない */
function ContactButtons({
    line = false,
    telLabel = '電話で予約する',
}: {
    line?: boolean;
    telLabel?: string;
}) {
    if (!TEL && !(line && LINE_URL)) return null;
    return (
        <div className="mt-6 grid gap-3">
            {TEL && (
                <a
                    href={`tel:${TEL}`}
                    className="group flex min-h-14 items-center justify-between gap-6 rounded-xl bg-teal-700 px-6 py-3 text-base font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                >
                    <span className="flex flex-col leading-tight">
                        {telLabel}
                        <span className="u-num mt-1 text-sm font-medium text-white/90">{TEL}</span>
                    </span>
                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
            )}
            {line && LINE_URL && (
                <a
                    href={LINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-14 items-center justify-between gap-6 rounded-xl bg-[#06C755] px-6 py-3 text-base font-bold text-white transition-[background-color,transform] duration-200 hover:bg-[#05b04c] active:scale-[0.98]"
                >
                    <span className="flex flex-col leading-tight">
                        LINEで予約する
                        <span className="sr-only">（新しいタブで開きます）</span>
                        <span className="mt-1 text-sm font-medium text-white/90">24時間受付</span>
                    </span>
                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
            )}
            {TEL && (
                <p className="text-sm text-gray-600">
                    お電話の受付：平日 {OPENING_HOURS.weekday}／土曜 {OPENING_HOURS.saturday}
                </p>
            )}
        </div>
    );
}
