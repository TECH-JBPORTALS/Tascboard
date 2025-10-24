import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth.js";
import {
  inferAdditionalFields,
  emailOTPClient,
  adminClient,
} from "better-auth/client/plugins";

if (!process.env.BETTER_AUTH_URL)
  throw new Error("No BETTER_AUTH_URL defined in .env file");

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
    adminClient(),
  ],
});
