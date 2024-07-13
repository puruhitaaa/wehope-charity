import {
  insertDonationSchema,
  NewDonationParams,
} from "@/lib/db/schema/donations";
import { MidtransClient } from "midtrans-node-client";
import { createId } from "@paralleldrive/cuid2";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { env } from "@/lib/env.mjs";

export const createTransactionToken = async (donation: NewDonationParams) => {
  let snap = new MidtransClient.Snap({
    isProduction: false,
    serverKey: env.MIDTRANS_SERVER_KEY,
    clientKey: env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });

  const newDonation = insertDonationSchema.parse(donation);
  try {
    const { userId } = auth();
    const user = await clerkClient.users.getUser(userId!);

    const customer_details = {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    };

    if (user?.firstName) {
      customer_details["first_name"] = user.firstName;
    }

    if (user?.lastName) {
      customer_details["last_name"] = user.lastName;
    }

    if (user?.primaryEmailAddress || user?.emailAddresses) {
      customer_details["email"] =
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0].emailAddress;
    }

    if (user?.primaryPhoneNumber?.phoneNumber) {
      customer_details["phone"] = user.primaryPhoneNumber?.phoneNumber;
    }

    let parameter = {
      customer_details: { ...customer_details },
      transaction_details: {
        order_id: createId(),
        gross_amount: newDonation.amount,
      },
      credit_card: {
        secure: true,
      },
    };

    const token = await snap.createTransactionToken(parameter);
    return token;
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
