import type { BinarySearchStep } from "@/lib/types";

export function getBinarySearchStepCaption(
  step: BinarySearchStep,
  target: number,
  stepIndex: number,
  totalSteps: number
): string {
  const prefix = `Step ${stepIndex + 1} of ${totalSteps}: `;
  const midpoint = `Look at index ${step.mid}, which holds ${step.midValue}.`;

  if (step.comparison === "found") {
    return `${prefix}${midpoint} Target ${target} matches — algorithm complete!`;
  }

  if (step.comparison === "greater") {
    return `${prefix}${midpoint} ${target} is greater, so discard the left side (indices ${step.low}–${step.mid}) and search ${step.mid + 1}–${step.high}.`;
  }

  return `${prefix}${midpoint} ${target} is smaller, so discard the right side (indices ${step.mid}–${step.high}) and search ${step.low}–${step.mid - 1}.`;
}

export function isIndexInActiveRange(
  index: number,
  step: BinarySearchStep
): boolean {
  return index >= step.low && index <= step.high;
}

export function isIndexEliminated(
  index: number,
  step: BinarySearchStep
): boolean {
  if (step.comparison === "found" && index === step.mid) return false;
  return index < step.low || index > step.high;
}
