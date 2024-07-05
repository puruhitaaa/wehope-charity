import { db } from "@/lib/db/index";
import { type CategoryId, categoryIdSchema } from "@/lib/db/schema/categories";

export const getCategories = async () => {
  const c = await db.category.findMany({ select: { id: true, name: true } });
  return c;
};

export const getCategoryById = async (id: CategoryId) => {
  const { id: categoryId } = categoryIdSchema.parse({ id });
  const c = await db.category.findFirst({
    where: { id: categoryId },
    select: { id: true, name: true },
  });
  return { category: c };
};
