import "server-only";
import { cache } from "react";
import { kyClient } from "@/lib/ky";
import type { Notebook } from "../types/notebooks";

export const getNotebookById = cache(async (id: string | number) => {
  try {
    const data = await kyClient
      .get("notebook", { searchParams: { id: id.toString() } })
      .json<Notebook[]>(); // API checks by query param and returns a list

    return data[0] || null;
  } catch (error) {
    // console.error(`Failed to fetch notebook ${id}`, error);
    // Return null or throw depending on how you want to handle 404s
    return null;
  }
});
