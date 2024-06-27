"use client";

import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CauseItem from "../CauseItem";

function Causes() {
  const { data: causes, isLoading: isLoadingCauses } =
    trpc.causes.getRecentCauses.useQuery();

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-3 lg:gap-6">
        <div className="flex flex-col gap-3 lg:gap-6">
          <h1 className="text-4xl lg:text-6xl font-semibold">
            Ongoing Donations
          </h1>
          <p className="text-muted-foreground">
            See how you can make a difference in the world for generations.
          </p>
        </div>

        {!isLoadingCauses ? (
          causes?.length && causes.length > 2 ? (
            <Link
              className={buttonVariants({
                variant: "link",
                className: "lg:self-end w-fit !px-0",
              })}
              href="/causes"
            >
              See All Donations
            </Link>
          ) : null
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
        {!isLoadingCauses
          ? causes?.length
            ? causes.map((cause) => <CauseItem key={cause.id} cause={cause} />)
            : null
          : [1, 2, 3].map((v) => (
              <Skeleton key={v} className="rounded-xl h-[36rem] w-full" />
            ))}
      </div>
    </>
  );
}

export default Causes;
