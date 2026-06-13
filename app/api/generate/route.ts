import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateLesson } from "@/lib/ai/generate-lesson";
import { resolveTemplate } from "@/lib/ai/infer-template";
import { log, logError, logWarn } from "@/lib/ai/logger";
import type {
  GeminiLessonOutput,
  GeminiAiLessonOutput,
  GeminiBinarySearchOutput,
  GeminiDnsResolutionOutput,
  GeminiProjectileOutput,
} from "@/lib/ai/schemas/experience";
import { DEMO_TOPICS, getStaticFallback } from "@/lib/fallbacks";
import type { ExperiencePayload, TemplateId, Category } from "@/lib/types";

const RequestSchema = z.object({
  topic: z.string().min(1).max(500),
  category: z.enum(["cs", "physics"]).nullable().optional(),
});

export interface GenerateMeta {
  source: "gemini" | "static";
  reason: string;
  durationMs: number;
  templateId: TemplateId;
  attempt?: number;
}

function buildStaticResponse(
  templateId: TemplateId,
  topic: string,
  reason: string,
  startMs: number
): NextResponse {
  const payload: ExperiencePayload = {
    ...getStaticFallback(templateId),
    topic: topic.trim() || getStaticFallback(templateId).topic,
  };

  const durationMs = Date.now() - startMs;
  log("generate", "Serving static fallback", {
    templateId,
    reason,
    durationMs,
    sessionId: payload.sessionId,
  });

  return NextResponse.json({
    payload,
    meta: {
      source: "static",
      reason,
      durationMs,
      templateId,
    } satisfies GenerateMeta,
  });
}

function toExperiencePayload(data: GeminiLessonOutput): ExperiencePayload {
  const sessionId = randomUUID();

  const tid = (data as unknown as { templateId: string }).templateId;
  switch (tid) {
    case "ai_lesson": {
      const d = data as unknown as GeminiAiLessonOutput;
      const payload: ExperiencePayload = {
        sessionId,
        topic: d.topic || "STEM Topic",
        category: (d.category as Category) || "cs",
        templateId: d.templateId,
        confidence: d.confidence ?? 0.5,
        lesson: {
          title: d.title || "Learning Lesson",
          summary: d.summary || "A tailored lesson to help you master this topic.",
          keyConcepts: Array.isArray(d.keyConcepts) ? d.keyConcepts : [],
          visualCards: Array.isArray(d.visualCards) ? d.visualCards : [],
          insights: Array.isArray(d.insights) ? d.insights : [],
        },
      };
      if (d.explanation) payload.explanation = d.explanation;
      if (d.quiz && Array.isArray(d.quiz.questions)) {
        payload.quiz = { questions: d.quiz.questions };
      }
      return payload;
    }
    case "binary_search": {
      const d = data as GeminiBinarySearchOutput;
      const payload: ExperiencePayload = {
        sessionId,
        topic: d.topic,
        category: d.category,
        templateId: d.templateId,
        confidence: d.confidence,
        explanation: d.explanation,
        simulation: d.simulation,
        quiz: { questions: [...d.quiz.questions] },
      };
      return payload;
    }
    case "dns_resolution": {
      const d = data as GeminiDnsResolutionOutput;
      const payload: ExperiencePayload = {
        sessionId,
        topic: d.topic,
        category: d.category,
        templateId: d.templateId,
        confidence: d.confidence,
        explanation: d.explanation,
        simulation: d.simulation,
        quiz: { questions: [...d.quiz.questions] },
      };
      return payload;
    }
    case "projectile_motion": {
      const d = data as GeminiProjectileOutput;
      const payload: ExperiencePayload = {
        sessionId,
        topic: d.topic,
        category: d.category,
        templateId: d.templateId,
        confidence: d.confidence,
        explanation: d.explanation,
        simulation: d.simulation,
        quiz: { questions: [...d.quiz.questions] },
      };
      return payload;
    }
    default:
      // fallback: return minimal payload
      return {
        sessionId,
        topic: "",
        category: "cs",
        templateId: "ai_lesson",
        confidence: 0,
      } as ExperiencePayload;
  }
}

export async function POST(request: Request) {
  const startMs = Date.now();
  log("generate", "POST /api/generate received");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logWarn("generate", "Invalid JSON body");
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    logWarn("generate", "Request validation failed", {
      errors: parsed.error.flatten(),
    });
    return NextResponse.json(
      { error: "topic is required (1-500 characters)" },
      { status: 400 }
    );
  }

  const { topic, category = null } = parsed.data;
  const inferred = await resolveTemplate(topic, category);

  log("generate", "Template resolved", {
    topic,
    category,
    supported: inferred.supported,
    reason: inferred.reason,
    ...(inferred.supported
      ? {
          templateId: inferred.templateId,
          useAiGeneration: inferred.useAiGeneration,
        }
      : {}),
  });

  if (!inferred.supported) {
    logWarn("generate", "Unsupported topic", { topic, reason: inferred.reason });
    return NextResponse.json(
      {
        error: "unsupported_topic",
        message:
          "Currently supported STEM simulations are Binary Search, DNS Resolution, and Projectile Motion.",
        suggestedTopics: DEMO_TOPICS,
      },
      { status: 422 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    logWarn("generate", "GEMINI_API_KEY missing — static fallback");
    return buildStaticResponse(
      inferred.templateId,
      topic,
      "missing_api_key",
      startMs
    );
  }

  log("generate", "Using Gemini model", { model: process.env.GEMINI_MODEL || "gemini-2.5-flash (default)" });

  try {
    const result = await generateLesson(inferred.templateId, topic);

    if (!result.ok) {
      logWarn("generate", "Gemini generation failed — static fallback", {
        templateId: inferred.templateId,
        reason: result.reason,
        error: result.error,
        durationMs: result.durationMs,
      });
      return buildStaticResponse(
        inferred.templateId,
        topic,
        `gemini_${result.reason}`,
        startMs
      );
    }

    const payload = toExperiencePayload(result.data);
    const durationMs = Date.now() - startMs;

    log("generate", "Gemini generation succeeded", {
      sessionId: payload.sessionId,
      templateId: payload.templateId,
      topic: payload.topic,
      confidence: payload.confidence,
      attempt: result.attempt,
      durationMs,
    });

    return NextResponse.json({
      payload,
      meta: {
        source: "gemini",
        reason: `${inferred.templateId}_ai_generated`,
        durationMs,
        templateId: inferred.templateId,
        attempt: result.attempt,
      } satisfies GenerateMeta,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown API error";
    logError("generate", "Unhandled error — static fallback", { error: message });
    return buildStaticResponse(
      inferred.templateId,
      topic,
      "unhandled_error",
      startMs
    );
  }
}
