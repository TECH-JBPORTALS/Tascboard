import { Container } from "@/components/container";
import { TascDetailsPage } from "./tasc-details.page.client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SiteHeaderClient } from "./site-header.client";

export default async function Track({
  params,
}: {
  params: Promise<{ faceId: string; trackId: string }>;
}) {
  const { faceId, trackId } = await params;
  prefetch(trpc.tasc.getById.queryOptions({ faceId, trackId }));

  return (
    <HydrateClient>
      <SiteHeaderClient />
      <Container>
        <TascDetailsPage />
      </Container>
    </HydrateClient>
  );
}
