import { boardMember } from "@/server/db/schema";
import { protectedProcedure } from "../trpc";

import { z } from "zod/v4";
import { and, eq } from "drizzle-orm";

export const boardMemberRouter = {
  add: protectedProcedure
    .input(z.object({ userId: z.string().min(1), boardId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(boardMember).values(input);
    }),
  remove: protectedProcedure
    .input(z.object({ userId: z.string().min(1), boardId: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(boardMember)
        .where(
          and(
            eq(boardMember.userId, input.userId),
            eq(boardMember.boardId, input.boardId),
          ),
        );
    }),
  list: protectedProcedure
    .input(z.object({ boardId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.boardMember.findMany({
        where: eq(boardMember.boardId, input.boardId),
        with: {
          user: true,
        },
      });
    }),
};
