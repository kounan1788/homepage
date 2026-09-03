/**
 * ノレタのローン計算ロジック。
 * 残債方式（元利均等）で、ボーナス月（年2回）に繰上返済を上乗せした場合に
 * 分割手数料がいくら減るかを算出します。
 *
 * 月々の支払額は変えず、ボーナス月にだけ追加で返済する考え方のため、
 * 返済期間が短縮され、その分の利息が軽くなります。
 *
 * UIから独立して検証できるよう、副作用のない純粋関数のみを置いています。
 */

import { ANNUAL_INTEREST_RATE, BONUS_INTERVAL_MONTHS, LOAN_PAYMENTS } from './carPrices';

/** 返済シミュレーションが発散した場合の打ち切り月数（無限ループ防止） */
const MAX_MONTHS = 600;

/** 元金と月額から、完済までの総支払額を求めます。 */
function totalPaid(principal: number, monthlyPayment: number, bonusPerTime: number): number {
    const monthlyRate = ANNUAL_INTEREST_RATE / 12;
    let balance = principal;
    let paid = 0;

    for (let month = 1; month <= MAX_MONTHS && balance > 0; month++) {
        balance *= 1 + monthlyRate;
        balance -= monthlyPayment;
        paid += monthlyPayment;
        // 6か月ごとのボーナス月に追加返済する
        if (month % BONUS_INTERVAL_MONTHS === 0) {
            balance -= bonusPerTime;
            paid += bonusPerTime;
        }
    }

    // 最終月に払いすぎた分を戻す
    return paid + balance;
}

/** ボーナス払いなしで36回完済するための月額を二分探索で求めます。 */
function solveMonthlyPayment(principal: number): number {
    const monthlyRate = ANNUAL_INTEREST_RATE / 12;
    let low = 0;
    let high = principal;

    for (let i = 0; i < 60; i++) {
        const monthly = (low + high) / 2;
        let balance = principal;
        for (let month = 1; month <= LOAN_PAYMENTS; month++) {
            balance *= 1 + monthlyRate;
            balance -= monthly;
        }
        if (balance > 0) {
            low = monthly;
        } else {
            high = monthly;
        }
    }

    return high;
}

/**
 * ボーナス月に追加返済したときに、ボーナス払いなしと比べて
 * 分割手数料がいくら減るかを返します（円）。
 */
export function calcInterestReduction(principal: number, bonusPerTime: number): number {
    if (principal <= 0 || bonusPerTime <= 0) {
        return 0;
    }

    const monthlyPayment = solveMonthlyPayment(principal);
    const interestWithoutBonus = totalPaid(principal, monthlyPayment, 0) - principal;
    const interestWithBonus = totalPaid(principal, monthlyPayment, bonusPerTime) - principal;

    return Math.max(0, Math.round(interestWithoutBonus - interestWithBonus));
}
