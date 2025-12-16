"use client";

import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CreateTrackDialog } from "../dialogs/create-track.dialog";
import { DeleteIcon, PlusIcon } from "lucide-react";

export function BoardActionDropdownMenu({
  children,
  boardId,
}: {
  children: React.ReactNode;
  boardId: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <CreateTrackDialog boardId={boardId}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <PlusIcon /> Create track...
            </DropdownMenuItem>
          </CreateTrackDialog>
          <DropdownMenuItem variant="destructive">
            <DeleteIcon /> Delete board
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
