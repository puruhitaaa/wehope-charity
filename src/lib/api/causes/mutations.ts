import { db } from "@/lib/db/index";
import {
  CauseId,
  NewCauseParams,
  UpdateCauseParams,
  updateCauseSchema,
  insertCauseSchema,
  causeIdSchema,
} from "@/lib/db/schema/causes";
import type { MediaType } from "@prisma/client";

export const createCause = async (cause: NewCauseParams) => {
  const newCause = insertCauseSchema.parse(cause);
  try {
    const mediaRecords = cause.uploadedFiles?.map((file) => ({
      key: file.key,
      type: "IMAGE" as MediaType,
      url: file?.url!,
    }));

    const causeAndMedia = await db.$transaction([
      db.cause.create({ data: newCause }),
      db.media.createManyAndReturn({ data: mediaRecords! }),
    ]);

    const [c, m] = causeAndMedia;

    await Promise.all(
      m.map((mediaRecord) =>
        db.media.update({
          where: { key: mediaRecord.key },
          data: { causeId: c.id },
        })
      )
    );
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCause = async (id: CauseId, cause: UpdateCauseParams) => {
  const { id: causeId } = causeIdSchema.parse({ id });
  const newCause = updateCauseSchema.parse(cause);
  try {
    const mediaRecords = cause.uploadedFiles?.map((file) => ({
      key: file.key,
      type: "IMAGE" as MediaType,
      url: file?.url!,
    }));

    const causeAndMedia = await db.$transaction([
      db.cause.update({ where: { id: causeId }, data: newCause }),
      db.media.createManyAndReturn({ data: mediaRecords! }),
    ]);

    const [c, m] = causeAndMedia;

    await Promise.all(
      m.map((mediaRecord) =>
        db.media.update({
          where: { key: mediaRecord.key },
          data: { causeId: c.id },
        })
      )
    );

    return { cause: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCause = async (id: CauseId) => {
  const { id: causeId } = causeIdSchema.parse({ id });
  try {
    const c = await db.cause.delete({ where: { id: causeId } });
    return { cause: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
