"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useParams, useSearchParams } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";
import type { TascPriority, TascStatus } from "@/server/db/schema";
import { useQueryStates } from "nuqs";
import { tascFilterSearchParams } from "@/lib/search-params";
import { TASC_PRIORITY_LIST, TASC_STATUS_LIST } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export function DataTableClient() {
  const trpc = useTRPC();
  const { trackId } = useParams<{ trackId: string }>();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") as TascStatus | null;
  const priority = searchParams.get("priority") as TascPriority | null;
  const assignee = searchParams.get("assignee");

  const debouncedQuery = useDebounce(q, 600);
  const { data } = useSuspenseQuery(
    trpc.tasc.list.queryOptions({
      trackId,
      q: debouncedQuery,
      status,
      priority,
      assignee,
    }),
  );
  return <DataTable columns={columns} data={data} />;
}

export function FiltersRow() {
  const [filter, setFilter] = useQueryStates(tascFilterSearchParams, {
    clearOnDefault: true,
  });

  function StatusButton() {
    const selectedStatus = TASC_STATUS_LIST.find(
      (item) => item.value == filter.status,
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={filter.status ? "secondary" : "outline"}
            className={cn("data-[state=open]:bg-accent border-dashed")}
            size={"sm"}
          >
            {selectedStatus ? (
              <>
                <selectedStatus.icon className={selectedStatus?.className} />
                {selectedStatus.label}
              </>
            ) : (
              <>Status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-44 p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading={"Members of track"}>
                {TASC_STATUS_LIST.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() =>
                      setFilter((prev) => ({
                        ...prev,
                        status: prev.status !== item.value ? item.value : null,
                      }))
                    }
                  >
                    <item.icon className={cn(item.className)} />
                    <span>{item.label}</span>
                    {item.value == filter.status && (
                      <CheckIcon className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  function MembersButton() {
    const [open, setOpen] = useState(false);
    const trpc = useTRPC();
    const { trackId } = useParams<{ trackId: string }>();
    const { data, isLoading } = useQuery(
      trpc.trackMember.list.queryOptions({ trackId }, { enabled: open }),
    );

    const selectedMember = data?.find((mem) => mem.userId === filter.assignee);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={filter.assignee ? "secondary" : "outline"}
            className={cn("data-[state=open]:bg-accent border-dashed")}
            size={"sm"}
          >
            {selectedMember ? (
              <>
                <Avatar className="size-5">
                  <AvatarImage src={selectedMember.user.image ?? "No image"} />
                  <AvatarFallback>
                    {selectedMember.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {selectedMember.user.name}
              </>
            ) : (
              "Assignee"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-44 p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2Icon
                  strokeWidth={1.25}
                  className="size-6 animate-spin"
                />
              </div>
            ) : (
              <CommandList>
                <CommandEmpty>No members found.</CommandEmpty>

                <CommandGroup>
                  {data?.map((mem) => (
                    <CommandItem
                      key={mem.id}
                      onSelect={() =>
                        setFilter((prev) => ({
                          ...prev,
                          assignee:
                            prev.assignee !== mem.userId ? mem.userId : null,
                        }))
                      }
                    >
                      <Avatar className="size-6">
                        <AvatarImage src={mem.user.image ?? "No image"} />
                        <AvatarFallback>
                          {mem.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{mem.user.name}</span>
                      {mem.userId == filter.assignee && (
                        <CheckIcon className="ml-auto" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  function PriorityButton() {
    const selectedPriority = TASC_PRIORITY_LIST.find(
      (item) => item.value == filter.priority,
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={filter.priority ? "secondary" : "outline"}
            className={cn(
              "data-[state=open]:bg-accent border-dashed",
              selectedPriority?.className,
            )}
            size={"sm"}
          >
            {selectedPriority ? (
              <>
                <selectedPriority.icon />
                {selectedPriority.label}
              </>
            ) : (
              "Priority"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-44 p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {TASC_PRIORITY_LIST.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() =>
                      setFilter((prev) => ({
                        ...prev,
                        priority:
                          prev.priority !== item.value ? item.value : null,
                      }))
                    }
                  >
                    <item.icon className={cn(item.className)} />
                    <span>{item.label}</span>
                    {item.value == filter.priority && (
                      <CheckIcon className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex items-center gap-3.5">
      <SearchInput placeholder="Search tascs..." />

      <PriorityButton />
      <StatusButton />
      <MembersButton />
      {!!filter.status || !!filter.priority || !!filter.assignee ? (
        <Button
          size={"xs"}
          variant={"ghost"}
          className="text-muted-foreground hover:text-muted-foreground"
          onClick={() =>
            setFilter({ assignee: null, priority: null, status: null })
          }
        >
          <XIcon /> Clear
        </Button>
      ) : null}
    </div>
  );
}
