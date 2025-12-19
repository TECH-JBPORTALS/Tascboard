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
import React from "react";
import z from "zod/v4";
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
import { ChevronRight, LockKeyhole, MailIcon, User2 } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { authClient } from "@/utils/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

const signUpSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters required."),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Minimum 8 charcters required.")
    .max(128, "Can not be more than 128 characters."),
});

export function SignUp({ email }: { email: string }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const { setEmail, setVerficationType } = useAuthStore();
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email,
      password: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    await authClient.signUp.email({
      ...values,
      fetchOptions: {
        async onSuccess() {
          setEmail(values.email);
          setVerficationType("email-verification");
          const params = new URLSearchParams(searchParams.toString());
          router.push(`/verification?${params.toString()}`);
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
        <CardTitle className="text-center">Welcome to Tascboard</CardTitle>
        <CardDescription className="text-center">
          Create an account to continue with dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            {form.formState.errors.root && (
              <span className="text-destructive text-center text-sm">
                {form.formState.errors.root.message}
              </span>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <InputGroup className="h-10">
                      <InputGroupAddon>
                        <User2 className="text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="Jhon Doe"
                        type="text"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <InputGroup className="bg-accent text-accent-foreground h-10">
                      <InputGroupAddon>
                        <MailIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        readOnly
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputGroup className="h-10">
                      <InputGroupAddon>
                        <LockKeyhole className="text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="······················"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <Button
                          onClick={() => setShowPassword((prev) => !prev)}
                          type="button"
                          variant={"link"}
                          size={"xs"}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </InputGroupAddon>
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
