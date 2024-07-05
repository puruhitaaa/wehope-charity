import { getMediaById, getMediaRelatedToCause } from "@/lib/api/media/queries";
import { protectedProcedure, publicProcedure, router } from "@/lib/server/trpc";
import { mediaKeySchema } from "@/lib/db/schema/media";
import { causeIdSchema } from "@/lib/db/schema/causes";
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { deleteMedia } from "@/lib/api/media/mutations";

export const mediaRouter = router({
  getMediaRelatedToCause: publicProcedure
    .input(causeIdSchema)
    .query(async ({ input }) => {
      return getMediaRelatedToCause(input.id);
    }),
  // getMedia: publicProcedure.query(async () => {
  //   return getMedia();
  // }),
  getMediaById: publicProcedure
    .input(mediaKeySchema)
    .query(async ({ input }) => {
      return getMediaById(input.key);
    }),
  // createCause: publicProcedure
  //   .input(insertCauseParams)
  //   .mutation(async ({ input }) => {
  //     return createCause(input);
  //   }),
  // updateCause: publicProcedure
  //   .input(updateCauseParams)
  //   .mutation(async ({ input }) => {
  //     return updateCause(input.id, input);
  //   }),
  deleteMedia: protectedProcedure
    .input(mediaKeySchema)
    .mutation(async ({ input }) => {
      const { sessionClaims } = auth();

      if (
        sessionClaims?.metadata.role !== "admin" &&
        sessionClaims?.metadata.role !== "volunteer"
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return deleteMedia(input.key);
    }),
});
