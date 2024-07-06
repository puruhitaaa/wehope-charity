import { db } from "@/lib/db/index";
import { type CauseId, causeIdSchema } from "@/lib/db/schema/causes";
import { z } from "zod";

import { getCausesParams } from "@/lib/server/routers/causes";
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const getRecentCauses = async () => {
  const { userId } = auth();
  const c = await db.cause.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      targetAmount: true,
      createdAt: true,
      media: { select: { key: true, url: true } },
      category: { select: { id: true, name: true } },
    },
    where: {
      isPublished: true,
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const donationSums = await db.donation.groupBy({
    by: ["causeId"],
    _sum: {
      amount: true,
    },
    where: {
      causeId: {
        in: c.map((cause) => cause.id),
      },
    },
  });

  const causesWithDonationSum = c.map((cause) => {
    const donationSum =
      donationSums.find((sum) => sum.causeId === cause.id)?._sum.amount || 0;
    return {
      ...cause,
      donationSum,
      ratio: (donationSum / cause.targetAmount) * 100,
    };
  });

  if (userId) {
    const bookmarks = await db.bookmark.findMany({
      where: {
        userId: userId,
        causeId: {
          in: causesWithDonationSum.map((cause) => cause.id),
        },
      },
    });
    return causesWithDonationSum.map((cause) => {
      return {
        ...cause,
        isBookmarked: bookmarks.some(
          (bookmark) => bookmark.causeId === cause.id
        ),
      };
    });
  }

  return causesWithDonationSum.map((cause) => {
    return {
      ...cause,
      isBookmarked: false,
    };
  });
};

export const getAllCauses = async () => {
  const c = await db.cause.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      media: { select: { key: true, url: true } },
      category: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return c;
};

export const getCauses = async ({
  categoryId,
  sortDate,
  cursor,
  limit,
  skip,
}: z.infer<typeof getCausesParams>) => {
  const { userId } = auth();

  const c = await db.cause.findMany({
    take: limit! + 1,
    skip: skip,
    select: {
      id: true,
      title: true,
      description: true,
      targetAmount: true,
      createdAt: true,
      media: { select: { key: true, url: true } },
      category: { select: { id: true, name: true } },
    },
    orderBy: [
      { createdAt: sortDate ? sortDate : "desc" },
      {
        id: "asc",
      },
    ],
    where: {
      categoryId: categoryId ? categoryId : undefined,
      isPublished: true,
    },
  });

  const donationSums = await db.donation.groupBy({
    by: ["causeId"],
    _sum: {
      amount: true,
    },
    where: {
      causeId: {
        in: c.map((cause) => cause.id),
      },
    },
  });

  const causesWithDonationSum = c.map((cause) => {
    const donationSum =
      donationSums.find((sum) => sum.causeId === cause.id)?._sum.amount || 0;
    return {
      ...cause,
      donationSum,
      ratio: (donationSum / cause.targetAmount) * 100,
    };
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (causesWithDonationSum.length > limit!) {
    const nextItem = causesWithDonationSum.pop();
    nextCursor = nextItem?.id!;
  }

  if (userId) {
    const bookmarks = await db.bookmark.findMany({
      where: {
        userId: userId,
        causeId: {
          in: causesWithDonationSum.map((cause) => cause.id),
        },
      },
    });
    return {
      causes: causesWithDonationSum.map((cause) => {
        return {
          ...cause,
          isBookmarked: bookmarks.some(
            (bookmark) => bookmark.causeId === cause.id
          ),
        };
      }),
      nextCursor,
    };
  }

  return {
    causes: causesWithDonationSum.map((cause) => {
      return {
        ...cause,
        isBookmarked: false,
      };
    }),
    nextCursor,
  };
};

export const getCauseById = async (id: CauseId) => {
  const { id: causeId } = causeIdSchema.parse({ id });
  const c = await db.cause.findFirst({
    where: { id: causeId },
    select: {
      id: true,
      title: true,
      description: true,
      targetAmount: true,
      createdAt: true,
      media: { select: { key: true, url: true } },
      category: { select: { id: true, name: true } },
    },
  });

  if (!c) throw new TRPCError({ code: "NOT_FOUND" });

  const donationSums = await db.donation.groupBy({
    by: ["causeId"],
    _sum: {
      amount: true,
    },
    where: {
      causeId: c.id,
    },
  });

  const donationSum =
    donationSums.find((sum) => sum.causeId === c.id)?._sum.amount || 0;
  const causeWithDonationSum = {
    ...c,
    donationSum,
    ratio: (donationSum / c.targetAmount) * 100,
  };

  return causeWithDonationSum;
};
