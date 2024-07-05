"use client";

import { trpc } from "@/lib/trpc/client";
import CauseModal from "./CauseModal";
import type { RouterOutput } from "@/lib/trpc/utils";

export default function CauseList({
  causes,
}: {
  causes: RouterOutput["causes"]["getAllCauses"];
}) {
  const { data: c } = trpc.causes.getAllCauses.useQuery(undefined, {
    initialData: causes,
    refetchOnMount: false,
  });

  if (c.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {c.map((cause) => (
        <Cause cause={cause} key={cause.id} />
      ))}
    </ul>
  );
}

const Cause = ({
  cause,
}: {
  cause: RouterOutput["causes"]["getAllCauses"][number];
}) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{cause.title}</div>
      </div>
      <CauseModal cause={cause} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No causes
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new cause.
      </p>
      <div className="mt-6">
        <CauseModal emptyState={true} />
      </div>
    </div>
  );
};
