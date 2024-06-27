import * as z from "zod"
import { CompleteApproval, relatedApprovalSchema, CompleteCertificate, relatedCertificateSchema } from "./index"

export const volunteerSchema = z.object({
  id: z.string(),
  approvalId: z.string().nullish(),
  startDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteVolunteer extends z.infer<typeof volunteerSchema> {
  approval?: CompleteApproval | null
  certificate: CompleteCertificate[]
}

/**
 * relatedVolunteerSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedVolunteerSchema: z.ZodSchema<CompleteVolunteer> = z.lazy(() => volunteerSchema.extend({
  approval: relatedApprovalSchema.nullish(),
  certificate: relatedCertificateSchema.array(),
}))
