export type Category = "cs" | "physics";
export type TemplateId =
  | "binary_search"
  | "dns_resolution"
  | "projectile_motion"
  | "ai_lesson";

export interface Explanation {
  hook?: string;
  keyIdeas?: string[];
  analogy?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface BinarySearchStep {
  low: number;
  high: number;
  mid: number;
  midValue?: number;
  comparison: string;
  eliminated?: string;
}

export interface BinarySearchConfig {
  sortedArray: number[];
  target: number;
  steps: BinarySearchStep[];
}

export interface DnsResolutionStep {
  stepNumber?: number;
  from: string;
  to: string;
  query: string;
  response: string;
  type: string;
}

export interface DnsResolutionConfig {
  domain: string;
  resolvedIp: string;
  steps: DnsResolutionStep[];
}

export interface ProjectileScenario {
  label?: string;
  velocity: number;
  angle: number;
}

export interface ProjectileMotionConfig {
  velocity: number;
  angle: number;
  gravity: number;
  scenarios?: ProjectileScenario[];
}

export type SimulationConfig =
  | BinarySearchConfig
  | DnsResolutionConfig
  | ProjectileMotionConfig;

export interface ExperiencePayload {
  sessionId: string;
  topic: string;
  category: Category;
  templateId: TemplateId;
  confidence: number;
  explanation?: Explanation;
  simulation?: {
    config: SimulationConfig;
  };
  quiz?: {
    questions: QuizQuestion[];
  };
  // Generic AI lesson payload (for non-simulation topics)
  lesson?: {
    title?: string;
    summary?: string;
    keyConcepts?: { title: string; detail?: string }[];
    visualCards?: { title: string; caption?: string; image?: string }[];
    insights?: { id: string; text: string }[];
  };
}

export interface DemoTopic {
  id: TemplateId;
  title: string;
  description: string;
  category: Category;
  prompt: string;
}
