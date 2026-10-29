"use client";

import { useId, useState } from "react";
import { Card, Note } from "@/components/ui";
import { calculateCashFlow, calculateLoanPayment, formatMoney } from "@/lib/calculators";

// Inputs stay as strings so a student can clear a field while typing; parse on render.
const parseAmount = (value: string) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

function AmountField({ label, value, onChange, step = "1" }: { label: string; value: string; onChange: (v: string) => void; step?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      <input
        id={id}
        type="number"
        min="0"
        step={step}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-lg border border-[#c9c1b4] bg-card px-3.5 text-base"
      />
    </div>
  );
}

const statusCopy = {
  surplus: { label: "Left over", box: "bg-primary-soft", ink: "text-primary" },
  exact: { label: "Exactly covered", box: "bg-accent", ink: "text-accent-foreground" },
  shortfall: { label: "Shortfall", box: "bg-notice", ink: "text-notice-foreground" },
} as const;

function CashFlowCalculator() {
  const [available, setAvailable] = useState("500");
  const [obligations, setObligations] = useState("350");
  const [purchase, setPurchase] = useState("200");

  const a = parseAmount(available), o = parseAmount(obligations), p = parseAmount(purchase);
  const result = calculateCashFlow({ available: a, obligations: o, purchase: p });
  const style = statusCopy[result.status];
  const explanation =
    result.status === "surplus"
      ? `Under these numbers, commitments and the purchase are covered with ${formatMoney(result.remaining)} to spare.`
      : result.status === "exact"
        ? "Everything is covered, but there is no cushion for anything unexpected."
        : `Under these numbers you would be ${formatMoney(-result.remaining)} short of covering both commitments and the purchase.`;
  const whatIfs = [
    { label: "No purchase", purchase: 0 },
    { label: `Half the purchase (${formatMoney(p / 2)})`, purchase: p / 2 },
    { label: `Full purchase (${formatMoney(p)})`, purchase: p },
  ];

  return (
    <Card title="Can I afford this right now?">
      <p className="-mt-2 text-sm text-muted-foreground">
        A simple cash-flow check: what you have, minus what&apos;s committed, minus the purchase.
      </p>
      <div className="flex flex-wrap gap-6">
        <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5">
          <AmountField label="Money available now ($)" value={available} onChange={setAvailable} />
          <AmountField label="Already committed — rent, bills ($)" value={obligations} onChange={setObligations} />
          <AmountField label="Purchase you're considering ($)" value={purchase} onChange={setPurchase} />
        </div>
        <div role="status" aria-live="polite" className={`flex min-w-0 flex-[1_1_260px] flex-col gap-2 rounded-xl p-5 ${style.box}`}>
          <span className={`text-xs font-semibold uppercase tracking-wide ${style.ink}`}>{style.label}</span>
          <span className="text-4xl font-bold tracking-tight">{formatMoney(result.remaining)}</span>
          <span className="leading-relaxed">{explanation}</span>
          <span className="text-sm text-muted-foreground">
            {formatMoney(a)} − {formatMoney(o)} − {formatMoney(p)} = {formatMoney(result.remaining)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold">What if the purchase were different?</h3>
        <ul className="grid gap-2.5 sm:grid-cols-3">
          {whatIfs.map((w) => (
            <li key={w.label} className="flex flex-col gap-1 rounded-xl border border-border p-3.5">
              <span className="text-sm text-muted-foreground">{w.label}</span>
              <span className="text-lg font-bold">
                {formatMoney(calculateCashFlow({ available: a, obligations: o, purchase: w.purchase }).remaining)}
              </span>
              <span className="text-sm text-muted-foreground">left after commitments</span>
            </li>
          ))}
        </ul>
      </div>
      <Note>
        <strong className="font-semibold">Assumptions &amp; limits:</strong> uses only the numbers you enter. Doesn&apos;t know
        about income arriving later, other upcoming bills, fees, or interest. The result describes a scenario — it isn&apos;t a
        recommendation to buy or not buy.
      </Note>
    </Card>
  );
}

function LoanCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5.5");
  const [years, setYears] = useState("10");
  const loan = calculateLoanPayment(parseAmount(principal), parseAmount(rate), Math.max(1, parseAmount(years)));

  return (
    <Card title="Student loan payment illustration">
      <p className="-mt-2 text-sm text-muted-foreground">
        See how the amount, interest rate, and time affect a fixed monthly payment.
      </p>
      <div className="flex flex-wrap gap-6">
        <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5">
          <AmountField label="Amount borrowed ($)" value={principal} onChange={setPrincipal} />
          <AmountField label="Annual interest rate (%)" value={rate} onChange={setRate} step="0.1" />
          <AmountField label="Years to repay" value={years} onChange={setYears} />
        </div>
        <div role="status" aria-live="polite" className="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5 rounded-xl bg-primary-soft p-5">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">Monthly payment</span>
            <span className="text-4xl font-bold tracking-tight">{formatMoney(loan.monthlyPayment)}</span>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-muted-foreground">Total repaid</dt><dd className="font-bold">{formatMoney(Math.round(loan.totalPaid))}</dd></div>
            <div><dt className="text-muted-foreground">Of which interest</dt><dd className="font-bold">{formatMoney(Math.round(loan.totalInterest))}</dd></div>
          </dl>
        </div>
      </div>
      <Note>
        <strong className="font-semibold">Illustration only.</strong> Assumes a fixed rate and equal monthly payments. Real
        federal loans have different repayment plans, fees, and grace periods — check{" "}
        <a href="https://studentaid.gov" className="font-semibold underline">studentaid.gov</a> or talk with your financial aid office.
      </Note>
    </Card>
  );
}

export function DecisionLab() {
  return (
    <>
      <CashFlowCalculator />
      <LoanCalculator />
    </>
  );
}
