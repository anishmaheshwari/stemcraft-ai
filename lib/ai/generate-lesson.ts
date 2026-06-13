import "server-only";

import {
  GoogleGenerativeAI,
  type GenerateContentResult,
  type ResponseSchema,
} from "@google/generative-ai";
import type { z } from "zod";
import {
  BINARY_SEARCH_GEMINI_SCHEMA,
  DNS_RESOLUTION_GEMINI_SCHEMA,
  PROJECTILE_MOTION_GEMINI_SCHEMA,
  AI_LESSON_GEMINI_SCHEMA,
} from "@/lib/ai/gemini-schema";
import { log, logError, logWarn } from "@/lib/ai/logger";
import {
  BINARY_SEARCH_SYSTEM_PROMPT,
  DNS_RESOLUTION_SYSTEM_PROMPT,
  PROJECTILE_MOTION_SYSTEM_PROMPT,
  AI_LESSON_SYSTEM_PROMPT,
  buildRepairPrompt,
} from "@/lib/ai/prompts/system";
import {
  buildBinarySearchUserPrompt,
  buildDnsResolutionUserPrompt,
  buildProjectileMotionUserPrompt,
  buildAiLessonUserPrompt,
} from "@/lib/ai/prompts/user";
import {
  GeminiBinarySearchOutputSchema,
  GeminiDnsResolutionOutputSchema,
  GeminiProjectileOutputSchema,
  GeminiAiLessonOutputSchema,
  AiLessonRelaxedSchema,
  type GeminiLessonOutput,
} from "@/lib/ai/schemas/experience";
import { getGeminiModel } from "@/lib/ai/model";
import type { TemplateId } from "@/lib/types";

const TIMEOUT_MS = 25000;

export type GeminiGenerateResult =
  | { ok: true; data: GeminiLessonOutput; durationMs: number; attempt: number }
  | {
      ok: false;
      reason:
        | "timeout"
        | "invalid_json"
        | "validation_failed"
        | "api_error"
        | "quota_exceeded";
      error: string;
      durationMs: number;
    };

interface LessonGeneratorConfig {
  label: string;
  systemPrompt: string;
  buildUserPrompt: (topic: string) => string;
  responseSchema: ResponseSchema;
  zodSchema: z.ZodTypeAny;
}

const GENERATORS: Record<TemplateId, LessonGeneratorConfig> = {
  binary_search: {
    label: "binary_search",
    systemPrompt: BINARY_SEARCH_SYSTEM_PROMPT,
    buildUserPrompt: buildBinarySearchUserPrompt,
    responseSchema: BINARY_SEARCH_GEMINI_SCHEMA,
    zodSchema: GeminiBinarySearchOutputSchema,
  },
  dns_resolution: {
    label: "dns_resolution",
    systemPrompt: DNS_RESOLUTION_SYSTEM_PROMPT,
    buildUserPrompt: buildDnsResolutionUserPrompt,
    responseSchema: DNS_RESOLUTION_GEMINI_SCHEMA,
    zodSchema: GeminiDnsResolutionOutputSchema,
  },
  projectile_motion: {
    label: "projectile_motion",
    systemPrompt: PROJECTILE_MOTION_SYSTEM_PROMPT,
    buildUserPrompt: buildProjectileMotionUserPrompt,
    responseSchema: PROJECTILE_MOTION_GEMINI_SCHEMA,
    zodSchema: GeminiProjectileOutputSchema,
  },
  ai_lesson: {
    label: "ai_lesson",
    systemPrompt: AI_LESSON_SYSTEM_PROMPT,
    buildUserPrompt: buildAiLessonUserPrompt,
    responseSchema: AI_LESSON_GEMINI_SCHEMA,
    zodSchema: GeminiAiLessonOutputSchema,
  },
};

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenerativeAI(apiKey);
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Gemini request timed out after ${ms}ms`)), ms);
    promise
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}

function normalizeRawPayload(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const record = raw as Record<string, unknown>;

  if (record.explanation && typeof record.explanation === "object") {
    const explanation = record.explanation as Record<string, unknown>;
    if (Array.isArray(explanation.keyIdeas) && explanation.keyIdeas.length > 5) {
      explanation.keyIdeas = explanation.keyIdeas.slice(0, 5);
    }
  }

  if (record.quiz && typeof record.quiz === "object") {
    const quiz = record.quiz as Record<string, unknown>;
    if (Array.isArray(quiz.questions) && quiz.questions.length > 5) {
      quiz.questions = quiz.questions.slice(0, 5);
    }
  }

  return record;
}

/** Apply sensible defaults to partial ai_lesson responses */
function applyAiLessonDefaults(partial: unknown): GeminiLessonOutput {
  const obj = (partial ?? {}) as Record<string, unknown>;
  
  return {
    templateId: "ai_lesson",
    topic: obj.topic ?? "STEM Topic",
    category: obj.category ?? "cs",
    confidence: obj.confidence ?? 0.5,
    title: obj.title ?? "Learning Lesson",
    summary: obj.summary ?? "A tailored lesson to help you master this topic.",
    explanation: {
      hook: (obj.explanation as Record<string, unknown> | undefined)?.hook ?? "",
      keyIdeas: Array.isArray((obj.explanation as Record<string, unknown> | undefined)?.keyIdeas) 
        ? ((obj.explanation as Record<string, unknown>).keyIdeas as unknown[])
        : [],
      analogy: (obj.explanation as Record<string, unknown> | undefined)?.analogy ?? "",
    },
    keyConcepts: Array.isArray(obj.keyConcepts) 
      ? (obj.keyConcepts as unknown[])
      : [],
    visualCards: Array.isArray(obj.visualCards)
      ? (obj.visualCards as unknown[])
      : [],
    quiz: {
      questions: Array.isArray((obj.quiz as Record<string, unknown> | undefined)?.questions)
        ? ((obj.quiz as Record<string, unknown>).questions as unknown[])
        : [],
    },
    insights: Array.isArray(obj.insights)
      ? (obj.insights as unknown[])
      : [],
  } as GeminiLessonOutput;
}

async function callGemini(
  config: LessonGeneratorConfig,
  topic: string,
  repairErrors?: string
): Promise<GenerateContentResult> {
  const genAI = getClient();
  const modelName = getGeminiModel();
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: config.systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: config.responseSchema,
      temperature: 0.4,
    },
  });

  const userPrompt = repairErrors
    ? `${buildRepairPrompt(repairErrors)}\n\nOriginal topic: "${topic}"`
    : config.buildUserPrompt(topic);

  return withTimeout(model.generateContent(userPrompt), TIMEOUT_MS);
}

export async function generateLesson(
  templateId: TemplateId,
  topic: string
): Promise<GeminiGenerateResult> {
  const config = GENERATORS[templateId];
  const modelName = getGeminiModel();
  const overallStart = Date.now();
  log("gemini", `Starting ${config.label} generation`, {
    topic,
    model: modelName,
  });

  let lastError = "Unknown error";

  for (let attempt = 1; attempt <= 2; attempt++) {
    const attemptStart = Date.now();
    log("gemini", `Attempt ${attempt} started`, { templateId, topic });

    try {
      const result = await callGemini(
        config,
        topic,
        attempt === 2 ? lastError : undefined
      );
      const durationMs = Date.now() - attemptStart;
      const text = result.response.text();

      if (!text) {
        lastError = "Empty response from Gemini";
        logWarn("gemini", `Attempt ${attempt} empty response`, { durationMs });
        if (attempt === 2) {
          return { ok: false, reason: "invalid_json", error: lastError, durationMs: Date.now() - overallStart };
        }
        continue;
      }

      let raw: unknown;
      try {
        raw = normalizeRawPayload(JSON.parse(text));
      } catch (err) {
        lastError = err instanceof Error ? err.message : "JSON parse failed";
        logWarn("gemini", `Attempt ${attempt} invalid JSON`, { durationMs, error: lastError });
        if (attempt === 2) {
          return { ok: false, reason: "invalid_json", error: lastError, durationMs: Date.now() - overallStart };
        }
        continue;
      }

      const validated = config.zodSchema.safeParse(raw);
      if (!validated.success) {
        lastError = validated.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ");
        logWarn("gemini", `Attempt ${attempt} validation failed`, { durationMs, errors: lastError });
        
        // For ai_lesson, accept partial response and apply defaults
        if (templateId === "ai_lesson") {
          logWarn("gemini", `Attempt ${attempt} ai_lesson validation: accepting partial response`, { errors: lastError });
          const relaxedValidated = AiLessonRelaxedSchema.safeParse(raw);
          if (relaxedValidated.success) {
            const partial = relaxedValidated.data as unknown as GeminiLessonOutput;
            const withDefaults = applyAiLessonDefaults(partial);
            const topicVal = (withDefaults as unknown as { topic?: string }).topic ?? "";
            const confidenceVal = (withDefaults as unknown as { confidence?: number }).confidence ?? 0;
            log("gemini", `Attempt ${attempt} succeeded with defaults`, {
              templateId,
              durationMs,
              totalDurationMs: Date.now() - overallStart,
              topic: topicVal,
              confidence: confidenceVal,
            });
            return {
              ok: true,
              data: withDefaults,
              durationMs: Date.now() - overallStart,
              attempt,
            };
          }
        }
        
        if (attempt === 2) {
          return { ok: false, reason: "validation_failed", error: lastError, durationMs: Date.now() - overallStart };
        }
        continue;
      }

      const parsed = validated.data as GeminiLessonOutput;
      const topicVal = (parsed as unknown as { topic?: string }).topic ?? "";
      const confidenceVal = (parsed as unknown as { confidence?: number }).confidence ?? 0;
      log("gemini", `Attempt ${attempt} succeeded`, {
        templateId,
        durationMs,
        totalDurationMs: Date.now() - overallStart,
        topic: topicVal,
        confidence: confidenceVal,
      });

      return {
        ok: true,
        data: parsed,
        durationMs: Date.now() - overallStart,
        attempt,
      };
    } catch (err) {
      const durationMs = Date.now() - attemptStart;
      const message = err instanceof Error ? err.message : "Gemini API error";
      lastError = message;
      const isTimeout = message.includes("timed out");
      const isQuota =
        message.includes("429") ||
        message.toLowerCase().includes("quota");
      logError("gemini", `Attempt ${attempt} failed`, {
        durationMs,
        error: message,
        isTimeout,
        isQuota,
      });
      if (attempt === 2 || isTimeout || isQuota) {
        return {
          ok: false,
          reason: isTimeout ? "timeout" : isQuota ? "quota_exceeded" : "api_error",
          error: message,
          durationMs: Date.now() - overallStart,
        };
      }
    }
  }

  return { ok: false, reason: "api_error", error: lastError, durationMs: Date.now() - overallStart };
}

/** @deprecated Use generateLesson('binary_search', topic) */
export async function generateBinarySearchLesson(topic: string) {
  return generateLesson("binary_search", topic);
}
