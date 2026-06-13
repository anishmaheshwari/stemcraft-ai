"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

interface PanelTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  explain: ReactNode;
  simulate: ReactNode;
  quiz: ReactNode;
}

export function PanelTabs({
  activeTab,
  onTabChange,
  explain,
  simulate,
  quiz,
}: PanelTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="lg:hidden">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="explain">Explain</TabsTrigger>
        <TabsTrigger value="simulate">Simulate</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
      </TabsList>
      <TabsContent value="explain">{explain}</TabsContent>
      <TabsContent value="simulate">{simulate}</TabsContent>
      <TabsContent value="quiz">{quiz}</TabsContent>
    </Tabs>
  );
}
