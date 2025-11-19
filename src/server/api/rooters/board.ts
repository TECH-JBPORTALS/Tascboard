import { z } from "zod/v4";
import { protectedProcedure } from "../trpc";
import {
  board,
  boardMember,
  CreateBoardSchema,
  UpdateBoardSchema,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const boardRouter = {
  create: protectedProcedure
    .input(CreateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // 1. Create board
        const createdBoard = await tx.insert(board).values(input).returning();

        if (!createdBoard[0])
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create board",
          });

        // 2. Make the creator of the board as member of the board
        await tx.insert(boardMember).values({
          userId: ctx.auth.user.id,
          boardId: createdBoard[0].id,
        });

        return createdBoard[0];
      });
    }),

  update: protectedProcedure
    .input(UpdateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(board)
        .set(input)
        .where(eq(board.id, input.id))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(board).where(eq(board.id, input.id));
    }),

  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.boardMember
      .findMany({
        where: eq(boardMember.userId, ctx.auth.user.id),
        columns: { id: true },
        with: {
          board: true,
        },
      })
      .then((r) =>
        r.map((r) => ({
          ...r.board,
          name: !r.board.name ? "Untitled" : r.board.name,
          boardMemberId: r.id,
        })),
      );
  }),

  getById: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.board.findFirst({ where: eq(board.id, input.boardId) }),
    ),
};
