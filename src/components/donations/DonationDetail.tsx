"use client";

import { trpc } from "@/lib/trpc/client";
import { Progress } from "../ui/progress";
import { currencyFormat, ny } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { formatDistance } from "date-fns";
import InfiniteScroll from "../InfiniteScroll";
import { Loader2, MessageCircleMore } from "lucide-react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import LikeButton from "../comments/LikeButton";

type TDonationDetailProps = {
  id: string;
};

function DonationDetail({ id }: TDonationDetailProps) {
  const [isTruncated, setIsTruncated] = useState(true);
  const [page, setPage] = useState(0);
  const { data: cause, isLoading: isLoadingCause } =
    trpc.causes.getCauseById.useQuery({ id });
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingComments,
  } = trpc.comments.getComments.useInfiniteQuery(
    {
      limit: 9,
      causeId: id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const comments = commentsData?.pages[page]?.comments;

  const handleFetchNextPage = () => {
    fetchNextPage();
    setPage((prev) => prev + 1);
  };

  return (
    <>
      <div className="gap-3 flex flex-col lg:sticky lg:top-0">
        {!isLoadingCause ? (
          cause ? (
            <div className="h-96 w-auto relative">
              <Image
                alt={cause?.id}
                src={cause?.media[0].url}
                className="object-cover rounded-lg h-full w-full"
                fill
              />
            </div>
          ) : null
        ) : (
          <Skeleton className="h-96 w-auto" />
        )}
        {!isLoadingCause ? (
          cause ? (
            <h5 className="font-semibold text-lg lg:text-2xl">{cause.title}</h5>
          ) : null
        ) : (
          <Skeleton className="w-full h-8" />
        )}
        {!isLoadingCause ? (
          cause ? (
            <>
              <div className="relative max-h-60 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary">
                <p
                  className={ny("text-muted-foreground", {
                    truncate: isTruncated,
                  })}
                >
                  {cause?.description}
                </p>
                {isTruncated ? (
                  <button
                    className="absolute block right-0 text-primary inset-y-0 bg-gradient-to-r from-background/90 to-background px-4"
                    onClick={() => setIsTruncated(!isTruncated)}
                  >
                    ...more
                  </button>
                ) : null}
              </div>
              {!isTruncated ? (
                <Badge className="w-fit">{cause?.category.name}</Badge>
              ) : null}
              {!isTruncated ? (
                <button
                  className="text-primary inset-y-0 border border-primary rounded-lg bg-gradient-to-r from-background/90 to-background px-4 py-2"
                  onClick={() => setIsTruncated(!isTruncated)}
                >
                  less
                </button>
              ) : null}
            </>
          ) : null
        ) : (
          <Skeleton className="h-6 w-full" />
        )}

        {!isLoadingCause ? (
          cause ? (
            <Progress value={cause.ratio} />
          ) : null
        ) : (
          <Skeleton className="h-4 w-full" />
        )}

        <div className="flex flex-col 2xl:items-center 2xl:flex-row 2xl:justify-between 2xl:gap-3 gap-1.5">
          <div>
            {!isLoadingCause ? (
              cause ? (
                <>
                  <p>Reached</p>{" "}
                </>
              ) : null
            ) : (
              <Skeleton className="h-5 w-full" />
            )}
            {!isLoadingCause ? (
              cause ? (
                <div className="flex sm:items-center flex-col sm:flex-row gap-1.5">
                  <span className="flex items-center gap-1.5">
                    <p className="font-semibold text-primary truncate">
                      {currencyFormat(cause.donationSum)}
                    </p>
                    /
                  </span>
                  <p className="font-semibold truncate">
                    {currencyFormat(cause.targetAmount)}
                  </p>
                </div>
              ) : null
            ) : (
              <Skeleton className="h-6 w-full" />
            )}
          </div>

          {!isLoadingCause ? (
            cause ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>Donate</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Donate to this cause</p>
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null
          ) : (
            <Skeleton className="w-20 h-10" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:overflow-y-auto lg:scrollbar-thin lg:scrollbar-track-transparent lg:scrollbar-thumb-primary">
        {!isLoadingComments ? (
          <h5 className="font-semibold text-lg lg:text-2xl">Comments</h5>
        ) : (
          <Skeleton className="w-32 h-8" />
        )}
        {!isLoadingComments ? (
          comments?.length ? (
            comments.map((comment) => (
              <div
                className="flex flex-col gap-3 dark:shadow-none shadow rounded-xl p-4 overflow-y-auto"
                key={comment.id}
              >
                <div className="flex gap-1.5">
                  <div className="w-8 h-8 relative">
                    <Image
                      alt={comment.userId}
                      className="object-cover rounded-full"
                      src={comment.user?.imageUrl!}
                      fill
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <h6>{comment.user?.name}</h6>
                    <p className="text-muted-foreground text-sm">
                      {formatDistance(comment.createdAt, new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary">
                  <p>{comment.content}</p>
                </div>

                <div className="gap-1.5 flex flex-col">
                  <p className="text-muted-foreground text-sm">
                    {comment._count.likes} like
                    {comment._count.likes > 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-3">
                    <LikeButton comment={comment} />

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MessageCircleMore className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reply Comment</p>
                          <TooltipArrow />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))
          ) : null
        ) : (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((v) => (
              <Skeleton className="w-full h-44" key={v} />
            ))}
          </div>
        )}
        <InfiniteScroll
          hasMore={hasNextPage ?? false}
          isLoading={isLoadingComments}
          next={handleFetchNextPage}
          threshold={1}
        >
          {hasNextPage && (
            <Loader2 className="my-4 h-8 w-8 animate-spin bg-foreground" />
          )}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default DonationDetail;
