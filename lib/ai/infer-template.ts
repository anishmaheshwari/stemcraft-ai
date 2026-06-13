import "server-only";

import { log } from "@/lib/ai/logger";
import type { Category, TemplateId } from "@/lib/types";

export interface InferredTemplate {
  supported: true;
  templateId: TemplateId;
  useAiGeneration: boolean;
  reason: string;
}

export interface UnsupportedTemplate {
  supported: false;
  reason: string;
}

export type ResolveTemplateResult = InferredTemplate | UnsupportedTemplate;

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

/** Topics clearly outside CS/Physics — only these get rejected */
const OUT_OF_SCOPE_KEYWORDS = [
  "recipe",
  "cooking",
  "cook ",
  "restaurant",
  "movie",
  "film actor",
  "celebrity",
  "football",
  "cricket",
  "soccer",
  "basketball",
  "medical diagnosis",
  "symptoms",
  "stock market",
  "cryptocurrency trading",
];

const BIOGRAPHY_PATTERNS = [
  "who is ",
  "who was ",
  "biography",
  "born in",
  "when did he",
  "when did she",
];

const SEARCH_KEYWORDS = [
  "binary search",
  "binary-search",
  "binarysearch",
  "linear search",
  "linear-search",
  "search algorithm",
  "search algorithms",
  "searching",
];

const NETWORK_KEYWORDS = [
  "dns resolution",
  "dns",
  "domain name",
  "name resolution",
  "nameserver",
  "nameservers",
  "https",
  "http",
  "ssl",
  "tls",
];

const PHYSICS_CONCEPT_KEYWORDS = [
  "projectile motion",
  "projectile",
  "trajectory",
  "ballistic",
  "range",
  "launch angle",
];

function isOutOfScope(topic: string): boolean {
  const n = normalize(topic);
  return includesAny(n, OUT_OF_SCOPE_KEYWORDS);
}

function isBiographical(topic: string): boolean {
  const n = normalize(topic);
  return BIOGRAPHY_PATTERNS.some((p) => n.includes(p));
}

/**
 * Fast keyword routing for supported simulation topics.
 */
export function inferTemplateByKeywords(
  topic: string
): InferredTemplate | null {
  if (isOutOfScope(topic)) return null;

  const n = normalize(topic);

  if (includesAny(n, SEARCH_KEYWORDS)) {
    return {
      supported: true,
      templateId: "binary_search",
      useAiGeneration: true,
      reason: "keyword_algorithms",
    };
  }

  if (includesAny(n, NETWORK_KEYWORDS)) {
    return {
      supported: true,
      templateId: "dns_resolution",
      useAiGeneration: true,
      reason: "keyword_networking",
    };
  }

  if (!isBiographical(topic) && includesAny(n, PHYSICS_CONCEPT_KEYWORDS)) {
    return {
      supported: true,
      templateId: "projectile_motion",
      useAiGeneration: true,
      reason: "keyword_projectile_motion",
    };
  }

  return null;
}

/**
 * Resolves topic → template via keywords, Gemini classification, then local heuristics.
 */
export async function resolveTemplate(
  topic: string,
  category?: Category | null
): Promise<ResolveTemplateResult> {
  log("infer", "Resolving topic to template", { topic, category });

  if (isOutOfScope(topic)) {
    return { supported: false, reason: "out_of_scope_topic" };
  }

  // Fast path: only explicit simulation topics are routed to simulation templates.
  const keywordMatch = inferTemplateByKeywords(topic);
  if (keywordMatch) {
    log("infer", "Keyword/heuristic simulation match", {
      topic,
      templateId: keywordMatch.templateId,
      reason: keywordMatch.reason,
    });
    return keywordMatch;
  }

  // For all other CS/Physics topics, default to an AI-generated lesson.
  // Do not reject; let the generator handle topic interpretation.
  return {
    supported: true,
    templateId: "ai_lesson",
    useAiGeneration: true,
    reason: "default_ai_lesson",
  };
}
