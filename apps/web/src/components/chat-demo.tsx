"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonStyles, CheckIcon, Note, pillStyle } from "@/components/ui";
import { brand } from "@/lib/brand";
import { calculateCashFlow, formatMoney } from "@/lib/calculators";

// Scripted walkthrough of the Phase 2 reference scenario. No AI is called: the flow shows
// the intended consent → calculate → explain → alternatives pattern with real arithmetic.
const scenario = { available: 500, obligations: 350, purchase: 200 };
const question = `I have ${formatMoney(scenario.available)}, rent is ${formatMoney(scenario.obligations)}, and I want to buy something for ${formatMoney(scenario.purchase)}. What would my remaining balance be?`;

const rooms = [
  { id: "learning", label: "Financial Learning", scope: "Explains concepts from the approved lesson library." },
  { id: "decision", label: "Decision Support", scope: "Can use the cash-flow and scenario calculators on numbers you type. Never decides for you." },
  { id: "plan", label: "Learning Plan", scope: "Suggests short lessons based on goals you set." },
  { id: "resources", label: "Campus Resources", scope: "Searches verified campus and community resources only." },
] as const;

type Step = "start" | "consent" | "result" | "concept";

function MiloBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-xl flex-col gap-3 rounded-[4px_16px_16px_16px] bg-muted px-4 py-3.5 leading-relaxed">
      {children}
    </div>
  );
}

export function ChatDemo() {
  const [step, setStep] = useState<Step>("start");
  const [roomId, setRoomId] = useState<(typeof rooms)[number]["id"]>("decision");
  const [reminder, setReminder] = useState<"set" | "declined" | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const room = rooms.find((r) => r.id === roomId) ?? rooms[1];
  const result = calculateCashFlow(scenario);
  const leftAfterObligations = calculateCashFlow({ ...scenario, purchase: 0 }).remaining;
  const reducedPurchase = scenario.available - scenario.obligations;

  function restart() {
    setStep("start");
    setReminder(null);
    setFeedback(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div role="group" aria-label="Chat rooms" className="flex flex-wrap gap-2">
          {rooms.map((r) => (
            <button key={r.id} type="button" aria-pressed={r.id === roomId} onClick={() => setRoomId(r.id)} className={pillStyle(r.id === roomId)}>
              {r.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">In this room:</span> {room.scope}
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <section aria-label="Conversation" className="flex min-w-0 flex-[999_1_520px] flex-col rounded-card border border-border bg-card">
          <div aria-live="polite" className="flex flex-col gap-5 p-5 sm:p-6">
            <MiloBubble>
              Hi Alex — I&apos;m {brand.assistantName}. I can help you think through money decisions using
              hypothetical numbers you type in. I can&apos;t see your bank accounts, and the decision is always yours.
            </MiloBubble>

            {step === "start" && (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Try asking:</span>
                <button type="button" onClick={() => { setStep("consent"); setRoomId("decision"); }} className="rounded-lg border border-primary bg-card px-4 py-3 text-left text-sm font-semibold leading-relaxed text-primary hover:bg-primary-soft">
                  {question}
                </button>
              </div>
            )}

            {step !== "start" && (
              <div className="max-w-lg self-end rounded-[16px_4px_16px_16px] bg-primary px-4 py-3.5 leading-relaxed text-primary-foreground">
                {question}
              </div>
            )}

            {step === "consent" && (
              <div className="flex max-w-xl flex-col gap-3.5 rounded-[4px_16px_16px_16px] border border-border p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">Permission request</p>
                <p className="leading-relaxed">
                  I can run this through the cash-flow calculator using the three numbers you just typed:{" "}
                  <strong>{formatMoney(scenario.available)} available</strong>, <strong>{formatMoney(scenario.obligations)} rent</strong>,
                  and a <strong>{formatMoney(scenario.purchase)} purchase</strong>. I&apos;ll use them for this calculation only and
                  won&apos;t save them to your profile. Is that okay?
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <button type="button" onClick={() => setStep("result")} className={buttonStyles.primary}>Yes, use these numbers</button>
                  <button type="button" onClick={() => setStep("concept")} className={buttonStyles.secondary}>No — just explain the idea</button>
                </div>
              </div>
            )}

            {step === "result" && (
              <div className="flex max-w-2xl flex-col gap-4">
                <p className="inline-flex items-center gap-2 self-start rounded-full bg-primary-soft px-3 py-1.5 text-sm font-semibold text-primary">
                  <CheckIcon className="mt-0 text-primary" /> Cash-flow calculator · numbers checked by code
                </p>

                <div className="flex flex-col gap-3 rounded-[4px_16px_16px_16px] border border-border p-4 sm:p-5">
                  <table className="w-full text-[15px]">
                    <caption className="pb-2 text-left text-sm text-muted-foreground">Your scenario (hypothetical)</caption>
                    <tbody>
                      <tr className="border-b border-muted"><th scope="row" className="py-2 text-left font-medium">Money available</th><td className="py-2 text-right">{formatMoney(scenario.available)}</td></tr>
                      <tr className="border-b border-muted"><th scope="row" className="py-2 text-left font-medium">Rent</th><td className="py-2 text-right">{formatMoney(-scenario.obligations)}</td></tr>
                      <tr className="border-b border-border"><th scope="row" className="py-2 text-left font-medium">Planned purchase</th><td className="py-2 text-right">{formatMoney(-scenario.purchase)}</td></tr>
                      <tr><th scope="row" className="pt-2.5 text-left font-bold">Remaining</th><td className="pt-2.5 text-right font-bold text-notice-foreground">{formatMoney(result.remaining)}</td></tr>
                    </tbody>
                  </table>
                  <p className="leading-relaxed">
                    Under these assumptions, you&apos;d be <strong>{formatMoney(-result.remaining)} short</strong> — the{" "}
                    {formatMoney(scenario.available)} doesn&apos;t cover both rent and the purchase.
                  </p>
                </div>

                <div className="flex flex-col gap-3 rounded-card border border-border p-4 sm:p-5">
                  <p className="font-semibold">A few ways to look at it</p>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    <div className="flex flex-col gap-1 rounded-xl bg-accent p-3.5">
                      <span className="text-sm font-semibold text-accent-foreground">Wait on the purchase</span>
                      <span className="text-xl font-bold">{formatMoney(leftAfterObligations)} left</span>
                      <span className="text-sm text-muted-foreground">after rent, as a cushion</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-accent p-3.5">
                      <span className="text-sm font-semibold text-accent-foreground">Spend {formatMoney(reducedPurchase)} instead</span>
                      <span className="text-xl font-bold">{formatMoney(0)} left</span>
                      <span className="text-sm text-muted-foreground">rent covered, no cushion</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-notice p-3.5">
                      <span className="text-sm font-semibold text-notice-foreground">Buy as planned</span>
                      <span className="text-xl font-bold">{formatMoney(-result.remaining)} short</span>
                      <span className="text-sm text-muted-foreground">would need to come from elsewhere</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Not included:</span> other bills before your next income,
                    when money arrives, and fees. Want to add those? Try the{" "}
                    <Link href="/decision-lab" className="font-semibold text-primary hover:underline">Decision Lab</Link>.
                  </p>
                </div>

                <p className="leading-relaxed">
                  This one&apos;s your call — I don&apos;t approve or block purchases. Would a 24-hour pause help before you
                  decide? Totally optional.
                </p>
                {reminder === null && (
                  <div className="flex flex-wrap gap-2.5">
                    <button type="button" onClick={() => setReminder("set")} className={buttonStyles.outline}>Remind me tomorrow</button>
                    <button type="button" onClick={() => setReminder("declined")} className={buttonStyles.secondary}>No thanks</button>
                  </div>
                )}
                {reminder === "set" && (
                  <p role="status" className="text-sm font-semibold text-primary">
                    Okay — I&apos;ll check in tomorrow, inside the app only. You can cancel it in Profile &amp; Privacy.
                  </p>
                )}
                {reminder === "declined" && (
                  <p role="status" className="text-sm text-muted-foreground">No problem — I won&apos;t bring it up again.</p>
                )}

                <p className="border-t border-muted pt-3.5 text-sm leading-relaxed text-muted-foreground">
                  If covering rent feels tight most months, that&apos;s usually about resources, not budgeting skills.{" "}
                  <Link href="/resources" className="font-semibold text-primary hover:underline">Campus Resources</Link> lists
                  emergency aid and basic-needs support.
                </p>
              </div>
            )}

            {step === "concept" && (
              <MiloBubble>
                <span>No problem — I won&apos;t use your numbers. Here&apos;s the idea:</span>
                <span>
                  <strong>Cash flow</strong> is the money coming in minus the money going out over a period. To check a
                  purchase, start with what you have, subtract what&apos;s already committed (like rent), and see what&apos;s left.
                </span>
                <span>
                  If you&apos;d like to try it with any numbers, the{" "}
                  <Link href="/decision-lab" className="font-semibold text-primary hover:underline">Decision Lab</Link> has a calculator.
                </span>
              </MiloBubble>
            )}

            {(step === "result" || step === "concept") && feedback === null && (
              <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
                <span>Was this helpful?</span>
                <button type="button" onClick={() => setFeedback("up")} className={pillStyle(false)}>Yes</button>
                <button type="button" onClick={() => setFeedback("down")} className={pillStyle(false)}>Not really</button>
              </div>
            )}
            {feedback && (
              <p role="status" className="text-sm text-muted-foreground">Thanks — your rating helps the research team improve {brand.assistantName}.</p>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-2.5 border-t border-border px-5 py-4 sm:px-6">
            <div className="flex min-w-0 flex-[999_1_240px] flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-semibold">Message {brand.assistantName}</label>
              <input id="message" type="text" disabled placeholder="Free-form chat arrives in Sprint 2 — try the example above" className="min-h-11 w-full rounded-lg border border-[#c9c1b4] bg-muted px-3.5 text-[15px] placeholder:text-muted-foreground disabled:cursor-not-allowed" />
            </div>
            <button type="button" onClick={restart} className={`${buttonStyles.secondary} flex-auto`}>Restart demo</button>
          </div>
        </section>

        <aside aria-labelledby="why-heading" className="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5 rounded-card border border-border bg-card p-5">
          <h2 id="why-heading" className="font-semibold">How {brand.assistantName} got this answer</h2>
          <dl className="flex flex-col gap-3 text-sm">
            <div><dt className="text-muted-foreground">Room</dt><dd className="font-semibold">{room.label}</dd></div>
            <div><dt className="text-muted-foreground">Tools used</dt><dd className="font-semibold">{step === "result" ? "Cash-flow calculator" : "None"}</dd></div>
            <div>
              <dt className="text-muted-foreground">Your information used</dt>
              <dd className="font-semibold">
                {step === "result" ? "3 numbers you typed, for this calculation only" : step === "concept" ? "None — you chose not to share" : "None yet"}
              </dd>
            </div>
            <div><dt className="text-muted-foreground">Saved to your profile</dt><dd className="font-semibold">Nothing</dd></div>
          </dl>
          <Note>Numbers are calculated by tested code, not by the AI. {brand.assistantName} writes the explanation.</Note>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {brand.assistantName} is educational support, not professional financial, legal, or tax advice. For complex
            situations, {brand.assistantName} points you to a person who can help.
          </p>
        </aside>
      </div>
    </div>
  );
}
