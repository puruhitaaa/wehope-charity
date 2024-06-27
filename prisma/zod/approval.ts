import * as z from "zod"
import { ApprovalStatus } from "@prisma/client"
import { CompleteCause, relatedCauseSchema, CompleteVolunteer, relatedVolunteerSchema, CompleteMedia, relatedMediaSchema, CompleteDiscussion, relatedDiscussionSchema } from "./index"

export const approvalSchema = z.object({
  id: z.string(),
  approverId: z.string(),
  requesterId: z.string(),
  causeId: z.string().nullish(),
  volunteerId: z.string().nullish(),
  status: z.nativeEnum(ApprovalStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteApproval extends z.infer<typeof approvalSchema> {
  cause?: CompleteCause | null
  volunteer?: CompleteVolunteer | null
  media: CompleteMedia[]
  discussions: CompleteDiscussion[]
}

/**
 * relatedApprovalSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedApprovalSchema: z.ZodSchema<CompleteApproval> = z.lazy(() => approvalSchema.extend({
  cause: relatedCauseSchema.nullish(),
  volunteer: relatedVolunteerSchema.nullish(),
  media: relatedMediaSchema.array(),
  discussions: relatedDiscussionSchema.array(),
}))
