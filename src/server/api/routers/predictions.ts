import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type GetAllWhereClause = {
  symbol?: string;
  interval?: string;
};

export const predictionsRouter = createTRPCRouter({
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

      const allPredictions = await ctx.prisma.predictions.findMany({
        take: input.take,
        skip: input.skip,
        where: whereClause,
        orderBy: [{ openTimestamp: "desc"}, {updatedAt: "desc" }],
      });

      const latestPredictionsMap = new Map();

      for (const prediction of allPredictions) {
        const key = `${prediction.symbol}-${prediction.openTimestamp}-${prediction.interval}`;
        
        if (!latestPredictionsMap.has(key)) {
          latestPredictionsMap.set(key, prediction);
        }
      }

      const latestPredictions = Array.from(latestPredictionsMap.values());

      return latestPredictions.slice(input.skip, input.skip + input.take);
    }),
});
