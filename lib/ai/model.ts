import "server-only";

/**
 * gemini-2.0-flash free-tier quota is 0 (deprecated/shut down).
 * Default to gemini-2.5-flash which has active free-tier limits.
 * Override via GEMINI_MODEL in .env.local
 */
export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
}
