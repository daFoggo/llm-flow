"use client";

import { BookSearch } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { AddSourcesDialog } from "./add-sources-dialog";
import { DocumentList } from "./document-list";
import { ResponsiveBlock } from "./responsive-block";

export const DocumentsManagementBlock = () => {
  return (
    <ResponsiveBlock
      title="Documents"
      icon={BookSearch}
      cardContent={<DocumentsManagementCardContent />}
    />
  );
};

const DocumentsManagementCardContent = () => {
  return (
    <CardContent className="flex flex-col gap-4">
      <AddSourcesDialog />
      <DocumentList />
    </CardContent>
  );
};
