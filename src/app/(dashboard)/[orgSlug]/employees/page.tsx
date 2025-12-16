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
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Employees(props: PageProps) {
  const canAccessEmployees = await auth.api.hasPermission({
    body: { permission: { member: ["create"] } },
    headers: await headers(),
  });

  if (!canAccessEmployees.success) notFound();

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
