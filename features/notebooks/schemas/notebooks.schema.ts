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

export const getNotebooksSchema = z.object({
  limit: z.number().optional(),
  last_id: z.number().optional(),
});

export const deleteNotebookSchema = z.object({
  notebook_id: z.number(),
});

export type CreateNotebookSchema = z.infer<typeof createNotebookSchema>;
export type GetNotebooksSchema = z.infer<typeof getNotebooksSchema>;
export type DeleteNotebookSchema = z.infer<typeof deleteNotebookSchema>;
