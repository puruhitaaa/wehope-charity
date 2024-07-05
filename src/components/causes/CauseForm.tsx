"use client";

import { NewCauseParams, insertCauseParams } from "@/lib/db/schema/causes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Trash } from "lucide-react";
import { FileUploader } from "../file-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";
import type { RouterOutput } from "@/lib/trpc/utils";
import { getErrorMessage } from "@/lib/handle-error";
import { useEffect } from "react";
import { handleDeleteFiles } from "./actions";
import ConfirmationAlert from "./ConfirmationAlert";

const CauseForm = ({
  cause,
  closeModal,
}: {
  cause?: RouterOutput["causes"]["getAllCauses"][number];
  closeModal?: () => void;
}) => {
  const { data: categories } = trpc.categories.getCategories.useQuery();
  const editing = !!cause?.id;
  const { data: media } = trpc.media.getMediaRelatedToCause.useQuery({
    id: cause?.id ?? "",
  });

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertCauseParams>>({
    resolver: zodResolver(insertCauseParams),
    defaultValues: cause ?? {
      title: "",
      description: "",
      targetAmount: 0.0,
      categoryId: "",
      isForwarded: false,
      isPublished: false,
    },
  });

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }

    await utils.causes.getAllCauses.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Cause ${action}d!`);
  };

  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  );

  const { mutate: createCause, isLoading: isCreating } =
    trpc.causes.createCause.useMutation({
      onSuccess: (_) => {
        onSuccess("create");
        form.reset();
      },
      onError: (err) => onSuccess("create", { error: err.message }),
    });

  const { mutate: updateCause, isLoading: isUpdating } =
    trpc.causes.updateCause.useMutation({
      onSuccess: (_) => onSuccess("update"),
      onError: (err) => onSuccess("update", { error: err.message }),
    });

  const { mutate: deleteCause, isLoading: isDeleting } =
    trpc.causes.deleteCause.useMutation({
      onSuccess: (_) => onSuccess("delete"),
      onError: (err) => onSuccess("delete", { error: err.message }),
    });
  const { mutate: deleteMedia, isLoading: isDeletingMedia } =
    trpc.media.deleteMedia.useMutation({
      onSuccess: (_) => onSuccess("delete"),
      onError: (err) => onSuccess("delete", { error: err.message }),
    });

  const handleSubmit = (values: NewCauseParams) => {
    if (editing) {
      if (!values.images) {
        updateCause(
          { ...values, id: cause.id },
          {
            onSuccess: (_) => onSuccess("update"),
            onError: (err) => onSuccess("update", { error: err.message }),
          }
        );
        return;
      }

      toast.promise(uploadFiles(values.images), {
        loading: "Uploading new images...",
        success: () => {
          return "New images uploaded";
        },
        error: (err) => {
          return getErrorMessage(err);
        },
      });
    } else {
      if (!values.images) return;

      toast.promise(uploadFiles(values.images), {
        loading: "Uploading images...",
        success: () => {
          return "Images uploaded";
        },
        error: (err) => {
          return getErrorMessage(err);
        },
      });
    }
  };

  const handleDeleteCause = async (
    cause: RouterOutput["causes"]["getAllCauses"][number]
  ) => {
    deleteCause(
      { id: cause.id },
      {
        onSuccess: async () => {
          handleDeleteFiles(cause.media.map((m) => m.key));
        },
      }
    );
  };

  const handleDeleteMedia = (key: string) => {
    deleteMedia(
      { key },
      {
        onSuccess: async () => {
          handleDeleteFiles([key]);
        },
      }
    );
  };

  useEffect(() => {
    if (uploadedFiles.length) {
      const { images, ...rest } = form.getValues();
      if (!editing) {
        createCause({ ...rest, uploadedFiles });
      } else {
        updateCause({ ...rest, id: cause.id, uploadedFiles });
      }
    }
  }, [uploadedFiles, editing, cause, form, createCause, updateCause]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="max-h-40" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Amount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {editing ? (
          media?.length ? (
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {media.map((_, index) => (
                  <CarouselItem className="flex flex-col gap-1.5" key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="relative aspect-square">
                          <Image
                            alt={media[index].key}
                            className="object-cover rounded-lg"
                            src={media[index].url}
                            fill
                          />
                          <div className="absolute top-0 right-0 m-2 flex items-center gap-1.5">
                            <ConfirmationAlert
                              title="Are you absolutely sure?"
                              description="This action cannot be undone. This will
                                    permanently this image from the database and
                                    storage."
                              Icon={Trash}
                              isDestructive
                              actionText={`Delet${
                                isDeletingMedia ? "ing" : "e"
                              }`}
                              withCancel
                              onAction={() =>
                                handleDeleteMedia(media[index].key)
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Badge
                      className="py-2 flex items-center justify-center gap-1"
                      variant="outline"
                    >
                      <span className="text-primary font-semibold">
                        {index + 1}
                      </span>{" "}
                      out of {media.length}
                    </Badge>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious type="button" />
              <CarouselNext type="button" />
            </Carousel>
          ) : null
        ) : null}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFiles={4}
                    maxSize={4 * 1024 * 1024}
                    progresses={progresses}
                    // pass the onUpload function here for direct upload
                    // onUpload={uploadFiles}
                    disabled={isUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {editing ? (
          <FormField
            control={form.control}
            name="isForwarded"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is Forwarded</FormLabel>
                <br />
                <FormControl>
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    value={""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Published</FormLabel>
              <br />
              <FormControl>
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  value={""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating || isUploading}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <ConfirmationAlert
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will
                permanently this cause from the database."
            isDestructive
            triggerText="Delete"
            actionText={`Delet${isDeleting ? "ing" : "e"}`}
            withCancel
            onAction={() => handleDeleteCause(cause)}
          />
        ) : null}
      </form>
    </Form>
  );
};

export default CauseForm;
