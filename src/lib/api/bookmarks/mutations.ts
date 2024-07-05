import { db } from "@/lib/db/index";
import {
  type UserId,
  NewBookmarkParams,
  UpdateBookmarkParams,
  updateBookmarkSchema,
  insertBookmarkSchema,
  userIdSchema,
} from "@/lib/db/schema/bookmarks";

export const createBookmark = async (bookmark: NewBookmarkParams) => {
  const newBookmark = insertBookmarkSchema.parse(bookmark);
  try {
    if (bookmark.isBookmarked) {
      const d = await db.bookmark.delete({
        where: { causeId: bookmark.causeId },
      });
      return { bookmark: d };
    }

    const c = await db.bookmark.create({ data: newBookmark });
    return { bookmark: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

// export const updateCategory = async (
//   id: CategoryId,
//   category: UpdateCategoryParams
// ) => {
//   const { id: categoryId } = categoryIdSchema.parse({ id });
//   const newCategory = updateCategorySchema.parse(category);
//   try {
//     const c = await db.category.update({
//       where: { id: categoryId },
//       data: newCategory,
//     });
//     return { category: c };
//   } catch (err) {
//     const message = (err as Error).message ?? "Error, please try again";
//     console.error(message);
//     throw { error: message };
//   }
// };

// export const deleteCategory = async (id: CategoryId) => {
//   const { id: categoryId } = categoryIdSchema.parse({ id });
//   try {
//     const c = await db.category.delete({ where: { id: categoryId } });
//     return { category: c };
//   } catch (err) {
//     const message = (err as Error).message ?? "Error, please try again";
//     console.error(message);
//     throw { error: message };
//   }
// };
