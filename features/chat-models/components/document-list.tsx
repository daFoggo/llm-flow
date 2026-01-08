"use client";

import { truncate } from "lodash";
import { EllipsisVertical, FileText } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FieldLabel } from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useDocuments } from "@/features/chat-models/hooks/use-documents";
import { cn } from "@/lib/utils";
import { getIconForType } from "../utils/document";

type DocumentListProps = {
  isMinimized?: boolean;
};

export const DocumentList = ({ isMinimized }: DocumentListProps) => {
  const { documents, toggleSelection, toggleAll } = useDocuments();

  const allSelected =
    documents.length > 0 && documents.every((d) => d.isSelected);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 flex-1 overflow-y-auto min-h-0",
        isMinimized && "gap-2"
      )}
    >
      {documents.length === 0 ? (
        !isMinimized && (
          <Empty className="border-border bg-background/50">
            <EmptyMedia>
              <FileText className="text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No documents added</EmptyTitle>
            <EmptyDescription>
              Click "Add documents" to start diving into your data.
            </EmptyDescription>
          </Empty>
        )
      ) : (
        <ItemGroup>
          {documents.length > 0 && !isMinimized && (
            <Item>
              <ItemContent className="flex-">
                <ItemTitle>Total documents: {documents.length}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <div className="flex items-center gap-2">
                  <FieldLabel htmlFor="select-all" className="cursor-pointer">
                    Select All
                  </FieldLabel>
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleAll(checked === true)}
                  />
                </div>
              </ItemActions>
            </Item>
          )}
          {documents.map((doc) => {
            const Icon = getIconForType(doc.type);

            const ItemComponent = (
              <Item
                key={doc.id}
                className={cn(
                  "group/item transition-all",
                  isMinimized && "border-0 p-0 shadow-none hover:bg-transparent"
                )}
              >
                {!isMinimized ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ItemMedia className="cursor-pointer">
                          <Icon className="group-hover/item:hidden" />
                          <EllipsisVertical className="hidden group-hover/item:block" />
                        </ItemMedia>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>Change name</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <ItemContent>
                      <ItemTitle className="line-clamp-1">
                        {truncate(doc.name || doc.content)}
                      </ItemTitle>
                    </ItemContent>

                    <Checkbox
                      className="shrink-0"
                      checked={doc.isSelected}
                      onCheckedChange={(checked) =>
                        toggleSelection(doc.id, checked === true)
                      }
                    />
                  </>
                ) : (
                  <div className="flex justify-center w-full">
                    <div className="relative flex items-center justify-center p-2 rounded-md hover:bg-accent/50 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                      <Icon className="size-5" />
                    </div>
                  </div>
                )}
              </Item>
            );

            if (isMinimized) {
              return (
                <Tooltip side="right" key={doc.id}>
                  <TooltipTrigger asChild>{ItemComponent}</TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="truncate">{doc.name || doc.content}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return ItemComponent;
          })}
        </ItemGroup>
      )}
    </div>
  );
};
