import { Container } from "@/components/container";
import { Plus } from "lucide-react";
import DataTableClient from "./data-table.client";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import { CreateTascDialog } from "@/components/dialogs/create-tasc.dialog";
import { loadQuerySearchParams } from "@/lib/search-params";
import type { SearchParams } from "nuqs";
import { SearchInput } from "@/components/search-input";
import { Suspense } from "react";
import { SiteHeaderClient } from "../site-header.client";

export default async function Tascs({
  params,
  searchParams,
}: {
  params: Promise<{ trackId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { trackId } = await params;
  const { q } = await loadQuerySearchParams(searchParams);

  return (
    <>
      <SiteHeaderClient />
      <Container>
        <div className="flex justify-between">
          <SearchInput placeholder="Search tascs..." />

          <CreateTascDialog trackId={trackId}>
            <Button>
              <Plus /> New
            </Button>
          </CreateTascDialog>
        </div>

        <Suspense fallback={"loading..."}>
          <TascsSuspenseArea q={q} trackId={trackId} />
        </Suspense>
      </Container>
    </>
  );
}

async function TascsSuspenseArea({
  trackId,
  q,
}: {
  trackId: string;
  q: string;
}) {
  prefetch(trpc.tasc.list.queryOptions({ trackId, q }));
  return (
    <HydrateClient>
      <DataTableClient />
    </HydrateClient>
  );
}
