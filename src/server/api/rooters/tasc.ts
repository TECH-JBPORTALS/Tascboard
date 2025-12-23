import { z } from "zod/v4";
import { and, asc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import {
  CreateTascSchema,
  UpdateTascSchema,
  type TascStatus,
  tasc,
  tascMember,
  trackMember,
  type TascPriority,
  tascActivity,
} from "@/server/db/schema";
import { hasPermissionMiddleware, organizationProcedure } from "../trpc";
import { user } from "@/server/db/auth-schema";
import { format } from "date-fns";

export const tascRouter = {
  create: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { tasc: ["create"] } },
        "You don't have permission to create tasc",
      ),
    )
    .input(CreateTascSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // Ensure user is member of the track through trackMember
        const membership = await tx.query.trackMember.findFirst({
          where: and(
            eq(trackMember.trackId, input.trackId),
            eq(trackMember.userId, ctx.auth.user.id),
          ),
        });

        if (!membership) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "You must be a member of this track to create tascs for it.",
          });
        }

        const created = await tx
          .insert(tasc)
          .values({
            ...input,
            faceId: sql<string>`COALESCE((SELECT (MAX(CAST(${tasc.faceId} AS integer)) + 1)::text FROM ${tasc} WHERE ${tasc.trackId} = ${input.trackId}),'1')`,
            createdBy: ctx.auth.session.userId,
          })
          .returning();

        const createdTasc = created[0];

        if (!createdTasc) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create tasc",
          });
        }

        const creator: typeof tascMember.$inferInsert = {
          tascId: createdTasc.id,
          userId: ctx.auth.user.id,
        };

        const initialMembers: (typeof tascMember.$inferInsert)[] =
          input.membersUserIds.map((userId) => ({
            userId,
            tascId: createdTasc.id,
          }));

        await tx.insert(tascMember).values([creator, ...initialMembers]);

        return createdTasc;
      });
    }),

  update: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { tasc: ["update"] } },
        "You don't have permission to update tasc",
      ),
    )
    .input(UpdateTascSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const existing = await tx.query.tasc.findFirst({
          where: and(
            eq(tasc.faceId, input.faceId),
            eq(tasc.trackId, input.trackId),
          ),
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tasc not found",
          });
        }

        const activityPatch: Partial<typeof tascActivity.$inferInsert> = {
          tascId: existing.id,
          performedBy: ctx.auth.session.userId,
        };

        if (
          existing.startDate !== input.startDate ||
          existing.endDate !== input.endDate
        ) {
          activityPatch.action = "due_changed";
          activityPatch.reason = `${input.startDate && format(input.startDate, "MMM, dd yyyy")}`;
        }

        const [updated] = await tx
          .update(tasc)
          .set({
            name: input.name,
            description: input.description,
            startDate: input.startDate,
            endDate: input.endDate,
          })
          .where(
            and(eq(tasc.faceId, input.faceId), eq(tasc.trackId, input.trackId)),
          )
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tasc not found",
          });
        }

        return updated;
      });
    }),

  updateStatus: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { tasc: ["update"] } },
        "You don't have permission to update tasc status",
      ),
    )
    .input(
      z.object({
        faceId: z.string().min(1),
        trackId: z.string().min(1),
        status: z.custom<TascStatus>(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const existing = await tx.query.tasc.findFirst({
          where: and(
            eq(tasc.faceId, input.faceId),
            eq(tasc.trackId, input.trackId),
          ),
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tasc not found",
          });
        }

        if (existing.status == input.status) return;

        const [updated] = await tx
          .update(tasc)
          .set({ status: input.status })
          .where(
            and(eq(tasc.faceId, input.faceId), eq(tasc.trackId, input.trackId)),
          )
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update tasc status",
          });
        }

        const [updatedActivity] = await tx
          .insert(tascActivity)
          .values({
            tascId: updated.id,
            action: "status_changed",
            performedBy: ctx.auth.session.userId,
            reason: updated.status,
          })
          .returning();

        if (!updatedActivity) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update tasc activity",
          });
        }

        return updated;
      });
    }),

  updatePriority: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { tasc: ["update"] } },
        "You don't have permission to update tasc status",
      ),
    )
    .input(
      z.object({
        faceId: z.string().min(1),
        trackId: z.string().min(1),
        priority: z.custom<TascPriority>(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const existing = await tx.query.tasc.findFirst({
          where: and(
            eq(tasc.faceId, input.faceId),
            eq(tasc.trackId, input.trackId),
          ),
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tasc not found",
          });
        }

        if (existing.priority == input.priority) return;

        const [updated] = await tx
          .update(tasc)
          .set({ priority: input.priority })
          .where(
            and(eq(tasc.faceId, input.faceId), eq(tasc.trackId, input.trackId)),
          )
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update tasc priority",
          });
        }

        const [updatedActivity] = await tx
          .insert(tascActivity)
          .values({
            tascId: updated.id,
            action: "priority_changed",
            performedBy: ctx.auth.session.userId,
            reason: updated.priority,
          })
          .returning();

        if (!updatedActivity) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update tasc activity",
          });
        }

        return updated;
      });
    }),

  delete: organizationProcedure
    .use(
      hasPermissionMiddleware(
        { permission: { tasc: ["delete"] } },
        "You don't have permission to delete tasc",
      ),
    )
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(tasc).where(eq(tasc.id, input.id));
      return { success: true };
    }),

  list: organizationProcedure
    .input(z.object({ trackId: z.string().min(1), q: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const activeMember = await ctx.authApi.getActiveMember({
        headers: ctx.headers,
      });

      const whereClause = and(
        eq(tasc.trackId, input.trackId),
        activeMember?.role == "employee"
          ? or(
              eq(tascMember.userId, ctx.auth.session.userId),
              eq(tasc.createdBy, ctx.auth.session.userId),
            )
          : undefined,
      );

      const tascs = await ctx.db
        .select({
          ...getTableColumns(tasc),
          createdByUser: getTableColumns(user),
        })
        .from(tasc)
        .leftJoin(tascMember, eq(tasc.id, tascMember.tascId))
        .innerJoin(user, eq(tasc.createdBy, user.id))
        .where(
          input.q
            ? and(
                whereClause,
                or(
                  ilike(tasc.name, `%${input.q}%`),
                  ilike(tasc.faceId, `%${input.q}%`),
                ),
              )
            : whereClause,
        )
        .orderBy(asc(tasc.createdAt))
        .groupBy(tasc.id, user.id);

      return Promise.all(
        tascs.map((tasc) =>
          ctx.db.query.tascMember
            .findMany({
              where: and(eq(tascMember.tascId, tasc.id)),
              with: {
                user: true,
              },
            })
            .then((tascMembers) => ({
              ...tasc,
              tascMembers,
              tascMemberUserIds: tascMembers.map((t) => t.userId),
            })),
        ),
      );
    }),

  getById: organizationProcedure
    .input(z.object({ faceId: z.string().min(1), trackId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.tasc
        .findFirst({
          where: and(
            eq(tasc.faceId, input.faceId),
            eq(tasc.trackId, input.trackId),
          ),
          with: {
            tascMembers: {
              with: {
                user: true,
              },
            },
            createdByUser: true,
          },
        })
        .then((r) => ({
          ...r,
          tascMembersUserIds: r?.tascMembers.map((v) => v.userId),
        }));

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tasc not found",
        });
      }

      return data;
    }),
};
