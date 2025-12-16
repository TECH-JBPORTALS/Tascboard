"use client";

import { SiteHeader } from "@/components/site-header";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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

export function SiteHeaderClient() {
  const trpc = useTRPC();
  const { boardId, trackId } = useParams<{
    boardId: string;
    trackId: string;
  }>();
  const [board, track] = useSuspenseQueries({
    queries: [
      trpc.board.getById.queryOptions({ boardId }),
      trpc.track.getById.queryOptions({ trackId }),
    ],
  });

  return (
    <SiteHeader
      startElement={
        <div className="flex items-center gap-3.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="flex items-center gap-1.5">
                  <BoxIcon className="size-4" /> {board.data?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <Squircle className="size-4" /> {track.data?.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <TrackTabs />
        </div>
      }
    />
  );
}
