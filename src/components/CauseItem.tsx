"use client";

import Image from "next/image";
import { Progress } from "./ui/progress";
import { currencyFormat } from "@/lib/utils";
import { Button } from "./ui/button";
import { RouterOutput } from "@/lib/trpc/utils";
import { Bookmark } from "lucide-react";

type TCauseItemProps = {
  cause: RouterOutput["causes"]["getRecentCauses"][number];
};

function CauseItem({ cause }: TCauseItemProps) {
  return (
    <div className="rounded-xl shadow dark:shadow-none p-4 md:p-6 flex flex-col gap-1.5 lg:gap-3 group">
      <div className="w-auto h-96 relative group overflow-hidden rounded-xl">
        <div className="absolute top-0 flex w-full lg:items-center lg:justify-between z-10">
          <button className="from-background px-4 py-1 rounded-full to-background/30 bg-gradient-to-r m-4 text-foreground font-semibold border border-background group-hover:bg-background transition-colors text-sm">
            {cause.category.name}
          </button>

          <button className="m-4 rounded-full border p-2 group-hover:bg-background text-foreground to-background/30 from-background border-background bg-gradient-to-r transition-colors">
            <Bookmark className="h-7 w-7" />
          </button>
        </div>
        <Image
          alt={cause.category.name}
          className="object-cover rounded-xl group-hover:scale-105 transition-transform ease-out"
          src={cause.media[0].url}
          fill
        />
      </div>

      <h5 className="font-semibold text-lg lg:text-2xl">{cause.title}</h5>
      <p className="text-muted-foreground">{cause.description}</p>

      <Progress value={cause.ratio} />

      <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-3 gap-1.5">
        <div>
          Reached <br />{" "}
          <div className="inline-flex gap-1.5">
            <p className="font-semibold text-primary">
              {currencyFormat(cause.donationSum)}
            </p>
            /
            <p className="font-semibold">
              {currencyFormat(cause.targetAmount)}
            </p>
          </div>
        </div>

        <Button>Donate</Button>
      </div>
    </div>
  );
}

export default CauseItem;
