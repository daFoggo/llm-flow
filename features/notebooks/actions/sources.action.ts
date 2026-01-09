"use server";

import { actionClient } from "@/lib/safe-action";
import {
  deleteSourceSchema,
  getSourcesSchema,
  uploadSourceSchema,
} from "../schemas/sources.schema";
import {
  deleteSource,
  getSources,
  uploadSource,
} from "../services/sources.service";

export const uploadSourceAction = actionClient
  .inputSchema(uploadSourceSchema)
  .action(async ({ parsedInput: { notebook_id, file } }) => {
    // console.log("Uploading source:", { notebook_id, filename: file.filename, type: file.type, size: file.content.length });
    const formData = new FormData();
    const buffer = Buffer.from(file.content, "base64");

    // Ensure we have a valid mime type, default to octet-stream if empty
    const mimeType = file.type || "application/octet-stream";
    const blob = new Blob([buffer], { type: mimeType });

    formData.append("file", blob, file.filename);

    const result = await uploadSource(notebook_id, formData);
    return result;
  });

export const deleteSourceAction = actionClient
  .inputSchema(deleteSourceSchema)
  .action(async ({ parsedInput: { notebook_id, source_id } }) => {
    const result = await deleteSource(notebook_id, source_id);
    return result;
  });

export const getSourcesAction = actionClient
  .inputSchema(getSourcesSchema)
  .action(async ({ parsedInput: { notebook_id } }) => {
    const result = await getSources(notebook_id);
    return result;
  });
