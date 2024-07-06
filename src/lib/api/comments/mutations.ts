import { db } from "@/lib/db/index";
import {
  CommentId,
  NewCommentParams,
  UpdateCommentParams,
  updateCommentSchema,
  insertCommentSchema,
  commentIdSchema,
} from "@/lib/db/schema/comments";

// export const createComment = async (comment: NewCommentParams) => {
//   const newComment = insertCommentSchema.parse(comment);
//   try {
//     const mediaRecords = comment.uploadedFiles?.map((file) => ({
//       key: file.key,
//       type: "IMAGE" as MediaType,
//       url: file?.url!,
//     }));

//     const commentAndMedia = await db.$transaction([
//       db.comment.create({ data: newComment }),
//       db.media.createManyAndReturn({ data: mediaRecords! }),
//     ]);

//     const [c, m] = commentAndMedia;

//     await Promise.all(
//       m.map((mediaRecord) =>
//         db.media.update({
//           where: { key: mediaRecord.key },
//           data: { commentId: c.id },
//         })
//       )
//     );
//   } catch (err) {
//     const message = (err as Error).message ?? "Error, please try again";
//     console.error(message);
//     throw { error: message };
//   }
// };

// export const updateComment = async (
//   id: CommentId,
//   comment: UpdateCommentParams
// ) => {
//   const { id: commentId } = commentIdSchema.parse({ id });
//   const newComment = updateCommentSchema.parse(comment);
//   try {
//     const mediaRecords = comment.uploadedFiles?.map((file) => ({
//       key: file.key,
//       type: "IMAGE" as MediaType,
//       url: file?.url!,
//     }));

//     const commentAndMedia = await db.$transaction([
//       db.comment.update({ where: { id: commentId }, data: newComment }),
//       db.media.createManyAndReturn({ data: mediaRecords! }),
//     ]);

//     const [c, m] = commentAndMedia;

//     await Promise.all(
//       m.map((mediaRecord) =>
//         db.media.update({
//           where: { key: mediaRecord.key },
//           data: { commentId: c.id },
//         })
//       )
//     );

//     return { comment: c };
//   } catch (err) {
//     const message = (err as Error).message ?? "Error, please try again";
//     console.error(message);
//     throw { error: message };
//   }
// };

export const deleteComment = async (id: CommentId) => {
  const { id: commentId } = commentIdSchema.parse({ id });
  try {
    const c = await db.comment.delete({ where: { id: commentId } });
    return { comment: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
