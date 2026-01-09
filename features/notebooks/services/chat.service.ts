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
  return kyClient
    .post(`notebook/${notebookId}/message`, { json: input })
    .json<AIResponse>();
};
