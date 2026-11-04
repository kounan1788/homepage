'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import liff from '@line/liff';
import { sendGAEvent } from '@next/third-parties/google';
import ArrowRight from '@/components/ArrowRight';
import { registerShakenReminder } from '@/app/actions/registerShakenReminder';
import { cn } from '@/lib/utils';

/**
 * 車検満了日リマインダーの登録フォーム（LIFF）。
 *
 * LIFFの初期化はブラウザでしか動かないため、このコンポーネントは
 * page.tsx から ssr: false の dynamic import で読み込む。
 * ページ本文（説明・構造化データ）はサーバー側で描画済みなので、
 * ここで初期化が失敗してもページ全体は壊れない。
 */

/** 公式LINEの友だち追加リンク（サイト内の他ページと同じもの） */
const LINE_FRIEND_URL = 'https://lin.ee/CKQM0mE';

const TEL = '076-268-1788';

/** 画面の状態。LIFFの確認が通るまでフォームは出さない */
type Stage =
    /** liff.init / プロフィール取得の待ち */
    | 'loading'
    /** 友だち追加済み。フォームを表示する */
    | 'ready'
    /** 未友だち。通知が届かないので登録させない */
    | 'needFriend'
    /** 初期化失敗。LINEアプリから開く案内に切り替える */
    | 'error';

/** ナンバー欄の最大文字数（下4桁） */
const PLATE_MAX_LENGTH = 4;

/** Date を yyyy-mm-dd（端末のローカル日付）にする。date 入力の min / max に使う */
function toYmd(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/** 入力欄の共通スタイル（サイトの問い合わせフォームと同じ） */
const inputClass =
    'w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-[15px] text-gray-900 transition-colors placeholder:text-gray-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700 disabled:bg-gray-50 disabled:text-gray-500';

/** LINEアプリから開き直してもらう案内。初期化失敗と未友だちで使い回す */
function LineGuide({ title, body }: { title: string; body: string }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
            <p className="text-[17px] font-bold text-gray-900">{title}</p>
            <p className="mt-3 text-sm leading-loose text-gray-600">{body}</p>
            <div className="mt-6 grid gap-3">
                <a
                    href={LINE_FRIEND_URL}
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
                <a
                    href={`tel:${TEL}`}
                    className="group flex h-14 items-center justify-between gap-6 rounded-xl border border-gray-300 bg-white px-6 font-bold text-gray-900 transition-[background-color,transform] duration-200 hover:bg-gray-50 active:scale-[0.98]"
                >
                    <span className="flex flex-col leading-tight">
                        <span className="u-num text-lg">{TEL}</span>
                        <span className="mt-1 text-[11px] font-medium text-gray-500">
                            平日 9:00〜18:00 ／ 土曜 9:00〜17:00
                        </span>
                    </span>
                    <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
            </div>
        </div>
    );
}

export default function ReminderForm() {
    const [stage, setStage] = useState<Stage>('loading');
    const [name, setName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [carModel, setCarModel] = useState('');
    const [plateLast4, setPlateLast4] = useState('');
    const [consent, setConsent] = useState(false);
    const [website, setWebsite] = useState('');
    const [source, setSource] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // 入力できる満了日の範囲（今日より後〜3年以内）。描画のたびに動かないよう初回に固定する
    const [dateLimit] = useState(() => {
        const min = new Date();
        min.setDate(min.getDate() + 1);
        const max = new Date();
        max.setFullYear(max.getFullYear() + 3);
        return { min: toYmd(min), max: toYmd(max) };
    });

    /**
     * LIFFの初期化とプロフィール・友だち状態の確認。
     * 友だちでない方に登録させると「登録できたのに通知が届かない」ことになるため、
     * friendFlag が false の間はフォームを出さない。
     */
    const setUpLiff = useCallback(async () => {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
            console.error('ReminderForm: NEXT_PUBLIC_LIFF_ID が未設定です');
            setStage('error');
            return;
        }

        try {
            await liff.init({ liffId });

            // 未ログインならLINEの認可画面へ飛ぶ（以降の処理は戻ってきてから走る）
            if (!liff.isLoggedIn()) {
                liff.login();
                return;
            }

            const profile = await liff.getProfile();
            const friendship = await liff.getFriendship();

            // 氏名は編集できるようにしたいので、表示名は初期値としてだけ使う
            setName((current) => current || profile.displayName);
            setStage(friendship.friendFlag ? 'ready' : 'needFriend');
        } catch (error) {
            console.error('ReminderForm: liff error', error);
            setStage('error');
        }
    }, []);

    useEffect(() => {
        setUpLiff();
    }, [setUpLiff]);

    // 流入元（店頭QRは ?src=store）。useSearchParams を使うとページ全体が動的描画になるため直接読む
    useEffect(() => {
        setSource(new URLSearchParams(window.location.search).get('src') ?? '');
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // 二重送信の防止（送信中と、登録が済んだあと）
        if (isSubmitting || isDone) return;

        setIsSubmitting(true);
        setStatus(null);

        try {
            // 誰の登録かはサーバー側がLINEに確認する。ここでは発行済みのIDトークンを渡すだけ
            const idToken = liff.getIDToken();
            if (!idToken) {
                setStatus({
                    type: 'error',
                    message: `LINEの情報を取得できませんでした。お手数ですが、LINEアプリからこのページを開き直してください。うまくいかない場合は ${TEL} へお電話ください。`,
                });
                return;
            }

            const result = await registerShakenReminder({
                idToken,
                displayName: name,
                expiryDate,
                carModel,
                plateLast4,
                source,
                consent,
                website,
            });

            if (result.success) {
                setIsDone(true);
                setStatus({
                    type: 'success',
                    message:
                        '登録しました。車検満了日の2ヶ月前になりましたら、LINEでお知らせします。内容を変更したい場合は、LINEでメッセージをお送りください。',
                });
                sendGAEvent('event', 'shaken_reminder_signup', { src: source || 'direct' });
            } else {
                setStatus({
                    type: 'error',
                    message: `登録できませんでした（${result.error}）。もう一度お試しいただくか、お急ぎの場合は ${TEL} へお電話ください。`,
                });
            }
        } catch (error) {
            console.error('ReminderForm: submit error', error);
            setStatus({
                type: 'error',
                message: `登録できませんでした。通信状況をご確認のうえ、もう一度お試しください。お急ぎの場合は ${TEL} へお電話ください。`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (stage === 'loading') {
        return (
            <p role="status" aria-live="polite" className="text-sm text-gray-500">
                LINEの情報を確認しています…
            </p>
        );
    }

    if (stage === 'error') {
        return (
            <LineGuide
                title="LINEアプリから開いてください"
                body="このページはLINEと連携して満了日をお預かりします。お手数ですが、当社の公式LINEのメニューからもう一度開いてください。うまくいかない場合は、お電話でも満了日のお知らせを承ります。"
            />
        );
    }

    if (stage === 'needFriend') {
        return (
            <div className="grid gap-4">
                <LineGuide
                    title="先に友だち追加をお願いします"
                    body="当社の公式LINEと友だちになっていないと、お知らせをお送りできません。友だち追加のうえ、下のボタンでこの画面をもう一度ご確認ください。"
                />
                <button
                    type="button"
                    onClick={() => {
                        setStage('loading');
                        setUpLiff();
                    }}
                    className="h-12 rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50"
                >
                    友だち追加が済んだら、ここを押してください
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative grid gap-6">
            <div className="space-y-2">
                <label
                    className="flex items-center gap-2 text-sm font-bold text-gray-900"
                    htmlFor="reminder-name"
                >
                    お名前
                    <span className="u-chip bg-red-50 py-1 text-red-700">必須</span>
                </label>
                <input
                    className={inputClass}
                    id="reminder-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    disabled={isDone}
                />
                <p className="text-xs leading-relaxed text-gray-500">
                    LINEのお名前を初期値にしています。お知らせの宛名になりますので、必要に応じて書き換えてください。
                </p>
            </div>

            <div className="space-y-2">
                <label
                    className="flex items-center gap-2 text-sm font-bold text-gray-900"
                    htmlFor="reminder-expiry"
                >
                    車検満了日
                    <span className="u-chip bg-red-50 py-1 text-red-700">必須</span>
                </label>
                <input
                    className={inputClass}
                    id="reminder-expiry"
                    name="expiryDate"
                    type="date"
                    min={dateLimit.min}
                    max={dateLimit.max}
                    value={expiryDate}
                    onChange={(event) => setExpiryDate(event.target.value)}
                    aria-describedby="reminder-expiry-help"
                    required
                    disabled={isDone}
                />
                <p id="reminder-expiry-help" className="text-xs leading-relaxed text-gray-500">
                    車検証に記載された「有効期間の満了する日」を、記載どおりにご入力ください。フロントガラスの車検シールにも年月が書かれています。
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        className="flex items-center gap-2 text-sm font-bold text-gray-900"
                        htmlFor="reminder-car"
                    >
                        車種
                        <span className="u-chip bg-gray-100 py-1 text-gray-600">任意</span>
                    </label>
                    <input
                        className={inputClass}
                        id="reminder-car"
                        name="carModel"
                        type="text"
                        maxLength={50}
                        value={carModel}
                        onChange={(event) => setCarModel(event.target.value)}
                        placeholder="例）ハスラー"
                        disabled={isDone}
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="flex items-center gap-2 text-sm font-bold text-gray-900"
                        htmlFor="reminder-plate"
                    >
                        ナンバー下4桁
                        <span className="u-chip bg-gray-100 py-1 text-gray-600">任意</span>
                    </label>
                    <input
                        className={cn(inputClass, 'max-w-[12rem] tabular-nums')}
                        id="reminder-plate"
                        name="plateLast4"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={PLATE_MAX_LENGTH}
                        value={plateLast4}
                        onChange={(event) => setPlateLast4(event.target.value)}
                        placeholder="1234"
                        disabled={isDone}
                    />
                    <p className="text-xs leading-relaxed text-gray-500">
                        ナンバープレートに大きく書かれた数字です。ご記入いただくと、お車をすぐにお調べできます。
                    </p>
                </div>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-loose text-gray-700">
                <input
                    className="mt-1.5 size-4 shrink-0 cursor-pointer accent-teal-700"
                    name="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    required
                    disabled={isDone}
                />
                <span>
                    <Link href="/privacy" className="font-bold text-teal-700 underline">
                        個人情報の取り扱い
                    </Link>
                    に同意します（お預かりしたお名前・満了日は、車検のお知らせとご連絡にのみ使用します）
                    <span className="u-chip ml-2 bg-red-50 py-1 text-red-700">必須</span>
                </span>
            </label>

            {status && (
                <p
                    id="reminder-status"
                    role="status"
                    aria-live="polite"
                    className={cn(
                        'border-l-2 px-4 py-3 text-sm leading-loose',
                        status.type === 'success'
                            ? 'border-teal-700 bg-teal-50 text-teal-900'
                            : 'border-red-600 bg-red-50 text-red-800'
                    )}
                >
                    {status.message}
                </p>
            )}

            {!isDone && (
                <button
                    className={cn(
                        'group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-teal-700 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.98]',
                        isSubmitting && 'cursor-not-allowed opacity-60'
                    )}
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    aria-describedby={status ? 'reminder-status' : undefined}
                >
                    {isSubmitting ? '登録中…' : 'この内容で登録する'}
                    {!isSubmitting && (
                        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                    )}
                </button>
            )}

            {isDone && (
                <Link
                    href="/shaken"
                    className="group flex h-14 w-full items-center justify-between gap-6 rounded-xl border border-gray-300 bg-white px-6 text-[15px] font-bold text-gray-900 transition-[background-color,transform] duration-200 hover:bg-gray-50 active:scale-[0.98]"
                >
                    車検の料金と流れを見る
                    <ArrowRight className="text-teal-700 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
            )}

            {/* ハニーポット。人には見えないので、埋まっていればボットと判断する。
                display:none だと入力可能と見なさないボットがいるため画面外に逃がす */}
            <div
                aria-hidden="true"
                className="absolute left-[-9999px] top-auto size-px overflow-hidden"
            >
                <label htmlFor="reminder-website">ホームページ（入力不要）</label>
                <input
                    id="reminder-website"
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
