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
} from "./ui/command";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { CheckIcon, Loader2Icon } from "lucide-react";
import type { TascStatus } from "@/server/db/schema";
import { TASC_STATUS_LIST, type TascStatusItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TascStatusButton({
  status,
  buttonProps,
  tascId,
  showLabel = true,
  ...props
}: React.ComponentProps<typeof Popover> & {
  status?: TascStatus;
  tascId: string;
  buttonProps?: React.ComponentProps<typeof Button>;
  showLabel?: boolean;
}) {
  const currentStatus = TASC_STATUS_LIST.find((item) => item.value === status);

  function StatusItem({ item }: { item: TascStatusItem }) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { mutate: updateTasc, isPending } = useMutation(
      trpc.tasc.updateStatus.mutationOptions({
        async onSuccess() {
          await Promise.all([
            queryClient.invalidateQueries(trpc.tasc.getById.queryFilter()),
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
          updateTasc({ status: item.value, id: tascId });
        }}
        disabled={isPending}
      >
        <item.icon className={cn(item.className)} />
        <span>{item.label}</span>
        {isPending ? (
          <Loader2Icon className="ml-auto size-4 animate-spin" />
        ) : item.value == status ? (
          <CheckIcon className="ml-auto" />
        ) : null}
      </CommandItem>
    );
  }

  if (!currentStatus) return null;

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          {...buttonProps}
          className={cn(currentStatus.className, buttonProps?.className)}
        >
          <currentStatus.icon />
          {showLabel && currentStatus.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-52 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Members of organization">
              {TASC_STATUS_LIST?.map((item) => (
                <StatusItem item={item} key={item.value} />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
