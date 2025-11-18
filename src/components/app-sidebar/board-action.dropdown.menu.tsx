"use client";

import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CreateTrackDialog } from "../dialogs/create-track.dialog";

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
        <DropdownMenuGroup>
          <CreateTrackDialog boardId={boardId}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Create track...
            </DropdownMenuItem>
          </CreateTrackDialog>
          <DropdownMenuItem variant="destructive">
            Delete board
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
