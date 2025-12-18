"use client";

import { DeleteTascAlertDialog } from "@/components/delete-tasc.alert-dialog";
import { TascStatusButton } from "@/components/tasc-status.button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type RouterOutputs } from "@/trpc/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DeleteIcon, MoreHorizontalIcon } from "lucide-react";
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
      <span className="text-muted-foreground">{row.faceId}</span>
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
        <div className="min-w-sm text-right">
          <TascStatusButton
            tascId={row.id}
            status={row.status}
            buttonProps={{ size: "xs", variant: "ghost" }}
          />
        </div>
      );
    },
  },
  {
    id: "more-action",
    cell(props) {
      const row = props.row.original;
      return (
        <div className="text-right">
          <TascMoreActionDropdown tascId={row.id}>
            <Button variant={"ghost"} size={"icon-sm"}>
              <MoreHorizontalIcon />
            </Button>
          </TascMoreActionDropdown>
        </div>
      );
    },
  },
];

function TascMoreActionDropdown({
  children,
  tascId,
}: {
  children: React.ReactNode;
  tascId: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DeleteTascAlertDialog tascId={tascId}>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              variant="destructive"
            >
              <DeleteIcon /> Delete tasc
            </DropdownMenuItem>
          </DeleteTascAlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
