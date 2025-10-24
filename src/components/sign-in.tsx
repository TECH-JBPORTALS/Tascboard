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
import React, { useState } from "react";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { ChevronRight, MailIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { authClient } from "@/lib/auth-client";
import { notFound, useParams, useRouter } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useTicker } from "@/hooks/use-ticker";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the 6-digit code"),
});

/** Return the current path according to the sign-in catch-all route */
function useSignInPathname() {
  const params = useParams<{ "sign-in"?: string[] }>();

  return `/${params["sign-in"]?.join("/") ?? ""}`;
}

/** Helper to get the full sign-in path with base prefix */
function getSignInPath(path: string) {
  return `/sign-in${path}`;
}

export function SignIn() {
  const pathname = useSignInPathname();
  const [email, setEmail] = useState<string>("");

  console.log(pathname);

  switch (pathname) {
    case "/":
      return <SendVerificationForm onEmailSent={setEmail} />;

    case "/email-otp":
      return <EmailOTPForm email={email} />;

    default:
      notFound();
  }
}

function SendVerificationForm({
  onEmailSent,
}: {
  onEmailSent: (email: string) => void;
}) {
  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: values.email,
        type: "sign-in",
      });

      onEmailSent(values.email);
      router.push(getSignInPath("/email-otp"));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.";
      form.setError("root", {
        message: errorMessage,
      });
    }
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

function EmailOTPForm({ email }: { email: string }) {
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });
  const router = useRouter();
  const { time, restart, isCounting } = useTicker();
  const [isResending, setIsResending] = React.useState(false);

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    try {
      await authClient.signIn.emailOtp({
        email: email,
        otp: values.otp,
      });

      // Redirect to dashboard on successful sign in
      router.push("/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Invalid verification code. Please try again.";
      form.setError("root", {
        message: errorMessage,
      });
    }
  }

  async function resendCode() {
    setIsResending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
      });

      form.setError("root", {
        message: "Verification code sent! Check your email.",
      });

      /** Restart the  */
      restart();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend code. Please try again.";
      form.setError("root", {
        message: errorMessage,
      });
    }
    setIsResending(false);
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
        <CardTitle className="text-center">Verify your Email</CardTitle>
        <CardDescription className="text-center">
          We sent a 6-digit code to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-3.5" onSubmit={form.handleSubmit(onSubmit)}>
            {form.formState.errors.root && (
              <span
                className={`text-center text-sm ${
                  form.formState.errors.root.message?.includes("sent")
                    ? "text-green-600"
                    : "text-destructive"
                }`}
              >
                {form.formState.errors.root.message}
              </span>
            )}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="justify-center">
                  <FormControl>
                    <InputOTP {...field} maxLength={6}>
                      <InputOTPGroup className="[&_div]:data-[slot=input-otp-slot]:size-11">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <span className="text-center text-sm">
              {"Didn't recieve a code?"}{" "}
              <Button
                onClick={() => resendCode()}
                variant={"link"}
                disabled={isCounting || isResending}
                className="text-primary px-0.5 text-sm"
                type="button"
              >
                {isCounting ? (
                  `Resend (in ${time}s)`
                ) : (
                  <>{isResending ? "Resending..." : "Resend"}</>
                )}
              </Button>
            </span>
            <Button
              className="group"
              size={"lg"}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify"}
              <ChevronRight className="transition-all duration-200 group-hover:translate-x-0.5" />
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="ghost"
          size={"lg"}
          onClick={() => router.push(getSignInPath("/"))}
          className="text-muted-foreground w-full"
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
