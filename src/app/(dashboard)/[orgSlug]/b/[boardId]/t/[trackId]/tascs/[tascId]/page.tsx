import { Container } from "@/components/container";
import { TascDetailsPage } from "./tasc-details.page.client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Track({
  params,
}: {
  params: Promise<{ tascId: string }>;
}) {
  const { tascId } = await params;
  prefetch(trpc.tasc.getById.queryOptions({ tascId }));

  return (
    <HydrateClient>
      <Container>
        <TascDetailsPage />
      </Container>
    </HydrateClient>
  );
}
