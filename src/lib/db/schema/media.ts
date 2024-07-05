import { mediaSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
// import { getMedia } from "@/lib/api/media/queries";

// Schema for media - used to validate API requests
const baseSchema = mediaSchema.omit(timestamps);

export const insertMediaSchema = baseSchema;
export const insertMediaParams = baseSchema.extend({
  url: z.string(),
  type: z.enum(["IMAGE", "VIDEO", "FILE"]),
  userId: z.string().optional(),
  causeId: z.string().optional(),
  approvalId: z.string().optional(),
  certificateId: z.string().optional(),
  articleId: z.string().min(1).optional(),
});

export const updateMediaSchema = baseSchema;
export const updateMediaParams = updateMediaSchema.extend({
  url: z.string(),
  type: z.enum(["IMAGE", "VIDEO", "FILE"]),
  userId: z.string().optional(),
  causeId: z.string().optional(),
  approvalId: z.string().optional(),
  certificateId: z.string().optional(),
  articleId: z.string().min(1).optional(),
});
export const mediaKeySchema = baseSchema.pick({ key: true });

// Types for media - used to type API request params and within Components
export type Media = z.infer<typeof mediaSchema>;
export type NewMedia = z.infer<typeof insertMediaSchema>;
export type NewMediaParams = z.infer<typeof insertMediaParams>;
export type UpdateMediaParams = z.infer<typeof updateMediaParams>;
export type MediaKey = z.infer<typeof mediaKeySchema>["key"];

// this type infers the return from getMedia() - meaning it will include any joins
// export type CompleteMedia = Awaited<ReturnType<typeof getMedia>>[number];
