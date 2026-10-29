// Run with: npm test   (Node's built-in test runner; Node 23+ strips TypeScript types natively)
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateCashFlow, calculateLoanPayment, formatMoney } from "./calculators.ts";

describe("calculateCashFlow", () => {
  it("reports the $50 shortfall from the project's reference scenario", () => {
    assert.deepEqual(calculateCashFlow({ available: 500, obligations: 350, purchase: 200 }), {
      remaining: -50,
      status: "shortfall",
    });
  });

  it("distinguishes surplus, exact, and shortfall", () => {
    assert.equal(calculateCashFlow({ available: 500, obligations: 350, purchase: 0 }).status, "surplus");
    assert.equal(calculateCashFlow({ available: 500, obligations: 350, purchase: 150 }).status, "exact");
  });

  it("avoids floating-point drift", () => {
    assert.equal(calculateCashFlow({ available: 0.3, obligations: 0.1, purchase: 0.2 }).remaining, 0);
  });

  it("rejects negative or non-numeric input instead of guessing", () => {
    assert.throws(() => calculateCashFlow({ available: -1, obligations: 0, purchase: 0 }), RangeError);
    assert.throws(() => calculateCashFlow({ available: Number.NaN, obligations: 0, purchase: 0 }), RangeError);
  });
});

describe("calculateLoanPayment", () => {
  it("matches the standard amortization formula", () => {
    // $10,000 at 5.5% over 10 years is about $108.53/month.
    assert.equal(calculateLoanPayment(10_000, 5.5, 10).monthlyPayment, 108.53);
  });

  it("handles a zero interest rate", () => {
    const result = calculateLoanPayment(1_200, 0, 1);
    assert.equal(result.monthlyPayment, 100);
    assert.equal(result.totalInterest, 0);
  });
});

describe("formatMoney", () => {
  it("formats negatives with a minus sign", () => {
    assert.equal(formatMoney(-50), "−$50");
    assert.equal(formatMoney(108.53), "$108.53");
  });
});
