import ky from "ky";

export const kyClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_API,
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
          // refresh token ở đây
          // const newToken = await refreshToken();
          // localStorage.setItem("ACCESS_TOKEN", newToken);
          // return kyClient(_request); // retry
        }
      },
    ],
  },
});
