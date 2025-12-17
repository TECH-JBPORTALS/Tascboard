import { organizationProcedure } from "../trpc";

import { and, eq, not } from "drizzle-orm";
import { member } from "@/server/db/auth-schema";

export const memberRouter = {
  list: organizationProcedure.query(({ ctx }) => {
    return ctx.db.query.member.findMany({
      where: and(
        eq(member.organizationId, ctx.auth.session.activeOrganizationId),
        not(eq(member.userId, ctx.auth.session.userId)),
      ),
      with: {
        user: true,
      },
    });
  }),
};
