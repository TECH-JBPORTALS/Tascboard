import { getQueryClient, HydrateClient, prefetch, trpc } from "@/trpc/server";
import ActivitiesListClient from "./activities-list.client";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page({
  params,
}: {
  params: Promise<{ faceId: string; trackId: string }>;
}) {
  const { faceId, trackId } = await params;
  const queryClient = getQueryClient();
  const tasc = await queryClient.fetchQuery(
    trpc.tasc.getById.queryOptions({ faceId, trackId }),
  );

  if (!tasc.id) throw new Error("No tascId found");

  prefetch(trpc.tascActivity.list.queryOptions({ tascId: tasc.id }));

  return (
    <HydrateClient>
      <section className="container w-full max-w-lg flex-2 border-l px-8 py-6">
        <ScrollArea>
          <h4 className="mb-4 scroll-m-20 text-xl font-semibold tracking-tight">
            Activity
          </h4>
          <ActivitiesListClient />
        </ScrollArea>
      </section>
    </HydrateClient>
  );
}
