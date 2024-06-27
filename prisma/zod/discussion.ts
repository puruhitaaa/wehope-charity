import * as z from "zod"
import { CompleteMessage, relatedMessageSchema, CompleteApproval, relatedApprovalSchema } from "./index"

export const discussionSchema = z.object({
  id: z.string(),
  title: z.string(),
  approvalId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteDiscussion extends z.infer<typeof discussionSchema> {
  messages: CompleteMessage[]
  approval?: CompleteApproval | null
}

/**
 * relatedDiscussionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedDiscussionSchema: z.ZodSchema<CompleteDiscussion> = z.lazy(() => discussionSchema.extend({
  messages: relatedMessageSchema.array(),
  approval: relatedApprovalSchema.nullish(),
}))
