"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { ChevronRight, MailIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function SignIn() {
  const { setEmail } = useAuthStore();
  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    await authClient.emailOtp.sendVerificationOtp({
      email: values.email,
      type: "sign-in",
      fetchOptions: {
        onSuccess() {
          setEmail(values.email);
          router.push("/verification");
        },
        onError(context) {
          form.setError("root", { message: context.error.message });
        },
      },
    });
  }

  return (
    <Card className="mb-28 min-w-sm border-none shadow-none">
      <CardHeader className="items-center justify-center">
        <Image
          src={"/tascboard.svg"}
          alt="Tascboard logo"
          width={40}
          height={40}
          className="mx-auto my-3.5"
        />
        <CardTitle className="text-center">Sign in to Tascboard</CardTitle>
        <CardDescription className="text-center">
          Welcome back! sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-3.5" onSubmit={form.handleSubmit(onSubmit)}>
            {form.formState.errors.root && (
              <span className="text-destructive text-center text-sm">
                {form.formState.errors.root.message}
              </span>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <InputGroup className="h-10">
                      <InputGroupAddon>
                        <MailIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="your@email.com"
                        type="email"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="group"
              size={"lg"}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Please wait..." : "Continue"}
              <ChevronRight className="transition-all duration-200 group-hover:translate-x-0.5" />
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <span className="text-muted-foreground text-center text-sm">
          by continuing you will agree to our terms & conditions
        </span>
      </CardFooter>
    </Card>
  );
}
