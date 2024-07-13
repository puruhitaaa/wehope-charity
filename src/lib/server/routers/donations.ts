import { createDonation } from "@/lib/api/donations/mutations";
import { insertDonationParams } from "@/lib/db/schema/donations";
import { protectedProcedure, router } from "@/lib/server/trpc";
import { z } from "zod";

const clientDonationParams = insertDonationParams
  .omit({ userId: true })
  .extend({ transactionId: z.string().min(1) });

export const donationsRouter = router({
  createDonation: protectedProcedure
    .input(clientDonationParams)
    .mutation(async ({ input }) => {
      return createDonation(input);
    }),
});
