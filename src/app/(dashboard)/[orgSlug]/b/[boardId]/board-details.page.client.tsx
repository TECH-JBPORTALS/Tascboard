"use client";
import { Container } from "@/components/container";
import { DatePicker } from "@/components/date-picker";
import { MembersPopover } from "@/components/members-popover";
import { TextEditor } from "@/components/text-editor";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
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
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
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
      endDate: data?.endDate ?? new Date(),
      startDate: data?.startDate ?? new Date(),
    },
  });
  const { mutateAsync: updateBoard } = useMutation(
    trpc.board.update.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries(trpc.board.getById.queryFilter());
        await queryClient.invalidateQueries(trpc.board.list.queryFilter());
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
            <div className="flex items-center [&>svg]:size-4">
              <DatePicker>
                <Button
                  size={"xs"}
                  className="data-[state=open]:bg-accent"
                  variant={"ghost"}
                >
                  <CalendarIcon />7 Jun
                </Button>
              </DatePicker>
              <ArrowRightIcon />
              <DatePicker>
                <Button
                  size={"xs"}
                  className="data-[state=open]:bg-accent"
                  variant={"ghost"}
                >
                  2 Sep, 2023
                </Button>
              </DatePicker>
            </div>

            <MembersPopover memebers={users}>
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
            </MembersPopover>
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
