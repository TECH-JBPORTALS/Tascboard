import { z } from "zod/v4";
import { hasPermissionMiddleware, organizationProcedure } from "../trpc";
import {
  board,
  boardMember,
  CreateBoardSchema,
  UpdateBoardSchema,
} from "@/server/db/schema";
import { eq, not } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const boardRouter = {
  create: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { board: ["create"] } },
        "You don't have permission to create board",
      ),
    )
    .input(CreateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // 1. Create board
        const createdBoard = await tx
          .insert(board)
          .values({
            ...input,
            organizationId: ctx.auth.session.activeOrganizationId,
          })
          .returning()
          .then((r) => r[0]);

        if (!createdBoard)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create board",
          });

        // 2. Make the user creator of the board and add initial members if there are any
        const creator: typeof boardMember.$inferInsert = {
          userId: ctx.auth.user.id,
          boardId: createdBoard.id,
          role: "creator",
        };

        const initialMembers: (typeof boardMember.$inferInsert)[] =
          input.membersUserIds.map((userId) => ({
            userId,
            boardId: createdBoard.id,
            role: "member",
          }));

        await tx.insert(boardMember).values([creator, ...initialMembers]);

        return createdBoard;
      });
    }),

  update: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { board: ["update"] } },
        "You don't have permission to update board",
      ),
    )
    .input(UpdateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(board)
        .set(input)
        .where(eq(board.id, input.id))
        .returning();
    }),

  delete: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { board: ["delete"] } },
        "You don't have permission to delete board",
      ),
    )
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(board).where(eq(board.id, input.id));
    }),

  list: organizationProcedure.query(({ ctx }) => {
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

  getById: organizationProcedure
    .input(z.object({ boardId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.board
        .findFirst({
          where: eq(board.id, input.boardId),
          with: {
            boardMembers: {
              columns: {
                id: true,
                userId: true,
              },
              where: not(eq(boardMember.userId, ctx.auth.session.userId)),
            },
          },
        })
        .then((r) => ({
          ...r,
          boardMembersUserIds: r?.boardMembers.map((v) => v.userId),
        })),
    ),
};
