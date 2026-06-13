import "server-only";

import {
  GoogleGenerativeAI,
  SchemaType,
  type ResponseSchema,
} from "@google/generative-ai";
import { z } from "zod";
import { log, logWarn } from "@/lib/ai/logger";
import type { TemplateId } from "@/lib/types";

import { getGeminiModel } from "@/lib/ai/model";

const TIMEOUT_MS = 5000;

const ClassifyResultSchema = z.object({
  templateId: z.enum(["binary_search", "dns_resolution", "projectile_motion"]),
  confidence: z.number().min(0).max(1),
  supported: z.boolean(),
  reason: z.string(),
});

export type ClassifyResult = z.infer<typeof ClassifyResultSchema>;

const CLASSIFY_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    templateId: { type: SchemaType.STRING },
    confidence: { type: SchemaType.NUMBER },
    supported: { type: SchemaType.BOOLEAN },
    reason: { type: SchemaType.STRING },
  },
  required: ["templateId", "confidence", "supported", "reason"],
};

const CLASSIFY_SYSTEM = `You route STEM student topics to one of three interactive lesson engines.

ENGINES:
1. binary_search — binary search and explicit search algorithm topics
2. dns_resolution — DNS resolution, domain lookup, and secure web lookup topics
3. projectile_motion — projectile motion, trajectory, and launch-angle physics topics

RULES:
- Return supported=true only for strong matches to one of the three engines.
- supported=false for generic programming topics, generic networking topics, or generic physics topics outside projectile motion.
- linear search → binary_search
- DNS, domain name, HTTPS, SSL/TLS topics that focus on name resolution → dns_resolution
- projectile motion, trajectory, launch angle, and ballistic motion → projectile_motion
- confidence: 0.0-1.0 how well the topic fits the chosen engine
- Return JSON only`;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Classification timed out")), ms);
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

export async function classifyTopicWithGemini(
  topic: string
): Promise<ClassifyResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const start = Date.now();
  const modelName = getGeminiModel();
  log("classify", "Classifying topic with Gemini", { topic, model: modelName });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: CLASSIFY_SYSTEM,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: CLASSIFY_SCHEMA,
        temperature: 0.1,
      },
    });

    const result = await withTimeout(
      model.generateContent(`Classify this student topic: "${topic}"`),
      TIMEOUT_MS
    );

    const text = result.response.text();
    if (!text) return null;

    const parsed = ClassifyResultSchema.safeParse(JSON.parse(text));
    if (!parsed.success) {
      logWarn("classify", "Invalid classification response", {
        errors: parsed.error.message,
      });
      return null;
    }

    log("classify", "Classification complete", {
      ...parsed.data,
      durationMs: Date.now() - start,
    });

    return parsed.data;
  } catch (err) {
    logWarn("classify", "Classification failed", {
      error: err instanceof Error ? err.message : "unknown",
      durationMs: Date.now() - start,
    });
    return null;
  }
}

export function isClassifyResultUsable(
  result: ClassifyResult
): result is ClassifyResult & { supported: true; templateId: TemplateId } {
  return result.supported && result.confidence >= 0.6;
}
