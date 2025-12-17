"use client";

import type React from "react";
import {
  Dialog,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ArrowRightIcon, CalendarIcon, CalendarPlus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import type { DateRange } from "react-day-picker";

export function CreateBoardDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<DateRange>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: createBoard, isPending } = useMutation(
    trpc.board.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.board.list.queryFilter());
        setOpen(false);
        toast.success("Board created successfuly");
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[80%] min-h-[40%] flex-col sm:min-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-md font-medium">New board</DialogTitle>
        </DialogHeader>
        <div className="h-full flex-1 space-y-2 overflow-y-scroll">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Board name"
            className="bg-transparent! px-0 text-2xl! font-semibold outline-none"
          />
          <div className="flex items-center gap-1.5">
            <Button size={"xs"} variant={"secondary"}>
              Members
            </Button>
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
            markdown={description}
            onChange={(markdown) => {
              setDescription(markdown);
            }}
            className="h-full"
          />
        </div>
        <DialogFooter>
          <Button variant={"secondary"}>Cancel</Button>
          <Button
            onClick={() =>
              createBoard({
                name,
                description,
                startDate: dueDate?.from,
                endDate: dueDate?.to,
              })
            }
            disabled={!name || isPending}
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
