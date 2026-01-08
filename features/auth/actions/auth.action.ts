"use server";

import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { kyClient } from "@/lib/ky";
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
  User,
} from "../types/auth.types";

export async function registerAction(data: RegisterInput) {
  try {
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

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Registration failed:", error);
    let errorMessage = "Registration failed";

    if (error instanceof HTTPError) {
      try {
        const errorBody = await error.response.text();
        try {
          // Try to parse if it's JSON to get a cleaner message if possible (e.g. FastAPI returns { detail: ... })
          const errorJson = JSON.parse(errorBody);
          if (errorJson.detail) {
            errorMessage = Array.isArray(errorJson.detail)
              ? errorJson.detail.map((e: { msg: string }) => e.msg).join(", ")
              : errorJson.detail;
          } else {
            errorMessage = errorBody;
          }
        } catch {
          errorMessage = errorBody || error.response.statusText;
        }
      } catch {
        errorMessage = error.response.statusText;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function loginAction(data: LoginInput) {
  try {
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

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Login failed:", error);
    let errorMessage = "Login failed";

    if (error instanceof HTTPError) {
      // Try to read response body if possible, otherwise status text
      try {
        const errorBody = await error.response.text(); // or json() if backend returns structured error
        errorMessage = errorBody || error.response.statusText;
      } catch {
        errorMessage = error.response.statusText;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getMeAction() {
  try {
    const result = await kyClient.get("user/me").json<User>();
    return { success: true, data: result };
  } catch (error: unknown) {
    console.error("Get Me failed:", error);
    return { success: false, error: "Failed to fetch user data" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  return { success: true };
}
