import { db } from "@/lib/db/index";
import { type CommentId, commentIdSchema } from "@/lib/db/schema/comments";
import { z } from "zod";

import { getCommentsParams } from "@/lib/server/routers/comments";
import { TRPCError } from "@trpc/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { filteredUser } from "@/lib/utils";

export const getComments = async ({
  causeId,
  cursor,
  limit,
  skip,
}: z.infer<typeof getCommentsParams>) => {
  const { userId } = auth();

  const c = await db.comment.findMany({
    take: limit! + 1,
    skip: skip,
    select: {
      id: true,
      _count: {
        select: {
          likes: true,
        },
      },
      userId: true,
      content: true,
      createdAt: true,
    },
    orderBy: [
      { createdAt: "desc" },
      {
        id: "asc",
      },
    ],
    where: {
      causeId: causeId ? causeId : undefined,
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (c.length > limit!) {
    const nextItem = c.pop();
    nextCursor = nextItem?.id!;
  }

  const userIds = await clerkClient.users.getUserList({
    userId: c.map((a) => a.userId),
  });

  const commentsWithUsers = c.map((comment) => {
    const user = userIds.data.find((user) => user.id === comment.userId);
    if (!user) return { ...comment, user: null };

    return { ...comment, user: filteredUser(user) };
  });

  if (userId) {
    const likes = await db.like.findMany({
      where: {
        userId: userId,
        commentId: {
          in: commentsWithUsers.map((comment) => comment.id),
        },
      },
    });
    return {
      comments: commentsWithUsers.map((comment) => {
        return {
          ...comment,
          isLiked: likes.some((like) => like.commentId === comment.id),
        };
      }),
      nextCursor,
    };
  }

  return {
    comments: commentsWithUsers.map((comment) => {
      return { ...comment, isLiked: false };
    }),
    nextCursor,
  };
};

export const getCommentById = async (id: CommentId) => {
  const { id: commentId } = commentIdSchema.parse({ id });
  const c = await db.comment.findFirst({
    where: { id: commentId },
    select: {
      id: true,
      _count: {
        select: {
          likes: true,
        },
      },
      content: true,
      createdAt: true,
    },
  });

  if (!c) throw new TRPCError({ code: "NOT_FOUND" });

  return c;
};
