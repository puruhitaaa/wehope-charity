import * as z from "zod"
import { CompleteDonation, relatedDonationSchema } from "./index"

export const transactionSchema = z.object({
  id: z.string(),
  donationId: z.string().nullish(),
  isSuccess: z.boolean().nullish(),
})

export interface CompleteTransaction extends z.infer<typeof transactionSchema> {
  donation?: CompleteDonation | null
}

/**
 * relatedTransactionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTransactionSchema: z.ZodSchema<CompleteTransaction> = z.lazy(() => transactionSchema.extend({
  donation: relatedDonationSchema.nullish(),
}))
