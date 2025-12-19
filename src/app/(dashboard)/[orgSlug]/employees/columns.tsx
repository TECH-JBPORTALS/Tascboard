"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useTRPC, type RouterOutputs } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Delete, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type Employee = RouterOutputs["betterAuth"]["listMembers"][number];

export const columns: ColumnDef<Employee>[] = [
  {
    id: "employee",
    header: "Employee",
    cell(props) {
      const row = props.row.original;

      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={row.user.image ?? "No image"}
              alt={row.user.name}
            />
            <AvatarFallback>{row.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <span className="text-sm font-medium">{row.user.name}</span>
            <p className="text-muted-foreground text-sm">{row.user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "more-action",
    cell(props) {
      const row = props.row.original;

      if (row.role === "owner") return null;

      return (
        <div className="text-right">
          <EmployeeActionDropdownMenu memberId={row.id} userId={row.userId}>
            <Button variant={"ghost"} size={"icon-sm"}>
              <MoreHorizontalIcon />
            </Button>
          </EmployeeActionDropdownMenu>
        </div>
      );
    },
  },
];

export function EmployeeActionDropdownMenu({
  children,
  memberId,
  userId,
}: {
  children: React.ReactNode;
  memberId: string;
  userId: string;
}) {
  function DeleteTrackAlertDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const { mutate: deleteMember, isPending } = useMutation(
      trpc.member.remove.mutationOptions({
        async onSuccess() {
          await queryClient.invalidateQueries(trpc.track.list.queryFilter());

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
            <AlertDialogTitle>Remove employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this employee. By removing this
              employee he/she will not be able to access the organization.
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
              onClick={() => deleteMember({ memberId, userId })}
              disabled={isPending}
            >
              {isPending ? "Removing..." : "Remove employee"}
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
              <Delete /> Remove employee...
            </DropdownMenuItem>
          </DeleteTrackAlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
