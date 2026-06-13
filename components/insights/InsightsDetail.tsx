"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useInsights } from "./InsightsProvider";

export function InsightsDetail({ topicKey }: { topicKey: string }) {
  const insights = useInsights();
  const data = insights.getTopicInsights(topicKey);

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights for this topic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-muted-foreground">Accuracy</div>
          <div className="mt-1 font-medium">{Math.round(data.aggregate.accuracy * 100)}%</div>
        </div>
        <div className="mb-4">
          <div className="text-sm text-muted-foreground">Needs review</div>
          <div className="mt-1">{data.weaknesses.map((w) => <div key={w} className="py-1">{w}</div>)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Recommended</div>
          <div className="mt-1">{data.recommendations.map((r) => <div key={r} className="py-1">{r}</div>)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
