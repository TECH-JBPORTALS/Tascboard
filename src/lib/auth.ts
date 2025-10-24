import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { db } from "@/server/db";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  appName: "tascboard",
  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        // Send email with OTP
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
