"use client";

import { trpc } from "@/lib/trpc/client";
import { useEffect, useState } from "react";
import CauseItem from "../causes/CauseItem";
import { Skeleton } from "../ui/skeleton";
import InfiniteScroll from "../InfiniteScroll";
import { ArrowUpDownIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { ny } from "@/lib/utils";
import { useSearchParamsUtil } from "@/hooks/use-search-params";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type TSortOrder = "asc" | "desc";

function Donations() {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<TSortOrder | undefined>(undefined);
  const [page, setPage] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString } = useSearchParamsUtil();

  const { data, fetchNextPage, hasNextPage, isLoading } =
    trpc.causes.getCauses.useInfiniteQuery(
      {
        limit: 9,
        categoryId,
        sortDate: sortOrder,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  const { data: categories, isLoading: isLoadingCategories } =
    trpc.categories.getCategories.useQuery();

  const handleFetchNextPage = () => {
    fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const causes = data?.pages[page]?.causes;

  const catValues =
    categories?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) ?? [];

  const handleCategoryChange = (currentValue: string) => {
    if (currentValue === categoryId) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("categoryId");
      router.push(pathname + "?" + newSearchParams.toString());
      setCategoryId(undefined);
    } else {
      router.push(
        pathname +
          "?" +
          createQueryString(
            "categoryId",
            currentValue === categoryId ? "" : currentValue
          )
      );
      setCategoryId(currentValue);
    }
  };

  const handleSortOrderChange = (order: string) => {
    router.push(pathname + "?" + createQueryString("sortDate", order));
    setSortOrder(order as TSortOrder);
  };

  useEffect(() => {
    if (searchParams.get("categoryId")) {
      setCategoryId(searchParams.get("categoryId") as string);
    }
  }, [searchParams]);

  return (
    <div className="gap-6 lg:gap-12 flex flex-col">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="gap-1.5 flex flex-col">
          <h5 className="font-semibold">Category</h5>
          {!isLoadingCategories ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full md:w-[200px] justify-between"
                >
                  {categoryId
                    ? catValues.find((cat) => cat.value === categoryId)?.label
                    : "Select category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {catValues.map((cat) => (
                        <CommandItem
                          key={cat.value}
                          value={cat.value}
                          onSelect={(currentValue) => {
                            handleCategoryChange(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={ny(
                              "mr-2 h-4 w-4",
                              categoryId === cat.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {cat.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <Skeleton className="w-48 h-10" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <h5 className="font-semibold">Creation Date</h5>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDownIcon className="h-4 w-4" />
                Sort by Date{" "}
                {sortOrder
                  ? sortOrder === "asc"
                    ? "(Ascending)"
                    : "(Descending)"
                  : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuRadioGroup
                value={sortOrder}
                onValueChange={handleSortOrderChange}
              >
                <DropdownMenuRadioItem value="asc">
                  Ascending (oldest)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">
                  Descending (latest)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
        {!isLoading ? (
          <>
            {causes?.length ? (
              causes?.map((c) => <CauseItem key={c.id} cause={c} />)
            ) : (
              <h5 className="font-semibold text-lg lg:text-2xl">
                No published donations yet.
              </h5>
            )}
          </>
        ) : (
          [1, 2, 3].map((v) => (
            <Skeleton key={v} className="rounded-xl h-[36rem] w-full" />
          ))
        )}
        <InfiniteScroll
          hasMore={hasNextPage ?? false}
          isLoading={isLoading}
          next={handleFetchNextPage}
          threshold={1}
        >
          {hasNextPage && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Donations;
