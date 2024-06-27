import * as z from "zod"
import { CompleteDiscussion, relatedDiscussionSchema } from "./index"

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  discussionId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteMessage extends z.infer<typeof messageSchema> {
  discussion?: CompleteDiscussion | null
}

/**
 * relatedMessageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMessageSchema: z.ZodSchema<CompleteMessage> = z.lazy(() => messageSchema.extend({
  discussion: relatedDiscussionSchema.nullish(),
}))
