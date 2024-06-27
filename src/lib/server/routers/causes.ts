import {
  getCauseById,
  getRecentCauses,
  getCauses,
} from "@/lib/api/causes/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  causeIdSchema,
  insertCauseParams,
  updateCauseParams,
} from "@/lib/db/schema/causes";
import {
  createCause,
  deleteCause,
  updateCause,
} from "@/lib/api/causes/mutations";

export const causesRouter = router({
  getRecentCauses: publicProcedure.query(async () => {
    return getRecentCauses();
  }),
  getCauses: publicProcedure.query(async () => {
    return getCauses();
  }),
  getCauseById: publicProcedure
    .input(causeIdSchema)
    .query(async ({ input }) => {
      return getCauseById(input.id);
    }),
  createCause: publicProcedure
    .input(insertCauseParams)
    .mutation(async ({ input }) => {
      return createCause(input);
    }),
  updateCause: publicProcedure
    .input(updateCauseParams)
    .mutation(async ({ input }) => {
      return updateCause(input.id, input);
    }),
  deleteCause: publicProcedure
    .input(causeIdSchema)
    .mutation(async ({ input }) => {
      return deleteCause(input.id);
    }),
});
