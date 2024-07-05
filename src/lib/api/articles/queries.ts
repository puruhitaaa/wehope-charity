import { db } from "@/lib/db/index";
import { type ArticleId, articleIdSchema } from "@/lib/db/schema/articles";
import { getArticlesParams } from "@/lib/server/routers/articles";
import { filteredUser } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

export const getRecentArticles = async () => {
  const ar = await db.article.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      coverImage: { select: { key: true, url: true } },
      category: { select: { id: true, name: true } },
      authorId: true,
    },
    where: {
      isPublished: true,
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const authors = await clerkClient.users.getUserList({
    userId: ar.map((a) => a.authorId),
  });

  const articlesWithAuthors = ar.map((article) => {
    const author = authors.data.find(
      (author) => author.id === article.authorId
    );
    if (!author) return { ...article, author: null };

    return { ...article, author: filteredUser(author) };
  });

  return articlesWithAuthors;
};

export const getArticles = async ({
  categoryId,
  sortDate,
  cursor,
  limit,
  skip,
}: z.infer<typeof getArticlesParams>) => {
  const a = await db.article.findMany({
    take: limit! + 1,
    skip: skip,
    select: {
      id: true,
      title: true,
      createdAt: true,
      coverImage: { select: { key: true, url: true } },
      category: { select: { id: true, name: true } },
      authorId: true,
    },
    orderBy: [
      { createdAt: sortDate ? sortDate : "desc" },
      {
        id: "asc",
      },
    ],
    where: {
      categoryId: categoryId ? categoryId : undefined,
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (a.length > limit!) {
    const nextItem = a.pop();
    nextCursor = nextItem?.id!;
  }

  const authors = await clerkClient.users.getUserList({
    userId: a.map((a) => a.authorId),
  });

  const articlesWithAuthors = a.map((article) => {
    const author = authors.data.find(
      (author) => author.id === article.authorId
    );
    if (!author) return { ...article, author: null };

    return { ...article, author: filteredUser(author) };
  });

  return {
    articles: articlesWithAuthors,
    nextCursor,
  };
};

export const getArticleById = async (id: ArticleId) => {
  const { id: articleId } = articleIdSchema.parse({ id });
  const a = await db.article.findFirst({
    where: { id: articleId },
    include: {
      coverImage: { select: { key: true, url: true } },
      category: { select: { id: true, name: true } },
    },
  });
  return { article: a };
};
