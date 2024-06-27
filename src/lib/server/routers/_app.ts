import { router } from "@/lib/server/trpc";
import { categoriesRouter } from "./categories";
import { causesRouter } from "./causes";

export const appRouter = router({
  categories: categoriesRouter,
  causes: causesRouter,
});

export type AppRouter = typeof appRouter;
