import { db } from "@/lib/db/index";
import { NewLikeParams, insertLikeSchema } from "@/lib/db/schema/likes";

export const toggleLike = async (like: NewLikeParams) => {
  const newLike = insertLikeSchema.parse(like);
  try {
    if (!like.isLiked) {
      await db.like.create({ data: newLike });
    } else {
      await db.like.delete({
        where: { commentId: like.commentId!, userId: like.userId },
      });
    }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
