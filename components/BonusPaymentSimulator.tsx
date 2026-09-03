'use client';

import { useState } from 'react';
import { calcInterestReduction } from '@/lib/loanCalculator';
import { ANNUAL_INTEREST_RATE, BONUS_INTERVAL_MONTHS, LOAN_PAYMENTS } from '@/lib/carPrices';

interface BonusPaymentSimulatorProps {
    /** ローン計算に使う元金（円） */
    principal: number;
}

/** スライダーの上限（ボーナス1回あたりの加算額） */
const MAX_BONUS = 200000;

/** スライダーの刻み幅 */
const BONUS_STEP = 10000;

/** ボーナス払いの回数（年2回×契約年数） */
const BONUS_COUNT = Math.floor(LOAN_PAYMENTS / BONUS_INTERVAL_MONTHS);

/**
 * ボーナス払い（年2回）を上乗せしたときに、分割手数料がいくら減るかを表示します。
 * 月々の支払額は変わらないため、手数料の軽減額だけを示します。
 */
export default function BonusPaymentSimulator({ principal }: BonusPaymentSimulatorProps) {
    const [bonusPerTime, setBonusPerTime] = useState<number>(0);

    const interestReduction = calcInterestReduction(principal, bonusPerTime);

    return (
        <section className="rounded-2xl border border-rule bg-white">
            <h2 className="border-b border-rule px-5 py-3">
                <span className="u-label">ボーナス払い（年2回）</span>
            </h2>

            <div className="p-5">
                <p className="mb-5 text-sm leading-relaxed text-gray-600">
                    月々のお支払いはそのままに、ボーナス月に上乗せすると分割手数料が軽くなります。
                </p>

                <label htmlFor="bonus-slider" className="block text-xs text-gray-500">
                    ボーナス1回あたりの上乗せ額
                </label>
                <div className={`u-num mb-3 mt-1 text-3xl font-bold ${bonusPerTime > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                    {bonusPerTime.toLocaleString()}
                    <span className="ml-1 font-sans text-base font-normal text-gray-500">円</span>
                </div>

                <input
                    id="bonus-slider"
                    type="range"
                    min={0}
                    max={MAX_BONUS}
                    step={BONUS_STEP}
                    value={bonusPerTime}
                    onChange={(e) => setBonusPerTime(Number(e.target.value))}
                    className="w-full cursor-pointer accent-teal-700"
                    aria-describedby="bonus-result"
                />
                <div className="u-num mt-1 flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>{MAX_BONUS.toLocaleString()}</span>
                </div>

                <div
                    id="bonus-result"
                    aria-live="polite"
                    className="mt-5 flex items-baseline justify-between gap-4 border-t border-rule pt-4"
                >
                    <span className="text-sm text-gray-700">分割手数料</span>
                    {interestReduction > 0 ? (
                        <span className="u-num text-2xl font-bold text-teal-700">
                            −{interestReduction.toLocaleString()}
                            <span className="ml-1 font-sans text-sm font-normal text-gray-600">円</span>
                        </span>
                    ) : (
                        <span className="text-sm text-gray-500">上乗せなし</span>
                    )}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-gray-500">
                    実質年率{(ANNUAL_INTEREST_RATE * 100).toFixed(1)}%・{LOAN_PAYMENTS}回払い・ボーナス
                    {BONUS_COUNT}回で試算した概算です。実際のお支払い額は審査結果により異なります。
                </p>
            </div>
        </section>
    );
}
