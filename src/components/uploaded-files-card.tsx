import Image from "next/image";
import type { UploadedFile } from "@/types/uploadthing";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EmptyCard } from "@/components/empty-card";
import { ny } from "@/lib/utils";

interface UploadedFilesCardProps extends React.HTMLAttributes<HTMLDivElement> {
  uploadedFiles: UploadedFile[];
}

export function UploadedFilesCard({
  className,
  uploadedFiles,
}: UploadedFilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        <CardDescription>View the uploaded files here</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadedFiles.length > 0 ? (
          <ScrollArea className="pb-4">
            <div className={ny("flex w-max space-x-2.5", className)}>
              {uploadedFiles.map((file) => (
                <div key={file.key} className="relative aspect-video w-64">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    sizes="(min-width: 640px) 640px, 100vw"
                    loading="lazy"
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <EmptyCard
            title="No files uploaded"
            description="Upload some files to see them here"
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  );
}
