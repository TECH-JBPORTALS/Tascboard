import React from "react";
import { SiteHeaderClient } from "./site-header.client";
import { prefetch, trpc } from "@/trpc/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = await params;
  prefetch(trpc.track.getById.queryOptions({ trackId }));

  return (
    <>
      <SiteHeaderClient />
      {children}
    </>
  );
}
