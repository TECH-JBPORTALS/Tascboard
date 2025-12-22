import { Container } from "@/components/container";
import { TascDetailsPage } from "./tasc-details.page.client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SiteHeaderClient } from "./site-header.client";

export default async function Track({
  params,
}: {
  params: Promise<{ tascId: string }>;
}) {
  const { tascId } = await params;
  prefetch(trpc.tasc.getById.queryOptions({ tascId }));

  return (
    <HydrateClient>
      <SiteHeaderClient />
      <Container>
        <TascDetailsPage />
      </Container>
    </HydrateClient>
  );
}
