"use server";

import { actionClient } from "@/lib/safe-action";
import {
  retrieveContextSchema,
  sendMessageSchema,
} from "../schemas/chat.schema";
import { retrieveContext, sendMessage } from "../services/chat.service";

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

    // Attempt to handle the case where the backend returns a double-encoded JSON string
    // as warned in the documentation: "Response trả về là một chuỗi JSON string"
    if (typeof result === "string") {
      try {
        parsedResult = JSON.parse(result);
      } catch (_e) {
        // Keep as string if parsing fails
      }
    }

    return parsedResult;
  });
