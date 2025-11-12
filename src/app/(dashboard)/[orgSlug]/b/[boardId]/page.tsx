import { SiteHeader } from "@/components/site-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { BoxIcon } from "lucide-react";
import { BoardDetailsPage } from "./board-details.page.client";

export default async function Board({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  prefetch(trpc.board.getById.queryOptions({ boardId }));

  return (
    <HydrateClient>
      <SiteHeader
        startElement={
          <div className="flex items-center gap-1.5 text-sm">
            <BoxIcon className="size-4" /> Board Title
          </div>
        }
      />
      <BoardDetailsPage />
    </HydrateClient>
  );
}
