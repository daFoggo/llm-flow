"use client";

import { type LucideIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IResponsiveBlock {
  title: string;
  icon?: LucideIcon;
  description?: string;
  cardContent: ReactNode;
}
export const ResponsiveBlock = ({
  title,
  icon: Icon,
  description,
  cardContent,
}: IResponsiveBlock) => {
  const [isMaximize, setIsMaximize] = useState(false);

  const handleToggleMaximize = () => {
    setIsMaximize((prev) => !prev);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="size-4" />}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button size="icon" variant="outline" onClick={handleToggleMaximize}>
            {isMaximize ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        </CardAction>
      </CardHeader>
      {cardContent}
    </Card>
  );
};
