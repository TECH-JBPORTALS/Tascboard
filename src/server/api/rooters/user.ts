import { z } from "zod/v4";
import { publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { user } from "@/server/db/auth-schema";

export const userRouter = {
  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.user.findFirst({ where: eq(user.email, input.email) }),
    ),
};
