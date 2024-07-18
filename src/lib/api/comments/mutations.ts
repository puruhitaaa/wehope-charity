import { db } from "@/lib/db/index";
import {
  CommentId,
  commentIdSchema,
  insertCommentParams,
} from "@/lib/db/schema/comments";
import { ratelimit } from "@/lib/rate-limit";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createComment = async (
  comment: z.infer<typeof insertCommentParams>
) => {
  const newComment = insertCommentParams.parse(comment);
  try {
    const { success } = await ratelimit.limit(newComment.userId);

    if (!success)
      throw new TRPCError({
        message: "Rate limit exceeded",
        code: "TOO_MANY_REQUESTS",
      });

    const res: {
      isProfanity: boolean;
      score: number;
      flaggedFor?: string[];
    } = (await (
      await fetch("https://vector.profanity.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newComment.content }),
      })
    ).json()) as {
      isProfanity: boolean;
      score: number;
      flaggedFor?: string[];
    };

    if (res.isProfanity)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Message contains profanity!",
      });
    const c = await db.comment.create({ data: newComment });
    return c;
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteComment = async (id: CommentId) => {
  const { id: commentId } = commentIdSchema.parse({ id });
  try {
    const c = await db.comment.delete({ where: { id: commentId } });
    return { comment: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
