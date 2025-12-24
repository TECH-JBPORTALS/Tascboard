import { z } from "zod/v4";
import { organizationProcedure } from "../trpc";
import { asc, eq } from "drizzle-orm";
import { tascActivity } from "@/server/db/schema";
import { user } from "@/server/db/auth-schema";

export const tascActivityRouter = {
  list: organizationProcedure
    .input(z.object({ tascId: z.string() }))
    .query(async ({ ctx, input }) => {
      const activities = await ctx.db.query.tascActivity.findMany({
        where: eq(tascActivity.tascId, input.tascId),
        orderBy: asc(tascActivity.createdAt),
        with: {
          performedByUser: true,
        },
      });

      return Promise.all(
        activities.map(async (activity) => {
          let assignedUser: typeof user.$inferSelect | null | undefined = null;

          if (
            activity.reason.action == "member_assigned" ||
            activity.reason.action == "member_removed"
          ) {
            const _user = await ctx.db.query.user.findFirst({
              where: eq(user.id, activity.reason.payload.userId),
            });

            assignedUser = _user;
          }

          return { ...activity, assignedUser };
        }),
      );
    }),
};
