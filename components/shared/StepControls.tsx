"use client";

import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepControlsProps {
  isPlaying: boolean;
  canStepForward: boolean;
  canPlay?: boolean;
  currentStep: number;
  totalSteps: number;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
}

export function StepControls({
  isPlaying,
  canStepForward,
  canPlay = true,
  currentStep,
  totalSteps,
  onPlayPause,
  onStep,
  onReset,
}: StepControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-muted-foreground">
        Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onStep}
          disabled={!canStepForward || isPlaying}
        >
          <SkipForward />
          Step
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onPlayPause}
          disabled={!canPlay && !isPlaying}
        >
          {isPlaying ? <Pause /> : <Play />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw />
          Reset
        </Button>
      </div>
    </div>
  );
}
