import { router } from "@/lib/server/trpc";
import { categoriesRouter } from "./categories";
import { causesRouter } from "./causes";
import { mediaRouter } from "./media";
import { articlesRouter } from "./articles";
import { bookmarkRouter } from "./bookmarks";
import { commentsRouter } from "./comments";
import { likesRouter } from "./likes";

export const appRouter = router({
  categories: categoriesRouter,
  causes: causesRouter,
  media: mediaRouter,
  articles: articlesRouter,
  bookmarks: bookmarkRouter,
  comments: commentsRouter,
  likes: likesRouter,
});

export type AppRouter = typeof appRouter;
