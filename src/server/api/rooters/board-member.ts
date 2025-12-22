import {
  boardMember,
  tasc,
  tascMember,
  track,
  trackMember,
} from "@/server/db/schema";
import {
  hasPermissionMiddleware,
  organizationProcedure,
  protectedProcedure,
} from "../trpc";

import { z } from "zod/v4";
import { and, eq, not, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const boardMemberRouter = {
  add: organizationProcedure
    .use(hasPermissionMiddleware({ permission: { board: ["update"] } }))
    .input(z.object({ userId: z.string().min(1), boardId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId == ctx.auth.session.userId)
        throw new TRPCError({
          message: "You can't add yourself to the board",
          code: "BAD_REQUEST",
        });
      return await ctx.db.insert(boardMember).values(input);
    }),
  remove: organizationProcedure
    .use(hasPermissionMiddleware({ permission: { board: ["update"] } }))
    .input(z.object({ userId: z.string().min(1), boardId: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      if (input.userId == ctx.auth.session.userId)
        throw new TRPCError({
          message: "You can't remove yourself from the board",
          code: "BAD_REQUEST",
        });
      return ctx.db.transaction(async (tx) => {
        // 1. Delete boardMember
        await tx
          .delete(boardMember)
          .where(
            and(
              eq(boardMember.userId, input.userId),
              eq(boardMember.boardId, input.boardId),
            ),
          );

        // 2 Delete trackMembers
        const tracks = await tx.query.track.findMany({
          where: eq(track.boardId, input.boardId),
        });

        const trackMemberWhereClause = tracks.map((t) =>
          and(
            eq(trackMember.trackId, t.id),
            eq(trackMember.userId, input.userId),
          ),
        );

        await tx.delete(trackMember).where(or(...trackMemberWhereClause));

        // 2 Delete trackMembers
        const tascWhereClause = tracks.map((t) => eq(tasc.trackId, t.id));
        const tascs = await tx.query.tasc.findMany({
          where: or(...tascWhereClause),
        });

        const tascMemberWhereClause = tascs.map((t) =>
          and(eq(tascMember.tascId, t.id), eq(tascMember.userId, input.userId)),
        );

        await tx.delete(tascMember).where(or(...tascMemberWhereClause));
      });
    }),
  list: protectedProcedure
    .input(z.object({ boardId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.boardMember.findMany({
        where: and(
          eq(boardMember.boardId, input.boardId),
          not(eq(boardMember.userId, ctx.auth.session.userId)),
          not(eq(boardMember.role, "creator")),
        ),
        with: {
          user: true,
        },
      });
    }),
};
