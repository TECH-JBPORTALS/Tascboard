import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { env } from "@/env";

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
