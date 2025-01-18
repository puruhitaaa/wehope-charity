import * as React from "react";
import { toast } from "sonner";
import type { AnyFileRoute, UploadFilesOptions } from "uploadthing/types";

import { getErrorMessage } from "@/lib/handle-error";
import { uploadFiles } from "@/lib/uploadthing";
import { type OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadedFile } from "@/types/uploadthing";

interface UseUploadFileOptions<TFileRoute extends AnyFileRoute>
  extends Pick<
    UploadFilesOptions<TFileRoute>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  {
    defaultUploadedFiles = [],
    ...props
  }: UseUploadFileOptions<OurFileRouter[keyof OurFileRouter]> = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {}
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({
          file,
          progress,
        }: {
          file: File;
          progress: number;
        }) => {
          setProgresses((prev) => {
            return {
              ...prev,
              [file.name]: progress,
            };
          });
        },
      });

      setUploadedFiles((prev) => (prev ? [...prev, ...res] : res));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
