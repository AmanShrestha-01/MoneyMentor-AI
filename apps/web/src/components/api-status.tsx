import { getApiStatus } from "@/lib/api";

// Async server component: fetched fresh on every request, so the page must render it
// inside <Suspense> (required by Cache Components for uncached data).
export async function ApiStatusBadge() {
  const status = await getApiStatus();

  const [dotClass, label] =
    status.state === "not-configured"
      ? ["bg-muted-foreground", "Frontend preview · backend runs locally"]
      : status.state === "offline"
        ? ["bg-red-600", "API offline — start services/api"]
        : status.databaseReady
          ? ["bg-primary", `API v${status.version} · database connected`]
          : ["bg-amber-500", `API v${status.version} · database unavailable`];

  return (
    <span className="inline-flex items-center gap-2" role="status">
      <span aria-hidden="true" className={`size-2 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
