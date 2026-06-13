import type { SimulationConfig, TemplateId } from "@/lib/types";

export function getMaxSteps(
  templateId: TemplateId,
  config: SimulationConfig
): number {
  switch (templateId) {
    case "binary_search":
      return (config as { steps: unknown[] }).steps.length;
    case "dns_resolution":
      return (config as { steps: unknown[] }).steps.length;
    case "projectile_motion":
      return 1;
    default:
      return 1;
  }
}
