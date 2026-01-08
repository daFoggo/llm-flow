import { HTTPError } from "ky";
import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: async (error) => {
    console.error("Action Error:", error);

    if (error instanceof HTTPError) {
      try {
        const text = await error.response.text();
        try {
          const json = JSON.parse(text);
          return json.detail || text;
        } catch {
          return text;
        }
      } catch {
        return error.response.statusText;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong!";
  },
});
