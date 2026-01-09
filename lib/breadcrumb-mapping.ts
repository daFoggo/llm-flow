import { getNotebookById } from "@/features/notebooks/services/notebooks.service";

export const BREADCRUMB_MAPPING: Record<string, string> = {
  notebooks: "Notebooks",
  "chat-models": "Chat Models",
  logs: "Logs",
  feedbacks: "Feedbacks",
  overview: "Overview",
};

export function getBreadcrumbLabel(segment: string): string {
  return (
    BREADCRUMB_MAPPING[segment] ||
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

type DynamicLabelResolver = (id: string) => Promise<string | null>;

const DYNAMIC_BREADCRUMB_RESOLVERS: Record<string, DynamicLabelResolver> = {
  notebooks: async (id) => {
    const notebook = await getNotebookById(id);
    return notebook?.title ?? null;
  },
};

export async function getDynamicBreadcrumbLabel(
  segment: string,
  id: string
): Promise<string | null> {
  const resolver = DYNAMIC_BREADCRUMB_RESOLVERS[segment];
  if (!resolver) return null;

  return await resolver(id);
}
