"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { SendIcon } from "lucide-react";
import { authClient } from "@/utils/auth-client";
import { toast } from "sonner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const InviteEmployeesSchema = z.object({
  emails: z
    .string()
    .min(1, "Required")
    .check((ctx) => {
      const invalidEmails: string[] = [];

      ctx.value.split(",").forEach((email) => {
        if (!emailRegex.test(email.trim())) invalidEmails.push(email.trim());
      });

      if (invalidEmails.length > 0)
        ctx.issues.push({
          code: "invalid_value",
          input: ctx.value,
          values: [],
          message: `${invalidEmails.join(", ")} invalid`,
        });
    }),
});

export function InviteEmployeesButton() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(InviteEmployeesSchema),
    defaultValues: {
      emails: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof InviteEmployeesSchema>) {
    await Promise.all(
      values.emails.split(",").map(async (email) => {
        await authClient.organization.inviteMember({
          email: email.trim(),
          role: "employee",
          fetchOptions: {
            onError(context) {
              toast.error(`${email.trim()}: ${context.error.message}`);
            },
          },
        });
      }),
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <SendIcon /> Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite employees</DialogTitle>
          <DialogDescription>
            Invite employees into the work space to track their work
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid">
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="h-[125px] resize-none"
                        placeholder="email@example.com, email2@example.com..."
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
                {form.formState.isSubmitting ? "Sending..." : "Send invites..."}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
