import { z } from "zod/v4";
import { hasPermissionMiddleware, organizationProcedure } from "../trpc";
import {
  track,
  trackMember,
  CreateTrackSchema,
  UpdateTrackSchema,
  boardMember,
} from "@/server/db/schema";
import { and, eq, getTableColumns } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const trackRouter = {
  create: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { track: ["create"] } },
        "You don't have permission to create track",
      ),
    )
    .input(CreateTrackSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // 1. Check user is part of the board members list before proceeding to create the track
        const _boardMember = await tx.query.boardMember
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

        if (!_boardMember)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to create track, because your not a member of the board`,
          });

        // 2. Create track
        const createdtrack = await tx
          .insert(track)
          .values(input)
          .returning()
          .then((r) => r[0]);

        if (!createdtrack)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create track",
          });

        // 3. Make the user as creator of the track and and remaining members
        const creator: typeof trackMember.$inferInsert = {
          userId: ctx.auth.user.id,
          trackId: createdtrack.id,
          role: "creator",
        };

        const initialMembers: (typeof trackMember.$inferInsert)[] =
          input.membersUserIds.map((userId) => ({
            trackId: createdtrack.id,
            userId,
          }));

        await tx.insert(trackMember).values([creator, ...initialMembers]);

        return createdtrack;
      });
    }),

  update: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { track: ["update"] } },
        "You don't have permission to update track details",
      ),
    )
    .input(UpdateTrackSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(track)
        .set(input)
        .where(eq(track.id, input.id))
        .returning();
    }),

  delete: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { track: ["delete"] } },
        "You don't have permission to delete track",
      ),
    )
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(track).where(eq(track.id, input.id));
    }),

  list: organizationProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({ track: getTableColumns(track) })
        .from(track)
        .innerJoin(
          trackMember,
          and(
            eq(trackMember.trackId, track.id),
            eq(trackMember.userId, ctx.auth.session.userId),
          ),
        )
        .where(eq(track.boardId, input.boardId))
        .then((r) => r.map((r) => r.track));
    }),

  getById: organizationProcedure
    .input(z.object({ trackId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.track
        .findFirst({
          where: eq(track.id, input.trackId),
          with: {
            trackMembers: {
              columns: {
                id: true,
                userId: true,
              },
              with: {
                user: true,
              },
            },
          },
        })
        .then((r) => ({
          ...r,
          trackMembersUserIds: r?.trackMembers.map((v) => v.userId),
        })),
    ),
};
