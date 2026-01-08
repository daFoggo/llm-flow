"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import {
  ConversationManagementBlock,
  DocumentsManagementBlock,
} from "@/features/chat-models";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type MinimizeState = "documents" | "conversation" | null;

const ChatModelsPage = () => {
  const isMobile = useIsMobile();
  const [minimizedBlock, setMinimizedBlock] = useState<MinimizeState>(null);
  const [activeTab, setActiveTab] = useState("documents");

  const toggleDocuments = () => {
    setMinimizedBlock((prev) => (prev === "documents" ? null : "documents"));
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
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
          </TabsList>
          <TabsContents className="h-full flex-1 min-h-0">
            <TabsContent value="documents" className="h-full">
              <DocumentsManagementBlock className="h-full" />
            </TabsContent>
            <TabsContent value="conversation" className="h-full">
              <ConversationManagementBlock className="h-full" />
            </TabsContent>
          </TabsContents>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-between gap-4 h-[calc(100dvh-var(--dashboard-header-height-with-margin))] overflow-hidden">
      <DocumentsManagementBlock
        isMinimized={minimizedBlock === "documents"}
        onToggle={toggleDocuments}
        className={cn(
          "transition-[width,flex] duration-300 ease-in-out",
          minimizedBlock === "documents"
            ? "" // ResponsiveBlock handles w-fit
            : minimizedBlock === "conversation"
            ? "flex-1" // Maximized
            : "w-[30%] shrink-0" // Default
        )}
      />
      <ConversationManagementBlock
        className={cn("transition-[width,flex] duration-300 ease-in-out, pb-0")}
      />
    </div>
  );
};

export default ChatModelsPage;
