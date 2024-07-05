"use client";

import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import ArticleItem from "./ArticleItem";
import { Skeleton } from "../ui/skeleton";

function Articles() {
  const { data: articles, isLoading: isLoadingArticles } =
    trpc.articles.getRecentArticles.useQuery();

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-3 lg:gap-6">
        <div className="flex flex-col gap-3 lg:gap-6">
          <h1 className="text-4xl lg:text-6xl font-semibold">Current Issues</h1>
          <p className="text-muted-foreground">
            Get to know worldwide issues to move you into making a change.
          </p>
        </div>

        {!isLoadingArticles ? (
          articles?.length && articles.length > 2 ? (
            <Link
              className={buttonVariants({
                variant: "link",
                className: "lg:self-end w-fit !px-0",
              })}
              href="/articles"
            >
              See All Articles
            </Link>
          ) : null
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
        {!isLoadingArticles ? (
          articles?.length ? (
            articles.map((article) => (
              <ArticleItem key={article.id} article={article} />
            ))
          ) : (
            <h5 className="font-semibold text-lg lg:text-2xl">
              No published articles yet.
            </h5>
          )
        ) : (
          [1, 2, 3].map((v) => (
            <Skeleton key={v} className="rounded-xl h-[36rem] w-full" />
          ))
        )}
      </div>
    </>
  );
}

export default Articles;
