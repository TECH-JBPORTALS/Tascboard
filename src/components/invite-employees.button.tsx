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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { ChevronDown, SendIcon, User2Icon } from "lucide-react";
import { authClient } from "@/utils/auth-client";
import { toast } from "sonner";
import { ButtonGroup, ButtonGroupSeparator } from "./ui/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { api, type RouterOutputs } from "@/trpc/react";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { formatDistanceToNow } from "date-fns";

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
  const utils = api.useUtils();

  async function onSubmit(values: z.infer<typeof InviteEmployeesSchema>) {
    try {
      const emailList = values.emails.split(",");
      let errorCount = 0;

      await Promise.all(
        emailList.map(async (email) => {
          await authClient.organization.inviteMember({
            email: email.trim(),
            role: "employee",
            resend: true,
            fetchOptions: {
              onError(context) {
                toast.error(`${email.trim()}: ${context.error.message}`);
                errorCount++;
              },
              onSuccess() {
                toast.success(
                  <div>
                    Invitation sent to <b>{email.trim()}</b>
                  </div>,
                );
              },
            },
          });
        }),
      );

      await utils.betterAuth.getInvitaions.invalidate();

      if (errorCount == 0) {
        setOpen(false);
        form.reset();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ButtonGroup>
        <DialogTrigger asChild>
          <Button>
            <SendIcon /> Invite
          </Button>
        </DialogTrigger>
        <ButtonGroupSeparator />

        <InvitationsListButton />
      </ButtonGroup>
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
                    <FormDescription>
                      To resend the invitation mention email and send again
                      invitation.
                    </FormDescription>
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

function InvitationListItem({
  inv,
}: {
  inv: RouterOutputs["betterAuth"]["getInvitaions"][number];
}) {
  const utils = api.useUtils();
  const [isLoading, setLoading] = useState(false);

  async function onCancelInv() {
    setLoading(true);
    await authClient.organization.cancelInvitation({
      invitationId: inv.id,
      fetchOptions: {
        async onSuccess() {
          await utils.betterAuth.getInvitaions.invalidate();
        },
        onError(context) {
          toast.error(context.error.message);
        },
      },
    });
    setLoading(false);
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Avatar className="size-10 border border-dashed">
          <AvatarFallback className="bg-transparent">
            <User2Icon strokeWidth={1} className="text-muted-border" />
          </AvatarFallback>
        </Avatar>
        <div className="-space-y-0.5">
          <div className="text-xs font-medium">{inv.email}</div>
          <time className="text-muted-foreground text-xs">
            Expires {formatDistanceToNow(inv.expiresAt, { addSuffix: true })}
          </time>
        </div>
      </div>

      <Button
        onClick={onCancelInv}
        disabled={isLoading}
        variant={"outline"}
        size={"xs"}
      >
        {isLoading ? "Canceling..." : "Cancel"}
      </Button>
    </div>
  );
}

function InvitaionListSkeleton() {
  return Array.from({ length: 10 }).map((_, i) => (
    <div className="flex w-full items-center justify-between" key={i}>
      <div className="flex items-center gap-1.5">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>

      <Skeleton className="h-7 w-14" />
    </div>
  ));
}

function InvitationsListButton() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isRefetching } =
    api.betterAuth.getInvitaions.useQuery(undefined, {
      enabled: open,
    });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size={"icon"} className="data-[state=open]:bg-primary/90">
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="min-w-[350px] p-0">
        <div className="flex w-full items-center border-b p-2.5">
          <div className="text-sm font-semibold">Invitaions</div>
        </div>
        <ScrollArea>
          <div className="max-h-[350px] min-h-[350px] space-y-2.5 p-2.5">
            {isLoading || isRefetching ? (
              <InvitaionListSkeleton />
            ) : data?.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant={"icon"}>
                    <SendIcon />
                  </EmptyMedia>
                  <EmptyTitle className="text-base">No invitations</EmptyTitle>
                  <EmptyDescription className="text-xs">
                    When you invite the people using their email, those will be
                    shown here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              data?.map((inv) => <InvitationListItem inv={inv} key={inv.id} />)
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
