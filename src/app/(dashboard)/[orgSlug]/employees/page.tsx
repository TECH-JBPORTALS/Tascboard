import { SiteHeader } from "@/components/site-header";
import { Users } from "lucide-react";
import type { SearchParams } from "nuqs/server";
import { DataTableClient } from "./data-table.client";
import { Container } from "@/components/container";
import { InviteEmployeesButton } from "@/components/invite-employees.button";
import { SearchInput } from "@/components/search-input";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { loadQuerySearchParams } from "@/lib/search-params";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Employees(props: PageProps) {
  const { q } = await loadQuerySearchParams(props.searchParams);

  prefetch(trpc.betterAuth.listMembers.queryOptions({ q }));

  return (
    <HydrateClient>
      <SiteHeader
        startElement={
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="size-4" /> Employees
          </div>
        }
      />
      <Container>
        <div className="flex justify-between">
          <SearchInput />

          <InviteEmployeesButton />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <DataTableClient />
        </Suspense>
      </Container>
    </HydrateClient>
  );
}
