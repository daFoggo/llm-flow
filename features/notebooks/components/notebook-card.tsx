"use client";

import { EllipsisVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { deleteNotebookAction } from "../actions/notebooks.action";
import { useNotebooks } from "../hooks/use-notebooks";
import type { Notebook } from "../types/notebooks";

interface NotebookCardProps {
  notebook: Notebook;
}
export const NotebookCard = ({ notebook }: NotebookCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate } = useNotebooks();

  const { execute: executeDelete, status: deleteStatus } = useAction(
    deleteNotebookAction,
    {
      onSuccess: ({ data }) => {
        if (data?.status === "deleted") {
          toast.success("Notebook deleted successfully");
          mutate();
        }
        setShowDeleteDialog(false);
      },
      onError: ({ error }) => {
        toast.error("Failed to delete notebook");
        console.error(error);
        setShowDeleteDialog(false);
      },
    }
  );

  const handleDelete = () => {
    if (!notebook.id) {
      toast.error("Notebook ID is missing");
      return;
    }
    executeDelete({ notebook_id: notebook.id });
  };

  const isDeleting = deleteStatus === "executing";

  return (
    <>
      <Card className="h-auto hover:border-primary/70 hover:cursor-pointer">
        <CardHeader>
          <CardTitle className="truncate">
            <Link
              href={`/dashboard/notebooks/${notebook.id}`}
              className="hover:underline hover:text-primary transition-colors"
            >
              {notebook.title}
            </Link>
          </CardTitle>
          {notebook.description && (
            <CardDescription className="line-clamp-1">
              {notebook.description}
            </CardDescription>
          )}
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="text-destructive hover:text-destructive/70 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardFooter className="h-full">
          <span className="text-sm text-muted-foreground">
            {notebook.updated_at
              ? new Date(notebook.updated_at).toLocaleString()
              : "Unknown date"}
          </span>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              notebook "{notebook.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting && <Spinner />}
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
