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
import { type z } from "zod/v4";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { CreateTascSchema } from "@/server/db/schema";
import { useParams } from "next/navigation";

export function NewTascButton() {
  const [open, setOpen] = useState(false);
  const { trackId } = useParams<{ trackId: string }>();
  const form = useForm({
    resolver: zodResolver(CreateTascSchema),
    defaultValues: {
      name: "",
      description: "",
      trackId,
    },
    mode: "onChange",
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync: createTasc } = useMutation(
    trpc.tasc.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.tasc.list.queryFilter());
        setOpen(false);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof CreateTascSchema>) {
    await createTasc(values);
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
                name="name"
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

              <div className="flex w-full"></div>
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
              <Button disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
