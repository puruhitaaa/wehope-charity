import { db } from "@/lib/db/index";
import {
  MediaKey,
  UpdateMediaParams,
  updateMediaSchema,
  mediaKeySchema,
} from "@/lib/db/schema/media";

export const updateMedia = async (key: MediaKey, media: UpdateMediaParams) => {
  const { key: mediaKey } = mediaKeySchema.parse({ key });
  const newMedia = updateMediaSchema.parse(media);
  try {
    const c = await db.media.update({
      where: { key: mediaKey },
      data: newMedia,
    });
    return { media: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteMedia = async (key: MediaKey) => {
  const { key: mediaKey } = mediaKeySchema.parse({ key });
  try {
    const c = await db.media.delete({ where: { key: mediaKey } });
    return { media: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
