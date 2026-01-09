import z from "zod";

export const retrieveContextSchema = z.object({
  user_query: z.string(),
  docs_ids: z.array(z.number()).optional(),
});

export const retrievedChunkSchema = z.object({
  chunk_id: z.string(),
  score: z.number(),
  text: z.string(),
  doc_id: z.number(),
  page: z.number(),
});

export const sendMessageSchema = z.object({
  notebook_id: z.number(),
  query: z.string(),
  history: z.string(),
  documents: z.array(retrievedChunkSchema),
});

export type RetrieveContextSchema = z.infer<typeof retrieveContextSchema>;
export type SendMessageSchema = z.infer<typeof sendMessageSchema>;
