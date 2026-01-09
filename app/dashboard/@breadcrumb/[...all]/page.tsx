import { truncate } from "lodash";
import Link from "next/link";
import type { ReactElement } from "react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  getBreadcrumbLabel,
  getDynamicBreadcrumbLabel,
} from "@/lib/breadcrumb-mapping";

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ all: string[] }>;
}) {
  const { all } = await params;
  const breadcrumbItems: ReactElement[] = [];
  let breadcrumbPage: ReactElement = <></>;

  const rootHref = "/dashboard";

  for (let i = 0; i < all.length; i++) {
    const route = all[i];
    let label = getBreadcrumbLabel(route);
    const href = `${rootHref}/${all.slice(0, i + 1).join("/")}`;

    // Handle dynamic breadcrumbs using the resolver registry
    // We check if the *previous* segment identifies a resource type (e.g. "notebooks" -> "123")
    if (i > 0) {
      const parentSegment = all[i - 1];
      const dynamicLabel = await getDynamicBreadcrumbLabel(
        parentSegment,
        route
      );
      if (dynamicLabel) {
        label = dynamicLabel;
      }
    }

    if (i === all.length - 1) {
      breadcrumbPage = (
        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold">
            {truncate(label, { length: 50 })}
          </BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <React.Fragment key={href}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={href}>{label}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </React.Fragment>
      );
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbItems}
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
