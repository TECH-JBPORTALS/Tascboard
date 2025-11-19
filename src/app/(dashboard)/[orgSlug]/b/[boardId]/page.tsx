import { SiteHeader } from "@/components/site-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { BoxIcon } from "lucide-react";
import { BoardDetailsPage } from "./board-details.page.client";
import { SiteHeaderClient } from "./site-header.client";

export default async function Board({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  prefetch(trpc.board.getById.queryOptions({ boardId }));

  return (
    <HydrateClient>
      <SiteHeaderClient />
      <BoardDetailsPage />
    </HydrateClient>
  );
}
