import { kyClient } from "@/lib/ky";
import type {
  DeleteSourceResponse,
  GetSourcesResponse,
  Source,
  UploadSourceResponse,
} from "../types/source";

export const getSources = async (notebookId: number): Promise<Source[]> => {
  return kyClient
    .get(`notebook/${notebookId}/sources`)
    .json<GetSourcesResponse>();
};

export const uploadSource = async (
  notebookId: number,
  formData: FormData
): Promise<UploadSourceResponse> => {
  return kyClient
    .post(`notebook/${notebookId}/sources`, {
      body: formData,
    })
    .json<UploadSourceResponse>();
};

export const deleteSource = async (
  notebookId: number,
  sourceId: number
): Promise<DeleteSourceResponse> => {
  return kyClient
    .delete(`notebook/${notebookId}/sources`, {
      searchParams: { source_id: sourceId },
    })
    .json<DeleteSourceResponse>();
};
