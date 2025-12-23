import { Container } from "@/components/container";
import { Loader2, Plus } from "lucide-react";
import { DataTableClient, FiltersRow } from "./data-table.client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import { CreateTascDialog } from "@/components/dialogs/create-tasc.dialog";
import {
  loadQuerySearchParams,
  loadTascFilterSearchParams,
} from "@/lib/search-params";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { SiteHeaderClient } from "../site-header.client";
import type { TascPriority, TascStatus } from "@/server/db/schema";

export default async function Tascs({
  params,
  searchParams,
}: {
  params: Promise<{ trackId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { trackId } = await params;
  const { q } = await loadQuerySearchParams(searchParams);
  const { assignee, priority, status } =
    await loadTascFilterSearchParams(searchParams);

  return (
    <>
      <SiteHeaderClient />
      <Container>
        <div className="flex justify-between">
          <FiltersRow />

          <CreateTascDialog trackId={trackId}>
            <Button>
              <Plus /> New
            </Button>
          </CreateTascDialog>
        </div>

        <Suspense
          fallback={
            <div className="flex min-h-[calc(100svh-50%)] items-center justify-center">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
            </div>
          }
        >
          <TascsSuspenseArea
            {...{ status, priority, assignee }}
            q={q}
            trackId={trackId}
          />
        </Suspense>
      </Container>
    </>
  );
}

async function TascsSuspenseArea({
  trackId,
  q,
  status,
  priority,
  assignee,
}: {
  trackId: string;
  q: string;
  status: TascStatus | null;
  priority: TascPriority | null;
  assignee: string | null;
}) {
  prefetch(
    trpc.tasc.list.queryOptions({ trackId, q, status, priority, assignee }),
  );
  return (
    <HydrateClient>
      <DataTableClient />
    </HydrateClient>
  );
}
