"use client";
import { Container } from "@/components/container";
import { TextEditor } from "@/components/text-editor";
import { TrackMembersButton } from "@/components/track-members.button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { AutoSyncButton } from "@/hooks/use-auto-sync";
import { UpdateTrackSchema } from "@/server/db/schema";
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

export function TrackDetailsPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.track.getById.queryOptions({ trackId }),
  );

  const form = useForm({
    resolver: zodResolver(UpdateTrackSchema),
    defaultValues: {
      id: trackId,
      name: data?.name ?? "Untitled",
      description: data?.description ?? "",
      endDate: data?.endDate,
      startDate: data?.startDate,
      trackMembersUserIds: data?.trackMembersUserIds ?? [],
    },
  });

  const values = form.watch();

  const { mutateAsync: updateBoard } = useMutation(
    trpc.track.update.mutationOptions({
      async onSuccess(data) {
        await Promise.all([
          queryClient.invalidateQueries(trpc.track.getById.queryFilter()),
          queryClient.invalidateQueries(trpc.track.list.queryFilter()),
        ]);
        form.reset({
          ...data[0],
          trackMembersUserIds: values.trackMembersUserIds,
        });
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
      name: data?.name ?? "Untitled",
      description: data?.description ?? "",
      endDate: data?.endDate,
      startDate: data?.startDate,
      trackMembersUserIds: data.trackMembersUserIds ?? [],
    });
  }, [
    data.name,
    data.description,
    data.endDate,
    data.startDate,
    data.trackMembersUserIds,
    form,
    trackId,
  ]);

  return (
    <Form {...form}>
      <Container className="px-52">
        <AutoSyncButton
          isDirty={form.formState.isDirty}
          values={{
            ...values,
            id: trackId,
          }}
          onSave={updateBoard}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormControl>
              <input
                {...field}
                placeholder="Untitled"
                className="text-3xl font-semibold focus-visible:outline-none"
              />
            </FormControl>
          )}
        />
        <div className="flex items-center gap-4 py-1">
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

          <TrackMembersButton membersUserIds={values.trackMembersUserIds} />
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
              />
            </FormControl>
          )}
        />
      </Container>
    </Form>
  );
}
