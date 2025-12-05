"use client";
import { Container } from "@/components/container";
import { TextEditor } from "@/components/text-editor";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const users = [
  { name: "Manu", url: "https://github.com/x-sss-x.png" },
  { name: "JB Portals", url: "https://github.com/JBPORTALS.png" },
  { name: "Akash", url: "https://github.com/akash.png" },
  { name: "Gayathri Emparala", url: "https://github.com/gayathriemparala.png" },
  { name: "Theo", url: "https://github.com/theo.png" },
];

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
    },
  });
  const { mutateAsync: updateBoard } = useMutation(
    trpc.track.update.mutationOptions({
      async onSuccess(data) {
        await Promise.all([
          queryClient.invalidateQueries(trpc.track.getById.queryFilter()),
          queryClient.invalidateQueries(trpc.track.list.queryFilter()),
        ]);
        form.reset(data[0]);
      },
      async onError() {
        toast.error(`Unable to save the changes`);
      },
    }),
  );

  const values = form.watch();

  return (
    <Form {...form}>
      <form>
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
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
              >
                <Calendar
                  captionLayout="dropdown"
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

            {/* <MembersPopover memebers={users}>
              <Button
                variant={"ghost"}
                className="data-[state=open]:bg-accent"
                size={"xs"}
              >
                <span className="inline-flex -space-x-2">
                  {users.map((item, i) => (
                    <Avatar
                      key={i}
                      className="border-background size-6 border-2"
                    >
                      <AvatarImage src={item.url} />
                    </Avatar>
                  ))}
                </span>
                {users.length} Members
              </Button>
            </MembersPopover> */}
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
      </form>
    </Form>
  );
}
