import {
  getArticleById,
  getRecentArticles,
  getArticles,
} from "@/lib/api/articles/queries";
import { publicProcedure, protectedProcedure, router } from "@/lib/server/trpc";
import {
  articleIdSchema,
  insertArticleParams,
  updateArticleParams,
} from "@/lib/db/schema/articles";
// import {
//   createArticle,
//   deleteArticle,
//   updateArticle,
// } from "@/lib/api/articles/mutations";
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getArticlesParams = z.object({
  limit: z.number().min(1).max(50).nullish(),
  cursor: z.string().nullish(),
  categoryId: z.string().min(1).optional(),
  sortDate: z.enum(["asc", "desc"]).optional(),
  skip: z.number().optional(),
});

export const articlesRouter = router({
  getRecentArticles: publicProcedure.query(async () => {
    return getRecentArticles();
  }),
  getArticles: publicProcedure
    .input(getArticlesParams)
    .query(async ({ input }) => {
      const { skip, categoryId, sortDate, cursor } = input;

      const limit = input.limit ?? 9;

      return getArticles({ skip, categoryId, sortDate, cursor, limit });
    }),
  getArticleById: publicProcedure
    .input(articleIdSchema)
    .query(async ({ input }) => {
      return getArticleById(input.id);
    }),
  // createArticle: protectedProcedure
  //   .input(insertArticleParams)
  //   .mutation(async ({ input }) => {
  //     const { sessionClaims } = auth();

  //     if (
  //       sessionClaims?.metadata.role !== "admin" &&
  //       sessionClaims?.metadata.role !== "volunteer"
  //     ) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }

  //     return createArticle(input);
  //   }),
  // updateArticle: protectedProcedure
  //   .input(updateArticleParams)
  //   .mutation(async ({ input }) => {
  //     const { sessionClaims } = auth();

  //     if (
  //       sessionClaims?.metadata.role !== "admin" &&
  //       sessionClaims?.metadata.role !== "volunteer"
  //     ) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }

  //     return updateArticle(input.id, input);
  //   }),
  // deleteArticle: protectedProcedure
  //   .input(articleIdSchema)
  //   .mutation(async ({ input }) => {
  //     return deleteArticle(input.id);
  //   }),
});
