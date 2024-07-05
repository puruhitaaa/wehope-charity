import { router } from "@/lib/server/trpc";
import { categoriesRouter } from "./categories";
import { causesRouter } from "./causes";
import { mediaRouter } from "./media";
import { articlesRouter } from "./articles";
import { bookmarkRouter } from "./bookmarks";

export const appRouter = router({
  categories: categoriesRouter,
  causes: causesRouter,
  media: mediaRouter,
  articles: articlesRouter,
  bookmarks: bookmarkRouter,
});

export type AppRouter = typeof appRouter;
