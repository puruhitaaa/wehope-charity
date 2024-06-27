import { db } from "@/lib/db/index";
import { type CauseId, causeIdSchema } from "@/lib/db/schema/causes";

export const getRecentCauses = async () => {
  const c = await db.cause.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      targetAmount: true,
      createdAt: true,
      media: { select: { id: true, url: true } },
      category: { select: { id: true, name: true } },
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

  return causesWithDonationSum;
};

export const getCauses = async () => {
  const c = await db.cause.findMany({
    include: { media: true, category: true },
  });
  return c;
};

export const getCauseById = async (id: CauseId) => {
  const { id: causeId } = causeIdSchema.parse({ id });
  const c = await db.cause.findFirst({
    where: { id: causeId },
    include: { media: true, category: true },
  });
  return { cause: c };
};
