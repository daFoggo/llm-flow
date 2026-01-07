"use client";

import { File, FileText, Link2, type LucideIcon, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  type DocumentItem,
  useDocuments,
} from "@/features/chat-models/hooks/use-documents";

const getIconForType = (type: DocumentItem["type"]): LucideIcon => {
  switch (type) {
    case "link":
      return Link2;
    case "text":
      return FileText;
    case "file":
      return File;
    default:
      return File;
  }
};

const formatSize = (bytes?: number) => {
  if (bytes === undefined) return "";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export const DocumentList = () => {
  const { documents, removeDocument, toggleSelection, toggleAll } =
    useDocuments();

  const allSelected =
    documents.length > 0 && documents.every((d) => d.isSelected);
  const isIndeterminate = documents.some((d) => d.isSelected) && !allSelected;

  return (
    <FieldSet>
      <Field>
        <div className="flex justify-between items-center">
          <FieldLabel>Documents</FieldLabel>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Checkbox
              id="select-all"
              checked={
                allSelected || (isIndeterminate ? "indeterminate" : false)
              }
              onCheckedChange={(checked) => toggleAll(checked === true)}
            />
            <FieldLabel htmlFor="select-all" className="cursor-pointer">
              Select All
            </FieldLabel>
          </div>
        </div>
        <FieldContent>
          <AnimatePresence mode="popLayout" initial={false}>
            {documents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Empty className="border-border bg-background/50">
                  <EmptyMedia>
                    <FileText className="text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No documents added</EmptyTitle>
                  <EmptyDescription>
                    Add documents to start chatting with your data.
                  </EmptyDescription>
                </Empty>
              </motion.div>
            ) : (
              <ItemGroup>
                {documents.map((doc) => {
                  const Icon = getIconForType(doc.type);
                  return (
                    <motion.div
                      key={doc.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Item>
                        <Checkbox
                          className="mr-2"
                          checked={doc.isSelected}
                          onCheckedChange={(checked) =>
                            toggleSelection(doc.id, checked === true)
                          }
                        />
                        <ItemMedia>
                          <Icon />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{doc.name || doc.content}</ItemTitle>
                          <ItemDescription>
                            {doc.type === "link" ? (
                              doc.content
                            ) : (
                              <>
                                {doc.type.toUpperCase()} •{" "}
                                {formatSize(doc.size)}
                              </>
                            )}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <AnimateIcon animateOnHover>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeDocument(doc.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AnimateIcon>
                        </ItemActions>
                      </Item>
                    </motion.div>
                  );
                })}
              </ItemGroup>
            )}
          </AnimatePresence>
        </FieldContent>
      </Field>
    </FieldSet>
  );
};
