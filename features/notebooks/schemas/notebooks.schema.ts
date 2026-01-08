import z from "zod";

export const createNotebookSchema = z.object({
  files: z.array(
    z.object({
      filename: z.string(),
      content: z.string(),
      type: z.string(),
    })
  ),
});

export const deleteNotebookSchema = z.object({
  notebook_id: z.number(),
});

export type CreateNotebookSchema = z.infer<typeof createNotebookSchema>;
export type DeleteNotebookSchema = z.infer<typeof deleteNotebookSchema>;
