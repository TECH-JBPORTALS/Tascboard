"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useParams } from "next/navigation";

export default function DataTableClient() {
  const trpc = useTRPC();
  const { trackId } = useParams<{ trackId: string }>();
  const { data } = useSuspenseQuery(trpc.tasc.list.queryOptions({ trackId }));
  return <DataTable columns={columns} data={data} />;
}
