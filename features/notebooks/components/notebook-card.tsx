import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Notebook } from "../types/notebooks";

interface NotebookCardProps {
  notebook: Notebook;
}
export const NotebookCard = ({ notebook }: NotebookCardProps) => {
  return (
    <Card className="h-fit hover:border-primary/70 hover:cursor-pointer">
      <CardHeader>
        <CardTitle>{notebook.title}</CardTitle>
        {notebook.description && (
          <CardDescription>{notebook.description}</CardDescription>
        )}
        <CardAction>
          <Badge variant="outline">... documents</Badge>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <span className="text-sm text-muted-foreground">
          {notebook.updated_at
            ? new Date(notebook.updated_at).toLocaleString()
            : "Unknown date"}
        </span>
      </CardFooter>
    </Card>
  );
};
