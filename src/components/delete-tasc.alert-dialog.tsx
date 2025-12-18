import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
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
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export function DeleteTascAlertDialog({
  children,
  tascId,
}: {
  children: React.ReactNode;
  tascId: string;
}) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams<{
    orgSlug: string;
    boardId: string;
    trackId: string;
    tascId?: string;
  }>();
  const { mutate: deleteTasc, isPending } = useMutation(
    trpc.tasc.delete.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.tasc.list.queryFilter());
        if (params.tascId)
          router.replace(
            `/${params.orgSlug}/b/${params.boardId}/t/${params.trackId}`,
          );
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
          <AlertDialogTitle>Delete tasc</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this tasc. By deleting this tasc it
            will remove all contents paramentatly and it is irreversable process
            too.
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
            onClick={() => deleteTasc({ id: tascId })}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete tasc"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
