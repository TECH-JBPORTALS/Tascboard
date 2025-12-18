import {
  organizationProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { z } from "zod/v4";
import { and, eq, getTableColumns, ilike } from "drizzle-orm";
import { invitation, member, user } from "@/server/db/auth-schema";

export const betterAuthRouter = {
  getInvitaions: protectedProcedure.query(({ ctx }) =>
    ctx.authApi.listInvitations({ headers: ctx.headers }),
  ),

  getInvitationById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.invitation.findFirst({
        where: eq(invitation.id, input.id),
        with: { organization: true, inviter: true },
      }),
    ),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.user
        .findFirst({ where: eq(user.email, input.email) })
        .then((r) => r ?? null),
    ),

  listMembers: organizationProcedure
    .input(z.object({ q: z.string().nullable() }).optional())
    .query(({ ctx, input }) =>
      ctx.db
        .select({
          user: { ...getTableColumns(user) },
          ...getTableColumns(member),
        })
        .from(member)
        .innerJoin(
          user,
          and(
            eq(user.id, member.userId),
            eq(member.organizationId, ctx.auth.session.activeOrganizationId),
          ),
        )
        .where(input?.q ? ilike(user.email, `%${input.q}%`) : undefined),
    ),
};
