"use client";

import { SiteHeader } from "@/components/site-header";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BoxIcon } from "lucide-react";
import { useParams } from "next/navigation";

export function SiteHeaderClient() {
  const trpc = useTRPC();
  const { boardId } = useParams<{ boardId: string }>();
  const { data: board } = useSuspenseQuery(
    trpc.board.getById.queryOptions({ boardId }),
  );

  return (
    <SiteHeader
      startElement={
        <div className="flex items-center gap-1.5 text-sm">
          <BoxIcon className="size-4" /> {board?.name}
        </div>
      }
    />
  );
}
