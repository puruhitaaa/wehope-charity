"use client";

import Image from "next/image";
// import { Button } from "./ui/button";
import { RouterOutput } from "@/lib/trpc/utils";
import { format } from "date-fns";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

type TArticleItemProps = {
  article:
    | RouterOutput["articles"]["getRecentArticles"][number]
    | RouterOutput["articles"]["getArticles"]["articles"][number];
};

function ArticleItem({ article }: TArticleItemProps) {
  return (
    <div className="rounded-xl shadow dark:shadow-none p-4 md:p-6 flex flex-col gap-1.5 lg:gap-3 group">
      <div className="w-auto h-96 relative group overflow-hidden rounded-xl">
        <Image
          alt={article.title}
          className="object-cover rounded-xl group-hover:scale-105 transition-transform ease-out"
          src={article.coverImage?.url ?? ""}
          fill
        />
        <Link
          className="h-full w-full absolute inset-0 m-auto bg-black/50 group-hover:flex hidden items-center justify-center"
          href={`/articles/${article.id}`}
        >
          <div
            className={buttonVariants({
              size: "lg",
            })}
          >
            Read
          </div>
        </Link>
      </div>
      <h5 className="font-semibold text-lg lg:text-2xl max-h-20 overflow-y-auto">
        {article.title}
      </h5>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-3 mt-auto">
        <div className="flex items-center lg:gap-3 gap-1.5">
          <div className="h-8 w-8 relative">
            <Image
              alt={article.authorId}
              className="object-cover rounded-full"
              src={article.author?.imageUrl!}
              fill
            />
          </div>
          <p className="font-semibold">{article.author?.name}</p>
        </div>

        <p className="text-muted-foreground">
          {format(article.createdAt.toISOString(), "MMMM dd, yyyy")}
        </p>
      </div>
    </div>
  );
}

export default ArticleItem;
