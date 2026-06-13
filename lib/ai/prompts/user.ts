export function buildBinarySearchUserPrompt(topic: string): string {
  return `Create an interactive lesson for this student topic: "${topic}"

Use a binary search simulation config. Tailor explanation and quiz to the topic.`;
}

export function buildDnsResolutionUserPrompt(topic: string): string {
  return `Create an interactive networking lesson for this student topic: "${topic}"

Use a DNS resolution simulation trace. Tailor explanation and quiz to the topic.`;
}

export function buildProjectileMotionUserPrompt(topic: string): string {
  return `Create an interactive physics lesson for this student topic: "${topic}"

Use a projectile motion simulation config. Tailor explanation and quiz to the topic.`;
}

export function buildAiLessonUserPrompt(topic: string): string {
  return `Create a concise, high-quality lesson for this student topic: "${topic}".

Include a short title, summary, key concepts, visual learning cards (if applicable), a short quiz (0-6 questions), and personalized insights.`;
}
