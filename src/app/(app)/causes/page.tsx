import CauseList from "@/components/causes/CauseList";
import NewCauseModal from "@/components/causes/CauseModal";
import { api } from "@/lib/trpc/api";

export default async function Causes() {
  const { causes } = await api.causes.getCauses.query();

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Causes</h1>
        <NewCauseModal />
      </div>
      <CauseList causes={causes} />
    </main>
  );
}
