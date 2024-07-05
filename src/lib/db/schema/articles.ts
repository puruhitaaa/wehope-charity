import { articleSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getArticles } from "@/lib/api/articles/queries";

// Schema for articles - used to validate API requests
const baseSchema = articleSchema.omit(timestamps);

export const insertArticleSchema = baseSchema.omit({ id: true });
export const insertArticleParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateArticleSchema = baseSchema;
export const updateArticleParams = updateArticleSchema.extend({});
export const articleIdSchema = baseSchema.pick({ id: true });

// Types for articles - used to type API request params and within Components
export type Article = z.infer<typeof articleSchema>;
export type NewArticle = z.infer<typeof insertArticleSchema>;
export type NewArticleParams = z.infer<typeof insertArticleParams>;
export type UpdateArticleParams = z.infer<typeof updateArticleParams>;
export type ArticleId = z.infer<typeof articleIdSchema>["id"];

// this type infers the return from getArticles() - meaning it will include any joins
export type CompleteArticle = Awaited<
  ReturnType<typeof getArticles>
>["articles"][number];
