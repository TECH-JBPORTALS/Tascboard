"use client";

import { Button } from "@/components/ui/button";
import type { RouterOutputs } from "@/trpc/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export type Tasc = RouterOutputs["tasc"]["list"][number];

function TascItem({ row }: { row: Tasc }) {
  const { boardId, orgSlug, trackId } = useParams<{
    boardId: string;
    trackId: string;
    orgSlug: string;
  }>();

  return (
    <Link
      href={`/${orgSlug}/b/${boardId}/t/${trackId}/tascs/${row.id}`}
      className="flex w-full flex-1 items-center gap-2"
    >
      <span className="text-muted-foreground text-xs">{row.faceId}</span>
      <p className="font-medium">{row.name}</p>
    </Link>
  );
}

export const columns: ColumnDef<Tasc>[] = [
  {
    id: "tasc",
    header: "Tasc",
    cell(props) {
      const row = props.row.original;

      return <TascItem row={row} />;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="px-4 text-right">Status</div>,
    cell(props) {
      const row = props.row.original;

      return (
        <div className="text-right">
          <Button variant={"ghost"}>{row.status}</Button>
        </div>
      );
    },
  },
  {
    id: "more-action",
    cell(_props) {
      return (
        <Button variant={"ghost"} size={"icon-sm"}>
          <MoreHorizontalIcon />
        </Button>
      );
    },
  },
];
