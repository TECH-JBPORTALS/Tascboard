import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import {
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
  inferOrgAdditionalFields,
} from "better-auth/client/plugins";
import { employee, owner, ac } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
      ac,
      roles: {
        owner,
        employee,
      },
    }),
  ],
});
