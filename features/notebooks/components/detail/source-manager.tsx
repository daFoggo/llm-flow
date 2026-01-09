import { BookSearch } from "lucide-react";

import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddSourcesDialog } from "./add-sources-dialog";
import { ResponsiveBlock } from "./responsive-block";
import { SourceList } from "./source-list";

type SourceManagerProps = {
  notebookId: number;
  isMinimized?: boolean;
  onToggle?: () => void;
  className?: string;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
};

export const SourceManager = ({
  notebookId,
  isMinimized = false,
  onToggle,
  className,
  selectedIds,
  onSelectionChange,
}: SourceManagerProps) => {
  const contextAction = null;

  return (
    <ResponsiveBlock
      title="Sources"
      icon={BookSearch}
      minimizable
      isMinimized={isMinimized}
      minimizeDirection="left"
      onToggle={onToggle}
      className={className}
      headerAction={contextAction}
      cardContent={
        <DocumentsManagementCardContent
          isMinimized={isMinimized}
          notebookId={notebookId}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
        />
      }
    />
  );
};

type DocumentsManagementCardContentProps = {
  isMinimized: boolean;
  notebookId: number;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
};

const DocumentsManagementCardContent = ({
  isMinimized,
  notebookId,
  selectedIds,
  onSelectionChange,
}: DocumentsManagementCardContentProps) => {
  return (
    <CardContent
      className={cn(
        "flex flex-col gap-4 transition-all duration-300 flex-1 min-h-0",
        isMinimized ? "p-2 items-center" : ""
      )}
    >
      <AddSourcesDialog isMinimized={isMinimized} notebookId={notebookId} />
      <SourceList
        isMinimized={isMinimized}
        notebookId={notebookId}
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
      />
    </CardContent>
  );
};
