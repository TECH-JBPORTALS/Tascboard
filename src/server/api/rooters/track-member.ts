import { tasc, tascMember, trackMember } from "@/server/db/schema";
import {
  hasPermissionMiddleware,
  organizationProcedure,
  protectedProcedure,
} from "../trpc";

import { z } from "zod/v4";
import { and, eq, not, or } from "drizzle-orm";

export const trackMemberRouter = {
  add: organizationProcedure
    .use(hasPermissionMiddleware({ permission: { track: ["update"] } }))
    .input(z.object({ userId: z.string().min(1), trackId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(trackMember).values(input);
    }),
  remove: organizationProcedure
    .use(hasPermissionMiddleware({ permission: { track: ["update"] } }))
    .input(z.object({ userId: z.string().min(1), trackId: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        // 1. Delete trackMember
        await tx
          .delete(trackMember)
          .where(
            and(
              eq(trackMember.userId, input.userId),
              eq(trackMember.trackId, input.trackId),
            ),
          );

        // 2 Delete trackMembers
        const tascs = await tx.query.tasc.findMany({
          where: eq(tasc.trackId, input.trackId),
        });

        const tascMemberWhereClause = tascs.map((t) =>
          and(eq(tascMember.tascId, t.id), eq(tascMember.userId, input.userId)),
        );

        await tx.delete(tascMember).where(or(...tascMemberWhereClause));
      });
    }),
  list: protectedProcedure
    .input(z.object({ trackId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.trackMember.findMany({
        where: and(
          eq(trackMember.trackId, input.trackId),
          not(eq(trackMember.userId, ctx.auth.session.userId)),
          eq(trackMember.role, "member"),
        ),
        with: {
          user: true,
        },
      });
    }),
};
