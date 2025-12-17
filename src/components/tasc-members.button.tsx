"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
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

export function TascMembersButton({
  membersUserIds = [],
  ...props
}: React.ComponentProps<typeof Popover> & {
  membersUserIds: string[];
}) {
  const trpc = useTRPC();
  const { trackId } = useParams<{ trackId: string }>();
  const { data } = useSuspenseQuery(
    trpc.trackMember.list.queryOptions({ trackId }),
  );

  const membersOfTasc = data?.filter((mem) =>
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
          className="data-[state=open]:bg-accent"
          size={"xs"}
        >
          <span className="inline-flex -space-x-2">
            {membersOfTasc?.map((mem) => (
              <Avatar key={mem.id} className="size-6">
                <AvatarImage src={mem.user.image ?? "No image"} />
                <AvatarFallback>{mem.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </span>
          {membersOfTasc?.length > 0
            ? `${membersOfTasc.length} members`
            : "Assign members"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-52 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            {membersOfTasc.length > 0 && (
              <>
                <CommandGroup heading={"Members of board"}>
                  {membersOfTasc?.map((mem) => (
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

function MemberItem({
  mem,
}: {
  mem: RouterOutputs["trackMember"]["list"][number];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { tascId } = useParams<{ tascId: string }>();
  const { mutate: removeMember, isPending } = useMutation(
    trpc.tascMember.remove.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.tasc.getById.queryOptions({ tascId }),
        );
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  return (
    <CommandItem
      onSelect={() => {
        removeMember({ userId: mem.userId, tascId });
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
  mem: RouterOutputs["trackMember"]["list"][number];
}) {
  const trpc = useTRPC();
  const { tascId } = useParams<{ tascId: string }>();
  const queryClient = useQueryClient();
  const { mutate: addMember, isPending } = useMutation(
    trpc.tascMember.add.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(
          trpc.tasc.getById.queryOptions({ tascId }),
        );
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  return (
    <CommandItem
      onSelect={() => {
        addMember({ userId: mem.userId, tascId });
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
