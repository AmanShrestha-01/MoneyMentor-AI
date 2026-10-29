"use client";

import { useState } from "react";
import { pillStyle } from "@/components/ui";
import { categories, type ResourceCategory, resources } from "@/lib/resources";

export function ResourceList() {
  const [filter, setFilter] = useState<ResourceCategory | "all">("all");
  const shown = resources.filter((r) => filter === "all" || r.category === filter);
  const labelFor = (id: ResourceCategory) => categories.find((c) => c.id === id)?.label;

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Not sure where to start?" className="grid gap-3.5 sm:grid-cols-2">
        <button type="button" onClick={() => setFilter("basic")} className="flex flex-col gap-1.5 rounded-card border border-[#f0dcb6] bg-notice p-4 text-left hover:border-notice-foreground/40">
          <span className="font-bold">I&apos;m short on money for essentials right now</span>
          <span className="text-sm leading-relaxed text-muted-foreground">Food, housing, or an emergency. A budget won&apos;t fix this — these programs can help directly.</span>
        </button>
        <button type="button" onClick={() => setFilter("aid")} className="flex flex-col gap-1.5 rounded-card border border-[#cfdcf3] bg-accent p-4 text-left hover:border-accent-foreground/40">
          <span className="font-bold">I want to understand my options</span>
          <span className="text-sm leading-relaxed text-muted-foreground">Financial aid, loans, or talking through a plan with a trained counselor.</span>
        </button>
      </section>

      <div role="group" aria-label="Filter by need" className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)} className={pillStyle(filter === c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((r) => (
          <li key={r.name} className="flex flex-col gap-2.5 rounded-card border border-border bg-card p-5">
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
              {r.scope === "national" ? (
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[#0f5c55]">National · public</span>
              ) : (
                <span className="rounded-full bg-notice px-2.5 py-1 text-notice-foreground">Campus · placeholder</span>
              )}
              <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{labelFor(r.category)}</span>
            </div>
            <h2 className="text-[17px] font-bold leading-snug">{r.name}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{r.about}</p>
            {r.url && (
              <a href={r.url} className="text-sm font-semibold text-primary hover:underline">
                {r.url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </a>
            )}
            <p className="mt-auto border-t border-muted pt-2.5 text-xs text-muted-foreground">
              {r.scope === "national" ? "Official public resource" : "Not yet verified — pending research-team review"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
