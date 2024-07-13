import * as z from "zod"
import { CompleteComment, relatedCommentSchema } from "./index"

export const likeSchema = z.object({
  userId: z.string(),
  commentId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteLike extends z.infer<typeof likeSchema> {
  comment: CompleteComment
}

/**
 * relatedLikeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedLikeSchema: z.ZodSchema<CompleteLike> = z.lazy(() => likeSchema.extend({
  comment: relatedCommentSchema,
}))
