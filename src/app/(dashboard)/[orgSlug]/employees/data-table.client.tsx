"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useDebounce } from "@uidotdev/usehooks";

export function DataTableClient() {
  const trpc = useTRPC();
  const [q] = useQueryState("q");
  const debouncedQuery = useDebounce(q, 300);

  const { data: employees } = useSuspenseQuery(
    trpc.betterAuth.listMembers.queryOptions({ q: debouncedQuery }),
  );

  return <DataTable columns={columns} data={employees ?? []} />;
}
