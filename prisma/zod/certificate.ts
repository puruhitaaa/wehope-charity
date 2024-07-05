import * as z from "zod"
import { CompleteMedia, relatedMediaSchema, CompleteVolunteer, relatedVolunteerSchema } from "./index"

export const certificateSchema = z.object({
  id: z.string(),
  documentKey: z.string(),
  volunteerId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteCertificate extends z.infer<typeof certificateSchema> {
  document: CompleteMedia
  volunteer?: CompleteVolunteer | null
}

/**
 * relatedCertificateSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCertificateSchema: z.ZodSchema<CompleteCertificate> = z.lazy(() => certificateSchema.extend({
  document: relatedMediaSchema,
  volunteer: relatedVolunteerSchema.nullish(),
}))
