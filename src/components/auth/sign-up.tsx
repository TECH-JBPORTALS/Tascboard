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
import {
  ChevronRight,
  EyeClosedIcon,
  EyeIcon,
  LockKeyhole,
  MailIcon,
  User2,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { authClient } from "@/utils/auth-client";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useTicker } from "@/hooks/use-ticker";
import { useAuthStore } from "@/stores/auth-store";

const signUpSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters required."),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Minimum 8 charcters required.")
    .max(128, "Can not be more than 128 characters."),
});

/** Return the current path according to the sign-up catch-all route */
function useSignUpPathname() {
  const params = useParams<{ "sign-up"?: string[] }>();

  return `/${params["sign-up"]?.join("/") ?? ""}`;
}

/** Helper to get the full sign-up path with base prefix */
function getSignUpPath(path: string) {
  return `/sign-up${path}`;
}

export function SignUp() {
  const pathname = useSignUpPathname();

  switch (pathname) {
    case "/":
      return <SignUpForm />;

    case "/verfication":
      return null;

    default:
      notFound();
  }
}

function SignUpForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    await authClient.signUp.email({
      ...values,
      fetchOptions: {
        onSuccess() {
          router.push(getSignUpPath("/email-otp"));
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

// function EmailOTPForm({
//   email,
//   onBack,
// }: {
//   email: string;
//   onBack: () => void;
// }) {
//   const form = useForm({
//     resolver: zodResolver(otpSchema),
//     defaultValues: {
//       otp: "",
//     },
//   });
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { time, restart, isCounting } = useTicker();
//   const [isResending, setIsResending] = React.useState(false);
//   const { isVerifying, setIsVerifying, reset } = useAuthStore();

//   const inviteToken = searchParams.get("invite");

//   async function onSubmit(values: z.infer<typeof otpSchema>) {
//     setIsVerifying(true);
//     await authClient.signUp.email({
//       email: email,
//       name:,
//       fetchOptions: {
//         onError(context) {
//           form.setError("root", {
//             message: context.error.message,
//           });
//         },
//         onSuccess() {
//           reset();
//           // Redirect to accept invite page if invite token exists
//           if (inviteToken) {
//             router.push(`/accept-invite/${inviteToken}`);
//           } else {
//             router.push("/");
//           }
//         },
//       },
//     });
//     setIsVerifying(false);
//   }

//   async function resendCode() {
//     setIsResending(true);
//     await authClient.emailOtp.sendVerificationOtp({
//       email,
//       type: "email-verification",
//       fetchOptions: {
//         onSuccess() {
//           form.setError("root", {
//             message: "Verification code sent! Check your email.",
//           });
//           /** Restart the  */
//           restart();
//         },
//         onError(context) {
//           form.setError("root", { message: context.error.message });
//         },
//       },
//     });

//     setIsResending(false);
//   }

//   return (
//     <Card className="mb-28 min-w-sm border-none shadow-none">
//       <CardHeader className="items-center justify-center">
//         <Image
//           src={"/tascboard.svg"}
//           alt="Tascboard logo"
//           width={40}
//           height={40}
//           className="mx-auto my-3.5"
//         />
//         <CardTitle className="text-center">Verify your Email</CardTitle>
//         <CardDescription className="text-center">
//           We sent a 6-digit code to <strong>{email}</strong>
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form className="grid gap-3.5" onSubmit={form.handleSubmit(onSubmit)}>
//             {form.formState.errors.root && (
//               <span
//                 className={`text-center text-sm ${
//                   form.formState.errors.root.message?.includes("sent")
//                     ? "text-green-600"
//                     : "text-destructive"
//                 }`}
//               >
//                 {form.formState.errors.root.message}
//               </span>
//             )}
//             <FormField
//               control={form.control}
//               name="otp"
//               render={({ field }) => (
//                 <FormItem className="justify-center">
//                   <FormControl>
//                     <InputOTP {...field} maxLength={6}>
//                       <InputOTPGroup className="[&_div]:data-[slot=input-otp-slot]:size-11">
//                         <InputOTPSlot index={0} />
//                         <InputOTPSlot index={1} />
//                         <InputOTPSlot index={2} />
//                         <InputOTPSlot index={3} />
//                         <InputOTPSlot index={4} />
//                         <InputOTPSlot index={5} />
//                       </InputOTPGroup>
//                     </InputOTP>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <span className="text-center text-sm">
//               {"Didn't recieve a code?"}{" "}
//               <Button
//                 onClick={() => resendCode()}
//                 variant={"link"}
//                 disabled={isCounting || isResending}
//                 className="text-primary px-0.5 text-sm"
//                 type="button"
//               >
//                 {isCounting ? (
//                   `Resend (in ${time}s)`
//                 ) : (
//                   <>{isResending ? "Resending..." : "Resend"}</>
//                 )}
//               </Button>
//             </span>
//             <Button
//               className="group"
//               size={"lg"}
//               disabled={form.formState.isSubmitting || isVerifying}
//             >
//               {isVerifying ? "Verifying..." : "Verify"}
//               <ChevronRight className="transition-all duration-200 group-hover:translate-x-0.5" />
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//       <CardFooter className="flex flex-col gap-2">
//         <Button
//           variant="ghost"
//           size={"lg"}
//           onClick={() => {
//             onBack();
//             router.replace(getSignUpPath("/"));
//           }}
//           className="text-muted-foreground w-full"
//         >
//           Cancel
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }
