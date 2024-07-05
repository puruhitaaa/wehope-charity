import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { ratelimit } from "@/lib/rate-limit";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async ({ req }) => {
      const { userId } = auth();

      if (!userId) throw new UploadThingError("Unauthorized");

      const { success } = await ratelimit.limit(userId);

      if (!success) {
        throw new UploadThingError("Rate limit exceeded");
      }

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
