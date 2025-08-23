"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Avatar, AvatarImage } from "./ui/avatar";

export function MembersPopover({
  children,
  memebers = [],
  ...props
}: React.ComponentProps<typeof Popover> & {
  memebers: { name: string; url: string }[];
}) {
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="max-w-52 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandGroup heading="Employees of organization">
              {memebers.map((mem, i) => (
                <CommandItem key={i}>
                  <Avatar className="size-4">
                    <AvatarImage src={mem.url} />
                  </Avatar>
                  <span>{mem.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
