import { tascActivity, tascMember } from "@/server/db/schema";
import { hasPermissionMiddleware, organizationProcedure } from "../trpc";

import { z } from "zod/v4";
import { and, eq } from "drizzle-orm";

export const tascMemberRouter = {
  add: organizationProcedure
    .use(hasPermissionMiddleware({ permission: { tasc: ["update"] } }))
    .input(z.object({ userId: z.string().min(1), tascId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        await tx.insert(tascMember).values(input).returning();
        await tx.insert(tascActivity).values({
          tascId: input.tascId,
          performedBy: ctx.auth.session.userId,
          reason: {
            action: "member_assigned",
            payload: { userId: input.userId },
          },
        });
      });
    }),
  remove: organizationProcedure
    .use(hasPermissionMiddleware({ permission: { tasc: ["update"] } }))
    .input(z.object({ userId: z.string().min(1), tascId: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        await tx
          .delete(tascMember)
          .where(
            and(
              eq(tascMember.userId, input.userId),
              eq(tascMember.tascId, input.tascId),
            ),
          );
        await tx.insert(tascActivity).values({
          tascId: input.tascId,
          performedBy: ctx.auth.session.userId,
          reason: {
            action: "member_removed",
            payload: { userId: input.userId },
          },
        });
      });
    }),
};
