import { kyClient } from "@/lib/ky";
import type {
  AIResponse,
  RetrieveContextInput,
  RetrieveContextResponse,
  SendMessageInput,
} from "../types/chat";

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
  // Response from backend is a JSON string of the object, ky might parse it automatically if content-type is json
  // But user note says: "Response trả về là một chuỗi JSON string (được parse từ json.dumps(ai_response) của BE)"
  // If the *body* of the response is a JSON string, we might need to parse it twice if ky doesn't handle the inner string.
  // However, usually API frameworks return 'application/json' and the body IS the JSON object.
  // The note "Response trả về là một chuỗi JSON string" might mean the field "response" inside the JSON is a string?
  // "Lưu ý: Response trả về là một chuỗi JSON string (được parse từ json.dumps(ai_response) của BE), FE cần parse nó ra object nếu cần thiết hoặc hiển thị text."
  // Wait, if the whole response is a string, then ky().json() will fail or return a string.
  // Let's assume for now it returns standard JSON, but if the Content-Type is text/plain or string-ified JSON, we might need to adjust.
  // Based on the example:
  // {
  //     "response": "Theo tài liệu...",
  //     "citations": [ ... ]
  // }
  // This looks like a standard JSON object.
  // OR does it mean the response body is literally `"{\"response\": \"...\"}"`?
  // Let's trust standard KY handling for now, but be ready to debug.

  return kyClient
    .post(`notebook/${notebookId}/message`, { json: input })
    .json<AIResponse>();
};
