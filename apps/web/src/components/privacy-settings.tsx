"use client";

import { useId, useState } from "react";
import { buttonStyles, Card, pillStyle } from "@/components/ui";
import { brand } from "@/lib/brand";
import { demoStudent } from "@/lib/demo-fixtures";

// Prototype only: settings live in component state and reset on reload.
// The real version stores append-only consent_records in the API (Sprint 1).

const switches = [
  { key: "personalize", label: "Use my goals to personalize lessons", help: `${brand.assistantName} picks lessons that connect to goals you set.`, initial: true },
  { key: "reminders", label: "Learning reminders", help: "At most two a week, inside the app only. Off by default.", initial: false },
  { key: "resources", label: "Suggest resources when I mention money stress", help: `${brand.assistantName} may point to campus or community help. It never contacts anyone for you.`, initial: true },
  { key: "history", label: "Keep my chat history", help: "Lets you scroll back. Turn off to delete chats when you leave.", initial: true },
] as const;

type SwitchKey = (typeof switches)[number]["key"];

const numberModes = [
  { id: "ask", label: "Ask me every time" },
  { id: "session", label: "Allow for this session" },
  { id: "never", label: "Never use them" },
];

function Switch({ label, help, checked, onToggle }: { label: string; help: string; checked: boolean; onToggle: () => void }) {
  const labelId = useId();
  return (
    <div className="flex items-center justify-between gap-4 border-t border-muted py-3.5">
      <div className="flex min-w-0 flex-col gap-1">
        <span id={labelId} className="font-semibold">{label}</span>
        <span className="text-sm leading-relaxed text-muted-foreground">{help}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={onToggle}
        className={`flex h-8 w-14 flex-none rounded-full p-[3px] ${checked ? "justify-end bg-primary" : "justify-start bg-[#8a8478]"}`}
      >
        <span aria-hidden="true" className="size-[26px] rounded-full bg-white" />
      </button>
    </div>
  );
}

export function PrivacySettings() {
  const [settings, setSettings] = useState<Record<SwitchKey, boolean>>(
    () => Object.fromEntries(switches.map((s) => [s.key, s.initial])) as Record<SwitchKey, boolean>,
  );
  const [numbersMode, setNumbersMode] = useState("ask");
  const [goals, setGoals] = useState(() => demoStudent.goals.map((g) => g.label));
  const [draft, setDraft] = useState("");
  const [dataAction, setDataAction] = useState<"exported" | "confirm-delete" | "deleted" | null>(null);

  function addGoal(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setGoals((current) => [...current, text]);
    setDraft("");
  }

  return (
    <div className="flex flex-wrap items-start gap-5">
      <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-5">
        <Card title={`What ${brand.assistantName} may use`}>
          <div className="-mt-2 flex flex-col">
            {switches.map((s) => (
              <Switch key={s.key} label={s.label} help={s.help} checked={settings[s.key]} onToggle={() => setSettings((cur) => ({ ...cur, [s.key]: !cur[s.key] }))} />
            ))}
            <div className="flex flex-col gap-2.5 border-t border-muted pt-3.5">
              <span id="numbers-label" className="font-semibold">Numbers I type in chat</span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                Amounts like rent or a planned purchase. They&apos;re used for the calculation and never saved to your profile.
              </span>
              <div role="radiogroup" aria-labelledby="numbers-label" className="flex flex-wrap gap-2">
                {numberModes.map((m) => (
                  <button key={m.id} type="button" role="radio" aria-checked={numbersMode === m.id} onClick={() => setNumbersMode(m.id)} className={pillStyle(numbersMode === m.id)}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Your goals">
          {goals.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {goals.map((goal, i) => (
                <li key={`${goal}-${i}`} className="flex items-center justify-between gap-3 rounded-lg bg-accent py-2 pl-3.5 pr-2 text-sm leading-relaxed">
                  <span>{goal}</span>
                  <button type="button" aria-label={`Remove goal: ${goal}`} onClick={() => setGoals((cur) => cur.filter((_, j) => j !== i))} className="min-h-10 flex-none rounded-md border border-[#cfdcf3] bg-card px-3 text-sm font-semibold text-accent-foreground">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No goals right now — that&apos;s fine. {brand.assistantName} will still answer questions.</p>
          )}
          <form onSubmit={addGoal} className="flex flex-wrap items-end gap-2.5">
            <div className="flex min-w-0 flex-[999_1_240px] flex-col gap-1.5">
              <label htmlFor="new-goal" className="text-sm font-semibold">Add a goal</label>
              <input id="new-goal" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. Build a $300 emergency cushion" className="min-h-11 w-full rounded-lg border border-[#c9c1b4] bg-card px-3.5" />
            </div>
            <button type="submit" className={`${buttonStyles.primary} flex-auto`}>Add goal</button>
          </form>
        </Card>

        <Card title="Your data">
          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={() => setDataAction("exported")} className={buttonStyles.outline}>Download my data</button>
            <button type="button" onClick={() => setDataAction("confirm-delete")} className={`${buttonStyles.secondary} text-[#8a2c0d]`}>Delete my data</button>
          </div>
          {dataAction === "exported" && (
            <p role="status" className="text-sm font-semibold text-primary">Your export is ready (prototype — a real version would download a JSON file).</p>
          )}
          {dataAction === "confirm-delete" && (
            <div role="alertdialog" aria-labelledby="delete-title" className="flex flex-col gap-3 rounded-xl border border-[#f0dcb6] bg-notice p-4">
              <p id="delete-title" className="text-sm leading-relaxed text-notice-foreground">
                <strong>Delete everything?</strong> This permanently removes your profile, goals, learning progress, and chat
                history. It can&apos;t be undone.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button type="button" onClick={() => setDataAction("deleted")} className="inline-flex min-h-11 items-center rounded-lg bg-[#8a2c0d] px-4 text-sm font-semibold text-white">Yes, delete my data</button>
                <button type="button" onClick={() => setDataAction(null)} className={buttonStyles.secondary}>Cancel</button>
              </div>
            </div>
          )}
          {dataAction === "deleted" && (
            <p role="status" className="text-sm text-muted-foreground">Done. (Prototype — nothing real was stored or deleted.)</p>
          )}
        </Card>
      </div>

      <aside aria-labelledby="stored-title" className="flex min-w-0 flex-[1_1_280px] flex-col gap-3.5 rounded-card border border-border bg-card p-5">
        <h2 id="stored-title" className="font-semibold">What {brand.productName} stores</h2>
        <dl className="flex flex-col gap-3 text-sm leading-relaxed">
          <div><dt className="font-semibold">Account</dt><dd className="text-muted-foreground">Name and school email, from your login</dd></div>
          <div><dt className="font-semibold">Goals</dt><dd className="text-muted-foreground">Only the ones you add</dd></div>
          <div><dt className="font-semibold">Learning progress</dt><dd className="text-muted-foreground">Lessons finished, quiz answers, confidence ratings</dd></div>
          <div>
            <dt className="font-semibold">Chat messages</dt>
            <dd className="text-muted-foreground">{settings.history ? "Kept for [30] days, then deleted automatically" : "Not kept — deleted when you leave"}</dd>
          </div>
        </dl>
        <div className="flex flex-col gap-1.5 rounded-xl bg-primary-soft p-3.5 text-sm leading-relaxed">
          <span className="font-bold text-[#0f5c55]">Never collected</span>
          <span>Bank or card logins, account numbers, transactions, Social Security numbers.</span>
        </div>
      </aside>
    </div>
  );
}
