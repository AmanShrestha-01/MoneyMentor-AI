import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles, Card, CheckIcon, CrossIcon, Note } from "@/components/ui";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "About this project" };

// Progress report for the faculty supervisor. Keep every claim here verifiable:
// "Built" means it exists and its checks pass; everything else is labeled.
const report = {
  preparedFor: "Dr. Md Rahman",
  preparedBy: "Aman Shrestha",
  updated: "October 28, 2026",
};

const built = [
  "Next.js 16 student web app — responsive, keyboard-accessible, six screens",
  "FastAPI backend with liveness and readiness health checks",
  "PostgreSQL 18 connection and Alembic migrations, verified against a live database",
  "Cash-flow and student-loan calculators with unit tests (500 − 350 − 200 = −50)",
  "Automated checks: linting, type checking, backend and frontend tests, production build",
  "Documentation: architecture, roadmap, decision log, research boundaries, learning notes",
];

const prototypeOnly = [
  `${brand.assistantName} chat is a scripted walkthrough — no AI model is connected yet`,
  "All student data is fictional, and nothing is saved",
  "Privacy settings work on screen but reset on reload",
  "Campus resources are placeholders awaiting verification",
  "No login yet — accounts and authorization are Sprint 1",
];

const pathway = [
  "Agentic AI support",
  "Financial capability & self-efficacy",
  "Decision quality & behavior",
  "Lower financial stress",
  "Improved financial well-being",
];

const responsibilities = [
  { part: "Claude (AI model)", does: "Understands the student's language; proposes which approved action to take", never: "Holds credentials, chooses whose data to use, runs tools directly, or changes its own permissions" },
  { part: "FastAPI backend", does: "Decides who the student is, what they may do, whether consent exists, and which tools run", never: "Trusts a user ID supplied by the browser, the AI, or a workflow" },
  { part: "Python tools", does: "Exact, tested calculations (cash flow, loan payments)", never: "Relies on an AI model for arithmetic" },
  { part: "n8n (planned)", does: "Sequencing, retries, and timeouts for multi-step workflows", never: "Reaches the database directly or stores full conversations by default" },
];

const agentFunctions = [
  { name: "Learner profile", start: "Database records the student can view, correct, export, and delete", guardrail: "Sensitive fields need recorded consent" },
  { name: "Learning planner", start: "Rule-based choice of short lessons from goals and gaps", guardrail: "Only lessons from the approved library" },
  { name: "Decision support", start: "Tested calculators plus structured explanations", guardrail: "Never decides; asks when information is missing" },
  { name: "Behavioral support", start: "A policy of allowed prompts, including “no intervention”", guardrail: "Frequency limits; opt-out always respected" },
  { name: "Resource navigation", start: "Search over a verified resource directory", guardrail: "Never invents listings or guesses eligibility" },
  { name: "Safety & escalation", start: "Deterministic checks in code before and after any AI call", guardrail: "Code rules win; never overridden by agent vote" },
];

const sprints = [
  { name: "Foundation (milestone 1.1)", deliverable: "Frontend, backend, database, tests, docs, and this clickable student experience", status: "Done" },
  { name: "Sprint 1 — Foundations & security", deliverable: "A student account and authorized profile flow working end to end", status: "Next" },
  { name: `Sprint 2 — ${brand.assistantName}'s first workflow`, deliverable: "A student asks a financial question and receives a verified explanation (Claude + calculator)", status: "Planned" },
  { name: "Sprint 3 — Knowledge & personalization", deliverable: `${brand.assistantName} gives grounded explanations from approved lessons and resources`, status: "Planned" },
  { name: "Sprint 4 — Evaluation & staging", deliverable: "Reproducible reliability, safety, and security tests; approved staging deployment", status: "Planned" },
];

const neverDoes = [
  "Access bank accounts or transactions",
  "Make, approve, or block payments and purchases",
  "Apply for loans or recommend financial products",
  "Give professional financial, legal, or tax advice",
  "Use sensitive context without the student's consent",
];

const questions = [
  `Retrieval (Sprint 3): how should we evaluate whether ${brand.assistantName} retrieves the right lesson or resource — e.g., precision@k or MRR — and is a keyword + vector hybrid worth testing?`,
  "IRB: what is the path and timeline for the Aim 1 focus groups with students?",
  "Authentication: is university single sign-on realistic for a pilot, or should the prototype use local accounts?",
  "Campus resources: who could verify listings for financial aid, basic needs, and counseling?",
  "Data retention: how long should chat messages and system logs be kept?",
];

const stack = {
  "In use": ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "FastAPI", "Python 3.12", "SQLAlchemy 2.1", "Alembic", "PostgreSQL 18", "pytest"],
  Planned: ["Claude", "n8n", "MCP", "Promptfoo", "Langfuse", "pgvector"],
};

const statusStyle: Record<string, string> = {
  Done: "bg-primary-soft text-[#0f5c55]",
  Next: "bg-accent text-accent-foreground",
  Planned: "bg-muted text-muted-foreground",
};

function ArchBox({ title, detail, planned = false }: { title: string; detail: string; planned?: boolean }) {
  return (
    <div className={`flex min-w-0 flex-1 basis-40 flex-col gap-1 rounded-xl border p-3.5 ${planned ? "border-dashed border-[#b9b0a2] bg-background" : "border-border bg-card"}`}>
      <span className="text-sm font-bold">{title}</span>
      <span className="text-xs leading-relaxed text-muted-foreground">{detail}</span>
      {planned && <span className="text-xs font-semibold text-accent-foreground">Planned</span>}
    </div>
  );
}

function DownArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto size-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v16M6 14l6 6 6-6" />
    </svg>
  );
}

export default function ProjectPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 rounded-card bg-[#14213d] p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9fd8cf]">Research prototype · progress report</p>
        <h1 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          Adaptive Agentic AI Financial Capability and Well-Being Intervention for Underserved College Students
        </h1>
        <p className="max-w-2xl leading-relaxed text-[#d7dbe4]">
          {brand.productName}, with the AI assistant {brand.assistantName}: a bounded, student-controlled system for
          financial education and decision support. It is not a financial adviser.
        </p>
        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div><dt className="text-[#aab3c5]">Prepared for</dt><dd className="font-semibold">{report.preparedFor}</dd></div>
          <div><dt className="text-[#aab3c5]">Prepared by</dt><dd className="font-semibold">{report.preparedBy}</dd></div>
          <div><dt className="text-[#aab3c5]">Updated</dt><dd className="font-semibold">{report.updated}</dd></div>
        </dl>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/chat" className="inline-flex min-h-11 items-center rounded-lg bg-[#2dd4bf] px-4 text-sm font-semibold text-[#14213d] hover:bg-[#5eead4]">
            Try the {brand.assistantName} walkthrough
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-lg border border-white/30 px-4 text-sm font-semibold text-white hover:bg-white/10">
            Open the student dashboard
          </Link>
        </div>
      </header>

      <Card title="Central research question">
        <blockquote className="border-l-0 text-lg font-medium leading-relaxed">
          “Can responsible agentic AI help students convert financial knowledge into stronger decision processes, greater
          self-efficacy, lower financial stress, and improved financial well-being?”
        </blockquote>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {pathway.map((stage, i) => (
            <li key={stage} className="flex items-center gap-2">
              <span className="rounded-lg bg-accent px-3 py-2 font-medium text-accent-foreground">{stage}</span>
              {i < pathway.length - 1 && <span aria-hidden="true" className="text-muted-foreground">→</span>}
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground">
          The software is designed to make this pathway testable. Engineering tests measure system behavior only; student
          outcomes require the separately approved study.
        </p>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Built and verified">
          <ul className="flex flex-col gap-2.5 text-sm leading-relaxed">
            {built.map((item) => <li key={item} className="flex gap-2.5"><CheckIcon />{item}</li>)}
          </ul>
        </Card>
        <Card title="Prototype only — not real yet">
          <ul className="flex flex-col gap-2.5 text-sm leading-relaxed">
            {prototypeOnly.map((item) => <li key={item} className="flex gap-2.5"><CrossIcon className="text-notice-foreground" />{item}</li>)}
          </ul>
        </Card>
      </div>

      <Card title="Architecture: the AI proposes, the backend decides">
        <div className="flex flex-col gap-2" role="img" aria-label="Architecture: the student's browser talks to the Next.js web app, which calls the FastAPI backend. The backend enforces permissions and connects to PostgreSQL, the Claude model, Python calculation tools, and a planned n8n workflow engine.">
          <div className="flex flex-wrap gap-2"><ArchBox title="Student's browser" detail="Asks questions, gives or withholds permission, makes every decision" /></div>
          <DownArrow />
          <div className="flex flex-wrap gap-2"><ArchBox title="Next.js web app" detail="Interface only — holds no secrets or permissions" /></div>
          <DownArrow />
          <div className="rounded-xl border-2 border-primary bg-primary-soft p-3.5">
            <p className="text-sm font-bold text-[#0f5c55]">FastAPI backend — the single point of control</p>
            <p className="text-xs leading-relaxed text-[#0f5c55]">Login · permissions · consent · input validation · safety checks · audit records</p>
          </div>
          <DownArrow />
          <div className="flex flex-wrap gap-2">
            <ArchBox title="PostgreSQL" detail="Profiles, consent records, progress" />
            <ArchBox title="Python tools" detail="Tested calculators" />
            <ArchBox title="Claude" detail="Language understanding and explanation" planned />
            <ArchBox title="n8n" detail="Multi-step workflow runs" planned />
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted">
              <tr><th scope="col" className="p-3 font-semibold">Component</th><th scope="col" className="p-3 font-semibold">Responsible for</th><th scope="col" className="p-3 font-semibold">Must never</th></tr>
            </thead>
            <tbody>
              {responsibilities.map((r) => (
                <tr key={r.part} className="border-t border-border align-top">
                  <th scope="row" className="p-3 font-semibold">{r.part}</th>
                  <td className="p-3 leading-relaxed">{r.does}</td>
                  <td className="p-3 leading-relaxed text-muted-foreground">{r.never}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="The six agent functions from the proposal">
        <p className="-mt-2 text-sm text-muted-foreground">
          These are capabilities, not six separate AI agents. Each starts as tested code; an AI model is added only where
          language understanding is genuinely needed.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {agentFunctions.map((f, i) => (
            <li key={f.name} className="flex flex-col gap-2 rounded-xl border border-border p-4">
              <span className="flex items-center gap-2 font-semibold">
                <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{i + 1}</span>
                {f.name}
              </span>
              <span className="text-sm leading-relaxed">{f.start}</span>
              <span className="text-xs leading-relaxed text-muted-foreground"><span className="font-semibold">Guardrail:</span> {f.guardrail}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Roadmap">
        <ol className="flex flex-col">
          {sprints.map((s) => (
            <li key={s.name} className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1.5 border-t border-muted py-3.5 first:border-t-0 first:pt-0">
              <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-0.5">
                <span className="font-semibold">{s.name}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{s.deliverable}</span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[s.status]}`}>{s.status}</span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Responsible AI boundaries">
          <p className="-mt-2 text-sm font-semibold">{brand.assistantName} never:</p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed">
            {neverDoes.map((item) => <li key={item} className="flex gap-2.5"><CrossIcon />{item}</li>)}
          </ul>
          <Note>
            Designed to align with the NIST AI Risk Management Framework and its Generative AI Profile (NIST AI 600-1), and
            to respect consumer financial-protection obligations.
          </Note>
        </Card>
        <Card title="Research boundaries">
          <ul className="flex flex-col gap-2.5 text-sm leading-relaxed">
            <li className="flex gap-2.5"><CheckIcon />No IRB or institutional approval is assumed</li>
            <li className="flex gap-2.5"><CheckIcon />Development uses fictional data only</li>
            <li className="flex gap-2.5"><CheckIcon />Enrollment, randomization, and outcome surveys are not built until approved</li>
            <li className="flex gap-2.5"><CheckIcon />The three study conditions are planned so their data and features can never mix</li>
          </ul>
        </Card>
      </div>

      <Card title="Questions for discussion">
        <ol className="flex list-decimal flex-col gap-2.5 pl-5 text-sm leading-relaxed marker:font-semibold marker:text-primary">
          {questions.map((q) => <li key={q} className="pl-1">{q}</li>)}
        </ol>
      </Card>

      <Card title="Technology">
        {Object.entries(stack).map(([group, items]) => (
          <div key={group} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-muted-foreground">{group}</h3>
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item} className={`rounded-full px-3 py-1 text-sm ${group === "Planned" ? "border border-dashed border-[#b9b0a2]" : "bg-muted font-medium"}`}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/chat" className={buttonStyles.primary}>Try the {brand.assistantName} walkthrough</Link>
        <Link href="/decision-lab" className={buttonStyles.secondary}>Open the Decision Lab</Link>
      </div>
    </div>
  );
}
