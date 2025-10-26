"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Plus, UserCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { MembersPopover } from "./members-popover";

export const NewTascSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export function NewTascButton() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(NewTascSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof NewTascSchema>) {
    // Do something...
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-normal">New tasc</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Untitled"
                        className="border-none px-0 text-2xl font-semibold shadow-none outline-none focus-visible:ring-0 md:text-2xl"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex w-full">
                <MembersPopover
                  memebers={[
                    { name: "Manu", url: "https://github.com/x-sss-x.png" },
                  ]}
                >
                  <Button size={"xs"} variant={"secondary"}>
                    <UserCircle />
                    Assign
                  </Button>
                </MembersPopover>
              </div>
              <Separator />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="h-[125px] resize-none border-none px-0 shadow-none outline-none focus-visible:ring-0"
                        placeholder="Add description..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button disabled={form.formState.isSubmitting}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
