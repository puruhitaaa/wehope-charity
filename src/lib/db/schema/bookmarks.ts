import { bookmarkSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getBookmarks } from "@/lib/api/bookmarks/queries";

// Schema for bookmarks - used to validate API requests
const baseSchema = bookmarkSchema.omit(timestamps);

export const insertBookmarkSchema = baseSchema;
export const insertBookmarkParams = baseSchema.extend({
  isBookmarked: z.boolean(),
});

export const updateBookmarkSchema = baseSchema;
export const updateBookmarkParams = updateBookmarkSchema.extend({});
export const userIdSchema = baseSchema.pick({ userId: true });

// Types for bookmarks - used to type API request params and within Components
export type Bookmark = z.infer<typeof bookmarkSchema>;
export type NewBookmark = z.infer<typeof insertBookmarkSchema>;
export type NewBookmarkParams = z.infer<typeof insertBookmarkParams>;
export type UpdateBookmarkParams = z.infer<typeof updateBookmarkParams>;
export type UserId = z.infer<typeof userIdSchema>["userId"];

// this type infers the return from getBookmarks() - meaning it will include any joins
export type CompleteBookmark = Awaited<
  ReturnType<typeof getBookmarks>
>["bookmarks"][number];
