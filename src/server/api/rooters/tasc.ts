import { z } from "zod/v4";
import { and, asc, eq, ilike, not, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import {
  CreateTascSchema,
  UpdateTascSchema,
  type TascStatus,
  tasc,
  tascMember,
  trackMember,
} from "@/server/db/schema";
import { hasPermissionMiddleware, organizationProcedure } from "../trpc";

function getNextFaceId({
  lastFaceId,
  prefix,
}: {
  lastFaceId?: string | null;
  prefix: string;
}) {
  if (!lastFaceId) return `${prefix}-01`;

  const [, numPart] = lastFaceId.split("-");
  const current = Number.parseInt(numPart ?? "0", 10) || 0;
  const next = current + 1;

  return `${prefix}-${next.toString().padStart(2, "0")}`;
}

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
          columns: {
            id: true,
            trackId: true,
          },
          with: {
            track: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        });

        if (!membership) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "You must be a member of this track to create tascs for it.",
          });
        }

        const lastTasc = await tx.query.tasc.findFirst({
          where: eq(tasc.trackId, input.trackId),
          orderBy: asc(tasc.createdAt),
        });

        const faceId = getNextFaceId({
          lastFaceId: lastTasc?.faceId,
          prefix: "#",
        });

        const created = await tx
          .insert(tasc)
          .values({
            ...input,
            name: input.name ?? "Untitled",
            faceId,
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
      const [updated] = await ctx.db
        .update(tasc)
        .set({
          name: input.name,
          description: input.description,
          startDate: input.startDate,
          endDate: input.endDate,
          status: input.status,
        })
        .where(eq(tasc.id, input.id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tasc not found",
        });
      }

      return updated;
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
        id: z.string().min(1),
        status: z.custom<TascStatus>(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.tasc.findFirst({
        where: eq(tasc.id, input.id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tasc not found",
        });
      }

      const patch: Partial<(typeof tasc)["$inferInsert"]> = {
        status: input.status,
      };

      if (existing.status === "todo" && input.status === "in_progress") {
        patch.startedAt = new Date();
      }

      if (
        (existing.status === "in_progress" || existing.status === "todo") &&
        input.status === "completed"
      ) {
        patch.completedAt = new Date();
        if (!existing.startedAt) {
          patch.startedAt = existing.startedAt ?? new Date();
        }
      }

      const [updated] = await ctx.db
        .update(tasc)
        .set(patch)
        .where(eq(tasc.id, input.id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update tasc status",
        });
      }

      return updated;
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
    .query(({ ctx, input }) =>
      ctx.db.query.tasc
        .findMany({
          where: input.q
            ? and(
                eq(tasc.trackId, input.trackId),
                or(
                  ilike(tasc.name, `%${input.q}%`),
                  ilike(tasc.faceId, `%${input.q}%`),
                ),
              )
            : eq(tasc.trackId, input.trackId),
          orderBy: asc(tasc.createdAt),
          with: {
            tascMembers: {
              columns: { tascId: true, userId: true },
              where: not(eq(tascMember.userId, ctx.auth.session.userId)),
            },
          },
        })
        .then((r) =>
          r.map((t) => ({
            ...t,
            name: t.name ?? "Untitled",
            tascMemberUserIds: t.tascMembers.map((tm) => tm.userId),
          })),
        ),
    ),

  getById: organizationProcedure
    .input(z.object({ tascId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.tasc
        .findFirst({
          where: eq(tasc.id, input.tascId),
          with: {
            tascMembers: true,
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
