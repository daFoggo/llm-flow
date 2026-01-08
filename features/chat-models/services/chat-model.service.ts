import "server-only";
import type { ChatModel } from "../types/chat-model";

export const chatModelService = {
  getChatModels: async (): Promise<ChatModel[]> => {
    // const res = await kyClient.get("models").json<ChatModelsResponse>();
    // return res.data;
    return [];
  },

  getChatModelById: async (_id: string): Promise<ChatModel> => {
    // return await kyClient.get(`models/${id}`).json<ChatModel>();
    throw new Error("Not implemented yet - Backend not ready");
  },
};
