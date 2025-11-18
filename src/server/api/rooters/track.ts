import { z } from "zod/v4";
import { protectedProcedure } from "../trpc";
import {
  track,
  trackMember,
  CreateTrackSchema,
  UpdateTrackSchema,
  boardMember,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const trackRouter = {
  create: protectedProcedure
    .input(CreateTrackSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // 1. Check user is part of the board members list before proceeding to create the track
        const boardMemberId = await tx.query.boardMember
          .findFirst({
            where: and(
              eq(boardMember.boardId, input.boardId),
              eq(boardMember.userId, ctx.auth.user.id),
            ),
            columns: {
              id: true,
            },
          })
          .then((r) => r?.id);

        if (!boardMemberId)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create track, because your not a member of the board`,
          });

        // 2. Create track
        const createdtrack = await tx.insert(track).values(input).returning();

        if (!createdtrack[0])
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create track",
          });

        // 3. Make the creator of the track as member of the track
        await tx.insert(trackMember).values({
          boardMemberId,
          userId: ctx.auth.user.id,
          trackId: createdtrack[0].id,
        });

        return createdtrack[0];
      });
    }),

  update: protectedProcedure
    .input(UpdateTrackSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(track)
        .set(input)
        .where(eq(track.id, input.id))
        .returning();
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(track).where(eq(track.id, input.id));
    }),

  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.trackMember
      .findMany({
        where: eq(trackMember.userId, ctx.auth.user.id),
        columns: {},
        with: {
          track: true,
        },
      })
      .then((r) =>
        r.map((r) => ({
          ...r.track,
          name: !r.track.name ? "Untitled" : r.track.name,
        })),
      );
  }),

  getById: protectedProcedure
    .input(z.object({ trackId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.track.findFirst({ where: eq(track.id, input.trackId) }),
    ),
};
