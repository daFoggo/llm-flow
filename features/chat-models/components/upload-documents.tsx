"use client";

import { Upload, X } from "lucide-react";
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

type UploadDocumentsProps = {
  onUploadSuccess?: (file: File) => void;
};

export const UploadDocuments = ({ onUploadSuccess }: UploadDocumentsProps) => {
  const MAX_ALLOWED_FILES = 10;
  const MAX_VISIBLE_FILES = 3;
  const MAX_FILE_SIZE_MB = 100;
  const [files, setFiles] = useState<File[]>([]);

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
        // Process each file individually
        const uploadPromises = files.map(async (file) => {
          try {
            // Simulate file upload with progress
            const totalChunks = 10;
            let uploadedChunks = 0;

            // Simulate chunk upload with delays
            for (let i = 0; i < totalChunks; i++) {
              // Simulate network delay (100-300ms per chunk)
              await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * 200 + 100)
              );

              // Update progress for this specific file
              uploadedChunks++;
              const progress = (uploadedChunks / totalChunks) * 100;
              onProgress(file, progress);
            }

            // Simulate server processing delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            onSuccess(file);
            onUploadSuccess?.(file);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed")
            );
          }
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
      } catch (error) {
        // This handles any error that might occur outside the individual upload processes
        console.error("Unexpected error during upload:", error);
      }
    },
    [onUploadSuccess]
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
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
