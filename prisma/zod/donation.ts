import * as z from "zod"
import { CompleteCause, relatedCauseSchema } from "./index"

export const donationSchema = z.object({
  id: z.string(),
  amount: z.number(),
  causeId: z.string().nullish(),
  userId: z.string(),
  isAnonymous: z.boolean().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteDonation extends z.infer<typeof donationSchema> {
  cause?: CompleteCause | null
}

/**
 * relatedDonationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedDonationSchema: z.ZodSchema<CompleteDonation> = z.lazy(() => donationSchema.extend({
  cause: relatedCauseSchema.nullish(),
}))
