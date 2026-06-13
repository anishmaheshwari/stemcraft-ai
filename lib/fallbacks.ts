import binarySearch from "@/data/fallbacks/binary_search.json";
import dnsResolution from "@/data/fallbacks/dns_resolution.json";
import projectileMotion from "@/data/fallbacks/projectile_motion.json";
import type { DemoTopic, ExperiencePayload, TemplateId } from "@/lib/types";

const FALLBACKS: Record<TemplateId, ExperiencePayload> = {
  binary_search: binarySearch as ExperiencePayload,
  dns_resolution: dnsResolution as ExperiencePayload,
  projectile_motion: projectileMotion as ExperiencePayload,
  ai_lesson: {
    sessionId: "",
    topic: "Understanding AI Learning",
    category: "cs",
    templateId: "ai_lesson",
    confidence: 0.7,
    lesson: {
      title: "Introduction to STEM Learning",
      summary: "Learn the fundamentals through structured explanation, visual concepts, and practice questions.",
      keyConcepts: [
        { title: "Core Concept 1", detail: "Understanding the basics" },
        { title: "Core Concept 2", detail: "Applying the principles" },
      ],
      visualCards: [
        { title: "Visual Overview", caption: "A high-level understanding of the topic" },
        { title: "Deep Dive", caption: "Detailed exploration of key ideas" },
      ],
      insights: [],
    },
    explanation: {
      hook: "Let's explore this fascinating topic together.",
      keyIdeas: [
        "First fundamental idea",
        "Second fundamental idea",
        "Third fundamental idea",
      ],
      analogy: "Think of it like...",
    },
    quiz: {
      questions: [
        {
          id: "q1",
          question: "What is the main concept?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 0,
          explanation: "This is the correct answer because...",
        },
      ],
    },
  } as ExperiencePayload,
};

export const DEMO_TOPICS: DemoTopic[] = [
  {
    id: "binary_search",
    title: "Binary Search",
    description: "Step through a sorted array search algorithm.",
    category: "cs",
    prompt: "Teach me Binary Search",
  },
  {
    id: "dns_resolution",
    title: "DNS Resolution",
    description: "Trace a domain lookup across DNS servers.",
    category: "cs",
    prompt: "How does DNS work?",
  },
  {
    id: "projectile_motion",
    title: "Projectile Motion",
    description: "Adjust angle and velocity to see trajectories.",
    category: "physics",
    prompt: "Teach me Projectile Motion",
  },
];

export function getStaticFallback(templateId: TemplateId): ExperiencePayload {
  const fallback = FALLBACKS[templateId];
  return {
    ...fallback,
    sessionId: crypto.randomUUID(),
  };
}

export function getDemoFallbackByPrompt(prompt: string): ExperiencePayload | null {
  const normalized = prompt.trim().toLowerCase();
  const match = DEMO_TOPICS.find(
    (topic) =>
      normalized.includes(topic.id.replace("_", " ")) ||
      normalized.includes(topic.title.toLowerCase()) ||
      topic.prompt.toLowerCase() === normalized
  );
  return match ? getStaticFallback(match.id) : null;
}
