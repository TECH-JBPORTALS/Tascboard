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
import { Loader2Icon, UserCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function TascMembersButton({
  membersUserIds = [],
  tascId,
  faceId,
  showLabel = true,
  tascMembers = [],
  ...props
}: React.ComponentProps<typeof Popover> & {
  membersUserIds: string[];
  tascId: string;
  faceId: string;
  showLabel?: boolean;
  tascMembers:
    | RouterOutputs["tasc"]["list"][number]["tascMembers"]
    | RouterOutputs["tasc"]["getById"]["tascMembers"];
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
          {tascMembers.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex -space-x-2">
                  {tascMembers?.map((mem) => (
                    <Avatar
                      key={mem.id}
                      className="border-background size-6 border-2"
                    >
                      <AvatarImage src={mem.user.image ?? "No image"} />
                      <AvatarFallback>{mem.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {tascMembers.map((mem) => mem.user.name).join(", ")}
              </TooltipContent>
            </Tooltip>
          )}
          {tascMembers?.length > 0 ? (
            showLabel && `${tascMembers.length} members`
          ) : (
            <>
              <UserCircleIcon
                strokeWidth={1.25}
                className="text-muted-foreground size-5"
              />{" "}
              {showLabel && (
                <span className="text-muted-foreground">Assign...</span>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-52 p-0">
        <Command>
          <CommandInput placeholder="Assign to..." />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            {membersOfTasc.length > 0 && (
              <>
                <CommandGroup heading={"Members of tasc"}>
                  {membersOfTasc?.map((mem) => (
                    <MemberItem
                      {...{ faceId, tascId, trackId }}
                      key={mem.id}
                      mem={mem}
                    />
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {remainingMembers?.length !== 0 && (
              <CommandGroup heading="Members of track">
                {remainingMembers?.map((mem) => (
                  <RemainingMemberItem
                    {...{ faceId, tascId, trackId }}
                    mem={mem}
                    key={mem.id}
                  />
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
  tascId,
  faceId,
  trackId,
}: {
  mem: RouterOutputs["trackMember"]["list"][number];
  tascId: string;
  faceId: string;
  trackId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: removeMember, isPending } = useMutation(
    trpc.tascMember.remove.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.tasc.getById.queryOptions({ faceId, trackId }),
          ),
          queryClient.invalidateQueries(trpc.tasc.list.queryFilter()),
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
  tascId,
  faceId,
  trackId,
}: {
  mem: RouterOutputs["trackMember"]["list"][number];
  tascId: string;
  faceId: string;
  trackId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: addMember, isPending } = useMutation(
    trpc.tascMember.add.mutationOptions({
      async onSuccess() {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.tasc.getById.queryOptions({ faceId, trackId }),
          ),
          queryClient.invalidateQueries(trpc.tasc.list.queryFilter()),
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
