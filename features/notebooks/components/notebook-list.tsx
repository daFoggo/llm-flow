"use client";

import { Loader2 } from "lucide-react";

import { Copy } from "@/components/animate-ui/icons/copy";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useNotebooks } from "../hooks/use-notebooks";
import { NotebookCard } from "./notebook-card";

export const NotebookList = () => {
  const { notebooks, isLoadingMore, isReachingEnd, loadMore, isValidating } =
    useNotebooks();

  if (notebooks.length === 0) {
    return (
      <Empty>
        <EmptyMedia>
          <Copy className="text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No notebooks created</EmptyTitle>
        <EmptyDescription>
          Create a new notebook to start using LLM Flow.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-4 min-h-0 flex-1">
        {notebooks.map((notebook) => (
          <NotebookCard key={notebook.id} notebook={notebook} />
        ))}

        {/* Load More Button Area */}
        {!isReachingEnd && (
          <div className="col-span-full flex justify-center py-4 mt-2">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={isLoadingMore || isValidating}
              className="w-full md:w-auto min-w-[150px]"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
