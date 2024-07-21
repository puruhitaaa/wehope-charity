import * as z from "zod"
import { CompleteCause, relatedCauseSchema, CompleteLike, relatedLikeSchema } from "./index"

export const commentSchema = z.object({
  id: z.string(),
  content: z.string(),
  userId: z.string(),
  causeId: z.string().nullish(),
  referenceId: z.string().nullish(),
  parentId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteComment extends z.infer<typeof commentSchema> {
  cause?: CompleteCause | null
  likes: CompleteLike[]
  reference?: CompleteComment | null
  references: CompleteComment[]
  parent?: CompleteComment | null
  replies: CompleteComment[]
}

/**
 * relatedCommentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCommentSchema: z.ZodSchema<CompleteComment> = z.lazy(() => commentSchema.extend({
  cause: relatedCauseSchema.nullish(),
  likes: relatedLikeSchema.array(),
  reference: relatedCommentSchema.nullish(),
  references: relatedCommentSchema.array(),
  parent: relatedCommentSchema.nullish(),
  replies: relatedCommentSchema.array(),
}))
