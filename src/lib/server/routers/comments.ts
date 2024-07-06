import { getCommentById, getComments } from "@/lib/api/comments/queries";
import { publicProcedure, protectedProcedure, router } from "@/lib/server/trpc";
import {
  commentIdSchema,
  // insertCommentParams,
  // updateCommentParams,
} from "@/lib/db/schema/comments";
import {
  // createComment,
  deleteComment,
  // updateComment,
} from "@/lib/api/comments/mutations";
import { z } from "zod";

export const getCommentsParams = z.object({
  limit: z.number().min(1).max(50).nullish(),
  cursor: z.string().nullish(),
  causeId: z.string().min(1),
  skip: z.number().optional(),
});

export const commentsRouter = router({
  getComments: publicProcedure
    .input(getCommentsParams)
    .query(async ({ input }) => {
      const { skip, causeId, cursor } = input;

      const limit = input.limit ?? 9;
      return getComments({ skip, causeId, cursor, limit });
    }),
  getCommentById: publicProcedure
    .input(commentIdSchema)
    .query(async ({ input }) => {
      return getCommentById(input.id);
    }),
  // createComment: protectedProcedure
  //   .input(insertCommentParams)
  //   .mutation(async ({ input }) => {
  //     const { sessionClaims } = auth();

  //     if (
  //       sessionClaims?.metadata.role !== "admin" &&
  //       sessionClaims?.metadata.role !== "volunteer"
  //     ) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }

  //     return createComment(input);
  //   }),
  // updateComment: protectedProcedure
  //   .input(updateCommentParams)
  //   .mutation(async ({ input }) => {
  //     const { sessionClaims } = auth();

  //     if (
  //       sessionClaims?.metadata.role !== "admin" &&
  //       sessionClaims?.metadata.role !== "volunteer"
  //     ) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }

  //     return updateComment(input.id, input);
  //   }),
  deleteComment: protectedProcedure
    .input(commentIdSchema)
    .mutation(async ({ input }) => {
      return deleteComment(input.id);
    }),
});
