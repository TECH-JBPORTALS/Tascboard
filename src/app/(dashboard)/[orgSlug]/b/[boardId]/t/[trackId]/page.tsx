import { auth } from "@/utils/auth";
import { TrackDetailsPage } from "./track-details.page.client";
import { headers } from "next/headers";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Container } from "@/components/container";
import { SiteHeaderClient } from "./site-header.client";

export default async function Track({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const hasAccessToEdit = await auth.api.hasPermission({
    body: { permission: { track: ["update"] } },
    headers: await headers(),
  });
  const { trackId } = await params;
  prefetch(trpc.track.getById.queryOptions({ trackId }));
  return (
    <HydrateClient>
      <SiteHeaderClient />
      <Container>
        <TrackDetailsPage hasAccessToEdit={hasAccessToEdit.success} />
      </Container>
    </HydrateClient>
  );
}
