import { publicProcedure, protectedProcedure, router } from "@/lib/server/trpc";
import {
  likeCommentIdSchema,
  insertLikeParams,
  updateLikeParams,
} from "@/lib/db/schema/likes";
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { toggleLike } from "@/lib/api/likes/mutations";

export const getLikesParams = z.object({
  limit: z.number().min(1).max(50).nullish(),
  cursor: z.string().nullish(),
  categoryId: z.string().min(1).optional(),
  sortDate: z.enum(["asc", "desc"]).optional(),
  skip: z.number().optional(),
});

export const likesRouter = router({
  toggleLike: protectedProcedure
    .input(insertLikeParams.omit({ userId: true }))
    .mutation(async ({ input }) => {
      const { userId } = auth();

      return toggleLike({ ...input, userId: userId! });
    }),
  // updateLike: protectedProcedure
  //   .input(updateLikeParams)
  //   .mutation(async ({ input }) => {
  //     const { sessionClaims } = auth();

  //     if (
  //       sessionClaims?.metadata.role !== "admin" &&
  //       sessionClaims?.metadata.role !== "volunteer"
  //     ) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }

  //     return updateLike(input.id, input);
  //   }),
  // deleteLike: protectedProcedure
  //   .input(likeIdSchema)
  //   .mutation(async ({ input }) => {
  //     return deleteLike(input.id);
  //   }),
});
