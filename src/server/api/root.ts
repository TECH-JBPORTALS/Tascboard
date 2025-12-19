import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { betterAuthRouter } from "./rooters/better-auth";
import { boardRouter } from "./rooters/board";
import { boardMemberRouter } from "./rooters/board-member";
import { trackRouter } from "./rooters/track";
import { memberRouter } from "./rooters/members";
import { tascRouter } from "./rooters/tasc";
import { trackMemberRouter } from "./rooters/track-member";
import { tascMemberRouter } from "./rooters/tasc-member";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  betterAuth: betterAuthRouter,
  board: boardRouter,
  boardMember: boardMemberRouter,
  track: trackRouter,
  trackMember: trackMemberRouter,
  member: memberRouter,
  tasc: tascRouter,
  tascMember: tascMemberRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
