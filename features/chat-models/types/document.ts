export interface DocumentItem {
  id: string;
  type: "link" | "text" | "file";
  content: string; // URL for link, text content for text, filename for file
  name?: string; // Optional name for the document
  size?: number; // Size in bytes
  createdAt: number;
  isSelected: boolean;
}
