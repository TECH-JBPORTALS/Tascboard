import { auth } from "@/utils/auth";
import { protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { invitation, user } from "@/server/db/auth-schema";

export const betterAuthRouter = {
  getInvitaions: protectedProcedure.query(({ ctx }) =>
    auth.api.listInvitations({ headers: ctx.headers }),
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
      ctx.db.query.user.findFirst({ where: eq(user.email, input.email) }),
    ),
};
