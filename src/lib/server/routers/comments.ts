import {
  getCommentById,
  getComments,
  getReplies,
} from "@/lib/api/comments/queries";
import { publicProcedure, protectedProcedure, router } from "@/lib/server/trpc";
import { clientCommentParams, commentIdSchema } from "@/lib/db/schema/comments";
import { createComment, deleteComment } from "@/lib/api/comments/mutations";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

export const getCommentsParams = z.object({
  limit: z.number().min(1).max(50).nullish(),
  cursor: z.string().nullish(),
  causeId: z.string().min(1),
  parentId: z.string().min(1).optional(),
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
  getReplies: publicProcedure
    .input(getCommentsParams)
    .query(async ({ input }) => {
      const { skip, causeId, cursor, parentId } = input;

      const limit = input.limit ?? 9;
      return getReplies({
        skip,
        causeId,
        parentId,
        cursor,
        limit,
      });
    }),
  getCommentById: publicProcedure
    .input(commentIdSchema)
    .query(async ({ input }) => {
      return getCommentById(input.id);
    }),
  createComment: protectedProcedure
    .input(clientCommentParams)
    .mutation(async ({ input }) => {
      const { userId } = auth();
      return createComment({ ...input, userId: userId! });
    }),
  deleteComment: protectedProcedure
    .input(commentIdSchema)
    .mutation(async ({ input }) => {
      return deleteComment(input.id);
    }),
});
