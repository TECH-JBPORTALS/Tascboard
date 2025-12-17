"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";
import slugify from "slugify";
import { cn } from "@/lib/utils";
import { authClient } from "@/utils/auth-client";
import { CheckCircle2, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateOrganization = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name should be atlease 3 characters")
    .max(60, "Name can not exceed above 60 characters"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug should be atleast 3 characters")
    .max(70, "Slug can not exceed above 70 characters"),
});

export default function Page() {
  const form = useForm({
    resolver: zodResolver(CreateOrganization),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
  const [isSlugValid, setSlugValid] = useState(false);

  const [isSlugChecking, setSlugChecking] = useState(false);

  const values = form.watch();

  const debouncedOrgName = useDebounce(values.name, 200);
  const debouncedSlug = useDebounce(values.slug, 200);
  const router = useRouter();

  const checkSlug = useCallback(
    async (slug: string) => {
      form.clearErrors();
      setSlugChecking(true);
      await authClient.organization.checkSlug({
        slug,
        fetchOptions: {
          onError(ctx) {
            setSlugValid(false);
            form.setError("slug", {
              message: ctx.error.message,
              type: "value",
            });
          },
          onSuccess() {
            setSlugValid(true);
          },
        },
      });
      setSlugChecking(false);
    },
    [form],
  );

  useEffect(() => {
    const slug = slugify(debouncedOrgName, { lower: true, trim: true });
    form.setValue("slug", slug, {
      shouldValidate: true,
    });
    if (slug) void checkSlug(slug);
  }, [debouncedOrgName, form, checkSlug]);

  useEffect(() => {
    if (debouncedSlug) void checkSlug(debouncedSlug);
  }, [debouncedSlug, form, checkSlug]);

  async function onSumbit(values: z.infer<typeof CreateOrganization>) {
    form.clearErrors();
    await authClient.organization.create(values, {
      onError(ctx) {
        form.setError("root", { message: ctx.error.message });
      },
      onSuccess() {
        router.push(`/${values.slug}`);
      },
    });
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <Image
        src={"/tascboard.svg"}
        alt="tascboard logo"
        height={34}
        width={34}
      />
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        New Organization
      </h3>
      <p className="text-muted-foreground max-w-lg text-center text-sm">
        Create new organizaiotn to start managing your tasks in project life
        cycle.
      </p>

      <Form {...form}>
        {form.formState.errors.root && (
          <span className="text-destructive max-w-lg text-center text-sm">
            {form.formState.errors.root.message}
          </span>
        )}
        <form
          onSubmit={form.handleSubmit(onSumbit)}
          className="w-full max-w-lg space-y-6"
        >
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      {...field}
                      className={cn("z-40", values.name && "rounded-b-none")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {values.name && (
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputGroup className="bg-accent! rounded-t-none border-t-0 transition-all duration-300">
                        <InputGroupAddon className="font-mono">
                          {window.location.origin}/
                        </InputGroupAddon>
                        <InputGroupInput
                          className="text-accent-foreground font-mono focus-visible:ring-0"
                          {...field}
                        />
                        <InputGroupAddon align={"inline-end"}>
                          {isSlugChecking ? (
                            <Loader2Icon className="size-4 animate-spin" />
                          ) : isSlugValid ? (
                            <CheckCircle2 className="size-4 text-green-600" />
                          ) : null}
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Button
            className="w-full max-w-lg"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
