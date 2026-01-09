import z from "zod";

export const retrieveContextSchema = z.object({
  user_query: z.string(),
  source_id: z.number(),
});

export const retrievedImageSchema = z.object({
  caption: z.string(),
  image_path: z.string(),
  page: z.number().optional(),
  breadcrumb: z.string().optional(),
});

export const retrievedContextSchema = z.object({
  texts: z.array(z.string()),
  images: z.array(retrievedImageSchema),
});

export const sendMessageSchema = z.object({
  notebook_id: z.number(),
  query: z.string(),
  history: z.string(),
  documents: retrievedContextSchema,
});

export type RetrieveContextSchema = z.infer<typeof retrieveContextSchema>;
export type SendMessageSchema = z.infer<typeof sendMessageSchema>;
