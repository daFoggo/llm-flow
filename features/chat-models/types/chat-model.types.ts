export type ChatModel = {
  id: string;
  name: string;
  provider: "openai" | "anthropic";
  createdAt: string;
};

export type CreateChatModelInput = {
  name: string;
  provider: string;
};

export type ChatModelsResponse = {
  data: ChatModel[];
  total: number;
};
