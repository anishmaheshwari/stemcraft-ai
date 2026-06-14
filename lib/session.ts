import type { ExperiencePayload } from "@/lib/types";
import type { GenerateMeta } from "@/lib/api/generate-client";

const SESSION_PREFIX = "stemcraft:session:";
const META_PREFIX = "stemcraft:meta:";

/**
 * In-memory cache: survives Next.js client-side navigation (same JS context).
 * This eliminates the flash between saving a session and reading it on the
 * learn page — sessionStorage.getItem is synchronous but requires a useEffect
 * to run after hydration, causing a visible blank frame. The memory cache lets
 * loadSession return immediately on the first render.
 */
const memoryCache = new Map<string, { payload: ExperiencePayload; meta?: GenerateMeta }>();

export function saveSession(
  payload: ExperiencePayload,
  meta?: GenerateMeta
): void {
  // 1. Write to memory cache immediately (synchronous, available before useEffect)
  memoryCache.set(payload.sessionId, { payload, meta });

  // 2. Also persist to sessionStorage as a backup (page refresh, etc.)
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    `${SESSION_PREFIX}${payload.sessionId}`,
    JSON.stringify({ payload, createdAt: new Date().toISOString() })
  );
  if (meta) {
    sessionStorage.setItem(
      `${META_PREFIX}${payload.sessionId}`,
      JSON.stringify(meta)
    );
  }
}

export function loadSession(sessionId: string): ExperiencePayload | null {
  // 1. Check memory cache first (instant — no async, no useEffect needed)
  const cached = memoryCache.get(sessionId);
  if (cached) return cached.payload;

  // 2. Fall back to sessionStorage (page refresh scenario)
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${SESSION_PREFIX}${sessionId}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { payload: ExperiencePayload };
    // Re-populate memory cache so subsequent calls are instant
    memoryCache.set(sessionId, { payload: parsed.payload });
    return parsed.payload;
  } catch {
    return null;
  }
}

export function loadSessionMeta(sessionId: string): GenerateMeta | null {
  // 1. Check memory cache first
  const cached = memoryCache.get(sessionId);
  if (cached?.meta) return cached.meta;

  // 2. Fall back to sessionStorage
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${META_PREFIX}${sessionId}`);
  if (!raw) return null;
  try {
    const meta = JSON.parse(raw) as GenerateMeta;
    // Re-populate memory cache
    const existing = memoryCache.get(sessionId);
    if (existing) memoryCache.set(sessionId, { ...existing, meta });
    return meta;
  } catch {
    return null;
  }
}
