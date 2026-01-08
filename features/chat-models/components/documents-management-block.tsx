import { BookSearch } from "lucide-react";

import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AddSourcesDialog } from "./add-sources-dialog";
import { DocumentList } from "./document-list";
import { ResponsiveBlock } from "./responsive-block";

interface IDocumentsManagementCardContentProps {
  isMinimized: boolean;
}

interface IDocumentsManagementBlockProps {
  isMinimized?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const DocumentsManagementBlock = ({
  isMinimized = false,
  onToggle,
  className,
}: IDocumentsManagementBlockProps) => {
  const contextAction = null;

  return (
    <ResponsiveBlock
      title="Documents"
      icon={BookSearch}
      minimizable
      isMinimized={isMinimized}
      minimizeDirection="left"
      onToggle={onToggle}
      className={className}
      headerAction={contextAction}
      cardContent={<DocumentsManagementCardContent isMinimized={isMinimized} />}
    />
  );
};

const DocumentsManagementCardContent = ({
  isMinimized,
}: IDocumentsManagementCardContentProps) => {
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
