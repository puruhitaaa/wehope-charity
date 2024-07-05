import {
  getCauseById,
  getRecentCauses,
  getCauses,
  getAllCauses,
} from "@/lib/api/causes/queries";
import { publicProcedure, protectedProcedure, router } from "@/lib/server/trpc";
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
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getCausesParams = z.object({
  limit: z.number().min(1).max(50).nullish(),
  cursor: z.string().nullish(),
  categoryId: z.string().min(1).optional(),
  sortDate: z.enum(["asc", "desc"]).optional(),
  skip: z.number().optional(),
});

export const causesRouter = router({
  getRecentCauses: publicProcedure.query(async () => {
    return getRecentCauses();
  }),
  getAllCauses: protectedProcedure.query(async () => {
    const { sessionClaims } = auth();

    if (
      sessionClaims?.metadata.role !== "admin" &&
      sessionClaims?.metadata.role !== "volunteer"
    ) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return getAllCauses();
  }),
  getCauses: publicProcedure.input(getCausesParams).query(async ({ input }) => {
    const { skip, categoryId, sortDate, cursor } = input;

    const limit = input.limit ?? 9;
    return getCauses({ skip, categoryId, sortDate, cursor, limit });
  }),
  getCauseById: publicProcedure
    .input(causeIdSchema)
    .query(async ({ input }) => {
      return getCauseById(input.id);
    }),
  createCause: protectedProcedure
    .input(insertCauseParams)
    .mutation(async ({ input }) => {
      const { sessionClaims } = auth();

      if (
        sessionClaims?.metadata.role !== "admin" &&
        sessionClaims?.metadata.role !== "volunteer"
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return createCause(input);
    }),
  updateCause: protectedProcedure
    .input(updateCauseParams)
    .mutation(async ({ input }) => {
      const { sessionClaims } = auth();

      if (
        sessionClaims?.metadata.role !== "admin" &&
        sessionClaims?.metadata.role !== "volunteer"
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return updateCause(input.id, input);
    }),
  deleteCause: protectedProcedure
    .input(causeIdSchema)
    .mutation(async ({ input }) => {
      return deleteCause(input.id);
    }),
});
