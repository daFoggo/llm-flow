import useSWRInfinite from "swr/infinite";
import { getNotebooksAction } from "../actions/notebooks.action";
import type { Notebook } from "../types/notebooks";

const fetcher = async ([, last_id]: [string, number | undefined]) => {
  const res = await getNotebooksAction({ limit: 10, last_id });
  if (res?.serverError || res?.validationErrors)
    throw new Error("Failed to fetch");
  return res?.data || [];
};

export const useNotebooks = (initialNotebooks?: Notebook[]) => {
  const getKey = (
    pageIndex: number,
    previousPageData: Notebook[]
  ): [string, number | undefined] | null => {
    // If reached the end, return null
    if (previousPageData && !previousPageData.length) return null;

    // First page, we don't have previous data
    if (pageIndex === 0) return ["notebooks", undefined];

    // Add last_id to the key
    return ["notebooks", previousPageData[previousPageData.length - 1].id];
  };

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    {
      fallbackData: initialNotebooks ? [initialNotebooks] : undefined,
      revalidateFirstPage: false,
      revalidateOnFocus: true,
    }
  );

  const notebooks = data ? data.flat() : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 10);

  const loadMore = () => setSize(size + 1);

  return {
    notebooks,
    isLoadingMore,
    isReachingEnd,
    isLoading,
    isValidating,
    isEmpty,
    loadMore,
  };
};
