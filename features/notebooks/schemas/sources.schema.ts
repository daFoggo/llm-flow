import z from "zod";

export const uploadSourceSchema = z.object({
  notebook_id: z.number(),
  file: z.object({
    filename: z.string(),
    content: z.string(), // base64 encoded content
    type: z.string(), // mime type
  }),
});

export const deleteSourceSchema = z.object({
  notebook_id: z.number(),
  source_id: z.number(),
});

export const getSourcesSchema = z.object({
  notebook_id: z.number(),
});

export type UploadSourceSchema = z.infer<typeof uploadSourceSchema>;
export type DeleteSourceSchema = z.infer<typeof deleteSourceSchema>;
export type GetSourcesSchema = z.infer<typeof getSourcesSchema>;
