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

export function TrackMembersButton({
  membersUserIds = [],
  hasAccessToEdit,
  trackMembers = [],
  ...props
}: React.ComponentProps<typeof Popover> & {
  membersUserIds: string[];
  hasAccessToEdit: boolean;
  trackMembers: RouterOutputs["track"]["getById"]["trackMembers"];
}) {
  const trpc = useTRPC();
  const { boardId } = useParams<{ boardId: string }>();
  const { data } = useSuspenseQuery(
    trpc.boardMember.list.queryOptions({ boardId }),
  );

  const membersOfTrack = data?.filter((mem) =>
    membersUserIds.includes(mem.userId),
  );

  const remainingMembers = data?.filter(
    (mem) => !membersUserIds.includes(mem.userId),
  );

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className="data-[state=open]:bg-accent disabled:opacity-100"
          size={"xs"}
          disabled={!hasAccessToEdit}
        >
          <span className="inline-flex -space-x-2">
            {trackMembers?.map((mem) => (
              <Avatar
                key={mem.id}
                className="border-background size-6 border-2"
              >
                <AvatarImage src={mem.user.image ?? "No image"} />
                <AvatarFallback>{mem.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </span>
          {trackMembers?.length > 0
            ? `${trackMembers.length} members`
            : "Assign members"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-52 p-0">
        <Command>
          <CommandInput placeholder="Assign to..." />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            {membersOfTrack.length > 0 && (
              <>
                <CommandGroup heading={"Members of track"}>
                  {membersOfTrack?.map((mem) => (
                    <MemberItem key={mem.id} mem={mem} />
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {remainingMembers?.length !== 0 && (
              <CommandGroup heading="Members of board">
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

function MemberItem({
  mem,
}: {
  mem: RouterOutputs["boardMember"]["list"][number];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { trackId } = useParams<{ trackId: string }>();
  const { mutate: removeMember, isPending } = useMutation(
    trpc.trackMember.remove.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries(trpc.track.pathFilter()),
          queryClient.invalidateQueries(trpc.tasc.pathFilter()),
          queryClient.invalidateQueries(trpc.trackMember.list.pathFilter()),
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
        removeMember({ userId: mem.userId, trackId });
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
  mem: RouterOutputs["boardMember"]["list"][number];
}) {
  const trpc = useTRPC();
  const { trackId } = useParams<{ trackId: string }>();
  const queryClient = useQueryClient();
  const { mutate: addMember, isPending } = useMutation(
    trpc.trackMember.add.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries(trpc.track.pathFilter()),
          queryClient.invalidateQueries(trpc.tasc.pathFilter()),
          queryClient.invalidateQueries(trpc.trackMember.list.pathFilter()),
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
        addMember({ userId: mem.userId, trackId });
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
