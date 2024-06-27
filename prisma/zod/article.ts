import * as z from "zod"
import { CompleteCategory, relatedCategorySchema, CompleteMedia, relatedMediaSchema, CompleteCause, relatedCauseSchema } from "./index"

export const articleSchema = z.object({
  id: z.string(),
  categoryId: z.string().nullish(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  coverImageId: z.string().nullish(),
  isPublished: z.boolean().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteArticle extends z.infer<typeof articleSchema> {
  category?: CompleteCategory | null
  coverImage?: CompleteMedia | null
  causes: CompleteCause[]
}

/**
 * relatedArticleSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedArticleSchema: z.ZodSchema<CompleteArticle> = z.lazy(() => articleSchema.extend({
  category: relatedCategorySchema.nullish(),
  coverImage: relatedMediaSchema.nullish(),
  causes: relatedCauseSchema.array(),
}))
