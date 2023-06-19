import { Predictions } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type GetAllWhereClause = {
  symbol?: string;
  interval?: string;
};

export const predictionsRouter = createTRPCRouter({
  getLatestForInterval: publicProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
        symbol: z.string().optional(),
        interval: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const whereClause: GetAllWhereClause = {};

      if (input.symbol) {
        whereClause.symbol = input.symbol;
      }

      if (input.interval) {
        whereClause.interval = input.interval;
      }

      const allPredictions = await ctx.prisma.predictions.findMany({
        where: whereClause,
        orderBy: [{ openTimestamp: "desc" }, { updatedAt: "desc" }],
      });

      const latestPredictionsMap = new Map<string, Predictions>();

      for (const prediction of allPredictions) {
        const key = `${prediction.symbol}-${prediction.openTimestamp}-${prediction.interval}`;

        if (
          !latestPredictionsMap.has(key) ||
          (latestPredictionsMap.has(key) &&
            (latestPredictionsMap.get(key)?.updatedAt.getTime() ?? 0) <
              prediction.updatedAt.getTime())
        ) {
          latestPredictionsMap.set(key, prediction);
        }
      }

      const latestPredictions = Array.from(latestPredictionsMap.values());

      return latestPredictions.slice(input.skip, input.skip + input.take);
    }),
  getAll: publicProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
        symbol: z.string().optional(),
        interval: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const whereClause: GetAllWhereClause = {};

      if (input.symbol) {
        whereClause.symbol = input.symbol;
      }

      if (input.interval) {
        whereClause.interval = input.interval;
      }

      return ctx.prisma.predictions.findMany({
        where: whereClause,
        orderBy: [{ openTimestamp: "desc" }, { updatedAt: "desc" }],
        skip: input.skip,
        take: input.take,
      });
    }),
});
