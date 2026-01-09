"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import { ChatInterface, SourceManager } from "@/features/notebooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type MinimizeState = "sources" | "conversation" | null;

const NotebookDetailPage = () => {
  const isMobile = useIsMobile();
  const params = useParams();
  const notebookId = Number(params?.id);
  const [minimizedBlock, setMinimizedBlock] = useState<MinimizeState>(null);
  const [activeTab, setActiveTab] = useState("sources");

  const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([]);

  const toggleSources = () => {
    setMinimizedBlock((prev) => (prev === "sources" ? null : "sources"));
  };

  if (isMobile) {
    return (
      <div className="p-4 h-[calc(100dvh-var(--dashboard-header-height-with-margin))] overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full w-full"
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
          </TabsList>
          <TabsContents className="h-full flex-1 min-h-0">
            <TabsContent value="sources" className="h-full">
              <SourceManager
                className="h-full"
                notebookId={notebookId}
                selectedIds={selectedSourceIds}
                onSelectionChange={setSelectedSourceIds}
              />
            </TabsContent>
            <TabsContent value="conversation" className="h-full">
              <ChatInterface
                className="h-full"
                notebookId={notebookId}
                selectedSourceIds={selectedSourceIds}
              />
            </TabsContent>
          </TabsContents>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-between gap-4 h-[calc(100dvh-var(--dashboard-header-height-with-margin))] overflow-hidden">
      <SourceManager
        isMinimized={minimizedBlock === "sources"}
        onToggle={toggleSources}
        className={cn(
          "transition-[width,flex] duration-300 ease-in-out",
          minimizedBlock === "sources"
            ? "" // ResponsiveBlock handles w-fit
            : minimizedBlock === "conversation"
            ? "flex-1" // Maximized
            : "w-[30%] shrink-0" // Default
        )}
        notebookId={notebookId}
        selectedIds={selectedSourceIds}
        onSelectionChange={setSelectedSourceIds}
      />
      <ChatInterface
        className={cn("transition-[width,flex] duration-300 ease-in-out, pb-0")}
        notebookId={notebookId}
        selectedSourceIds={selectedSourceIds}
      />
    </div>
  );
};

export default NotebookDetailPage;
