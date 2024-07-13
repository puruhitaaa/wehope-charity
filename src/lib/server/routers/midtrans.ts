import { createTransactionToken } from "@/lib/api/midtrans/mutations";
import { clientDonationParams } from "@/lib/db/schema/donations";
import { protectedProcedure, router } from "@/lib/server/trpc";
import { auth } from "@clerk/nextjs/server";

export const midtransRouter = router({
  createTransaction: protectedProcedure
    .input(clientDonationParams)
    .mutation(async ({ input }) => {
      const { userId } = auth();
      return createTransactionToken({ ...input, userId: userId! });
    }),
});
