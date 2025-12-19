"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useParams, useSearchParams } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";

export default function DataTableClient() {
  const trpc = useTRPC();
  const { trackId } = useParams<{ trackId: string }>();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const debouncedQuery = useDebounce(q, 600);
  const { data } = useSuspenseQuery(
    trpc.tasc.list.queryOptions({ trackId, q: debouncedQuery }),
  );
  return <DataTable columns={columns} data={data} />;
}
