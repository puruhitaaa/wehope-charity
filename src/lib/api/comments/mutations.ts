import { db } from "@/lib/db/index";
import {
  CommentId,
  commentIdSchema,
  insertCommentParams,
} from "@/lib/db/schema/comments";
import { z } from "zod";

export const createComment = async (
  comment: z.infer<typeof insertCommentParams>
) => {
  const newComment = insertCommentParams.parse(comment);
  try {
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
