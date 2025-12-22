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
import { BoxIcon, List, Squircle } from "lucide-react";
import Link from "next/link";
import { TascStatusButton } from "@/components/tasc-status.button";

export function SiteHeaderClient() {
  const trpc = useTRPC();
  const { boardId, trackId, orgSlug, tascId } = useParams<{
    boardId: string;
    trackId: string;
    orgSlug: string;
    tascId: string;
  }>();
  const [board, track, tasc] = useSuspenseQueries({
    queries: [
      trpc.board.getById.queryOptions({ boardId }),
      trpc.track.getById.queryOptions({ trackId }),
      trpc.tasc.getById.queryOptions({ tascId }),
    ],
  });

  return (
    <SiteHeader
      startElement={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="flex items-center gap-1.5">
                <Link href={`/${orgSlug}/b/${boardId}`}>
                  <BoxIcon className="size-4" /> {board.data?.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="flex items-center gap-1.5">
                <Link href={`/${orgSlug}/b/${boardId}/t/${trackId}`}>
                  <Squircle className="size-4" /> {track.data?.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="flex items-center gap-1.5">
                <Link href={`/${orgSlug}/b/${boardId}/t/${trackId}/tascs`}>
                  <List className="size-4" /> Tascs
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                <TascStatusButton
                  tascId={tascId}
                  status={tasc.data.status}
                  buttonProps={{
                    disabled: true,
                    className: "disabled:opacity-100 p-0",
                    variant: "ghost",
                    size: "xs",
                  }}
                  showLabel={false}
                />
                {tasc.data.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    />
  );
}
