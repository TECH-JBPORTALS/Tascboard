import { tascMember } from "@/server/db/schema";
import { protectedProcedure } from "../trpc";

import { z } from "zod/v4";
import { and, eq } from "drizzle-orm";

export const tascMemberRouter = {
  add: protectedProcedure
    .input(z.object({ userId: z.string().min(1), tascId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(tascMember).values(input);
    }),
  remove: protectedProcedure
    .input(z.object({ userId: z.string().min(1), tascId: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(tascMember)
        .where(
          and(
            eq(tascMember.userId, input.userId),
            eq(tascMember.tascId, input.tascId),
          ),
        );
    }),
};
