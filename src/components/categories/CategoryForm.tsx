"use client";

import {
  NewCategoryParams,
  insertCategoryParams,
} from "@/lib/db/schema/categories";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RouterOutput } from "@/lib/trpc/utils";

const CategoryForm = ({
  category,
  closeModal,
}: {
  category?: RouterOutput["categories"]["getCategories"][number];
  closeModal?: () => void;
}) => {
  const editing = !!category?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertCategoryParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertCategoryParams),
    defaultValues: category ?? {
      name: "",
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

    await utils.categories.getCategories.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Category ${action}d!`);
  };

  const { mutate: createCategory, isLoading: isCreating } =
    trpc.categories.createCategory.useMutation({
      onSuccess: (_) => onSuccess("create"),
      onError: (err) => onSuccess("create", { error: err.message }),
    });

  const { mutate: updateCategory, isLoading: isUpdating } =
    trpc.categories.updateCategory.useMutation({
      onSuccess: (_) => onSuccess("update"),
      onError: (err) => onSuccess("update", { error: err.message }),
    });

  const { mutate: deleteCategory, isLoading: isDeleting } =
    trpc.categories.deleteCategory.useMutation({
      onSuccess: (_) => onSuccess("delete"),
      onError: (err) => onSuccess("delete", { error: err.message }),
    });

  const handleSubmit = (values: NewCategoryParams) => {
    if (editing) {
      updateCategory({ ...values, id: category.id });
    } else {
      createCategory(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteCategory({ id: category.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default CategoryForm;
