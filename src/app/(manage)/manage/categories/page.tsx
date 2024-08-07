import CategoryList from "@/components/categories/CategoryList";
import NewCategoryModal from "@/components/categories/CategoryModal";
import { api } from "@/lib/trpc/api";

export const dynamic = "force-dynamic";

export default async function Categories() {
  const categories = await api.categories.getCategories.query();

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Categories</h1>
        <NewCategoryModal />
      </div>
      <CategoryList categories={categories} />
    </div>
  );
}
