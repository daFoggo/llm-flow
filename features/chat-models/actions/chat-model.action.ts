"use server";

import type { CreateChatModelInput } from "../types/chat-model";

export async function createChatModelAction(payload: CreateChatModelInput) {
  try {
    // await kyClient.post("models", { json: payload });
    // revalidatePath("/dashboard/chat-models");
    console.log("Mock create chat model:", payload);
    return { success: true };
  } catch (error: unknown) {
    console.error("Create model failed:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to create model",
    };
  }
}
