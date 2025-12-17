"use client";
import { Container } from "@/components/container";
import { BoardMembersButton } from "@/components/board-members.button";
import { TextEditor } from "@/components/text-editor";
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
import { UpdateBoardSchema } from "@/server/db/schema";
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
import { useEffect } from "react";

export function BoardDetailsPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.board.getById.queryOptions({ boardId }),
  );

  const form = useForm({
    resolver: zodResolver(UpdateBoardSchema),
    defaultValues: {
      id: boardId,
      name: data?.name ?? "Untitled",
      description: data?.description ?? "",
      endDate: data?.endDate,
      startDate: data?.startDate,
      boardMembersUserIds: data.boardMembersUserIds ?? [],
    },
  });
  const values = form.watch();

  const { mutateAsync: updateBoard } = useMutation(
    trpc.board.update.mutationOptions({
      async onSuccess(data) {
        await Promise.all([
          queryClient.invalidateQueries(trpc.board.getById.queryFilter()),
          queryClient.invalidateQueries(trpc.board.list.queryFilter()),
        ]);
        form.reset({
          ...data[0],
          boardMembersUserIds: values.boardMembersUserIds,
        });
      },
      async onError() {
        toast.error(`Unable to save the changes`);
      },
    }),
  );

  useEffect(() => {
    form.reset({
      name: data?.name ?? "Untitled",
      description: data?.description ?? "",
      endDate: data?.endDate,
      startDate: data?.startDate,
      boardMembersUserIds: data.boardMembersUserIds ?? [],
    });
  }, [
    data.name,
    data.description,
    data.endDate,
    data.startDate,
    data.boardMembersUserIds,
    form,
    boardId,
  ]);

  return (
    <Form {...form}>
      <form>
        <Container className="px-52">
          <AutoSyncButton
            isDirty={form.formState.isDirty}
            values={{
              ...values,
              id: boardId,
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

            <BoardMembersButton membersUserIds={values.boardMembersUserIds} />
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
