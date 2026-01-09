import { BACKEND_API } from "@/configs/env";
import ky from "ky";

export const kyClient = ky.create({
  prefixUrl: BACKEND_API,
  timeout: 30_000,
  retry: {
    limit: 2,
    methods: ["get", "post", "put"],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined | null;

        if (typeof window !== "undefined") {
          // Client side: get from localStorage
          token = localStorage.getItem("access_token");
        } else {
          // Server side: dynamically import cookies
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          token = cookieStore.get("access_token")?.value;
        }

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Auto-refresh token khi bị 401
        if (response.status === 401) {
          // If on client side, redirect to sign-in
          if (typeof window !== "undefined") {
            window.location.href = "/sign-in";
          }
        }
      },
    ],
  },
});
