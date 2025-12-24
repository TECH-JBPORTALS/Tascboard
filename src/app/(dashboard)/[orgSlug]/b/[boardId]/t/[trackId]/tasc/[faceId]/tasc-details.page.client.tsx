"use client";
import { TascMembersButton } from "@/components/tasc-members.button";
import { TascPriorityButton } from "@/components/tasc-priority.button";
import { TascStatusButton } from "@/components/tasc-status.button";
import { TextEditor } from "@/components/text-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AutoSyncButton } from "@/hooks/use-auto-sync";
import { UpdateTascSchema } from "@/server/db/schema";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowRightIcon, CalendarIcon, CalendarPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function TascDetailsPage() {
  const { faceId, trackId } = useParams<{ faceId: string; trackId: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.tasc.getById.queryOptions({ faceId, trackId }),
  );

  const form = useForm({
    resolver: zodResolver(UpdateTascSchema),
    defaultValues: {
      faceId: data.faceId,
      trackId: data.trackId,
      name: data?.name,
      description: data?.description ?? "",
      endDate: data?.endDate,
      startDate: data?.startDate,
      tascMembersUserIds: data.tascMembersUserIds ?? [],
    },
  });
  const values = form.watch();

  const { mutateAsync: updateTasc } = useMutation(
    trpc.tasc.update.mutationOptions({
      async onSuccess(data) {
        await Promise.all([
          queryClient.invalidateQueries(trpc.tasc.getById.queryFilter()),
          queryClient.invalidateQueries(trpc.tasc.list.queryFilter()),
          queryClient.invalidateQueries(trpc.tascActivity.list.queryFilter()),
        ]);
        form.reset({ ...data, tascMembersUserIds: values.tascMembersUserIds });
      },
      async onError(error) {
        toast.error(`Unable to save the changes`, {
          description: error.data?.zodError
            ? error.data?.zodError.fieldErrors.name
            : error.message,
        });
        form.reset();
      },
    }),
  );

  useEffect(() => {
    form.reset({
      faceId: data.faceId,
      trackId: data.trackId,
      name: data?.name,
      description: data?.description ?? "",
      endDate: data?.endDate,
      startDate: data?.startDate,
      tascMembersUserIds: data.tascMembersUserIds,
    });
  }, [
    data.faceId,
    data.trackId,
    data.name,
    data.description,
    data.endDate,
    data.startDate,
    data.tascMembersUserIds,
    form,
  ]);

  return (
    <Form {...form}>
      <section className="flex flex-4 flex-col gap-6 py-6 pr-6">
        <AutoSyncButton
          isDirty={form.formState.isDirty}
          values={{
            ...values,
            id: data.id,
          }}
          onSave={updateTasc}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormControl>
              <TextEditor
                markdown={field.value ?? ""}
                onChange={(markdown) => field.onChange(markdown)}
                placeholder="Tasc title"
                className="text-3xl font-semibold focus-visible:outline-none"
              />
            </FormControl>
          )}
        />
        <div className="flex items-center gap-4 py-1">
          <TascPriorityButton
            {...{ faceId, trackId }}
            priority={data.priority}
            buttonProps={{ size: "xs", variant: "ghost" }}
          />
          <TascStatusButton
            {...{ faceId, trackId }}
            status={data.status}
            buttonProps={{ size: "xs", variant: "ghost" }}
          />
          <TascMembersButton
            faceId={faceId}
            tascMembers={data.tascMembers}
            tascId={data.id!}
            membersUserIds={values.tascMembersUserIds ?? []}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"ghost"} size={"xs"}>
                {values.startDate ? (
                  <>
                    <CalendarIcon />
                    {format(values.startDate, "dd MMM, yyy")}{" "}
                    {values.endDate && (
                      <>
                        <ArrowRightIcon />
                        {format(values.endDate, "dd MMM, yyy")}
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
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
              <Calendar
                mode="range"
                selected={{
                  from: values.startDate ?? undefined,
                  to: values.endDate ?? undefined,
                }}
                onSelect={(selected) => {
                  form.setValue("startDate", selected?.from, {
                    shouldDirty: true,
                  });
                  form.setValue("endDate", selected?.to, {
                    shouldDirty: true,
                  });
                }}
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground inline-flex items-center gap-2 text-xs">
            <span> Created by </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="size-5">
                  <AvatarImage
                    src={data?.createdByUser?.image ?? "Creator profile"}
                  />
                  <AvatarFallback className="text-xs">
                    {data?.createdByUser?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {data?.createdByUser?.name}
              </TooltipContent>
            </Tooltip>
          </span>
        </div>
        <Separator />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormControl>
              <TextEditor
                markdown={field.value ?? ""}
                onChange={(markdown) => field.onChange(markdown)}
                className="min-h-20"
                placeholder="Add description..."
              />
            </FormControl>
          )}
        />
      </section>
    </Form>
  );
}
