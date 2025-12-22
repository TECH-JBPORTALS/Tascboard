import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { BoardDetailsPage } from "./board-details.page.client";
import { SiteHeaderClient } from "./site-header.client";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export default async function Board({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  prefetch(trpc.board.getById.queryOptions({ boardId }));
  prefetch(trpc.member.list.queryOptions());

  const hasAccessToEdit = await auth.api.hasPermission({
    body: { permission: { board: ["update"] } },
    headers: await headers(),
  });

  return (
    <HydrateClient>
      <SiteHeaderClient />
      <BoardDetailsPage hasAccessToEdit={hasAccessToEdit.success} />
    </HydrateClient>
  );
}
