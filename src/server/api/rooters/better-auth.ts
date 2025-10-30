import { auth } from "@/utils/auth";
import { protectedProcedure } from "../trpc";

export const betterAuthRouter = {
  getInvitaions: protectedProcedure.query(({ ctx }) =>
    auth.api.listInvitations({ headers: ctx.headers }),
  ),
};
