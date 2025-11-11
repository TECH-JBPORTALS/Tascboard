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
import { Input } from "../ui/input";
import { TextEditor } from "../text-editor";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function CreateBoardDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
      <DialogContent className="sm:min-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-md font-medium">New board</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Board Name"
            className="border-none bg-transparent! px-0 text-2xl! font-semibold focus-visible:ring-0"
          />
          <div className="space-x-1.5">
            <Button size={"xs"} variant={"secondary"}>
              Members
            </Button>
            <Button size={"xs"} variant={"secondary"}>
              Start Date
            </Button>
            <Button size={"xs"} variant={"secondary"}>
              End Date
            </Button>
          </div>
          <Separator />
          <TextEditor
            markdown={description}
            onChange={(markdown) => {
              setDescription(markdown);
            }}
            className="min-h-[400px]"
          />
        </div>
        <DialogFooter>
          <Button variant={"secondary"}>Cancel</Button>
          <Button
            onClick={() => createBoard({ name, description })}
            disabled={!name || isPending}
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
