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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export function TrackActionDropdownMenu({
  children,
  trackId,
}: {
  children: React.ReactNode;
  trackId: string;
}) {
  function DeleteTrackAlertDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const params = useParams<{
      orgSlug: string;
      boardId: string;
      trackId?: string;
    }>();
    const { mutate: deleteTrack, isPending } = useMutation(
      trpc.track.delete.mutationOptions({
        async onSuccess() {
          await queryClient.invalidateQueries(trpc.track.list.queryFilter());
          if (params.trackId)
            router.replace(`/${params.orgSlug}/b/${params.boardId}`);
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
            <AlertDialogTitle>Delete Track</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this track. By deleting this track
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
              onClick={() => deleteTrack({ id: trackId })}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete track"}
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
          <DeleteTrackAlertDialog>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              variant="destructive"
            >
              <DeleteIcon /> Delete track
            </DropdownMenuItem>
          </DeleteTrackAlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
