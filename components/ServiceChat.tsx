'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getTodayStatus } from '@/lib/businessDays';
import { buildContactUrl } from '@/lib/contactHandoff';
import { chatNodes, LINE_URL, TEL, type ChatAction } from '@/lib/chatFlow';
import { cn } from '@/lib/utils';

/**
 * サービス案内のチャットボット。
 *
 * 見た目は会話の吹き出しではなく「受付票」。
 * サイト全体が点検票・見積書の体裁（u-label の欄名、u-num の数字、u-road の罫）で
 * 組まれているため、それに合わせている。答え終えた質問は控えの1行として残る。
 *
 * 自由入力は受け付けず、lib/chatFlow.ts のシナリオを選択肢でたどる。
 * 最後は必ず「ページを見る・フォーム・電話・LINE」のいずれかに着地させる。
 *
 * 自動車以外のページ（IT支援とそのテンプレート、ゲーム）では出さない。
 * 扱うサービスが違うため、同じ案内を出すとかえって迷わせる。
 */
const HIDDEN_PATH_PREFIXES = [
    '/it-support',
    '/coffee-site-template',
    '/gallery-site-template',
    '/housemaker-site-template',
    '/game',
    '/horse-run',
];

/**
 * 自動で開くのをやめる印。
 * 一度閉じた方や、すでに選択肢を使った方に、同じ訪問の間ずっと出し続けないため。
 * sessionStorage なのでタブを閉じると消え、次のご来訪ではまた開く。
 */
const AUTO_OPEN_DONE_KEY = 'kounan-service-chat-opened';

/**
 * 自動で開くまでの待ち時間（ミリ秒）。
 * 開いたページを見てもらう時間を取ってから出す。短すぎると何のページか分からなくなる。
 */
const AUTO_OPEN_DELAY_MS = 5000;

/** 欄名が決まっていないノード（答えを返すだけのノード）で使う既定の欄名 */
const DEFAULT_FIELD = '次のご案内';

/** 会話の1手。chose は、このノードでお客様が選んだ選択肢のラベル */
interface ChatStep {
    nodeId: string;
    chose?: string;
}

export default function ServiceChat() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [steps, setSteps] = useState<ChatStep[]>([{ nodeId: 'root' }]);

    /** 本日の営業状態。日付はブラウザで決まるため、マウント後に入れる */
    const [today, setToday] = useState<{ open: boolean; label: string } | null>(null);

    const panelRef = useRef<HTMLElement>(null);
    const logRef = useRef<HTMLDivElement>(null);

    // 自分で開いたときだけパネルへフォーカスを移すための印。
    // 自動で開いたときに移すと、ページを読み始めた方の操作位置を奪ってしまう
    const openedByUser = useRef(false);

    /** 閉じたあとに起動ボタンへフォーカスを戻すかどうかの印 */
    const restoreFocus = useRef(false);

    /** 次のページから自動で開かないようにする */
    const stopAutoOpen = useCallback(() => {
        try {
            sessionStorage.setItem(AUTO_OPEN_DONE_KEY, '1');
        } catch {
            // プライベートモードなどで保存できないときは、そのまま（また開く）でよい
        }
    }, []);

    /**
     * 受付票を閉じる。
     * フォーカスが中にあったときだけ起動ボタンへ戻す。
     * 自動で開いただけで触れていない場合に動かすと、読んでいる位置を奪ってしまう。
     */
    const closePanel = useCallback(() => {
        restoreFocus.current = panelRef.current?.contains(document.activeElement) ?? false;
        setOpen(false);
        stopAutoOpen();
    }, [stopAutoOpen]);

    // ページを開いてしばらくしてから自動で開く。
    // 読み込みと同時に出すと、どのページを開いたのか分からなくなるため間を置く。
    // ただし一度閉じた方・すでに選択肢を使った方には、同じ訪問の間は出さない
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                // 待っている間に閉じられたかどうかを、開く直前に見る
                if (sessionStorage.getItem(AUTO_OPEN_DONE_KEY)) return;
            } catch {
                // 読めないときは開く側に倒す
            }
            setOpen(true);
        }, AUTO_OPEN_DELAY_MS);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => setToday(getTodayStatus()), []);

    // Escapeで閉じる
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            closePanel();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, closePanel]);

    // 閉じたあとに起動ボタンへフォーカスを戻す。
    // 閉じる処理の直後はボタンがまだ非表示で focus() が効かないため、描画後に行う
    useEffect(() => {
        if (open || !restoreFocus.current) return;
        restoreFocus.current = false;
        document.getElementById('service-chat-toggle')?.focus();
    }, [open]);

    // やり取りが進んだら最新の行まで送る。
    // 開いた直後（最初の質問だけ）は、あいさつが隠れないよう先頭のままにする
    useEffect(() => {
        if (!open || steps.length === 1) return;
        const log = logRef.current;
        if (!log) return;
        // 依頼されていない演出は置かない方針なので、滑らせずに瞬時に移す。
        // 動きを減らす設定との衝突も起きない
        log.scrollTo({ top: log.scrollHeight, behavior: 'auto' });
    }, [open, steps]);

    // 自分で開いたときだけパネルへフォーカスを移す（キーボードで選択肢まで辿れるように）
    useEffect(() => {
        if (!open || !openedByUser.current) return;
        panelRef.current?.focus();
    }, [open]);

    if (HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

    const current = steps[steps.length - 1];
    const currentNode = chatNodes[current.nodeId] ?? chatNodes.root;

    /** 答え終えた質問（控えに残す行） */
    const filledLines = steps.filter((step) => step.chose);

    /** 選択肢を選んで次のノードへ進む */
    const goNext = (label: string, to: string) => {
        setSteps((prev) => [
            ...prev.slice(0, -1),
            { ...prev[prev.length - 1], chose: label },
            { nodeId: to },
        ]);
    };

    /** ひとつ前の選択に戻す */
    const goBack = () => {
        setSteps((prev) =>
            prev.length <= 1 ? prev : [...prev.slice(0, -2), { nodeId: prev[prev.length - 2].nodeId }]
        );
    };

    const restart = () => setSteps([{ nodeId: 'root' }]);

    /** 選択肢からチャットの外へ出るとき。閉じたうえで、次のページから自動で開かないようにする */
    const leaveChat = () => {
        setOpen(false);
        stopAutoOpen();
    };

    // 記入欄の1行。車検ページの見積書の行と同じ組み方にする
    const rowClass =
        'u-tap flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-[13px] leading-snug text-gray-900 transition-colors hover:border-mint-300 hover:bg-mint-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700';

    /** 行の右端に等幅で添える事実（料金・対応範囲・電話番号） */
    const factClass = 'u-num ml-auto shrink-0 text-[11px] font-normal text-gray-500';

    const renderAction = (action: ChatAction) => {
        switch (action.kind) {
            case 'next':
                return (
                    <button
                        type="button"
                        onClick={() => goNext(action.label, action.to)}
                        className={rowClass}
                    >
                        <span className="font-bold">{action.label}</span>
                        {action.fact && <span className={factClass}>{action.fact}</span>}
                    </button>
                );

            case 'link':
                // 外部リンク（Googleマップ）は新しいタブ、サイト内はそのまま遷移する
                return action.href.startsWith('http') ? (
                    <a
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={stopAutoOpen}
                        className={cn(rowClass, 'font-bold text-teal-700')}
                    >
                        {action.label}
                    </a>
                ) : (
                    <Link
                        href={action.href}
                        onClick={leaveChat}
                        className={cn(rowClass, 'font-bold text-teal-700')}
                    >
                        {action.label}
                    </Link>
                );

            case 'form': {
                const href = buildContactUrl({ category: action.category, lines: action.lines });
                // トップページからトップページへの client 遷移では再マウントが起きず、
                // フォームの初期値（ジャンル・相談内容）が入らない。
                // そのときだけ a でフルリロードさせる（他ページからは Link のまま速く移る）
                return pathname === '/' ? (
                    <a
                        href={href}
                        onClick={stopAutoOpen}
                        className={cn(rowClass, 'font-bold text-teal-700')}
                    >
                        {action.label}
                    </a>
                ) : (
                    <Link
                        href={href}
                        onClick={leaveChat}
                        className={cn(rowClass, 'font-bold text-teal-700')}
                    >
                        {action.label}
                    </Link>
                );
            }

            case 'tel':
                return (
                    <a
                        href={`tel:${TEL}`}
                        onClick={stopAutoOpen}
                        className={cn(rowClass, 'font-bold text-teal-700')}
                    >
                        {action.label}
                        <span className={factClass}>{TEL}</span>
                    </a>
                );

            case 'line':
                return (
                    <a
                        href={LINE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={stopAutoOpen}
                        className={cn(rowClass, 'font-bold text-line')}
                    >
                        {action.label}
                        <span className="ml-auto shrink-0 text-[11px] font-normal text-gray-500">
                            24時間受付
                        </span>
                    </a>
                );
        }
    };

    return (
        <>
            {/* 起動ボタン。車種ページ・トップページには高さ70px前後の固定バーが下にあるため、その上に置く */}
            <button
                id="service-chat-toggle"
                type="button"
                onClick={() => {
                    openedByUser.current = true;
                    setOpen((prev) => !prev);
                }}
                aria-expanded={open}
                className={cn(
                    'u-tap fixed right-4 z-50 flex h-12 items-center gap-2 rounded-full bg-teal-700 px-4 text-sm font-bold text-white shadow-lg transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.97] md:right-6 md:h-14 md:px-5',
                    'bottom-[calc(84px_+_env(safe-area-inset-bottom))]',
                    open && 'hidden'
                )}
            >
                {/* 受付票のアイコン（けい紙に記入する） */}
                <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 2a1 1 0 0 0-1 1v1H6.5A1.5 1.5 0 0 0 5 5.5v15A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 17.5 4H16V3a1 1 0 0 0-1-1H9Zm0 2h6v1H9V4ZM8 9h8v1.5H8V9Zm0 4h8v1.5H8V13Zm0 4h5v1.5H8V17Z" />
                </svg>
                ご相談
            </button>

            {open && (
                /* ダイアログではなく、起動ボタンで開閉する領域。
                   フォーカスを閉じ込めずページも操作できるため、dialog とは名乗らない */
                <section
                    id="service-chat-panel"
                    ref={panelRef}
                    tabIndex={-1}
                    aria-labelledby="service-chat-title"
                    className="fixed inset-x-4 bottom-[calc(84px_+_env(safe-area-inset-bottom))] z-50 flex max-h-[min(70dvh,560px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg outline-none md:inset-x-auto md:right-6 md:w-[380px]"
                >
                    {/* 受付票の見出し。本日の営業状態をここに出す */}
                    <div className="shrink-0 px-5 pt-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2
                                    id="service-chat-title"
                                    className="text-balance text-[15px] font-bold leading-tight text-gray-900"
                                >
                                    ご相談受付票
                                </h2>
                                {today && (
                                    <p
                                        className={cn(
                                            'mt-1 text-[11px]',
                                            today.open ? 'text-teal-700' : 'text-red-700'
                                        )}
                                    >
                                        <span className={today.open ? 'u-num' : undefined}>
                                            {today.label}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={closePanel}
                                aria-label="受付票を閉じる"
                                className="u-tap -mr-2 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="size-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 5.7 18.3 4.3 16.9 10.6 12 4.3 5.7 5.7 4.3 12 10.6l4.9-4.9z" />
                                </svg>
                            </button>
                        </div>
                        <hr className="u-road mt-3" aria-hidden="true" />
                    </div>

                    {/* 記入内容 */}
                    <div ref={logRef} className="flex-1 overflow-y-auto px-5 py-4">
                        {/* 答え終えた質問は、欄名と答えの1行として控えに残る */}
                        {filledLines.length > 0 && (
                            <dl className="mb-4">
                                {filledLines.map((step, index) => (
                                    <div
                                        key={`${step.nodeId}-${index}`}
                                        className="flex items-baseline justify-between gap-4 border-b border-gray-200 py-2"
                                    >
                                        <dt className="u-label shrink-0">
                                            {chatNodes[step.nodeId]?.field ?? DEFAULT_FIELD}
                                        </dt>
                                        <dd className="text-right text-[13px] font-bold text-gray-900">
                                            {step.chose}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        {/* いまの案内文。
                            選択のたびに増えるのはここだけなので、読み上げ対象もここに限る。
                            選択肢まで含めると受付票全体が毎回読み直されてしまう */}
                        <div aria-live="polite" className="space-y-2">
                            {currentNode.says.map((line, index) => (
                                <p
                                    key={index}
                                    className="text-pretty text-[13px] leading-relaxed text-gray-700"
                                >
                                    {line}
                                </p>
                            ))}
                        </div>

                        {/* 次に記入する欄 */}
                        <div role="group" aria-labelledby="service-chat-field" className="mt-4">
                            <p id="service-chat-field" className="u-label mb-2">
                                {currentNode.field ?? DEFAULT_FIELD}
                            </p>
                            {/* 「9項目中の3番目」が伝わるようリストにする */}
                            <ul className="space-y-1.5">
                                {currentNode.actions.map((action, index) => (
                                    <li key={index}>{renderAction(action)}</li>
                                ))}
                            </ul>
                        </div>

                        {steps.length > 1 && (
                            <div className="mt-3 flex gap-4 text-[12px] text-gray-500">
                                <button
                                    type="button"
                                    onClick={goBack}
                                    className="u-tap underline transition-colors hover:text-teal-700"
                                >
                                    ひとつ前に戻る
                                </button>
                                <button
                                    type="button"
                                    onClick={restart}
                                    className="u-tap underline transition-colors hover:text-teal-700"
                                >
                                    最初から
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 人に繋がる導線。スマホではページ下部の固定バーと重なるので出さない */}
                    <div className="hidden shrink-0 grid-cols-2 border-t border-gray-200 md:grid">
                        <a
                            href={`tel:${TEL}`}
                            onClick={stopAutoOpen}
                            className="u-tap flex items-center justify-center gap-1.5 border-r border-gray-200 py-2.5 text-[12px] font-bold text-teal-700 transition-colors hover:bg-mint-50"
                        >
                            <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                            </svg>
                            電話で聞く
                        </a>
                        <a
                            href={LINE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={stopAutoOpen}
                            className="u-tap flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold text-line transition-colors hover:bg-mint-50"
                        >
                            <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                            </svg>
                            LINEで送る
                        </a>
                    </div>
                </section>
            )}
        </>
    );
}
