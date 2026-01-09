"use server";

import z from "zod";
import { actionClient } from "@/lib/safe-action";
import {
  retrieveContextSchema,
  sendMessageSchema,
} from "../schemas/chat.schema";
import {
  getNotebookHistory,
  retrieveContext,
  sendMessage,
} from "../services/chat.service";

export const getNotebookHistoryAction = actionClient
  .inputSchema(z.object({ notebook_id: z.number() }))
  .action(async ({ parsedInput }) => {
    try {
      const result = await getNotebookHistory(parsedInput.notebook_id);
      return result?.summary || "";
    } catch (error) {
      console.error("Error fetching history:", error);
      return "";
    }
  });

export const retrieveContextAction = actionClient
  .inputSchema(retrieveContextSchema)
  .action(async ({ parsedInput }) => {
    const result = await retrieveContext(parsedInput);
    return result;
  });

export const sendMessageAction = actionClient
  .inputSchema(sendMessageSchema)
  .action(async ({ parsedInput: { notebook_id, ...rest } }) => {
    const result = await sendMessage(notebook_id, rest);
    let parsedResult = result;

    if (typeof result === "string") {
      try {
        parsedResult = JSON.parse(result);
      } catch (_e) {
        // Keep as string if parsing fails
      }
    }

    return parsedResult;
  });
