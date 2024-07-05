import * as z from "zod"
import { CompleteCause, relatedCauseSchema } from "./index"

export const bookmarkSchema = z.object({
  causeId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteBookmark extends z.infer<typeof bookmarkSchema> {
  cause: CompleteCause
}

/**
 * relatedBookmarkSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedBookmarkSchema: z.ZodSchema<CompleteBookmark> = z.lazy(() => bookmarkSchema.extend({
  cause: relatedCauseSchema,
}))
