"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonStyles, pillStyle } from "@/components/ui";
import { brand } from "@/lib/brand";
import { demoStudent } from "@/lib/demo-fixtures";

const steps = [
  ["List money coming in", "and when it arrives — paychecks, aid refunds, family support. Timing matters as much as the amount."],
  ["List what's already committed", "and its due date — rent, phone, transportation, minimum payments."],
  ["Check what's left", "before each due date. A purchase is only “affordable” if commitments that come first are still covered."],
];

const choices = [
  { id: "a", label: "$150 left over", feedback: "Not quite — $150 is what remains after rent alone. The $200 purchase also has to come out: 500 − 350 − 200 = −50." },
  { id: "b", label: "Exactly enough", feedback: "Close, but the numbers come out below zero: 500 − 350 − 200 = −50." },
  { id: "c", label: "$50 less than you need for rent", feedback: "Right. 500 − 350 − 200 = −50. Because rent comes first, spending $200 today leaves rent $50 short on Friday." },
];
const correctId = "c";
const confidenceLevels = ["Not yet", "A little", "Fairly", "Very"];

export function Lesson() {
  const [topic, setTopic] = useState("Cash flow");
  const [answer, setAnswer] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const picked = choices.find((c) => c.id === answer);

  return (
    <div className="flex flex-wrap items-start gap-5">
      <nav aria-label="Topics" className="flex min-w-0 flex-[1_1_240px] flex-col gap-1 rounded-card border border-border bg-card p-3">
        {demoStudent.progress.map(({ topic: name, lessonsCompleted, lessonsTotal }) => (
          <button
            key={name}
            type="button"
            aria-pressed={name === topic}
            onClick={() => setTopic(name)}
            className={`flex flex-col gap-1.5 rounded-lg px-3 py-2.5 text-left ${name === topic ? "bg-primary-soft" : "hover:bg-muted"}`}
          >
            <span className="flex w-full justify-between gap-2 text-sm">
              <span className="font-semibold">{name}</span>
              <span className="text-muted-foreground">{lessonsCompleted}/{lessonsTotal}</span>
            </span>
            <span aria-hidden="true" className="block h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${(lessonsCompleted / lessonsTotal) * 100}%` }} />
            </span>
          </button>
        ))}
      </nav>

      <article aria-labelledby="lesson-title" className="flex min-w-0 flex-[999_1_480px] flex-col gap-5 rounded-card border border-border bg-card p-6 sm:p-7">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">{topic} · Lesson 3 of 4 · 5 min</p>
          <h2 id="lesson-title" className="text-2xl font-bold tracking-tight">Mapping a month of cash flow</h2>
          {topic !== "Cash flow" && (
            <p className="text-sm text-muted-foreground">Preview: every topic shows this sample lesson until the lesson library is built (Sprint 3).</p>
          )}
        </div>

        <ol className="flex flex-col gap-3.5">
          {steps.map(([bold, rest], i) => (
            <li key={bold} className="flex items-start gap-3.5">
              <span aria-hidden="true" className="grid size-7 flex-none place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">{i + 1}</span>
              <p className="leading-relaxed"><strong>{bold}</strong> {rest}</p>
            </li>
          ))}
        </ol>

        <section aria-labelledby="check-title" className="flex flex-col gap-3.5 rounded-xl border border-border bg-background p-5">
          <h3 id="check-title" className="font-semibold">Quick check</h3>
          <p className="leading-relaxed">You have $500. Rent of $350 is due Friday. If you spend $200 today, before Friday you&apos;d have…</p>
          <div role="group" aria-labelledby="check-title" className="flex flex-col gap-2">
            {choices.map((c) => {
              const isPicked = c.id === answer;
              const reveal = answer !== null && c.id === correctId;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={isPicked}
                  onClick={() => setAnswer(c.id)}
                  className={`min-h-12 rounded-lg border-2 px-4 text-left font-medium ${
                    reveal ? "border-primary bg-primary-soft" : isPicked ? "border-notice-foreground bg-notice" : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
          {picked && (
            <p role="status" className={`rounded-lg px-3.5 py-3 text-sm leading-relaxed ${picked.id === correctId ? "bg-primary-soft text-[#0f5c55]" : "bg-notice text-notice-foreground"}`}>
              {picked.feedback}
            </p>
          )}
        </section>

        <section aria-labelledby="confidence-title" className="flex flex-col gap-2.5">
          <h3 id="confidence-title" className="font-semibold">
            How confident do you feel about this? <span className="font-normal text-muted-foreground">(optional)</span>
          </h3>
          <div role="group" aria-labelledby="confidence-title" className="flex flex-wrap gap-2">
            {confidenceLevels.map((level) => (
              <button key={level} type="button" aria-pressed={confidence === level} onClick={() => setConfidence(level)} className={pillStyle(confidence === level)}>
                {level}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">This only helps {brand.assistantName} choose your next lesson. It&apos;s never shared outside your profile.</p>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-muted pt-5">
          <Link href="/decision-lab" className={buttonStyles.primary}>Practice in Decision Lab</Link>
          <Link href="/chat" className={buttonStyles.secondary}>Ask {brand.assistantName} a question</Link>
        </div>
      </article>
    </div>
  );
}
