import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth.js";
import {
  inferAdditionalFields,
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins";
import { employee, owner, ac } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
    organizationClient({
      ac,
      roles: {
        owner,
        employee,
      },
    }),
  ],
});
