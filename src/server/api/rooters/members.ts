import { hasPermissionMiddleware, organizationProcedure } from "../trpc";

import { and, eq, not } from "drizzle-orm";
import { member } from "@/server/db/auth-schema";
import { boardMember, tascMember, trackMember } from "@/server/db/schema";
import { z } from "zod/v4";

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
  remove: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { member: ["delete"] } },
        "You don't have permission to remove employee",
      ),
    )
    .input(z.object({ memberId: z.string(), userId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        // 1. Delete tasc member
        await tx.delete(tascMember).where(eq(tascMember.userId, input.userId));

        // 2. Delete track member
        await tx
          .delete(trackMember)
          .where(eq(trackMember.userId, input.userId));

        // 3. Delete board member
        await tx
          .delete(boardMember)
          .where(eq(boardMember.userId, input.userId));

        // 4. Delete member
        await ctx.authApi.removeMember({
          body: { memberIdOrEmail: input.memberId },
          headers: ctx.headers,
        });
      });
    }),
};
