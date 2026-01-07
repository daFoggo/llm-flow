"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocuments } from "@/features/chat-models/hooks/use-documents";
import { DocumentInputForm } from "./document-input-form";
import { UploadDocuments } from "./upload-documents";

export const AddSourcesDialog = () => {
  const [open, setOpen] = useState(false);
  const { addDocuments, addDocument } = useDocuments();

  const handleAddLinks = (newLinks: string[]) => {
    addDocuments(
      newLinks.map((link) => ({
        type: "link",
        content: link,
        name: link,
      }))
    );
    // Optional: show toast or close dialog? Keeping dialog open for more adds.
  };

  const handleAddText = (newText: string) => {
    addDocuments([
      {
        type: "text",
        content: newText,
        name: "Text Snippet",
        size: newText.length,
      },
    ]);
  };

  const handleUploadSuccess = (file: File) => {
    addDocument({
      type: "file",
      content: file.name,
      name: file.name,
      size: file.size,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AnimateIcon animateOnHover>
          <Button className="w-full">
            <PlusIcon />
            Add documents
          </Button>
        </AnimateIcon>
      </DialogTrigger>
      <DialogContent className="sm:min-w-2xl">
        <DialogHeader>
          <DialogTitle>Add documents</DialogTitle>
          <DialogDescription>
            Deep dive into your documents with AI-powered insights and analysis.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="link">Links</TabsTrigger>
            <TabsTrigger value="text">Paste Text</TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="mt-4">
            <UploadDocuments onUploadSuccess={handleUploadSuccess} />
          </TabsContent>
          <TabsContent value="link" className="mt-4">
            <DocumentInputForm
              inputType="link"
              onAddLinks={handleAddLinks}
              onAddText={() => {}}
            />
          </TabsContent>
          <TabsContent value="text" className="mt-4">
            <DocumentInputForm
              inputType="text"
              onAddLinks={() => {}}
              onAddText={handleAddText}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
