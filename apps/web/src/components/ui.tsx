import { useId } from "react";

// Small shared building blocks. Swap for shadcn/ui equivalents when it is adopted (D-010).

export const buttonStyles = {
  primary:
    "inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:bg-muted",
  outline:
    "inline-flex min-h-11 items-center justify-center rounded-lg border border-primary bg-card px-4 text-sm font-semibold text-primary hover:bg-primary-soft",
};

export function pillStyle(selected: boolean) {
  return `min-h-10 rounded-full border px-4 text-sm font-semibold ${
    selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
  }`;
}

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {children && <p className="max-w-2xl leading-relaxed text-muted-foreground">{children}</p>}
    </header>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={`flex flex-col gap-4 rounded-card border border-border bg-card p-5 sm:p-6 ${className}`}
    >
      {title && (
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id={headingId} className="text-base font-semibold">
            {title}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Note({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "notice" }) {
  const toneClass = tone === "info" ? "bg-accent text-accent-foreground" : "bg-notice text-notice-foreground";
  return <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${toneClass}`}>{children}</div>;
}

export function CheckIcon({ className = "text-primary" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 size-[18px] flex-none ${className}`}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function CrossIcon({ className = "text-muted-foreground" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className={`mt-0.5 size-[18px] flex-none ${className}`}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
