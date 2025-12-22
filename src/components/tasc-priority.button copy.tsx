"use client";

import React, { useState } from "react";
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
import type { TascPriority } from "@/server/db/schema";
import { TASC_PRIORITY_LIST, type TascPriorityItem } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function TascPriorityButton({
  priority,
  buttonProps,
  tascId,
  showLabel = true,
  ...props
}: React.ComponentProps<typeof Popover> & {
  priority?: TascPriority;
  tascId: string;
  buttonProps?: React.ComponentProps<typeof Button>;
  showLabel?: boolean;
}) {
  const currentPriority = TASC_PRIORITY_LIST.find(
    (item) => item.value === priority,
  );

  function PriorityItem({ item }: { item: TascPriorityItem }) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { mutate: updateTasc, isPending } = useMutation(
      trpc.tasc.updatePriority.mutationOptions({
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
          updateTasc({ priority: item.value, id: tascId });
        }}
        disabled={isPending}
      >
        <item.icon className={cn(item.className)} />
        <span>{item.label}</span>
        {isPending ? (
          <Loader2Icon className="ml-auto size-4 animate-spin" />
        ) : item.value == priority ? (
          <CheckIcon className="ml-auto" />
        ) : null}
      </CommandItem>
    );
  }

  if (!currentPriority) return null;

  return (
    <Popover {...props}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              {...buttonProps}
              className={cn(
                currentPriority.className,
                buttonProps?.className,
                showLabel && "min-w-[80px]",
                "justify-start",
              )}
            >
              <currentPriority.icon />
              {showLabel && currentPriority.label}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className={cn(showLabel && "hidden")}>
          {currentPriority.label}
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="max-w-52 p-0">
        <Command>
          <CommandInput placeholder="Set priority..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {TASC_PRIORITY_LIST?.map((item) => (
                <PriorityItem item={item} key={item.value} />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
