import * as z from "zod"
import { CompleteCause, relatedCauseSchema, CompleteArticle, relatedArticleSchema } from "./index"

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteCategory extends z.infer<typeof categorySchema> {
  causes: CompleteCause[]
  articles: CompleteArticle[]
}

/**
 * relatedCategorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCategorySchema: z.ZodSchema<CompleteCategory> = z.lazy(() => categorySchema.extend({
  causes: relatedCauseSchema.array(),
  articles: relatedArticleSchema.array(),
}))
