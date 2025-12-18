import { trackMember } from "@/server/db/schema";
import {
  hasPermissionMiddleware,
  organizationProcedure,
  protectedProcedure,
} from "../trpc";

import { z } from "zod/v4";
import { and, eq, not } from "drizzle-orm";

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
      return ctx.db
        .delete(trackMember)
        .where(
          and(
            eq(trackMember.userId, input.userId),
            eq(trackMember.trackId, input.trackId),
          ),
        );
    }),
  list: protectedProcedure
    .input(z.object({ trackId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.trackMember.findMany({
        where: and(
          eq(trackMember.trackId, input.trackId),
          not(eq(trackMember.userId, ctx.auth.session.userId)),
        ),
        with: {
          user: true,
        },
      });
    }),
};
