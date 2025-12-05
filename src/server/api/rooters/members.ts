import { organizationProcedure } from "../trpc";

import { eq } from "drizzle-orm";
import { member } from "@/server/db/auth-schema";

export const memberRouter = {
  list: organizationProcedure.query(({ ctx }) => {
    return ctx.db.query.member.findMany({
      where: eq(member.organizationId, ctx.auth.session.activeOrganizationId),
      with: {
        user: true,
      },
    });
  }),
};
