export interface RetrieveContextInput {
  user_query: string;
  source_id: number;
}

export interface RetrievedImage {
  caption: string;
  image_path: string;
  page?: number;
  breadcrumb?: string;
}

export interface RetrievedContext {
  texts: string[];
  images: RetrievedImage[];
}

export type RetrieveContextResponse = RetrievedContext;

export interface SendMessageInput {
  query: string;
  history: string;
  documents: RetrievedContext;
}

export interface AIResponse {
  response: string;
  citations: string[];
  recommendations: string[];
}
