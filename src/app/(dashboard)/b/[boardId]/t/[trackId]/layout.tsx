import { SiteHeader } from "@/components/site-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BoxIcon, Squircle } from "lucide-react";
import React from "react";
import { TrackTabs } from "./track-tabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader
        startElement={
          <div className="flex items-center gap-3.5">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="flex items-center gap-1.5">
                    <BoxIcon className="size-4" /> Board Title
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    <Squircle className="size-4" /> Track Title
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <TrackTabs />
          </div>
        }
      />
      {children}
    </>
  );
}
