import { db } from "@/lib/db/index";
import { userIdSchema } from "@/lib/db/schema/bookmarks";
import { getBookmarksParams } from "@/lib/server/routers/bookmarks";
import { z } from "zod";

export const getBookmarks = async ({
  userId,
  categoryId,
  sortDate,
  cursor,
  limit,
  skip,
}: z.infer<typeof getBookmarksParams>) => {
  const { userId: parsedUserId } = userIdSchema.parse({ userId });
  const b = await db.bookmark.findMany({
    take: limit! + 1,
    skip: skip,
    select: {
      userId: true,
      causeId: true,
      cause: {
        select: {
          id: true,
          title: true,
          description: true,
          targetAmount: true,
          createdAt: true,
          media: { select: { key: true, url: true } },
          category: { select: { id: true, name: true } },
        },
      },
    },
    where: {
      userId: parsedUserId,
      cause: { categoryId: categoryId },
    },
    orderBy: { createdAt: sortDate ? sortDate : "desc" },
  });

  const donationSums = await db.donation.groupBy({
    by: ["causeId"],
    _sum: {
      amount: true,
    },
    where: {
      causeId: {
        in: b.map((bookmark) => bookmark.causeId),
      },
    },
  });

  const bookmarkWithDonationSum = b.map((bookmark) => {
    const donationSum =
      donationSums.find((sum) => sum.causeId === bookmark.causeId)?._sum
        .amount || 0;
    return {
      ...bookmark,
      cause: {
        ...bookmark.cause,
        donationSum,
        ratio: (donationSum / bookmark.cause.targetAmount) * 100,
      },
    };
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (bookmarkWithDonationSum.length > limit!) {
    const nextItem = bookmarkWithDonationSum.pop();
    nextCursor = nextItem?.causeId!;
  }

  if (parsedUserId) {
    return {
      bookmarks: bookmarkWithDonationSum.map((bookmark) => {
        return {
          ...bookmark,
          cause: {
            ...bookmark.cause,
            isBookmarked: b.some(
              (bookmark) => bookmark.causeId === bookmark.causeId
            ),
          },
        };
      }),
      nextCursor,
    };
  }

  return {
    bookmarks: bookmarkWithDonationSum.map((bookmark) => {
      return {
        ...bookmark,
        cause: {
          ...bookmark.cause,
          isBookmarked: b.some(
            (bookmark) => bookmark.causeId === bookmark.causeId
          ),
        },
      };
    }),
    nextCursor,
  };
};

// export const getBookmarkById = async (id: CategoryId) => {
//   const { id: categoryId } = categoryIdSchema.parse({ id });
//   const c = await db.category.findFirst({
//     where: { id: categoryId },
//     select: { id: true, name: true },
//   });
//   return { category: c };
// };
