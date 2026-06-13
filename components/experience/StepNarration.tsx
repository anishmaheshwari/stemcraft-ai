"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { renderStepNarration } from "@/lib/narration";
import type { SimulationConfig, TemplateId } from "@/lib/types";

export function StepNarration({ templateId, config, stepIndex }: { templateId: TemplateId; config: SimulationConfig; stepIndex: number }) {
  const text = renderStepNarration(templateId, config, stepIndex);
  if (!text) return null;
  return (
    <Card>
      <CardContent>
        <div className="text-sm font-medium">{text}</div>
      </CardContent>
    </Card>
  );
}

export default StepNarration;
