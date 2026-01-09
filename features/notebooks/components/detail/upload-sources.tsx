"use client";

import { Upload, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import * as React from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { uploadSourceAction } from "../../actions/sources.action";

type UploadSourcesProps = {
  notebookId: number;
  onUploadSuccess?: (file: File) => void;
};

export const UploadSources = ({
  notebookId,
  onUploadSuccess,
}: UploadSourcesProps) => {
  const MAX_ALLOWED_FILES = 10;
  const MAX_VISIBLE_FILES = 3;
  const MAX_FILE_SIZE_MB = 100;
  const [files, setFiles] = useState<File[]>([]);

  const { executeAsync } = useAction(uploadSourceAction);

  const onUpload = useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      }
    ) => {
      try {
        const uploadPromises = files.map(async (file) => {
          try {
            onProgress(file, 10); // Start progress

            const toBase64 = (file: File) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () =>
                  resolve((reader.result as string).split(",")[1]);
                reader.onerror = (error) => reject(error);
              });

            const content = await toBase64(file);
            onProgress(file, 40); // Reading done

            const result = await executeAsync({
              notebook_id: notebookId,
              file: {
                filename: file.name,
                content,
                type: file.type,
              },
            });

            if (result?.data) {
              onProgress(file, 100);
              onSuccess(file);
              onUploadSuccess?.(file);
            } else {
              const errorMsg = result?.serverError
                ? typeof result.serverError === "string"
                  ? result.serverError
                  : "Server Error"
                : "Upload failed";
              throw new Error(errorMsg);
            }
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed")
            );
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    [notebookId, executeAsync, onUploadSuccess]
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      maxFiles={MAX_ALLOWED_FILES}
      maxSize={MAX_FILE_SIZE_MB * 1024 * 1024}
      className="w-full"
      onUpload={onUpload}
      onFileReject={onFileReject}
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max {MAX_ALLOWED_FILES} files, up to{" "}
            {MAX_FILE_SIZE_MB}MB each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.slice(0, MAX_VISIBLE_FILES).map((file, index) => (
          <FileUploadItem key={`${file.name}-${index}`} value={file}>
            <div className="flex w-full items-center gap-2">
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon">
                  <X />
                </Button>
              </FileUploadItemDelete>
            </div>
            <FileUploadItemProgress />
          </FileUploadItem>
        ))}
        {files.length > MAX_VISIBLE_FILES && (
          <div className="flex items-center justify-center pt-2">
            <Badge variant="secondary">
              +{files.length - MAX_VISIBLE_FILES} files
            </Badge>
          </div>
        )}
      </FileUploadList>
    </FileUpload>
  );
};
