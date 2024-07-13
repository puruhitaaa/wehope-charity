import { db } from "@/lib/db/index";
import { insertDonationParams } from "@/lib/db/schema/donations";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const clientDonationParams = insertDonationParams
  .omit({ userId: true })
  .extend({ transactionId: z.string().min(1) });

export const createDonation = async (
  donation: z.infer<typeof clientDonationParams>
) => {
  const newDonation = clientDonationParams.parse(donation);
  try {
    const { userId } = auth();
    const { causeId, ...rest } = newDonation;
    const d = await db.donation.create({
      data: {
        ...rest,
        userId: userId!,
        transaction: {
          create: {
            id: newDonation.transactionId,
            isSuccess: true,
          },
        },
        cause: { connect: { id: causeId! } },
      },
    });
    return { donation: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
