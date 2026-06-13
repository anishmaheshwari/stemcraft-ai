"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInsights } from "./InsightsProvider";

export function InsightsPanel({ topicKey }: { topicKey: string }) {
  const insights = useInsights();
  const [open, setOpen] = useState(false);
  const data = insights.getTopicInsights(topicKey);

  const topWeak = data?.weaknesses?.[0] ?? null;
  const topRec = data?.recommendations?.[0] ?? null;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Learning Insights</CardTitle>
          <CardDescription>Personalized feedback from this session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <div className="text-sm text-muted-foreground">You struggled with</div>
            <div className="mt-1 font-medium">{topWeak ?? "No major issues"}</div>
          </div>
          <div className="mb-3">
            <div className="text-sm text-muted-foreground">Recommended review</div>
            <div className="mt-1 font-medium">{topRec ?? "Review the explanation"}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>View details</Button>
            <Button variant="ghost" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Jump to simulation</Button>
          </div>
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl">
            {/* Simple Details drawer */}
            <div className="rounded-2xl bg-popover p-6">
              <h3 className="text-lg font-semibold">Learning insights</h3>
              <p className="text-sm text-muted-foreground mt-2">Session details and recommendations.</p>
              <div className="mt-4">
                <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data, null, 2)}</pre>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
