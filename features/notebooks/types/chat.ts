export interface RetrieveContextInput {
  user_query: string;
  docs_ids?: number[];
}

export interface RetrievedChunk {
  chunk_id: string;
  score: number;
  text: string;
  doc_id: number;
  page: number;
}

export type RetrieveContextResponse = RetrievedChunk[];

export interface SendMessageInput {
  query: string;
  history: string;
  documents: RetrievedChunk[];
}

export interface AIResponse {
  response: string;
  citations?: string[];
  recommendations?: string[];
}
