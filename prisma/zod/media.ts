import * as z from "zod"
import { MediaType } from "@prisma/client"
import { CompleteCause, relatedCauseSchema, CompleteApproval, relatedApprovalSchema, CompleteCertificate, relatedCertificateSchema, CompleteArticle, relatedArticleSchema } from "./index"

export const mediaSchema = z.object({
  key: z.string(),
  url: z.string(),
  type: z.nativeEnum(MediaType),
  userId: z.string().nullish(),
  causeId: z.string().nullish(),
  approvalId: z.string().nullish(),
  certificateId: z.string().nullish(),
  articleId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteMedia extends z.infer<typeof mediaSchema> {
  cause?: CompleteCause | null
  approval?: CompleteApproval | null
  certificate?: CompleteCertificate | null
  article?: CompleteArticle | null
}

/**
 * relatedMediaSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMediaSchema: z.ZodSchema<CompleteMedia> = z.lazy(() => mediaSchema.extend({
  cause: relatedCauseSchema.nullish(),
  approval: relatedApprovalSchema.nullish(),
  certificate: relatedCertificateSchema.nullish(),
  article: relatedArticleSchema.nullish(),
}))
