import { db } from "@/lib/db/index";
import { 
  CauseId, 
  NewCauseParams,
  UpdateCauseParams, 
  updateCauseSchema,
  insertCauseSchema, 
  causeIdSchema 
} from "@/lib/db/schema/causes";

export const createCause = async (cause: NewCauseParams) => {
  const newCause = insertCauseSchema.parse(cause);
  try {
    const c = await db.cause.create({ data: newCause });
    return { cause: c };
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
    const c = await db.cause.update({ where: { id: causeId }, data: newCause})
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
    const c = await db.cause.delete({ where: { id: causeId }})
    return { cause: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

