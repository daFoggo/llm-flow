import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";

export type IconType =
  | LucideIcon
  | ComponentType<SVGProps<SVGSVGElement>>
  | ComponentType<{ className?: string }>;

export type SidebarNavItem = {
  title: string;
  url: string;
  icon?: IconType;
  isActive?: boolean;
  items?: SidebarNavSubItem[];
};

export type SidebarNavSubItem = {
  title: string;
  url: string;
};

export type SidebarLayoutProps = {
  children: ReactNode;
  variant?: "inset" | "sidebar" | "floating";
  header?: ReactNode;
  footer?: ReactNode;
  navigation: SidebarNavItem[];
};
