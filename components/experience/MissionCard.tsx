"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export function MissionCard({ title, objective }: { title: string; objective: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Mission</CardTitle>
        <CardDescription className="text-xs">{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">{objective}</div>
      </CardContent>
    </Card>
  );
}

export default MissionCard;
