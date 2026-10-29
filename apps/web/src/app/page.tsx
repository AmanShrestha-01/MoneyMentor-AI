import Link from "next/link";
import { Suspense } from "react";
import { ApiStatusBadge } from "@/components/api-status";
import { buttonStyles, Card, CheckIcon, CrossIcon } from "@/components/ui";
import { brand } from "@/lib/brand";
import { demoStudent } from "@/lib/demo-fixtures";

export default function DashboardPage() {
  const { firstName, progress, goals, recommendedLesson, suggestedQuestions } = demoStudent;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, {firstName}</h1>
        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          Here&apos;s where your learning stands. Nothing here needs action today — go at your own pace.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card
          title="Learning progress"
          className="lg:col-span-3"
          action={
            <Link href="/learning" className="text-sm font-semibold text-primary hover:underline">
              See all topics
            </Link>
          }
        >
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {progress.map(({ topic, lessonsCompleted, lessonsTotal }) => (
              <li key={topic}>
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="font-medium">{topic}</span>
                  <span className="text-muted-foreground">
                    {lessonsCompleted} of {lessonsTotal} lessons
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${topic} progress`}
                  aria-valuenow={lessonsCompleted}
                  aria-valuemin={0}
                  aria-valuemax={lessonsTotal}
                  className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.round((lessonsCompleted / lessonsTotal) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recommended next">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            {recommendedLesson.minutes}-minute lesson
          </p>
          <p className="-mt-2 text-lg font-semibold">{recommendedLesson.title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Why this? </span>
            {recommendedLesson.reason}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/learning" className={buttonStyles.primary}>
              Start lesson
            </Link>
            <span className="text-xs text-muted-foreground">or skip — that&apos;s fine too</span>
          </div>
        </Card>

        <Card title="Your goals">
          <ul className="flex flex-col gap-2.5">
            {goals.map((goal) => (
              <li key={goal.label} className="rounded-lg bg-accent px-3.5 py-2.5 text-sm leading-relaxed">
                {goal.label}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            You set these.{" "}
            <Link href="/privacy" className="font-semibold text-primary hover:underline">
              Change or remove them
            </Link>{" "}
            anytime.
          </p>
        </Card>

        <Card title={`Ask ${brand.assistantName}`}>
          <p className="-mt-1 text-sm text-muted-foreground">Questions students often start with:</p>
          <ul className="flex flex-col gap-2">
            {suggestedQuestions.map((question) => (
              <li key={question}>
                <Link
                  href="/chat"
                  className="block rounded-lg border border-border px-3.5 py-2.5 text-sm leading-relaxed hover:border-primary hover:bg-primary-soft"
                >
                  {question}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={`What ${brand.assistantName} will and won't do`} className="lg:col-span-3">
          <ul className="grid gap-x-8 gap-y-2.5 text-sm leading-relaxed sm:grid-cols-2">
            <li className="flex gap-2.5"><CheckIcon />Explain concepts and compare hypothetical scenarios</li>
            <li className="flex gap-2.5 text-muted-foreground"><CrossIcon />Access bank accounts or move money</li>
            <li className="flex gap-2.5"><CheckIcon />Point you to verified campus and community help</li>
            <li className="flex gap-2.5 text-muted-foreground"><CrossIcon />Approve, block, or make purchases</li>
            <li className="flex gap-2.5"><CheckIcon />Let you see, correct, export, and delete your data</li>
            <li className="flex gap-2.5 text-muted-foreground"><CrossIcon />Make financial decisions for you</li>
          </ul>
        </Card>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
        <span>Demo student &ldquo;{firstName}&rdquo; is fictional.</span>
        <Suspense fallback={<span role="status">Checking API status…</span>}>
          <ApiStatusBadge />
        </Suspense>
      </footer>
    </div>
  );
}
