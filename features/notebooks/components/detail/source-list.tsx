"use client";

import { truncate } from "lodash";
import {
  EllipsisVertical,
  File,
  FileImage,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";
import { deleteSourceAction } from "../../actions/sources.action";
import { useSources } from "../../hooks/use-sources";

type SourceListProps = {
  isMinimized?: boolean;
  notebookId: number;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
};

export const SourceList = ({
  isMinimized,
  notebookId,
  selectedIds = [],
  onSelectionChange,
}: SourceListProps) => {
  const { sources, isLoading, mutate } = useSources(notebookId);

  const toggleSelection = (id: number, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((sid) => sid !== id));
    }
  };

  const toggleAll = (checked: boolean) => {
    if (!onSelectionChange || !sources) return;
    if (checked) {
      onSelectionChange(sources.map((s) => s.id));
    } else {
      onSelectionChange([]);
    }
  };

  const allSelected =
    sources &&
    sources.length > 0 &&
    sources.every((s) => selectedIds.includes(s.id));

  const { execute: deleteSource, status: deleteStatus } = useAction(
    deleteSourceAction,
    {
      onSuccess: () => {
        toast.success("Source deleted");
        mutate();
      },
      onError: ({ error }) => {
        let errorMessage = "Failed to delete source";
        if (typeof error.serverError === "string") {
          errorMessage = error.serverError;
        }
        toast.error(errorMessage);
      },
    }
  );

  const handleDelete = (sourceId: number) => {
    deleteSource({ notebook_id: notebookId, source_id: sourceId });
  };

  const getIcon = (filename: string) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return FileImage;
    }
    if (["pdf", "docx", "txt", "md"].includes(ext || "")) {
      return FileText;
    }
    return File;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 flex-1 overflow-y-auto min-h-0",
        isMinimized && "gap-2"
      )}
    >
      {!sources || sources.length === 0 ? (
        !isMinimized && (
          <Empty className="border-border bg-background/50">
            <EmptyMedia>
              <FileText className="text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No sources added</EmptyTitle>
            <EmptyDescription>
              Click "Add documents" to start diving into your data.
            </EmptyDescription>
          </Empty>
        )
      ) : (
        <ItemGroup>
          {sources.length > 0 && !isMinimized && (
            <Item>
              <ItemContent>
                <ItemTitle>Total sources: {sources.length}</ItemTitle>
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
          {sources.map((source) => {
            const Icon = getIcon(source.filename);
            const isSelected = selectedIds.includes(source.id);

            const ItemComponent = (
              <Item
                key={source.id}
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
                        {/* Rename not supported by API yet
                        <DropdownMenuItem>Rename</DropdownMenuItem> */}
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(source.id)}
                          disabled={deleteStatus === "executing"}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <ItemContent>
                      <ItemTitle className="line-clamp-1">
                        {truncate(source.title || source.filename, {
                          length: 30,
                        })}
                      </ItemTitle>
                    </ItemContent>

                    <Checkbox
                      className="shrink-0"
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        toggleSelection(source.id, checked === true)
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
                <Tooltip side="right" key={source.id}>
                  <TooltipTrigger asChild>{ItemComponent}</TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="truncate">
                      {source.title || source.filename}
                    </p>
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
