"use server";

import { kyClient } from "@/lib/ky";
import { actionClient } from "@/lib/safe-action";
import {
  createNotebookSchema,
  getNotebooksSchema,
} from "../schemas/notebooks.schema";
import type {
  CreateNotebookResponse,
  GetNotebooksResponse,
} from "../types/notebooks";

export const createNotebookAction = actionClient
  .inputSchema(createNotebookSchema)
  .action(async ({ parsedInput: data }) => {
    const formData = new FormData();

    // Append each file as a real file/blob to the form data
    data.files.forEach((file) => {
      const buffer = Buffer.from(file.content, "base64");
      const blob = new Blob([buffer], { type: file.type });
      formData.append("files", blob, file.filename);
    });

    const result = await kyClient
      .post("notebook", { body: formData })
      .json<CreateNotebookResponse>();

    return result;
  });

export const getNotebooksAction = actionClient
  .inputSchema(getNotebooksSchema)
  .action(async ({ parsedInput: { limit, last_id } }) => {
    const searchParams = new URLSearchParams();
    if (limit) {
      searchParams.set("limit", limit.toString());
    }
    if (last_id !== undefined) {
      searchParams.set("last_id", last_id.toString());
    }

    const result = await kyClient
      .get("notebook", { searchParams })
      .json<GetNotebooksResponse>();

    return result;
  });
