export interface Notebook {
  id?: number;
  title?: string;
  description?: string | null;
  user_id?: number;
  created_at?: string;
  updated_at?: string;

  // File properties
  filename?: string;
  file_path?: string;
  file_hash?: string;

  // Error properties
  error?: string;
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
  success_files: Notebook[];
  failed_files: Notebook[];
}
