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
        <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center">
                <span className="w-1 h-5 bg-teal-700 mr-3"></span>
                ボーナス払い（年2回）
            </h2>
            <p className="text-sm text-slate-500 mb-6">
                月々のお支払いはそのままに、ボーナス月に上乗せすると分割手数料が軽くなります。
            </p>

            <label htmlFor="bonus-slider" className="block text-sm font-medium text-slate-600 mb-2">
                ボーナス1回あたりの上乗せ額
            </label>
            <div className="text-3xl font-bold text-teal-700 mb-4 tabular-nums">
                {bonusPerTime.toLocaleString()}
                <span className="text-base font-medium text-slate-500 ml-1">円</span>
            </div>

            <input
                id="bonus-slider"
                type="range"
                min={0}
                max={MAX_BONUS}
                step={BONUS_STEP}
                value={bonusPerTime}
                onChange={(e) => setBonusPerTime(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
                aria-describedby="bonus-result"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1 mb-6">
                <span>0円</span>
                <span>{MAX_BONUS.toLocaleString()}円</span>
            </div>

            <div id="bonus-result" aria-live="polite" className="bg-teal-50 rounded p-4 text-center">
                <div className="text-sm font-medium text-teal-900 mb-1">分割手数料</div>
                {interestReduction > 0 ? (
                    <div className="text-3xl font-bold text-teal-700 tabular-nums">
                        −{interestReduction.toLocaleString()}
                        <span className="text-base font-medium ml-1">円 おトク</span>
                    </div>
                ) : (
                    <div className="text-lg font-medium text-slate-500">
                        スライダーを動かすと軽減額が表示されます
                    </div>
                )}
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                実質年率{(ANNUAL_INTEREST_RATE * 100).toFixed(1)}%・{LOAN_PAYMENTS}回払い・ボーナス
                {BONUS_COUNT}回で試算した概算です。実際のお支払い額は審査結果により異なります。
            </p>
        </div>
    );
}
