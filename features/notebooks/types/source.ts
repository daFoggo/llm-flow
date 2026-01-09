export interface Source {
  id: number;
  title: string | null;
  filename: string;
  file_path: string;
  file_hash: string;
  created_at: string;
  updated_at: string;
}

export interface GetSourcesResponse extends Array<Source> {}

export interface UploadSourceResponse extends Source {}

export interface DeleteSourceResponse {
  status: string;
}

export interface UploadSourceInput {
  notebook_id: number;
  file: File;
}

export interface DeleteSourceInput {
  notebook_id: number;
  source_id: number;
}
