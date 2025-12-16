"use client";

import { Button } from "@/components/ui/button";
import type { RouterOutputs } from "@/trpc/react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

export type Tasc = RouterOutputs["tasc"]["list"][number];

export const columns: ColumnDef<Tasc>[] = [
  {
    id: "tasc",
    header: "Tasc",
    cell(props) {
      const row = props.row.original;

      return (
        <Link
          href={`/b/1/t/1/tascs/${row.id}`}
          className="flex w-full flex-1 items-center gap-2"
        >
          <span className="text-muted-foreground text-xs">{row.faceId}</span>
          <p className="font-medium">{row.name}</p>
        </Link>
      );
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
