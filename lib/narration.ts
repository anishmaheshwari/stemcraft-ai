import type { SimulationConfig, TemplateId } from "./types";

export function renderStepNarration(
  templateId: TemplateId,
  config: SimulationConfig,
  stepIndex: number
): string {
  if (templateId === "binary_search") {
    const binaryConfig = config as import("./types").BinarySearchConfig;
    const steps = binaryConfig.steps || [];
    const step = steps[stepIndex];
    if (!step) return "";
    const { mid, midValue, comparison, low, high } = step;
    if (comparison === "found") return `Step ${stepIndex + 1}: Found target at index ${mid} (value ${midValue}).`;
    if (comparison === "greater") return `Step ${stepIndex + 1}: Looked at index ${mid} (${midValue}) — target is greater; discard indices ${low}–${mid}.`;
    return `Step ${stepIndex + 1}: Looked at index ${mid} (${midValue}) — target is smaller; discard indices ${mid}–${high}.`;
  }

  if (templateId === "dns_resolution") {
    const dnsConfig = config as import("./types").DnsResolutionConfig;
    const steps = dnsConfig.steps || [];
    const step = steps[stepIndex];
    if (!step) return "";
    const { from, to, query, response, type } = step;
    if (type === "query") return `Step ${stepIndex + 1}: ${from} queries ${to} — "${query}".`;
    return `Step ${stepIndex + 1}: ${to} responds to ${from} — "${response}".`;
  }

  if (templateId === "projectile_motion") {
    const projectileConfig = config as import("./types").ProjectileMotionConfig;
    // Simple narration tied to scenario index
    const scenario = projectileConfig.scenarios?.[stepIndex] || null;
    if (scenario) return `Scenario ${stepIndex + 1}: Launch at ${scenario.angle}° with ${scenario.velocity} m/s.`;
  }

  return "";
}

export default renderStepNarration;
