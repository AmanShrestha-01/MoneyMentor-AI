// Server-side API client. API_BASE_URL has no NEXT_PUBLIC_ prefix on purpose:
// it stays on the server and is never bundled into browser JavaScript.

import { connection } from "next/server";

export type ApiStatus =
  | { state: "not-configured" }
  | { state: "offline" }
  | { state: "online"; databaseReady: boolean; version: string };

export async function getApiStatus(): Promise<ApiStatus> {
  // Always evaluate per request, so the status (and API_BASE_URL) is never frozen at build time.
  await connection();

  // A frontend-only preview deployment has no backend; say so instead of "offline".
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) return { state: "not-configured" };

  try {
    const [liveness, readiness] = await Promise.all([
      fetch(`${baseUrl}/health`, { cache: "no-store", signal: AbortSignal.timeout(2000) }),
      fetch(`${baseUrl}/health/ready`, { cache: "no-store", signal: AbortSignal.timeout(4000) }),
    ]);
    if (!liveness.ok) return { state: "offline" };
    const { version } = (await liveness.json()) as { version: string };
    return { state: "online", databaseReady: readiness.ok, version };
  } catch {
    return { state: "offline" };
  }
}
