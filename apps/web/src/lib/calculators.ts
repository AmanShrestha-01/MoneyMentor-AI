// UI-preview calculators for the clickable demo. The authoritative versions will be
// Python tools in services/api (Sprint 2); these mirror them so the prototype can run
// without a backend. Keep the two in sync and covered by tests.

export type CashFlowInput = { available: number; obligations: number; purchase: number };

export type CashFlowResult = {
  remaining: number;
  status: "surplus" | "exact" | "shortfall";
};

function assertAmount(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative number`);
  }
}

// Work in whole cents so 0.1 + 0.2 style float errors never reach the student.
const toCents = (dollars: number) => Math.round(dollars * 100);

export function calculateCashFlow({ available, obligations, purchase }: CashFlowInput): CashFlowResult {
  assertAmount("available", available);
  assertAmount("obligations", obligations);
  assertAmount("purchase", purchase);

  const remainingCents = toCents(available) - toCents(obligations) - toCents(purchase);
  const status = remainingCents > 0 ? "surplus" : remainingCents === 0 ? "exact" : "shortfall";
  return { remaining: remainingCents / 100, status };
}

export type LoanResult = { monthlyPayment: number; totalPaid: number; totalInterest: number };

/** Standard fixed-rate amortization. Illustration only: ignores fees and repayment plans. */
export function calculateLoanPayment(principal: number, annualRatePercent: number, years: number): LoanResult {
  assertAmount("principal", principal);
  assertAmount("annualRatePercent", annualRatePercent);
  if (!Number.isFinite(years) || years <= 0) throw new RangeError("years must be positive");

  const months = Math.round(years * 12);
  const monthlyRate = annualRatePercent / 100 / 12;
  const payment =
    monthlyRate === 0 ? principal / months : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    monthlyPayment: round2(payment),
    totalPaid: round2(payment * months),
    totalInterest: round2(payment * months - principal),
  };
}

export function formatMoney(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  });
  return amount < 0 ? `−${formatted}` : formatted;
}
