"use client";

import { trpc } from "@/lib/trpc/client";
import { Progress } from "../ui/progress";
import { currencyFormat, ny } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

type TDonationDetailProps = {
  id: string;
};

function DonationDetail({ id }: TDonationDetailProps) {
  const [isTruncated, setIsTruncated] = useState(true);
  const { data: cause, isLoading: isLoadingCause } =
    trpc.causes.getCauseById.useQuery({ id });

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="gap-3 flex flex-col">
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
              <h5 className="font-semibold text-lg lg:text-2xl">
                {cause.title}
              </h5>
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

            <Button>Donate</Button>
          </div>
        </div>

        <p>test</p>
      </div>
    </>
  );
}

export default DonationDetail;
