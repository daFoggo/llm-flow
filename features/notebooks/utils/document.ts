import { File, FileText, Link2, type LucideIcon } from "lucide-react";
import type { DocumentItem } from "../types/document";

export const getIconForType = (type: DocumentItem["type"]): LucideIcon => {
  switch (type) {
    case "link":
      return Link2;
    case "text":
      return FileText;
    case "file":
      return File;
    default:
      return File;
  }
};
