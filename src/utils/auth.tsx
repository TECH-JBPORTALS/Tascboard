import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { env } from "@/env";
import { Resend } from "resend";
import OtpVerification from "@/emails/otp-verification";

const resend = new Resend(env.RESEND_API_KEY);

const baseURL =
  env.VERCEL_ENV === "production"
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : env.VERCEL_ENV === "preview"
      ? `https://${env.VERCEL_URL}`
      : "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  appName: "tascboard",
  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        switch (type) {
          case "sign-in":
            const subject = `Your verification code is ${otp}`;
            const { error } = await resend.emails.send({
              from: "Tascboard <send@resend.jbportals.com>",
              to: [email],
              subject,
              react: (
                <OtpVerification
                  previewText={subject}
                  otp={otp}
                  email={email}
                />
              ),
            });

            if (error)
              throw new Error(
                `Can't able to send code to this email right now`,
              );
            break;
        }
      },
    }),
    nextCookies(),
  ],
});

/** Get session in server environment */
export async function getSession() {
  const nextHeaders = await headers();
  return auth.api.getSession({ headers: nextHeaders }).then((r) => r?.session);
}
