"use client";
import { type LucideIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IResponsiveBlock {
  title: string;
  icon?: LucideIcon;
  description?: string;
  cardContent: ReactNode;
  isMinimized?: boolean;
  onToggle?: () => void;
}

export const ResponsiveBlock = ({
  title,
  icon: Icon,
  description,
  cardContent,
  isMinimized: controlledIsMinimized,
  onToggle,
}: IResponsiveBlock) => {
  const [internalIsMinimized, setInternalIsMinimized] = useState(false);

  const isControlled = controlledIsMinimized !== undefined;
  const isMinimized = isControlled
    ? controlledIsMinimized
    : internalIsMinimized;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsMinimized((prev) => !prev);
    }
  };

  return (
    <Card
      className={cn(
        "h-full transition-all duration-300 ease-in-out",
        isMinimized ? "w-fit min-w-16" : "w-full"
      )}
    >
      <CardHeader className={cn("border-b")}>
        <div className="flex items-center justify-between gap-2">
          {!isMinimized && (
            <div className="flex flex-col gap-1.5">
              <CardTitle className="flex items-center gap-2">
                {Icon && <Icon className="size-4" />}
                <span>{title}</span>
              </CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggle}
            className={cn("shrink-0", isMinimized && "mx-auto")}
          >
            {isMinimized ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        </div>
      </CardHeader>
      {cardContent}
    </Card>
  );
};
