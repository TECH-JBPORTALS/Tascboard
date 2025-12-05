import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { BoardDetailsPage } from "./board-details.page.client";
import { SiteHeaderClient } from "./site-header.client";

export default async function Board({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  prefetch(trpc.board.getById.queryOptions({ boardId }));
  prefetch(trpc.member.list.queryOptions());

  return (
    <HydrateClient>
      <SiteHeaderClient />
      <BoardDetailsPage />
    </HydrateClient>
  );
}
