"use client";

import { Upload, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Plus } from "@/components/animate-ui/icons/plus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Spinner } from "@/components/ui/spinner";
import { createNotebookAction } from "../actions/notebooks.action";

export const CreateNotebookDialog = () => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { execute, status } = useAction(createNotebookAction, {
    onSuccess: ({ data }) => {
      if (data) {
        if (data.failed_files.length > 0) {
          toast.warning(
            `Notebook created, but ${data.failed_files.length} file(s) failed to upload.`,
            {
              description: data.failed_files
                .map((f) => f.filename || "Unknown file")
                .join(", "),
            }
          );
        } else {
          toast.success("Notebook created successfully");
        }
      }
      setOpen(false);
      setFiles([]);
    },
    onError: ({ error }) => {
      let errorMessage = "Failed to create notebook";
      if (typeof error.serverError === "string") {
        errorMessage = error.serverError;
      } else if (Array.isArray(error.serverError)) {
        errorMessage = error.serverError.map((e: any) => e.msg).join(", ");
      } else if (typeof error.serverError === "object") {
        errorMessage = JSON.stringify(error.serverError);
      }
      toast.error(errorMessage);
    },
  });

  const MAX_ALLOWED_FILES = 10;
  const MAX_VISIBLE_FILES = 3;
  const MAX_FILE_SIZE_MB = 100;

  const onUpload = useCallback(
    async (
      filesToUpload: File[],
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
      filesToUpload.forEach(async (file) => {
        try {
          onProgress(file, 100);
          onSuccess(file);
        } catch (error) {
          onError(file, error instanceof Error ? error : new Error("Error"));
        }
      });
    },
    []
  );

  const onFileReject = useCallback((_file: File, message: string) => {
    toast.error(`File rejected: ${message}`);
  }, []);

  const handleDone = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    setIsUploading(true);
    try {
      const filePayloads = await Promise.all(
        files.map(async (file) => {
          const toBase64 = (file: File) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () =>
                resolve((reader.result as string).split(",")[1]);
              reader.onerror = (error) => reject(error);
            });

          return {
            filename: file.name,
            content: await toBase64(file),
            type: file.type,
          };
        })
      );

      execute({ files: filePayloads });
    } catch (error) {
      toast.error("Failed to read files");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = status === "executing" || isUploading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AnimateIcon animateOnHover animateOnView>
          <Button className="w-fit">
            <Plus />
            Create Notebook
          </Button>
        </AnimateIcon>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl flex flex-col max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Create Notebook</DialogTitle>
          <DialogDescription>
            Upload documents to create a new notebook.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
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
                  Or click to browse (max {MAX_ALLOWED_FILES} files)
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
                        <X className="size-4" />
                      </Button>
                    </FileUploadItemDelete>
                  </div>
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
        </div>

        <DialogFooter>
          <Button onClick={handleDone} disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
