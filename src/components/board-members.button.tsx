"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC, type RouterOutputs } from "@/trpc/react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

export function BoardMembersButton({
  membersUserIds = [],
  hasAccessToEdit,
  boardMembers = [],
  ...props
}: React.ComponentProps<typeof Popover> & {
  membersUserIds: string[];
  hasAccessToEdit: boolean;
  boardMembers: RouterOutputs["board"]["getById"]["boardMembers"];
}) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.member.list.queryOptions());

  const membersOfBoard = data?.filter((mem) =>
    membersUserIds.includes(mem.userId),
  );

  const remainingMembers = data?.filter(
    (mem) => !membersUserIds.includes(mem.userId),
  );

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          disabled={!hasAccessToEdit}
          variant={"ghost"}
          className="data-[state=open]:bg-accent disabled:opacity-100"
          size={"xs"}
        >
          <span className="inline-flex -space-x-2">
            {boardMembers?.map((mem) => (
              <Avatar
                key={mem.id}
                className="border-background size-6 border-2"
              >
                <AvatarImage src={mem.user.image ?? "No image"} />
                <AvatarFallback>{mem.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </span>
          {boardMembers?.length > 0
            ? `${boardMembers.length} members`
            : "Assign members"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-52 p-0">
        <Command>
          <CommandInput placeholder="Assign to..." />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            {membersOfBoard.length > 0 && (
              <>
                <CommandGroup heading={"Members of board"}>
                  {membersOfBoard?.map((mem) => (
                    <MemberItem key={mem.id} mem={mem} />
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {remainingMembers?.length !== 0 && (
              <CommandGroup heading="Members of organization">
                {remainingMembers?.map((mem) => (
                  <RemainingMemberItem mem={mem} key={mem.id} />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function MemberItem({ mem }: { mem: RouterOutputs["member"]["list"][number] }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { boardId } = useParams<{ boardId: string }>();
  const { mutate: removeMember, isPending } = useMutation(
    trpc.boardMember.remove.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries(trpc.board.pathFilter()),
          queryClient.invalidateQueries(trpc.track.pathFilter()),
          queryClient.invalidateQueries(trpc.tasc.pathFilter()),
          queryClient.invalidateQueries(trpc.boardMember.list.pathFilter()),
        ]);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  return (
    <CommandItem
      onSelect={() => {
        removeMember({ userId: mem.userId, boardId });
      }}
      disabled={isPending}
    >
      <Avatar className="size-6">
        <AvatarImage src={mem.user.image ?? "No image"} />
        <AvatarFallback>{mem.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span>{mem.user.name}</span>
      {isPending && <Loader2Icon className="ml-auto size-4 animate-spin" />}
    </CommandItem>
  );
}

function RemainingMemberItem({
  mem,
}: {
  mem: RouterOutputs["member"]["list"][number];
}) {
  const trpc = useTRPC();
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();
  const { mutate: addMember, isPending } = useMutation(
    trpc.boardMember.add.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries(trpc.board.pathFilter()),
          queryClient.invalidateQueries(trpc.track.pathFilter()),
          queryClient.invalidateQueries(trpc.tasc.pathFilter()),
          queryClient.invalidateQueries(trpc.boardMember.list.pathFilter()),
        ]);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  return (
    <CommandItem
      onSelect={() => {
        addMember({ userId: mem.userId, boardId });
      }}
      disabled={isPending}
    >
      <Avatar className="size-6">
        <AvatarImage src={mem.user.image ?? "No image"} />
        <AvatarFallback>{mem.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span>{mem.user.name}</span>
      {isPending && <Loader2Icon className="ml-auto size-4 animate-spin" />}
    </CommandItem>
  );
}
