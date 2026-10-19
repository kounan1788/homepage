'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buildContactUrl } from '@/lib/contactHandoff';
import { chatNodes, LINE_URL, TEL, type ChatAction } from '@/lib/chatFlow';
import { cn } from '@/lib/utils';

/**
 * サービス案内のチャットボット。
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

/** 会話の1手。chose は、このノードでお客様が選んだ選択肢のラベル */
interface ChatStep {
    nodeId: string;
    chose?: string;
}

export default function ServiceChat() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [steps, setSteps] = useState<ChatStep[]>([{ nodeId: 'root' }]);

    const panelRef = useRef<HTMLDivElement>(null);
    const logRef = useRef<HTMLDivElement>(null);

    // 自分で開いたときだけパネルへフォーカスを移すための印。
    // 自動で開いたときに移すと、ページを読み始めた方の操作位置を奪ってしまう
    const openedByUser = useRef(false);

    /** 次のページから自動で開かないようにする */
    const stopAutoOpen = () => {
        try {
            sessionStorage.setItem(AUTO_OPEN_DONE_KEY, '1');
        } catch {
            // プライベートモードなどで保存できないときは、そのまま（また開く）でよい
        }
    };

    // ページを開いたら自動で開く。
    // ただし一度閉じた方・すでに選択肢を使った方には、同じ訪問の間は出さない
    useEffect(() => {
        try {
            if (sessionStorage.getItem(AUTO_OPEN_DONE_KEY)) return;
        } catch {
            // 読めないときは開く側に倒す
        }
        setOpen(true);
    }, []);

    // Escapeで閉じ、開閉ボタンへフォーカスを戻す
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setOpen(false);
            stopAutoOpen();
            document.getElementById('service-chat-toggle')?.focus();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open]);

    // やり取りが進んだら最新の発言まで送る。
    // 開いた直後（最初の質問だけ）は、あいさつが隠れないよう先頭のままにする
    useEffect(() => {
        if (!open || steps.length === 1) return;
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
    }, [open, steps]);

    // 自分で開いたときだけパネルへフォーカスを移す（キーボードで選択肢まで辿れるように）
    useEffect(() => {
        if (!open || !openedByUser.current) return;
        panelRef.current?.focus();
    }, [open]);

    if (HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

    const current = steps[steps.length - 1];
    const currentNode = chatNodes[current.nodeId] ?? chatNodes.root;

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

    // 選択肢の見た目は共通。種類ごとに中身（button / Link / a）だけ変える
    const optionClass =
        'u-tap flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-left text-[13px] leading-snug text-gray-900 transition-colors hover:border-teal-600 hover:bg-teal-50 active:bg-teal-100';

    const renderAction = (action: ChatAction, index: number) => {
        switch (action.kind) {
            case 'next':
                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => goNext(action.label, action.to)}
                        className={optionClass}
                    >
                        {action.label}
                    </button>
                );

            case 'link':
                // 外部リンク（Googleマップ）は新しいタブ、サイト内はそのまま遷移する
                return action.href.startsWith('http') ? (
                    <a
                        key={index}
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={stopAutoOpen}
                        className={cn(optionClass, 'font-bold text-teal-700')}
                    >
                        {action.label}
                    </a>
                ) : (
                    <Link
                        key={index}
                        href={action.href}
                        onClick={leaveChat}
                        className={cn(optionClass, 'font-bold text-teal-700')}
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
                        key={index}
                        href={href}
                        onClick={stopAutoOpen}
                        className={cn(optionClass, 'font-bold text-teal-700')}
                    >
                        {action.label}
                    </a>
                ) : (
                    <Link
                        key={index}
                        href={href}
                        onClick={leaveChat}
                        className={cn(optionClass, 'font-bold text-teal-700')}
                    >
                        {action.label}
                    </Link>
                );
            }

            case 'tel':
                return (
                    <a
                        key={index}
                        href={`tel:${TEL}`}
                        onClick={stopAutoOpen}
                        className={cn(optionClass, 'font-bold text-teal-700')}
                    >
                        {action.label}
                        <span className="u-num ml-auto text-[11px] font-normal text-gray-500">{TEL}</span>
                    </a>
                );

            case 'line':
                return (
                    <a
                        key={index}
                        href={LINE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={stopAutoOpen}
                        className={cn(optionClass, 'font-bold text-[#06C755]')}
                    >
                        {action.label}
                        <span className="ml-auto text-[11px] font-normal text-gray-500">24時間受付</span>
                    </a>
                );
        }
    };

    return (
        <>
            {/* 起動ボタン。スマホでは下部の固定バー（68px）に重ならない高さに置く */}
            <button
                id="service-chat-toggle"
                type="button"
                onClick={() => {
                    openedByUser.current = true;
                    setOpen((prev) => !prev);
                }}
                aria-expanded={open}
                aria-controls="service-chat-panel"
                className={cn(
                    'u-tap fixed right-4 z-50 flex h-12 items-center gap-2 rounded-full bg-teal-700 px-4 text-sm font-bold text-white shadow-lg transition-[background-color,transform] duration-200 hover:bg-teal-600 active:scale-[0.97] md:right-6 md:h-14 md:px-5',
                    // 車種ページ・トップページには高さ70px前後の固定バーが下にあるため、その上に置く
                    'bottom-[calc(84px_+_env(safe-area-inset-bottom))]',
                    open && 'hidden'
                )}
            >
                <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3C6.5 3 2 6.58 2 11c0 2.5 1.44 4.73 3.7 6.2-.14.9-.6 2.3-1.45 3.4-.2.26.05.63.37.54 2.1-.57 3.6-1.5 4.4-2.1.95.2 1.95.3 2.98.3 5.5 0 10-3.58 10-8S17.5 3 12 3Z" />
                </svg>
                ご相談
            </button>

            {open && (
                <div
                    id="service-chat-panel"
                    ref={panelRef}
                    tabIndex={-1}
                    role="dialog"
                    aria-label="港南自動車サービスへのご相談"
                    className="fixed inset-x-4 z-50 flex max-h-[min(70dvh,560px)] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg outline-none bottom-[calc(84px_+_env(safe-area-inset-bottom))] md:inset-x-auto md:right-6 md:w-[380px]"
                >
                    {/* ヘッダー：戻る／社名／閉じる */}
                    <div className="flex items-center gap-2 bg-teal-700 px-3 py-2.5 text-white">
                        {steps.length > 1 ? (
                            <button
                                type="button"
                                onClick={goBack}
                                aria-label="ひとつ前に戻る"
                                className="u-tap -ml-1 flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                            >
                                <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z" />
                                </svg>
                            </button>
                        ) : (
                            <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
                                <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3C6.5 3 2 6.58 2 11c0 2.5 1.44 4.73 3.7 6.2-.14.9-.6 2.3-1.45 3.4-.2.26.05.63.37.54 2.1-.57 3.6-1.5 4.4-2.1.95.2 1.95.3 2.98.3 5.5 0 10-3.58 10-8S17.5 3 12 3Z" />
                                </svg>
                            </span>
                        )}
                        <div className="flex-1 leading-tight">
                            <p className="text-sm font-bold">港南自動車サービス</p>
                            <p className="text-[11px] text-teal-100">ご相談の受付</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                stopAutoOpen();
                                document.getElementById('service-chat-toggle')?.focus();
                            }}
                            aria-label="チャットを閉じる"
                            className="u-tap -mr-1 flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                        >
                            <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 5.7 18.3 4.3 16.9 10.6 12 4.3 5.7 5.7 4.3 12 10.6l4.9-4.9z" />
                            </svg>
                        </button>
                    </div>

                    {/* やり取り。読み上げは追加分だけ伝わるよう polite にする */}
                    <div ref={logRef} aria-live="polite" className="flex-1 overflow-y-auto px-3 py-4">
                        {steps.map((step, stepIndex) => {
                            const node = chatNodes[step.nodeId] ?? chatNodes.root;
                            return (
                                <div key={`${step.nodeId}-${stepIndex}`} className="flex flex-col gap-2.5">
                                    {node.says.map((line, lineIndex) => (
                                        <p
                                            key={lineIndex}
                                            className="max-w-[88%] rounded-lg rounded-tl-sm bg-gray-100 px-3 py-2 text-[13px] leading-relaxed text-gray-900"
                                        >
                                            {line}
                                        </p>
                                    ))}
                                    {step.chose && (
                                        <p className="mb-1 ml-auto max-w-[80%] rounded-lg rounded-tr-sm bg-teal-700 px-3 py-2 text-[13px] font-bold leading-relaxed text-white">
                                            {step.chose}
                                        </p>
                                    )}
                                </div>
                            );
                        })}

                        <div className="mt-3 flex flex-col gap-2">
                            {currentNode.actions.map(renderAction)}
                            {steps.length > 1 && (
                                <button
                                    type="button"
                                    onClick={restart}
                                    className="u-tap mt-1 self-start text-[12px] text-gray-500 underline transition-colors hover:text-teal-700"
                                >
                                    最初に戻る
                                </button>
                            )}
                        </div>
                    </div>

                    {/* いつでも人に繋がる導線。迷ったときの出口を常に出しておく */}
                    <div className="grid grid-cols-2 border-t border-gray-200">
                        <a
                            href={`tel:${TEL}`}
                            className="u-tap flex items-center justify-center gap-1.5 border-r border-gray-200 py-2.5 text-[12px] font-bold text-teal-700 transition-colors hover:bg-teal-50"
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
                            className="u-tap flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold text-[#06C755] transition-colors hover:bg-green-50"
                        >
                            <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                            </svg>
                            LINEで送る
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
