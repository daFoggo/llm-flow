"use client";

import { Flower } from "lucide-react";
import type { ReactNode } from "react";
import { ChartSpline } from "@/components/animate-ui/icons/chart-spline";
import { Copy } from "@/components/animate-ui/icons/copy";
import { List } from "@/components/animate-ui/icons/list";
import { MessageSquareHeart } from "@/components/animate-ui/icons/message-square-heart";
import {
  SidebarLayout,
  SidebarSiteHeader,
  SidebarUserMenu,
} from "@/components/layouts/sidebar-layout";
import { SITE_CONFIG } from "@/configs/site";
import type { SidebarNavItem } from "@/lib/types/sidebar";
import { DashboardHeader } from "./components/dashboard-header";

const NAVIGATION: SidebarNavItem[] = [
  {
    title: "Overview",
    url: "/dashboard/overview",
    icon: ChartSpline,
  },
  {
    title: "Notebooks",
    url: "/dashboard/notebooks",
    icon: Copy,
  },
  {
    title: "Logs",
    url: "/dashboard/logs",
    icon: List,
  },
  {
    title: "Feedbacks",
    url: "/dashboard/feedbacks",
    icon: MessageSquareHeart,
  },
];

const DashboardLayout = ({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb: ReactNode;
}) => {
  return (
    <SidebarLayout
      navigation={NAVIGATION}
      header={
        <SidebarSiteHeader
          logo={<Flower className="size-4" />}
          title={SITE_CONFIG.name}
        />
      }
      footer={<SidebarUserMenu />}
    >
      <DashboardHeader breadcrumbs={breadcrumb} />
      <div className="rounded-xl w-full flex-1 overflow-hidden">{children}</div>
    </SidebarLayout>
  );
};

export default DashboardLayout;
