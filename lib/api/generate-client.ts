import { DEMO_TOPICS } from "@/lib/fallbacks";
import type { Category, DemoTopic, ExperiencePayload } from "@/lib/types";

export interface GenerateMeta {
  source: "gemini" | "static";
  reason: string;
  durationMs: number;
  templateId: string;
  attempt?: number;
}

export interface GenerateResponse {
  payload: ExperiencePayload;
  meta: GenerateMeta;
}

export interface UnsupportedTopicErrorData {
  name: "UnsupportedTopicError";
  message: string;
  suggestedTopics: DemoTopic[];
}

export interface AiGenerationFailedError {
  name: "AiGenerationFailedError";
  message: string;
  reason: string;
  topic: string;
}

export function isAiGenerationFailedError(
  err: unknown
): err is AiGenerationFailedError {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as { name: string }).name === "AiGenerationFailedError"
  );
}

export function isUnsupportedTopicError(
  err: unknown
): err is UnsupportedTopicErrorData {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as { name: string }).name === "UnsupportedTopicError" &&
    "suggestedTopics" in err &&
    Array.isArray((err as { suggestedTopics: unknown }).suggestedTopics)
  );
}

export async function requestExperience(
  topic: string,
  category: Category | null
): Promise<GenerateResponse> {
  const start = Date.now();
  console.log("[STEMCraft][client] generate request started", {
    topic,
    category,
  });

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, category }),
  });

  const data = (await response.json()) as GenerateResponse & {
    error?: string;
    message?: string;
    userMessage?: string;
    reason?: string;
    topic?: string;
    suggestedTopics?: DemoTopic[];
  };

  if (response.status === 503 && data.error === "ai_generation_failed") {
    console.warn("[STEMCraft][client] ai generation failed", {
      topic,
      reason: data.reason,
      clientDurationMs: Date.now() - start,
    });
    throw {
      name: "AiGenerationFailedError",
      message: data.userMessage ?? `The AI couldn't generate a lesson for "${topic}". Please try again.`,
      reason: data.reason ?? "unknown",
      topic: data.topic ?? topic,
    } satisfies AiGenerationFailedError;
  }

  if (response.status === 422 && data.error === "unsupported_topic") {
    console.warn("[STEMCraft][client] unsupported topic", {
      topic,
      reason: data.error,
      clientDurationMs: Date.now() - start,
    });
    throw {
      name: "UnsupportedTopicError",
      message:
        data.message ??
        "This topic isn't supported yet. Try one of our demo lessons below.",
      suggestedTopics: data.suggestedTopics ?? DEMO_TOPICS,
    } satisfies UnsupportedTopicErrorData;
  }

  console.log("[STEMCraft][client] generate response received", {
    status: response.status,
    source: data.meta?.source,
    reason: data.meta?.reason,
    templateId: data.meta?.templateId,
    durationMs: data.meta?.durationMs,
    clientDurationMs: Date.now() - start,
    sessionId: data.payload?.sessionId,
  });

  if (!response.ok || !data.payload) {
    throw new Error(data.error ?? data.message ?? "Failed to generate experience");
  }

  return data;
}
