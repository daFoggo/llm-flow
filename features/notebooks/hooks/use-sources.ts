import useSWR from "swr";
import { getSourcesAction } from "../actions/sources.action";

const fetcher = async (notebookId: number) => {
  const res = await getSourcesAction({ notebook_id: notebookId });
  if (res?.serverError || res?.validationErrors) {
    throw new Error("Failed to fetch sources");
  }
  return res?.data || [];
};

export const useSources = (notebookId: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    notebookId ? ["sources", notebookId] : null,
    ([, id]) => fetcher(id as number)
  );

  return {
    sources: data,
    isLoading,
    isError: error,
    mutate,
  };
};
