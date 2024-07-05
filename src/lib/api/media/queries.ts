import { db } from "@/lib/db/index";
import { type CauseId } from "@/lib/db/schema/causes";
import { type MediaKey, mediaKeySchema } from "@/lib/db/schema/media";

export const getMediaRelatedToCause = async (causeId: CauseId) => {
  const m = await db.media.findMany({
    where: { causeId },
    include: {
      cause: {
        where: {
          id: causeId,
        },
      },
    },
  });
  return m;
};

// export const getMedia = async () => {
//   const m = await db.cause.findMany({
//     include: { media: true, category: true },
//   });
//   return m;
// };

export const getMediaById = async (key: MediaKey) => {
  const { key: mediaKey } = mediaKeySchema.parse({ key });
  const m = await db.media.findFirst({
    where: { key: mediaKey },
  });
  return { media: m };
};
