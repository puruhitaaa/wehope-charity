import { donationSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getDonations } from "@/lib/api/donations/queries";

// Schema for donations - used to validate API requests
const baseSchema = donationSchema.omit(timestamps);

export const insertDonationSchema = baseSchema.omit({ id: true });
export const insertDonationParams = baseSchema.extend({}).omit({
  id: true,
  transactionId: true,
});
export const clientDonationParams = insertDonationParams.omit({
  userId: true,
  causeId: true,
});

export const updateDonationSchema = baseSchema;
export const updateDonationParams = updateDonationSchema.omit({ id: true });
export const donationIdSchema = baseSchema.pick({ id: true });

// Types for donations - used to type API request params and within Components
export type Donation = z.infer<typeof donationSchema>;
export type NewDonation = z.infer<typeof insertDonationSchema>;
export type NewDonationParams = z.infer<typeof insertDonationParams>;
export type NewClientDonationParams = z.infer<typeof clientDonationParams>;
export type UpdateDonationParams = z.infer<typeof updateDonationParams>;
export type DonationId = z.infer<typeof donationIdSchema>["id"];

// this type infers the return from getDonations() - meaning it will include any joins
export type CompleteDonation = Awaited<ReturnType<typeof getDonations>>[number];
