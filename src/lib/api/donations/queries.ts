import { db } from "@/lib/db/index";
import { type DonationId, donationIdSchema } from "@/lib/db/schema/donations";

export const getDonations = async () => {
  const d = await db.donation.findMany({
    select: {
      id: true,
      amount: true,
      causeId: true,
      transactionId: true,
      isAnonymous: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return d;
};

export const getDonationById = async (id: DonationId) => {
  const { id: donationId } = donationIdSchema.parse({ id });
  const d = await db.donation.findFirst({
    where: { id: donationId },
    select: {
      id: true,
      amount: true,
      causeId: true,
      transactionId: true,
      isAnonymous: true,
      createdAt: true,
    },
  });
  return { donation: d };
};
