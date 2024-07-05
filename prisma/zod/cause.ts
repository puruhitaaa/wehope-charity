import * as z from "zod"
import { CompleteMedia, relatedMediaSchema, CompleteCategory, relatedCategorySchema, CompleteApproval, relatedApprovalSchema, CompleteComment, relatedCommentSchema, CompleteArticle, relatedArticleSchema, CompleteDonation, relatedDonationSchema, CompleteBookmark, relatedBookmarkSchema } from "./index"

export const causeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  targetAmount: z.number(),
  categoryId: z.string(),
  isForwarded: z.boolean().nullish(),
  isPublished: z.boolean().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteCause extends z.infer<typeof causeSchema> {
  media: CompleteMedia[]
  category: CompleteCategory
  approval?: CompleteApproval | null
  comments: CompleteComment[]
  articles: CompleteArticle[]
  donations: CompleteDonation[]
  bookmarks: CompleteBookmark[]
}

/**
 * relatedCauseSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCauseSchema: z.ZodSchema<CompleteCause> = z.lazy(() => causeSchema.extend({
  media: relatedMediaSchema.array(),
  category: relatedCategorySchema,
  approval: relatedApprovalSchema.nullish(),
  comments: relatedCommentSchema.array(),
  articles: relatedArticleSchema.array(),
  donations: relatedDonationSchema.array(),
  bookmarks: relatedBookmarkSchema.array(),
}))
