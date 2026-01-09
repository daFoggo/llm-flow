import type { Source } from "./source";

export interface Notebook {
  id?: number;
  title?: string;
  description?: string | null;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNotebookInput {
  files: {
    filename: string;
    content: string;
    type: string;
  }[];
}

export interface DeleteNotebookInput {
  notebook_id: number;
}

export interface CreateNotebookResponse {
  notebook: Notebook;
  success_files: Source[];
  failed_files: Source[];
}

export type GetNotebooksResponse = Notebook[];
