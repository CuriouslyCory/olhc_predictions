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
    .query(({ input, ctx }) => {
      const whereClause: GetAllWhereClause = {};

      if (input.symbol) {
        whereClause.symbol = input.symbol;
      }

      if (input.interval) {
        whereClause.interval = input.interval;
      }

      return ctx.prisma.predictions.findMany({
        take: input.take,
        skip: input.skip,
        where: whereClause,
      });
    }),
});
