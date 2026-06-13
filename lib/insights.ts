import TEMPLATE_CONCEPTS, { Concept } from "./insights/concepts";

const STORAGE_KEY = "stemcraft:insights:v1";

export type SessionSummary = {
  sessionId: string;
  timestamp: string;
  quizResults: { questionId: string; correct: boolean; questionText?: string }[];
  derivedWeaknesses: string[];
  derivedStrengths: string[];
};

export type TopicInsights = {
  topicKey: string;
  lastUpdated: string;
  aggregate: { attempts: number; correct: number; total: number; accuracy: number };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  sessions: SessionSummary[];
};

export type InsightsStore = {
  version: number;
  createdAt: string;
  topics: Record<string, TopicInsights>;
};

function loadStore(): InsightsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { version: 1, createdAt: new Date().toISOString(), topics: {} };
    }
    return JSON.parse(raw) as InsightsStore;
  } catch {
    return { version: 1, createdAt: new Date().toISOString(), topics: {} };
  }
}

function saveStore(store: InsightsStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    try {
      // Notify listeners that insights have been updated (for UI providers)
      window.dispatchEvent(new CustomEvent("stemcraft:insights:updated", { detail: { timestamp: new Date().toISOString() } }));
    } catch {
      // ignore
    }
  } catch {
    // ignore storage errors
  }
}

function normalizeText(t?: string) {
  return (t || "").toLowerCase();
}

function mapQuestionToConcepts(templateId: string, questionText?: string): Concept[] {
  const concepts = TEMPLATE_CONCEPTS[templateId] || [];
  const text = normalizeText(questionText);
  const hits: Concept[] = [];
  for (const c of concepts) {
    for (const kw of c.keywords) {
      if (text.includes(kw)) {
        hits.push(c);
        break;
      }
    }
  }
  return hits;
}

export function recordQuizResults(
  templateId: string,
  topicKey: string,
  sessionId: string,
  quizResults: { questionId: string; correct: boolean; question?: string }[]
) {
  const store = loadStore();
  const topic = store.topics[topicKey] || {
    topicKey,
    lastUpdated: new Date().toISOString(),
    aggregate: { attempts: 0, correct: 0, total: 0, accuracy: 0 },
    strengths: [],
    weaknesses: [],
    recommendations: [],
    sessions: [],
  } as TopicInsights;

  const sessionSummary: SessionSummary = {
    sessionId,
    timestamp: new Date().toISOString(),
    quizResults: quizResults.map((q) => ({ questionId: q.questionId, correct: q.correct, questionText: q.question })),
    derivedWeaknesses: [],
    derivedStrengths: [],
  };

  // Map question results to concepts
  const conceptStats: Record<string, { correct: number; total: number; label: string }> = {};
  for (const q of quizResults) {
    const concepts = mapQuestionToConcepts(templateId, q.question);
    if (concepts.length === 0) {
      // uncategorized -> track under a generic bucket
      const key = "general";
      conceptStats[key] = conceptStats[key] || { correct: 0, total: 0, label: "General" };
      conceptStats[key].total += 1;
      if (q.correct) conceptStats[key].correct += 1;
      continue;
    }
    for (const c of concepts) {
      conceptStats[c.id] = conceptStats[c.id] || { correct: 0, total: 0, label: c.label };
      conceptStats[c.id].total += 1;
      if (q.correct) conceptStats[c.id].correct += 1;
    }
  }

  // Derive strengths / weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  for (const s of Object.values(conceptStats)) {
    const acc = s.total > 0 ? s.correct / s.total : 0;
    if (acc >= 0.8 && s.total >= 1) strengths.push(s.label);
    if (acc <= 0.6) weaknesses.push(s.label);
  }

  sessionSummary.derivedStrengths = strengths;
  sessionSummary.derivedWeaknesses = weaknesses;

  // Update aggregate
  topic.aggregate.attempts += 1;
  const correct = quizResults.filter((q) => q.correct).length;
  topic.aggregate.correct += correct;
  topic.aggregate.total += quizResults.length;
  topic.aggregate.accuracy = topic.aggregate.total > 0 ? topic.aggregate.correct / topic.aggregate.total : 0;

  // Merge strengths/weaknesses and recommendations
  const uniq = (arr: string[]) => Array.from(new Set(arr));
  topic.strengths = uniq([...topic.strengths, ...strengths]).slice(0, 8);
  topic.weaknesses = uniq([...topic.weaknesses, ...weaknesses]).slice(0, 8);

  // Recommendations: lowest performing concept labels
  const ranked = Object.values(conceptStats)
    .map((s) => ({ label: s.label, accuracy: s.total > 0 ? s.correct / s.total : 0, total: s.total }))
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
    .map((r) => r.label)
    .slice(0, 5);
  topic.recommendations = uniq([...ranked, ...topic.recommendations]).slice(0, 8);

  // Push session summary
  topic.sessions = [sessionSummary, ...topic.sessions].slice(0, 8);
  topic.lastUpdated = new Date().toISOString();

  store.topics[topicKey] = topic;
  saveStore(store);

  return topic;
}

export function getTopicInsights(topicKey: string): TopicInsights | null {
  const store = loadStore();
  return store.topics[topicKey] || null;
}

export function clearTopicInsights(topicKey: string) {
  const store = loadStore();
  delete store.topics[topicKey];
  saveStore(store);
}

export const insights = {
  recordQuizResults,
  getTopicInsights,
  clearTopicInsights,
};
