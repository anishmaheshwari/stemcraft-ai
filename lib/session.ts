import type { ExperiencePayload } from "@/lib/types";
import type { GenerateMeta } from "@/lib/api/generate-client";

const SESSION_PREFIX = "stemcraft:session:";
const META_PREFIX = "stemcraft:meta:";

export function saveSession(
  payload: ExperiencePayload,
  meta?: GenerateMeta
): void {
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
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${SESSION_PREFIX}${sessionId}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { payload: ExperiencePayload };
    return parsed.payload;
  } catch {
    return null;
  }
}

export function loadSessionMeta(sessionId: string): GenerateMeta | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${META_PREFIX}${sessionId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GenerateMeta;
  } catch {
    return null;
  }
}
