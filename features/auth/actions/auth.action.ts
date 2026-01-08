"use server";

import { cookies } from "next/headers";
import { kyClient } from "@/lib/ky";
import { actionClient } from "@/lib/safe-action";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import type {
  LoginResponse,
  RegisterResponse,
  User,
} from "../types/auth.types";

export const registerAction = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput: data }) => {
    const result = await kyClient
      .post("user/register", {
        json: data,
      })
      .json<RegisterResponse>();

    // Store token in cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return result;
  });

export const loginAction = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: data }) => {
    // Login API expects form data
    const formData = new FormData();
    // Backend expects 'username' but we are sending email
    formData.append("username", data.email);
    if (data.password) {
      formData.append("password", data.password);
    }

    const result = await kyClient
      .post("user/login", {
        body: formData,
      })
      .json<LoginResponse>();

    // Store token in cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return result;
  });

export const getMeAction = actionClient.action(async () => {
  const result = await kyClient.get("user/me").json<User>();
  return result;
});

export const logoutAction = actionClient.action(async () => {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  return { success: true };
});
