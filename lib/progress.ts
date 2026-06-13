export interface TopicProgress {
  simulationComplete: boolean;
  quizScore: number | null;
  quizAnswers?: Record<string, number>;
  lastVisited: string;
}

export interface UserProgress {
  topics: Record<string, TopicProgress>;
}

const STORAGE_KEY = "stemcraft:progress";

function readStore(): UserProgress {
  if (typeof window === "undefined") return { topics: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { topics: {} };
    return JSON.parse(raw) as UserProgress;
  } catch {
    return { topics: {} };
  }
}

function writeStore(store: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function slugifyTopic(topic: string): string {
  return topic.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getTopicProgress(topicKey: string): TopicProgress | null {
  return readStore().topics[topicKey] ?? null;
}

export function updateTopicProgress(
  topicKey: string,
  partial: Partial<TopicProgress>
): TopicProgress {
  const store = readStore();
  const existing = store.topics[topicKey] ?? {
    simulationComplete: false,
    quizScore: null,
    lastVisited: new Date().toISOString(),
  };

  const updated: TopicProgress = {
    ...existing,
    ...partial,
    lastVisited: new Date().toISOString(),
  };

  store.topics[topicKey] = updated;
  writeStore(store);
  return updated;
}

export function computeExperienceProgress(
  currentStep: number,
  maxSteps: number,
  simulationComplete: boolean,
  quizScore: number | null
): number {
  const simMax = maxSteps > 1 ? maxSteps - 1 : 1;
  const simRatio = simulationComplete
    ? 1
    : Math.min(currentStep / simMax, 1);
  const simPortion = Math.round(simRatio * 50);

  const quizPortion =
    quizScore !== null ? Math.round((quizScore / 100) * 50) : 0;

  return Math.min(100, simPortion + quizPortion);
}
