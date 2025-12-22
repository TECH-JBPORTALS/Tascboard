"use client";

import type React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { TextEditor } from "../text-editor";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  ArrowRightIcon,
  BadgeInfoIcon,
  CalendarIcon,
  CalendarPlus,
  CheckIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import type { DateRange } from "react-day-picker";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { TascPriority, TascStatus } from "@/server/db/schema";
import { TASC_PRIORITY_LIST, TASC_STATUS_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CreateTascDialog({
  children,
  trackId,
}: {
  children: React.ReactNode;
  trackId: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<DateRange>();
  const [status, setStatus] = useState<TascStatus>("todo");
  const [priority, setPriority] = useState<TascPriority>("no_priority");
  const [membersUserIds, setMembersUserIds] = useState<string[]>([]);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: createTasc, isPending } = useMutation(
    trpc.tasc.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.tasc.list.queryFilter());
        setOpen(false);
        toast.success("Tasc created successfuly");
        setName("");
        setDescription("");
        setDueDate(undefined);
        setMembersUserIds([]);
        setStatus("todo");
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  function MembersButton() {
    const { data, isLoading, isError } = useQuery(
      trpc.trackMember.list.queryOptions({ trackId }, { enabled: open }),
    );

    const membersOfBoard = data?.filter((mem) =>
      membersUserIds.includes(mem.userId),
    );

    const remainingMembers = data?.filter(
      (mem) => !membersUserIds.includes(mem.userId),
    );

    if (isLoading) return <Skeleton className="h-7 w-20" />;

    if (isError)
      return (
        <span className="text-muted-foreground text-xs">
          <BadgeInfoIcon />
          {"Can't load members"}
        </span>
      );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"secondary"}
            className="data-[state=open]:bg-accent"
            size={"xs"}
          >
            <span className="inline-flex -space-x-2">
              {membersOfBoard?.map((mem) => (
                <Avatar key={mem.id} className="size-4">
                  <AvatarImage src={mem.user.image ?? "No image"} />
                  <AvatarFallback>{mem.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </span>
            {membersOfBoard && membersOfBoard?.length > 0
              ? `${membersOfBoard.length} members`
              : "Assign members"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-44 p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No members found.</CommandEmpty>
              {membersOfBoard && membersOfBoard.length > 0 && (
                <>
                  <CommandGroup heading={"Members of tasc"}>
                    {membersOfBoard?.map((mem) => (
                      <CommandItem
                        key={mem.id}
                        onSelect={() =>
                          setMembersUserIds((prev) =>
                            prev.filter((userId) => mem.userId !== userId),
                          )
                        }
                      >
                        <Avatar className="size-6">
                          <AvatarImage src={mem.user.image ?? "No image"} />
                          <AvatarFallback>
                            {mem.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{mem.user.name}</span>
                        <CheckIcon className="ml-auto" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {remainingMembers?.length !== 0 && (
                <CommandGroup heading="Members of track">
                  {remainingMembers?.map((mem) => (
                    <CommandItem
                      key={mem.id}
                      onSelect={() =>
                        setMembersUserIds((prev) => [...prev, mem.userId])
                      }
                    >
                      <Avatar className="size-6">
                        <AvatarImage src={mem.user.image ?? "No image"} />
                        <AvatarFallback>
                          {mem.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{mem.user.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  function StatusButton() {
    const selectedStatus = TASC_STATUS_LIST.find(
      (item) => item.value == status,
    );

    if (!selectedStatus) return null;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"secondary"}
            className={cn(
              "data-[state=open]:bg-accent",
              selectedStatus.className,
            )}
            size={"xs"}
          >
            <selectedStatus.icon />
            {selectedStatus.label}
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
                    onSelect={() => setStatus(item.value)}
                    className={cn(item.className)}
                  >
                    <item.icon className={cn(item.className)} />
                    <span>{item.label}</span>
                    {item.value == status && <CheckIcon className="ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  function PriorityButton() {
    const selectedPriority = TASC_PRIORITY_LIST.find(
      (item) => item.value == priority,
    );

    if (!selectedPriority) return null;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"secondary"}
            className={cn(
              "data-[state=open]:bg-accent",
              selectedPriority.className,
            )}
            size={"xs"}
          >
            <selectedPriority.icon />
            {selectedPriority.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-44 p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading={"Members of track"}>
                {TASC_PRIORITY_LIST.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => setPriority(item.value)}
                  >
                    <item.icon className={cn(item.className)} />
                    <span>{item.label}</span>
                    {item.value == priority && (
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[calc(100svh-15%)] min-h-[calc(100svh-15%)] flex-col sm:min-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-md font-medium">New tasc</DialogTitle>
        </DialogHeader>
        <div className="h-full flex-1 space-y-2 overflow-y-scroll">
          <TextEditor
            markdown={name}
            onChange={(markdown) => {
              setName(markdown);
            }}
            className="w-full text-2xl! font-semibold outline-none"
            placeholder="Tasc title"
          />
          <div className="flex items-center gap-1.5">
            <PriorityButton />
            <StatusButton />
            <MembersButton />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"secondary"} size={"xs"}>
                  {dueDate?.from ? (
                    <>
                      <CalendarIcon />
                      {format(dueDate?.from, "dd MMM, yyy")}{" "}
                      {dueDate.to && dueDate.from !== dueDate.to && (
                        <>
                          <ArrowRightIcon />
                          {format(dueDate.to, "dd MMM, yyy")}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <CalendarPlus /> Set Due
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
              >
                <Calendar
                  mode="range"
                  defaultMonth={dueDate?.to ?? dueDate?.from}
                  selected={{
                    from: dueDate?.from ?? undefined,
                    to: dueDate?.to ?? undefined,
                  }}
                  onSelect={(selected) => {
                    setDueDate(selected);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Separator />
          <TextEditor
            placeholder="Add description..."
            markdown={description}
            onChange={(markdown) => {
              setDescription(markdown);
            }}
            className="h-full"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={() =>
              createTasc({
                trackId,
                name,
                description,
                startDate: dueDate?.from,
                endDate: dueDate?.to,
                membersUserIds,
                status,
                priority,
              })
            }
            disabled={name.trim().length == 0 || isPending}
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
