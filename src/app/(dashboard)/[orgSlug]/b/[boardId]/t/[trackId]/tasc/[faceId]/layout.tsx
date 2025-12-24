import { Container } from "@/components/container";
import { SiteHeaderClient } from "./site-header.client";
import { HydrateClient, trpc, prefetch } from "@/trpc/server";

export default async function Layout({
  children,
  activity,
  params,
}: {
  children: React.ReactNode;
  activity: React.ReactNode;
  params: Promise<{ faceId: string; trackId: string }>;
}) {
  const { faceId, trackId } = await params;
  prefetch(trpc.tasc.getById.queryOptions({ faceId, trackId }));

  return (
    <HydrateClient>
      <SiteHeaderClient />
      <Container className="flex-row px-4 py-0 lg:gap-2 lg:px-6">
        {children}
        {activity}
      </Container>
    </HydrateClient>
  );
}
