import { causeSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getCauses } from "@/lib/api/causes/queries";


// Schema for causes - used to validate API requests
const baseSchema = causeSchema.omit(timestamps)

export const insertCauseSchema = baseSchema.omit({ id: true });
export const insertCauseParams = baseSchema.extend({
  targetAmount: z.coerce.number(),
  mediaId: z.coerce.string().min(1),
  categoryId: z.coerce.string().min(1),
  isForwarded: z.coerce.boolean(),
  isPublished: z.coerce.boolean()
}).omit({ 
  id: true
});

export const updateCauseSchema = baseSchema;
export const updateCauseParams = updateCauseSchema.extend({
  targetAmount: z.coerce.number(),
  mediaId: z.coerce.string().min(1),
  categoryId: z.coerce.string().min(1),
  isForwarded: z.coerce.boolean(),
  isPublished: z.coerce.boolean()
})
export const causeIdSchema = baseSchema.pick({ id: true });

// Types for causes - used to type API request params and within Components
export type Cause = z.infer<typeof causeSchema>;
export type NewCause = z.infer<typeof insertCauseSchema>;
export type NewCauseParams = z.infer<typeof insertCauseParams>;
export type UpdateCauseParams = z.infer<typeof updateCauseParams>;
export type CauseId = z.infer<typeof causeIdSchema>["id"];
    
// this type infers the return from getCauses() - meaning it will include any joins
export type CompleteCause = Awaited<ReturnType<typeof getCauses>>["causes"][number];
