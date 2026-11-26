'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import liff from '@line/liff';
import { sendGAEvent } from '@next/third-parties/google';
import ArrowRight from '@/components/ArrowRight';
import { requestShakenBooking } from '@/app/actions/requestShakenBooking';
import { LINE_URL, TEL } from '@/lib/chatFlow';
import {
    buildBookingMessage,
    buildOaMessageUrl,
    formatDateWithWeekday,
    getBookableDates,
    pickInitialDate,
    requestedDateNotice,
    validateBookingInput,
    type ValidBooking,
} from '@/lib/shakenBooking/booking';
import { formatPlateNumber } from '@/lib/plateNumber';
import { BOOKING_LIMITS } from '@/lib/shakenBooking/config';
import type { AvailabilityResponse } from '@/lib/shakenCalendar/availability';
import { todayInJapan } from '@/lib/shakenCalendar/dateUtils';
import { cn } from '@/lib/utils';
import BookingDone from './BookingDone';

/**
 * 車検のLINE予約フォーム（LIFF）。
 *
 * LIFFの初期化はブラウザでしか動かないため、page.tsx から ssr: false の dynamic import で読み込む。
 * 申し込むとサーバーがシートに記録して受付番号を返す。
 * そのあと、公式アカウントとのトーク画面を申込文が入力済みの状態で開いてもらう
 * （サイトから開いたLIFFでは liff.sendMessages() が使えないため）。
 */

/** 画面の状態 */
type Stage =
    /** LIFFの初期化・受け入れ状況の取得の待ち */
    | 'loading'
    /** パソコンで開かれた。スマートフォンのLINEで開くよう案内する */
    | 'pc'
    /** 未友だち。前日のお知らせが届かないので申し込ませない */
    | 'needFriend'
    /** 選べる日が無い（受け入れ状況の取得失敗を含む）。電話を案内する */
    | 'noDates'
    /** フォームを表示する */
    | 'ready'
    /** 申込済み。トークへの送信を案内する */
    | 'done'
    /** 設定不足・初期化失敗 */
    | 'error';

/** ナンバー欄の最大文字数（下4桁） */
const PLATE_MAX_LENGTH = 4;

const OPENING_HOURS_TEXT = '平日 9:00〜18:00 ／ 土曜 9:00〜17:00';

/** 入力欄の共通スタイル（サイトの問い合わせフォームと同じ） */
const inputClass =
    'w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-[15px] text-gray-900 transition-colors placeholder:text-gray-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700 disabled:bg-gray-50 disabled:text-gray-500';

const labelClass = 'flex items-center gap-2 text-sm font-bold text-gray-900';

function RequiredChip() {
    return <span className="u-chip bg-red-50 py-1 text-red-700">必須</span>;
}

function OptionalChip() {
    return <span className="u-chip bg-gray-100 py-1 text-gray-600">任意</span>;
}

/** 電話ボタン。フォームが使えない場面の受け皿 */
function TelButton() {
    return (
        <a
            href={`tel:${TEL}`}
            className="group flex h-14 items-center justify-between gap-6 rounded-xl border border-gray-300 bg-white px-6 font-bold text-gray-900 transition-[background-color,transform] duration-200 hover:bg-gray-50 active:scale-[0.98]"
        >
            <span className="flex flex-col leading-tight">
                <span className="u-num text-lg">{TEL}</span>
                <span className="mt-1 text-[11px] font-medium text-gray-500">{OPENING_HOURS_TEXT}</span>
            </span>
            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
        </a>
    );
}

/** フォームの代わりに出す案内（パソコン・未友だち・受付停止・エラーで使い回す） */
function Guide({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
            <p className="text-[17px] font-bold text-gray-900">{title}</p>
            <div className="mt-3 text-sm leading-loose text-gray-600">{children}</div>
        </div>
    );
}

export default function BookingForm() {
    const [stage, setStage] = useState<Stage>('loading');
    const [bookable, setBookable] = useState<string[]>([]);
    const [firstChoice, setFirstChoice] = useState('');
    const [secondChoice, setSecondChoice] = useState('');
    const [name, setName] = useState('');
    const [carModel, setCarModel] = useState('');
    const [plateLast4, setPlateLast4] = useState('');
    const [note, setNote] = useState('');
    const [consent, setConsent] = useState(false);
    const [website, setWebsite] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    /** カレンダーで押した日がフォームで選べなかったときの案内 */
    const [dateNotice, setDateNotice] = useState('');
    const [result, setResult] = useState<{ bookingNumber: string; value: ValidBooking } | null>(null);

    const liffId = process.env.NEXT_PUBLIC_BOOKING_LIFF_ID;
    const basicId = process.env.NEXT_PUBLIC_LINE_BASIC_ID;

    /**
     * LIFFの初期化 → パソコン判定 → ログイン → 友だち確認 → 受け入れ状況の取得。
     * 友だちでない方に申し込ませると、前日のお知らせが届かないため先に確かめる。
     */
    const setUp = useCallback(async () => {
        if (!liffId || !basicId) {
            console.error('BookingForm: NEXT_PUBLIC_BOOKING_LIFF_ID / NEXT_PUBLIC_LINE_BASIC_ID が未設定です');
            setStage('error');
            return;
        }

        try {
            await liff.init({ liffId });

            // パソコンではトーク画面を入力済みで開けないため、スマートフォンでの申込を案内する
            if (liff.getOS() === 'web') {
                setStage('pc');
                return;
            }

            // 未ログインならLINEの認可画面へ。戻り先を今のURLにして、押した日付（?date=）を失わないようにする
            if (!liff.isLoggedIn()) {
                liff.login({ redirectUri: window.location.href });
                return;
            }

            const [profile, friendship] = await Promise.all([liff.getProfile(), liff.getFriendship()]);
            setName((current) => current || profile.displayName);
            if (!friendship.friendFlag) {
                setStage('needFriend');
                return;
            }

            const response = await fetch('/api/shaken-availability', { cache: 'no-store' });
            const data = (await response.json()) as AvailabilityResponse;
            const dates = Array.isArray(data.days) ? getBookableDates(data.days, todayInJapan()) : [];
            if (dates.length === 0) {
                setStage('noDates');
                return;
            }

            setBookable(dates);
            // liff.line.me から開いた場合、?date= は liff.init() の完了後にURLへ戻されるので、ここで読む
            const requested = new URLSearchParams(window.location.search).get('date');
            setFirstChoice((current) => current || pickInitialDate(requested, dates));
            setDateNotice(requestedDateNotice(requested, dates));
            setStage('ready');
        } catch (setUpError) {
            console.error('BookingForm: setup error', setUpError);
            setStage('error');
        }
    }, [liffId, basicId]);

    useEffect(() => {
        setUp();
    }, [setUp]);

    const handleFirstChoiceChange = (value: string) => {
        setFirstChoice(value);
        // 第2希望が第1希望と同じ日になったら、第2希望を外す
        if (value === secondChoice) setSecondChoice('');
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // 二重送信の防止（送信中と、申込が済んだあと）
        if (isSubmitting || result) return;

        const input = { firstChoice, secondChoice, displayName: name, carModel, plateLast4, note, consent };
        // サーバーと同じ判定を先にブラウザで行い、すぐに直せるようにする
        const validation = validateBookingInput(input, bookable);
        if (!validation.ok) {
            setError(validation.error);
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // 誰の申込かはサーバー側がLINEに確認する。ここでは発行済みのIDトークンを渡すだけ
            const idToken = liff.getIDToken();
            if (!idToken) {
                setError(
                    `LINEの情報を取得できませんでした。お手数ですが、このページを開き直してください。うまくいかない場合は ${TEL} へお電話ください。`
                );
                return;
            }

            const response = await requestShakenBooking({ ...input, idToken, website });
            if (response.success) {
                setResult({ bookingNumber: response.bookingNumber, value: validation.value });
                setStage('done');
                sendGAEvent('event', 'shaken_booking_request', {});
            } else {
                setError(
                    `申し込めませんでした（${response.error}）。もう一度お試しいただくか、お急ぎの場合は ${TEL} へお電話ください。`
                );
            }
        } catch (submitError) {
            console.error('BookingForm: submit error', submitError);
            setError(
                `申し込めませんでした。通信状況をご確認のうえ、もう一度お試しください。お急ぎの場合は ${TEL} へお電話ください。`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (stage === 'loading') {
        return (
            <p role="status" aria-live="polite" className="text-sm text-gray-500">
                LINEの情報と受け入れ状況を確認しています…
            </p>
        );
    }

    if (stage === 'error') {
        return (
            <div className="grid gap-4">
                <Guide title="現在、LINEでの予約を受け付けられません">
                    お手数ですが、お電話でご予約ください。
                </Guide>
                <TelButton />
            </div>
        );
    }

    if (stage === 'pc') {
        return (
            <div className="grid gap-4">
                <Guide title="スマートフォンのLINEからお申し込みください">
                    <p>
                        LINEでの車検予約は、スマートフォンのLINEアプリからご利用いただけます。スマートフォンで次のURLを開いてください。
                    </p>
                    <p className="u-num mt-3 break-all rounded-lg bg-white px-4 py-3 font-bold text-gray-900">
                        https://liff.line.me/{liffId}
                    </p>
                    <p className="mt-3">お電話でもご予約を承ります。</p>
                </Guide>
                <TelButton />
            </div>
        );
    }

    if (stage === 'needFriend') {
        return (
            <div className="grid gap-4">
                <Guide title="先に友だち追加をお願いします">
                    当社の公式LINEと友だちになっていないと、確定のご連絡や前日のお知らせをお送りできません。友だち追加のうえ、下のボタンでこの画面をもう一度ご確認ください。
                </Guide>
                <a
                    href={LINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-14 items-center justify-between gap-6 rounded-xl bg-teal-700 px-6 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]"
                >
                    <span>
                        LINEで友だち追加する
                        <span className="sr-only">（新しいタブで開きます）</span>
                    </span>
                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <button
                    type="button"
                    onClick={() => {
                        setStage('loading');
                        setUp();
                    }}
                    className="h-12 rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50"
                >
                    友だち追加が済んだら、ここを押してください
                </button>
            </div>
        );
    }

    if (stage === 'noDates') {
        return (
            <div className="grid gap-4">
                <Guide title="現在はお電話で承っています">
                    今は予約フォームで選べる日（受け入れ状況が〇の日）がありません。お手数ですが、お電話でご相談ください。
                </Guide>
                <TelButton />
            </div>
        );
    }

    if (stage === 'done' && result) {
        const message = buildBookingMessage({ ...result.value, bookingNumber: result.bookingNumber });
        return (
            <BookingDone
                bookingNumber={result.bookingNumber}
                sendHref={buildOaMessageUrl(basicId ?? '', message)}
                message={message}
            />
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative grid gap-6">
            {dateNotice && (
                <p className="border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm leading-loose text-amber-900">
                    {dateNotice}
                </p>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="booking-first">
                        第1希望日
                        <RequiredChip />
                    </label>
                    <select
                        className={inputClass}
                        id="booking-first"
                        name="firstChoice"
                        value={firstChoice}
                        onChange={(event) => handleFirstChoiceChange(event.target.value)}
                        required
                    >
                        <option value="">選んでください</option>
                        {bookable.map((date) => (
                            <option key={date} value={date}>
                                {formatDateWithWeekday(date)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="booking-second">
                        第2希望日
                        <OptionalChip />
                    </label>
                    <select
                        className={inputClass}
                        id="booking-second"
                        name="secondChoice"
                        value={secondChoice}
                        onChange={(event) => setSecondChoice(event.target.value)}
                    >
                        <option value="">指定しない</option>
                        {bookable
                            .filter((date) => date !== firstChoice)
                            .map((date) => (
                                <option key={date} value={date}>
                                    {formatDateWithWeekday(date)}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
            <p className="-mt-3 text-xs leading-relaxed text-gray-500">
                選べるのは受け入れ状況が〇の日です。△の日をご希望の場合はお電話（{TEL}）でご相談ください。
            </p>

            <div className="space-y-2">
                <label className={labelClass} htmlFor="booking-name">
                    お名前
                    <RequiredChip />
                </label>
                <input
                    className={inputClass}
                    id="booking-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={BOOKING_LIMITS.displayName}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />
                <p className="text-xs leading-relaxed text-gray-500">
                    LINEのお名前を初期値にしています。必要に応じて書き換えてください。
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="booking-car">
                        車種
                        <RequiredChip />
                    </label>
                    <input
                        className={inputClass}
                        id="booking-car"
                        name="carModel"
                        type="text"
                        maxLength={BOOKING_LIMITS.carModel}
                        value={carModel}
                        onChange={(event) => setCarModel(event.target.value)}
                        placeholder="例）ハスラー"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="booking-plate">
                        ナンバー下4桁
                        <OptionalChip />
                    </label>
                    <input
                        className={cn(inputClass, 'max-w-[12rem] tabular-nums')}
                        id="booking-plate"
                        name="plateLast4"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={PLATE_MAX_LENGTH}
                        value={plateLast4}
                        onChange={(event) => setPlateLast4(event.target.value)}
                        placeholder="1234"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className={labelClass} htmlFor="booking-note">
                    ご連絡事項
                    <OptionalChip />
                </label>
                <textarea
                    className={cn(inputClass, 'min-h-[7rem]')}
                    id="booking-note"
                    name="note"
                    maxLength={BOOKING_LIMITS.note}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="例）代車を希望します／午前中に伺いたいです"
                />
            </div>

            {/* LINEで送っていただく内容のプレビュー。完了画面で初めて見る内容をなくすため、入力に合わせて更新する */}
            {firstChoice && (
                <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-900">LINEで送る内容</p>
                    <p className="whitespace-pre-wrap break-words rounded-xl border border-gray-300 bg-white px-4 py-3 text-[13px] leading-[1.6] text-gray-800">
                        {buildBookingMessage({
                            firstChoice,
                            secondChoice,
                            displayName: name.trim() || '（お名前）',
                            carModel: carModel.trim() || '（車種）',
                            plateLast4: formatPlateNumber(plateLast4.trim()) ?? '',
                            note: note.trim(),
                            bookingNumber: '（申込後に決まります）',
                        })}
                    </p>
                    <p className="text-xs leading-relaxed text-gray-500">
                        申し込んだあと、この内容をLINEで当店へ送信していただきます。
                    </p>
                </div>
            )}

            <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-loose text-gray-700">
                <input
                    className="mt-1.5 size-4 shrink-0 cursor-pointer accent-teal-700"
                    name="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    required
                />
                <span>
                    <Link href="/privacy" className="font-bold text-teal-700 underline">
                        個人情報の取り扱い
                    </Link>
                    に同意します（お預かりした内容は、車検のご予約の受付とご連絡にのみ使用します）
                    <span className="u-chip ml-2 bg-red-50 py-1 text-red-700">必須</span>
                </span>
            </label>

            {error && (
                <p
                    id="booking-error"
                    role="alert"
                    className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm leading-loose text-red-800"
                >
                    {error}
                </p>
            )}

            <button
                className={cn(
                    'group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-teal-700 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]',
                    isSubmitting && 'cursor-not-allowed opacity-60'
                )}
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                aria-describedby={error ? 'booking-error' : undefined}
            >
                {isSubmitting ? '送信中…' : 'この内容で申し込む'}
                {!isSubmitting && (
                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                )}
            </button>
            <p className="-mt-3 text-xs leading-relaxed text-gray-500">
                お申し込みの時点では、ご予約はまだ確定していません。
            </p>

            {/* ハニーポット。人には見えないので、埋まっていればボットと判断する。
                display:none だと入力可能と見なさないボットがいるため画面外に逃がす */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto size-px overflow-hidden">
                <label htmlFor="booking-website">ホームページ（入力不要）</label>
                <input
                    id="booking-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                />
            </div>
        </form>
    );
}
