"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

export interface Tasc {
  id: string;
  title: string;
  faceId: string;
  status: "in-progress" | "not-started" | "completed";
  createdBy: string;
}

export const columns: ColumnDef<Tasc>[] = [
  {
    id: "tasc",
    header: "Tasc",
    cell(props) {
      const row = props.row.original;

      return (
        <div className="flex w-full flex-1 items-center gap-2">
          <span className="text-muted-foreground text-xs">{row.faceId}</span>
          <p className="font-medium">{row.title}</p>
        </div>
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
    accessorKey: "createdBy",
    header: () => <div className="text-right">Created by</div>,
    cell(props) {
      const row = props.row.original;

      return (
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Avatar>
              <AvatarFallback>{row.createdBy.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>{row.createdBy}</div>
          </div>
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
