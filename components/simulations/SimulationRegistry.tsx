"use client";

import { BinarySearchSim } from "@/components/simulations/cs/BinarySearchSim";
import { DnsResolutionSim } from "@/components/simulations/cs/DnsResolutionSim";
import { ProjectileMotionSim } from "@/components/simulations/physics/ProjectileMotionSim";
import type { SimulationConfig, TemplateId } from "@/lib/types";
import type { ComponentType } from "react";
import React from "react";

export interface SimulationComponentProps {
  config: SimulationConfig;
  isPlaying: boolean;
  currentStep: number;
  onStepChange: (step: number) => void;
}

const EmptySim: ComponentType<SimulationComponentProps> = () => null;

const SIMULATION_REGISTRY: Record<
  TemplateId,
  ComponentType<SimulationComponentProps>
> = {
  binary_search: BinarySearchSim as ComponentType<SimulationComponentProps>,
  dns_resolution: DnsResolutionSim as ComponentType<SimulationComponentProps>,
  projectile_motion: ProjectileMotionSim as ComponentType<SimulationComponentProps>,
  ai_lesson: EmptySim,
};

interface SimulationRegistryProps extends SimulationComponentProps {
  templateId: TemplateId;
}

export function SimulationRegistry({
  templateId,
  ...props
}: SimulationRegistryProps) {
  const Component = SIMULATION_REGISTRY[templateId];
  return <Component {...props} />;
}
