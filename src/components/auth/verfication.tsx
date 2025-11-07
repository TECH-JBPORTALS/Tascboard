"use client";

import { useTicker } from "@/hooks/use-ticker";
import { useAuthStore } from "@/stores/auth-store";
import { authClient } from "@/utils/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the 6-digit code"),
});

export function Verification() {
  const { email } = useAuthStore();
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { time, restart, isCounting } = useTicker();
  const [isResending, setIsResending] = React.useState(false);
  const { isVerifying, setIsVerifying, reset } = useAuthStore();

  const inviteToken = searchParams.get("invite");

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    setIsVerifying(true);
    await authClient.signIn.emailOtp({
      email,
      otp: values.otp,
      fetchOptions: {
        onError(context) {
          form.setError("root", {
            message: context.error.message,
          });
        },
        onSuccess() {
          reset();
          // Redirect to accept invite page if invite token exists
          if (inviteToken) {
            router.push(`/accept-invite/${inviteToken}`);
          } else {
            router.push("/");
          }
        },
      },
    });
    setIsVerifying(false);
  }

  async function resendCode() {
    setIsResending(true);
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
      fetchOptions: {
        onSuccess() {
          form.setError("root", {
            message: "Verification code sent! Check your email.",
          });
          /** Restart the  */
          restart();
        },
        onError(context) {
          form.setError("root", { message: context.error.message });
        },
      },
    });

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
              disabled={form.formState.isSubmitting || isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
              <ChevronRight className="transition-all duration-200 group-hover:translate-x-0.5" />
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="ghost"
          size={"lg"}
          onClick={() => {
            router.replace("/sign-in");
          }}
          className="text-muted-foreground w-full"
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
