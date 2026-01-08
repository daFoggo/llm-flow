export interface ChatModel {
  id: string;
  name: string;
  provider: "openai" | "anthropic";
  createdAt: string;
}

export interface CreateChatModelInput {
  name: string;
  provider: string;
}

export interface ChatModelsResponse {
  data: ChatModel[];
  total: number;
}
