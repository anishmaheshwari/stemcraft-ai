import { z } from "zod";

export const ExplanationSchema = z.object({
  hook: z.string().min(5).max(300).optional(),
  keyIdeas: z.array(z.string().min(3).max(120)).min(1).max(5).optional(),
  analogy: z.string().min(5).max(200).optional(),
});

export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(5),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1).optional(),
});

export const BinarySearchStepSchema = z.object({
  low: z.number().int().min(0),
  high: z.number().int().min(0),
  mid: z.number().int().min(0),
  midValue: z.number().optional(),
  comparison: z.string().min(1),
  eliminated: z.string().optional(),
});

export const BinarySearchConfigSchema = z.object({
  sortedArray: z.array(z.number().int()).min(4).max(20),
  target: z.number().int(),
  steps: z.array(BinarySearchStepSchema).min(1).max(20),
});

export const DnsResolutionStepSchema = z.object({
  stepNumber: z.number().int().min(1).optional(),
  from: z.string().min(1),
  to: z.string().min(1),
  query: z.string().min(1),
  response: z.string().min(1),
  type: z.string().min(1),
});

export const DnsResolutionConfigSchema = z.object({
  domain: z.string().min(3),
  resolvedIp: z.string().min(7),
  steps: z.array(DnsResolutionStepSchema).min(1).max(20),
});

export const ProjectileScenarioSchema = z.object({
  label: z.string().min(1).optional(),
  velocity: z.number().min(0),
  angle: z.number().min(0),
});

export const ProjectileMotionConfigSchema = z.object({
  velocity: z.number().min(0),
  angle: z.number().min(0),
  gravity: z.number().min(0),
  scenarios: z.array(ProjectileScenarioSchema).min(0).max(6).optional(),
});

/** Gemini output for binary search (sessionId added server-side) */
export const GeminiBinarySearchOutputSchema = z.object({
  topic: z.string().min(2),
  category: z.literal("cs"),
  templateId: z.literal("binary_search"),
  confidence: z.number().min(0).max(1),
  explanation: ExplanationSchema.optional(),
  simulation: z.object({
    config: BinarySearchConfigSchema,
  }),
  quiz: z.object({
    questions: z.array(QuizQuestionSchema).min(1).max(5),
  }),
});

export type GeminiBinarySearchOutput = z.infer<typeof GeminiBinarySearchOutputSchema>;

export const GeminiDnsResolutionOutputSchema = z.object({
  topic: z.string().min(2),
  category: z.literal("cs"),
  templateId: z.literal("dns_resolution"),
  confidence: z.number().min(0).max(1),
  explanation: ExplanationSchema.optional(),
  simulation: z.object({
    config: DnsResolutionConfigSchema,
  }),
  quiz: z.object({
    questions: z.array(QuizQuestionSchema).min(1).max(5),
  }),
});

export type GeminiDnsResolutionOutput = z.infer<typeof GeminiDnsResolutionOutputSchema>;

export const GeminiProjectileOutputSchema = z.object({
  topic: z.string().min(2),
  category: z.literal("physics"),
  templateId: z.literal("projectile_motion"),
  confidence: z.number().min(0).max(1),
  explanation: ExplanationSchema.optional(),
  simulation: z.object({
    config: ProjectileMotionConfigSchema,
  }),
  quiz: z.object({
    questions: z.array(QuizQuestionSchema).min(1).max(5),
  }),
});

export type GeminiProjectileOutput = z.infer<typeof GeminiProjectileOutputSchema>;


/** Relaxed schema for ai_lesson that accepts partial/incomplete responses */
export const AiLessonRelaxedSchema = z.object({
  topic: z.string().optional(),
  category: z.string().optional(),
  templateId: z.literal("ai_lesson"),
  confidence: z.number().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  explanation: z.object({
    hook: z.string().optional(),
    keyIdeas: z.array(z.any()).optional(),
    analogy: z.any().optional()
  }).optional(),
  keyConcepts: z
    .array(z.any())
    .optional(),
  visualCards: z
    .array(z.any())
    .optional(),
  quiz: z
    .object({ questions: z.array(z.any()).optional() })
    .optional(),
  insights: z
    .array(z.any())
    .optional(),
}).passthrough();

export type AiLessonRelaxed = z.infer<typeof AiLessonRelaxedSchema>;

export const GeminiAiLessonOutputSchema = z.object({
  topic: z.string().min(2),
  category: z.string().min(2),
  templateId: z.literal("ai_lesson"),
  confidence: z.number().min(0).max(1),
  title: z.string().min(3).max(150),
  summary: z.string().min(5).max(800),
  explanation: ExplanationSchema.optional(),
  keyConcepts: z
    .array(z.object({ title: z.string().min(1), detail: z.string().min(1).optional() }))
    .min(0)
    .max(10)
    .optional(),
  visualCards: z
    .array(z.object({ title: z.string().min(1), caption: z.string().min(1).optional(), image: z.string().optional() }))
    .min(0)
    .max(8)
    .optional(),
  quiz: z
    .object({ questions: z.array(QuizQuestionSchema).min(0).max(6) })
    .optional(),
  insights: z
    .array(z.object({ id: z.string().min(1), text: z.string().min(1) }))
    .min(0)
    .max(10)
    .optional(),
});

export type GeminiAiLessonOutput = z.infer<typeof GeminiAiLessonOutputSchema>;

export type GeminiLessonOutput =
  | GeminiBinarySearchOutput
  | GeminiDnsResolutionOutput
  | GeminiProjectileOutput
  | GeminiAiLessonOutput;

export const ExperiencePayloadSchema = z.discriminatedUnion("templateId", [
  z.object({
    sessionId: z.string().uuid(),
    topic: z.string(),
    category: z.literal("cs"),
    templateId: z.literal("binary_search"),
    confidence: z.number(),
    explanation: ExplanationSchema.optional(),
    simulation: z.object({ config: BinarySearchConfigSchema }),
    quiz: z.object({ questions: z.array(QuizQuestionSchema).min(1).max(5) }),
  }),
  z.object({
    sessionId: z.string().uuid(),
    topic: z.string(),
    category: z.literal("cs"),
    templateId: z.literal("dns_resolution"),
    confidence: z.number(),
    explanation: ExplanationSchema.optional(),
    simulation: z.object({ config: DnsResolutionConfigSchema }),
    quiz: z.object({ questions: z.array(QuizQuestionSchema).min(1).max(5) }),
  }),
  z.object({
    sessionId: z.string().uuid(),
    topic: z.string(),
    category: z.literal("physics"),
    templateId: z.literal("projectile_motion"),
    confidence: z.number(),
    explanation: ExplanationSchema.optional(),
    simulation: z.object({ config: ProjectileMotionConfigSchema }),
    quiz: z.object({ questions: z.array(QuizQuestionSchema).min(1).max(5) }),
  }),
  z.object({
    sessionId: z.string().uuid(),
    topic: z.string(),
    category: z.string(),
    templateId: z.literal("ai_lesson"),
    confidence: z.number(),
    title: z.string().min(1),
    summary: z.string().min(1),
    explanation: ExplanationSchema.optional(),
    keyConcepts: z.array(z.object({ title: z.string().min(1), detail: z.string().optional() })).optional(),
    visualCards: z.array(z.object({ title: z.string().min(1), caption: z.string().optional(), image: z.string().optional() })).optional(),
    quiz: z.object({ questions: z.array(QuizQuestionSchema).min(0).max(6) }).optional(),
    insights: z.array(z.object({ id: z.string().min(1), text: z.string().min(1) })).optional(),
  }),
]);

export type ValidatedExperiencePayload = z.infer<typeof ExperiencePayloadSchema>;
