"use client";

import { useState } from "react";
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
import { useDocuments } from "@/features/chat-models/hooks/use-documents";
import { cn } from "@/lib/utils";
import { DocumentInputForm } from "./document-input-form";
import { UploadDocuments } from "./upload-documents";

type AddSourcesDialogProps = {
  isMinimized?: boolean;
};

export const AddSourcesDialog = ({ isMinimized }: AddSourcesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("file");
  const [linkContent, setLinkContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const { addDocuments, addDocument } = useDocuments();

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
    addDocument({
      type: "file",
      content: file.name,
      name: file.name,
      size: file.size,
    });
  };

  const linkSchema = z
    .string()
    .transform((val) =>
      val
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    )
    .pipe(
      z.array(z.string().url({ message: "Invalid URL format" })).min(1, {
        message: "At least one valid URL is required",
      })
    );

  const textSchema = z
    .string()
    .trim()
    .min(1, { message: "Text content cannot be empty" });

  const handleDone = () => {
    setErrors(null);

    try {
      if (activeTab === "link") {
        const links = linkSchema.parse(linkContent);
        addDocuments(
          links.map((link) => ({
            type: "link",
            content: link,
            name: link,
          }))
        );
      } else if (activeTab === "text") {
        const content = textSchema.parse(textContent);
        addDocuments([
          {
            type: "text",
            content: content,
            name: "Text Snippet",
            size: content.length,
          },
        ]);
      }
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
      {!isMinimized && "Add documents"}
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
            <p>Add documents</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
      )}
      <DialogContent className="sm:min-w-2xl flex flex-col max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Add documents</DialogTitle>
          <DialogDescription>
            Deep dive into your documents with AI-powered insights and analysis.
          </DialogDescription>
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
                <UploadDocuments onUploadSuccess={handleUploadSuccess} />
              </TabsContent>
              <TabsContent value="link" className="mt-4">
                <DocumentInputForm
                  inputType="link"
                  value={linkContent}
                  onChange={setLinkContent}
                  error={activeTab === "link" ? errors : null}
                />
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <DocumentInputForm
                  inputType="text"
                  value={textContent}
                  onChange={setTextContent}
                  error={activeTab === "text" ? errors : null}
                />
              </TabsContent>
            </TabsContents>
          </Tabs>
        </div>

        <DialogFooter className="mt-2">
          <Button onClick={handleDone}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
