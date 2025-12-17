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
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export function BoardActionDropdownMenu({
  children,
  boardId,
}: {
  children: React.ReactNode;
  boardId: string;
}) {
  function DeleteBoardAlertDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const params = useParams<{
      orgSlug: string;
      boardId?: string;
    }>();
    const { mutate: deleteBoard, isPending } = useMutation(
      trpc.board.delete.mutationOptions({
        async onSuccess() {
          await queryClient.invalidateQueries(trpc.board.list.queryFilter());
          if (params.boardId) router.replace(`/${params.orgSlug}`);
          setOpen(false);
        },
        onError(error) {
          toast.error(error.message);
        },
      }),
    );

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete board</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this board. By deleting this board
              it will remove all contents paramentatly and it is irreversable
              process too.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant={"outline"} disabled={isPending}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              variant={"destructive"}
              onClick={() => deleteBoard({ id: boardId })}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete board"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

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
          <DeleteBoardAlertDialog>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              variant="destructive"
            >
              <DeleteIcon /> Delete board
            </DropdownMenuItem>
          </DeleteBoardAlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
