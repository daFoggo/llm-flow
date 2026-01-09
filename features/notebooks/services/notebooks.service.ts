import "server-only";
import { cache } from "react";
import { kyClient } from "@/lib/ky";
import type { Notebook } from "../types/notebooks";

export const getNotebookById = cache(async (id: string | number) => {
  try {
    return await kyClient.get(`notebook/${id}`).json<Notebook>();
  } catch (error) {
    // console.error(`Failed to fetch notebook ${id}`, error);
    // Return null or throw depending on how you want to handle 404s
    return null;
  }
});
