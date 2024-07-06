import { likeSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";

// Schema for likes - used to validate API requests
const baseSchema = likeSchema.omit(timestamps);

export const insertLikeSchema = baseSchema;
export const insertLikeParams = baseSchema.extend({
  isLiked: z.boolean(),
});

export const updateLikeSchema = baseSchema;
export const updateLikeParams = updateLikeSchema.extend({});
export const likeCommentIdSchema = baseSchema.pick({ commentId: true });

// Types for likes - used to type API request params and within Components
export type Like = z.infer<typeof likeSchema>;
export type NewLike = z.infer<typeof insertLikeSchema>;
export type NewLikeParams = z.infer<typeof insertLikeParams>;
export type UpdateLikeParams = z.infer<typeof updateLikeParams>;
export type LikeId = z.infer<typeof likeCommentIdSchema>["commentId"];
