import { createTRPCRouter } from "~/server/api/trpc";
import { predictionsRouter } from "./routers/predictions";
import { historicalDataRouter } from "./routers/historical-data";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  historicalData: historicalDataRouter,
  predictions: predictionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
