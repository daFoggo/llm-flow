"use client";

import { BookSearch } from "lucide-react";
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddSourcesDialog } from "./add-sources-dialog";
import { DocumentList } from "./document-list";
import { ResponsiveBlock } from "./responsive-block";

export const DocumentsManagementBlock = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <ResponsiveBlock
      title="Documents"
      icon={BookSearch}
      isMinimized={isMinimized}
      onToggle={() => setIsMinimized((prev) => !prev)}
      cardContent={<DocumentsManagementCardContent isMinimized={isMinimized} />}
    />
  );
};

interface DocumentsManagementCardContentProps {
  isMinimized: boolean;
}

const DocumentsManagementCardContent = ({
  isMinimized,
}: DocumentsManagementCardContentProps) => {
  return (
    <CardContent
      className={cn(
        "flex flex-col gap-4 transition-all duration-300 flex-1 min-h-0",
        isMinimized ? "p-2 items-center" : ""
      )}
    >
      <AddSourcesDialog isMinimized={isMinimized} />
      <DocumentList isMinimized={isMinimized} />
    </CardContent>
  );
};
