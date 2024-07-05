import { protectedProcedure, publicProcedure, router } from "@/lib/server/trpc";
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { getBookmarks } from "@/lib/api/bookmarks/queries";
import { z } from "zod";
import { insertBookmarkParams } from "@/lib/db/schema/bookmarks";
import { createBookmark } from "@/lib/api/bookmarks/mutations";

export const getBookmarksParams = z.object({
  limit: z.number().min(1).max(50).nullish(),
  userId: z.string().min(1),
  cursor: z.string().nullish(),
  categoryId: z.string().min(1).optional(),
  sortDate: z.enum(["asc", "desc"]).optional(),
  skip: z.number().optional(),
});

export const bookmarkRouter = router({
  getBookmarks: protectedProcedure
    .input(getBookmarksParams.omit({ userId: true }))
    .query(async ({ input }) => {
      const { skip, categoryId, sortDate, cursor } = input;

      const limit = input.limit ?? 9;

      const { userId } = auth();
      return getBookmarks({
        skip,
        categoryId,
        sortDate,
        cursor,
        limit,
        userId: userId!,
      });
    }),
  // getMedia: publicProcedure.query(async () => {
  //   return getMedia();
  // }),
  // getMediaById: publicProcedure
  //   .input(mediaKeySchema)
  //   .query(async ({ input }) => {
  //     return getMediaById(input.key);
  //   }),
  createBookmark: protectedProcedure
    .input(insertBookmarkParams.omit({ userId: true }))
    .mutation(async ({ input }) => {
      const { userId } = auth();
      return createBookmark({ ...input, userId: userId! });
    }),
  // updateCause: publicProcedure
  //   .input(updateCauseParams)
  //   .mutation(async ({ input }) => {
  //     return updateCause(input.id, input);
  //   }),
  // deleteMedia: protectedProcedure
  //   .input(mediaKeySchema)
  //   .mutation(async ({ input }) => {
  //     const { sessionClaims } = auth();

  //     if (
  //       sessionClaims?.metadata.role !== "admin" &&
  //       sessionClaims?.metadata.role !== "volunteer"
  //     ) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }
  //     return deleteMedia(input.key);
  //   }),
});
