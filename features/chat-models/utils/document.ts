import { File, FileText, Link2, type LucideIcon } from "lucide-react";
import type { IDocumentItem } from "../types/document.type";

export const getIconForType = (type: IDocumentItem["type"]): LucideIcon => {
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
