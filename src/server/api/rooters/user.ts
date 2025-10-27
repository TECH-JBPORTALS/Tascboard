import { protectedProcedure } from "../trpc";

export const userRouter = {
  get: protectedProcedure.query(({ ctx }) => ctx.session.user),
};
