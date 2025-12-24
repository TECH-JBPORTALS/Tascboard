import { z } from "zod/v4";
import { organizationProcedure } from "../trpc";
import { asc, eq } from "drizzle-orm";
import { tascActivity } from "@/server/db/schema";

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

      return activities.map((activity) => {
        return activity;
      });
    }),
};
