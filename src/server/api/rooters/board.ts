import { z } from "zod/v4";
import { protectedProcedure } from "../trpc";
import {
  board,
  boardMember,
  CreateBoardSchema,
  UpdateBoardSchema,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const boardRouter = {
  create: protectedProcedure
    .input(CreateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(board).values(input);
    }),

  update: protectedProcedure
    .input(UpdateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(board)
        .set(input)
        .where(eq(board.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(board).where(eq(board.id, input.id));
    }),

  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.boardMember
      .findMany({
        where: eq(boardMember.userId, ctx.session.user.id),
        columns: {},
        with: {
          board: true,
        },
      })
      .then((r) => r.map((r) => r.board));
  }),
};
