import { commentSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getComments } from "@/lib/api/comments/queries";

// Schema for comments - used to validate API requests
const baseSchema = commentSchema.omit(timestamps);

export const insertCommentSchema = baseSchema.omit({ id: true });
export const insertCommentParams = baseSchema.extend({}).omit({
  id: true,
});
export const clientCommentParams = insertCommentParams.omit({
  userId: true,
});

export const updateCommentSchema = baseSchema;
export const updateCommentParams = updateCommentSchema.extend({});
export const commentIdSchema = baseSchema.pick({ id: true });

// Types for comments - used to type API request params and within Components
export type Comment = z.infer<typeof commentSchema>;
export type NewComment = z.infer<typeof insertCommentSchema>;
export type NewCommentParams = z.infer<typeof clientCommentParams>;
export type UpdateCommentParams = z.infer<typeof updateCommentParams>;
export type CommentId = z.infer<typeof commentIdSchema>["id"];

// this type infers the return from getComments() - meaning it will include any joins
export type CompleteComment = Awaited<
  ReturnType<typeof getComments>
>["comments"][number];
