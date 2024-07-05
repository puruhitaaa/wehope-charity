"use server";

import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";

export const handleDeleteFiles = async (keys: string[]) => {
  const { userId, sessionClaims } = auth();
  if (!userId) throw new Error("Unauthorized");

  if (
    sessionClaims.metadata.role !== "admin" &&
    sessionClaims.metadata.role !== "volunteer"
  ) {
    throw new Error("Unauthorized");
  }

  const utapi = new UTApi();
  await utapi.deleteFiles(keys);
};
