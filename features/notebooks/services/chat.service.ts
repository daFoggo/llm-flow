import { kyClient } from "@/lib/ky";
import type {
  AIResponse,
  RetrieveContextInput,
  RetrieveContextResponse,
  SendMessageInput,
} from "../types/chat";

export const getNotebookHistory = async (
  notebookId: number
): Promise<{ summary: string }> => {
  return kyClient.get(`notebook/${notebookId}/history`).json();
};

export const retrieveContext = async (
  input: RetrieveContextInput
): Promise<RetrieveContextResponse> => {
  return kyClient
    .post("retrieve", { json: input })
    .json<RetrieveContextResponse>();
};

export const sendMessage = async (
  notebookId: number,
  input: SendMessageInput
): Promise<AIResponse> => {
  const response = await kyClient.post(`notebook/${notebookId}/message`, {
    json: input,
  });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    try {
      // Attempt to fix common Python dict string format issues
      const fixedText = text
        .replace(/'/g, '"')
        .replace(/None/g, "null")
        .replace(/True/g, "true")
        .replace(/False/g, "false");
      return JSON.parse(fixedText);
    } catch (_retryError) {
      console.error("Failed to parse AI response:", text);
      throw error;
    }
  }
};
