"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { PlusIcon } from "@/components/animate-ui/icons/plus";
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
import { cn } from "@/lib/utils";
import { useSources } from "../../hooks/use-sources";
import { SourceInputForm } from "./source-input-form";
import { UploadSources } from "./upload-sources";

type AddSourcesDialogProps = {
  isMinimized?: boolean;
  notebookId: number;
};

export const AddSourcesDialog = ({
  isMinimized,
  notebookId,
}: AddSourcesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("file");
  const [linkContent, setLinkContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [errors, setErrors] = useState<string | null>(null);

  const { mutate } = useSources(notebookId);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset inputs when dialog closes
      setTimeout(() => {
        setLinkContent("");
        setTextContent("");
        setErrors(null);
        setActiveTab("file");
      }, 300);
    }
  };

  const handleUploadSuccess = (file: File) => {
    toast.success(`Source "${file.name}" added successfully`);
    mutate();
  };

  // const linkSchema = z
  //   .string()
  //   .transform((val) =>
  //     val
  //       .split("\n")
  //       .map((l) => l.trim())
  //       .filter(Boolean)
  //   )
  //   .pipe(
  //     z.array(z.string().url({ message: "Invalid URL format" })).min(1, {
  //       message: "At least one valid URL is required",
  //     })
  //   );

  // const textSchema = z
  //   .string()
  //   .trim()
  //   .min(1, { message: "Text content cannot be empty" });

  const handleDone = () => {
    setErrors(null);

    // Disable Link and Text logic for now as per requirement
    if (activeTab === "link" || activeTab === "text") {
      toast.info("This feature is not yet supported by the backend.");
      setOpen(false);
      return;
    }

    try {
      /*
      if (activeTab === "link") {
        const links = linkSchema.parse(linkContent);
         // Logic removed
      } else if (activeTab === "text") {
        const content = textSchema.parse(textContent);
         // Logic removed
      }
      */
      setOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.issues[0].message);
      }
    }
  };

  const TriggerButton = (
    <Button
      className={cn("transition-all", isMinimized ? "size-10 p-0" : "w-full")}
    >
      <AnimateIcon animateOnHover={!isMinimized}>
        <PlusIcon />
      </AnimateIcon>
      {!isMinimized && "Add sources"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {isMinimized ? (
        <Tooltip side="right">
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add sources</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
      )}
      <DialogContent className="sm:min-w-2xl flex flex-col max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Add sources</DialogTitle>
          <DialogDescription>Upload files to your notebook.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              setErrors(null);
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file">File Upload</TabsTrigger>
              <TabsTrigger value="link">Links</TabsTrigger>
              <TabsTrigger value="text">Paste Text</TabsTrigger>
            </TabsList>
            <TabsContents>
              <TabsContent value="file" className="mt-4">
                <UploadSources
                  notebookId={notebookId}
                  onUploadSuccess={handleUploadSuccess}
                />
              </TabsContent>
              <TabsContent value="link" className="mt-4">
                <SourceInputForm
                  inputType="link"
                  value={linkContent}
                  onChange={setLinkContent}
                  error={activeTab === "link" ? errors : null}
                />
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <SourceInputForm
                  inputType="text"
                  value={textContent}
                  onChange={setTextContent}
                  error={activeTab === "text" ? errors : null}
                />
              </TabsContent>
            </TabsContents>
          </Tabs>
        </div>

        {activeTab !== "file" && (
          <DialogFooter className="mt-2">
            <Button onClick={handleDone}>Done</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
