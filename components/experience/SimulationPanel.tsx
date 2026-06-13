"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationRegistry } from "@/components/simulations/SimulationRegistry";
import { StepControls } from "@/components/shared/StepControls";
import type { SimulationConfig, TemplateId } from "@/lib/types";

interface SimulationPanelProps {
  templateId: TemplateId;
  config: SimulationConfig;
  isPlaying: boolean;
  currentStep: number;
  onStepChange: (step: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
  maxSteps: number;
}

export function SimulationPanel({
  templateId,
  config,
  isPlaying,
  currentStep,
  onStepChange,
  onPlayPause,
  onReset,
  maxSteps,
}: SimulationPanelProps) {
  const canStepForward = currentStep < maxSteps - 1;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Simulate</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex-1 rounded-xl border border-border/60 bg-background/40">
          <SimulationRegistry
            templateId={templateId}
            config={config}
            isPlaying={isPlaying}
            currentStep={currentStep}
            onStepChange={onStepChange}
          />
        </div>
        <StepControls
          isPlaying={isPlaying}
          canStepForward={canStepForward}
          canPlay={canStepForward}
          currentStep={currentStep}
          totalSteps={maxSteps}
          onPlayPause={onPlayPause}
          onStep={() => onStepChange(Math.min(currentStep + 1, maxSteps - 1))}
          onReset={onReset}
        />
      </CardContent>
    </Card>
  );
}
