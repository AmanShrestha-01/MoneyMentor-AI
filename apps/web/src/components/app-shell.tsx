import { NavLinks } from "@/components/nav-links";
import { brand } from "@/lib/brand";

function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground"
      >
        M
      </span>
      {brand.productName}
    </span>
  );
}

// Sidebar on wide screens; on narrow screens the same column wraps above the content.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      <aside className="flex min-w-0 flex-[1_1_220px] flex-col gap-6 border-b border-border bg-card px-4 py-6 lg:max-w-64 lg:border-b-0 lg:border-r">
        <div className="px-3">
          <Logo />
          <p className="mt-1 text-xs text-muted-foreground">{brand.tagline}</p>
        </div>
        <nav aria-label="Main">
          <NavLinks />
        </nav>
        <p className="mt-auto rounded-xl bg-notice p-3 text-xs leading-relaxed text-notice-foreground">
          <strong className="font-semibold">Research prototype.</strong> Fictional data.{" "}
          {brand.assistantName}&apos;s AI is not connected yet. Not financial advice.
        </p>
      </aside>

      <main id="main" className="min-w-0 flex-[999_1_560px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
