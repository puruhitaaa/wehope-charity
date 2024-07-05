"use client";
import Image from "next/image";
import { Progress } from "../ui/progress";
import { ny, currencyFormat } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { RouterOutput } from "@/lib/trpc/utils";
import { Bookmark } from "lucide-react";
import { useSearchParamsUtil } from "@/hooks/use-search-params";
import { usePathname } from "next/navigation";
import { SignInButton, useSession } from "@clerk/nextjs";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import Link from "next/link";

type TCauseItemProps = {
  cause:
    | RouterOutput["causes"]["getRecentCauses"][number]
    | RouterOutput["causes"]["getCauses"]["causes"][number]
    | RouterOutput["bookmarks"]["getBookmarks"]["bookmarks"][number]["cause"];
};

function BookmarkButton({
  cause,
  loggedIn,
}: TCauseItemProps & { loggedIn: boolean }) {
  const utils = trpc.useUtils();
  const pathname = usePathname();
  const { mutate: addToBookmark, isLoading: isAddingToBookmark } =
    trpc.bookmarks.createBookmark.useMutation({
      onMutate: async () => {
        if (pathname.trim().toLowerCase() === "/") {
          await utils.causes.getRecentCauses.cancel();
          utils.causes.getRecentCauses.setData(undefined, (old) => {
            return old?.map((c) => {
              if (c.id === cause.id) {
                return {
                  ...c,
                  isBookmarked: !cause.isBookmarked,
                };
              }

              return c;
            });
          });
        } else if (pathname.trim().toLowerCase() === "/donations") {
          await utils.causes.getCauses.cancel();
          //@ts-ignore
          utils.causes.getCauses.setInfiniteData({}, (old) => {
            if (old === undefined) {
              return {
                pages: [],
                pageParams: undefined,
              };
            }

            const newData = old.pages.map((page) => ({
              ...page,
              causes: page.causes.map((c) => {
                if (c.id === cause.id) {
                  return {
                    ...c,
                    isBookmarked: !cause.isBookmarked,
                  };
                }
                return c;
              }),
            }));

            return {
              ...old,
              pages: newData,
            };
          });
        } else if (pathname.trim().toLowerCase() === "/bookmarks") {
          await utils.bookmarks.getBookmarks.cancel();
          //@ts-ignore
          utils.bookmarks.getBookmarks.setInfiniteData({}, (old) => {
            if (old === undefined) {
              return {
                pages: [],
                pageParams: undefined,
              };
            }

            const newData = old.pages.map((page) => ({
              ...page,
              bookmarks: page.bookmarks.filter((c) => c.causeId !== cause.id),
            }));

            return {
              ...old,
              pages: newData,
            };
          });
        }
      },
      onSettled: () => {
        if (pathname === "/") {
          utils.causes.getRecentCauses.refetch();
        } else if (pathname === "/donations") {
          utils.causes.getCauses.refetch();
        } else if (pathname === "/bookmarks") {
          utils.bookmarks.getBookmarks.refetch();
        }
      },
    });

  function renderButton({ onClick }: React.HTMLAttributes<HTMLButtonElement>) {
    return (
      <button
        disabled={!!isAddingToBookmark}
        className="m-4 rounded-full border p-2 group-hover:bg-background text-primary to-background/30 from-background border-background bg-gradient-to-r transition-colors"
        onClick={onClick}
      >
        <Bookmark
          className={ny("h-7 w-7", {
            "fill-primary": cause.isBookmarked,
          })}
        />
      </button>
    );
  }

  switch (loggedIn) {
    case true:
      return renderButton({
        onClick: () => {
          addToBookmark(
            { causeId: cause.id, isBookmarked: cause.isBookmarked },
            {
              onSuccess: () => {
                if (!cause.isBookmarked) {
                  toast.success("Added a cause to bookmarks");
                } else {
                  toast.error("Removed a cause from bookmarks");
                }
              },
              onError: () => toast.error("Something went wrong."),
            }
          );
        },
      });
    case false:
      return (
        <SignInButton mode="modal">
          {renderButton({ onClick: undefined })}
        </SignInButton>
      );
    default:
      return null;
  }
}

function CauseItem({ cause }: TCauseItemProps) {
  const { pushToRoute } = useSearchParamsUtil();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useSession();

  return (
    <div className="rounded-xl shadow dark:shadow-none p-4 md:p-6 flex flex-col gap-1.5 lg:gap-3 group">
      <div className="w-auto h-96 relative group overflow-hidden rounded-xl">
        <div className="absolute top-0 flex w-full lg:items-center lg:justify-between z-20">
          {pathname === "/" ? (
            <button
              className="from-background px-4 py-1 rounded-full to-background/30 bg-gradient-to-r m-4 text-foreground font-semibold border border-background group-hover:bg-background transition-colors text-sm"
              onClick={() =>
                pushToRoute("/donations", "categoryId", cause.category.id)
              }
            >
              {cause.category.name}
            </button>
          ) : null}

          {isLoaded ? (
            <BookmarkButton cause={cause} loggedIn={isSignedIn} />
          ) : null}
        </div>
        <div className="bg-background/50 absolute inset-0 m-auto group-hover:flex hidden items-center justify-center h-full w-full z-10">
          <Link className={buttonVariants()} href={`/donations/${cause.id}`}>
            Details
          </Link>
        </div>
        <Image
          alt={cause.category.name}
          className="object-cover rounded-xl group-hover:scale-105 transition-transform ease-out"
          src={cause.media[0].url}
          fill
        />
      </div>

      <h5 className="font-semibold text-lg lg:text-2xl">{cause.title}</h5>
      <p className="text-muted-foreground">{cause.description}</p>

      <Progress value={cause.ratio} />

      <div className="flex flex-col 2xl:items-center 2xl:flex-row 2xl:justify-between 2xl:gap-3 gap-1.5">
        <div>
          Reached <br />{" "}
          <div className="flex md:items-center flex-col md:flex-row gap-1.5">
            <span className="flex items-center gap-1.5">
              <p className="font-semibold text-primary truncate">
                {currencyFormat(cause.donationSum)}
              </p>
              /
            </span>
            <p className="font-semibold truncate">
              {currencyFormat(cause.targetAmount)}
            </p>
          </div>
        </div>

        <Button>Donate</Button>
      </div>
    </div>
  );
}

export default CauseItem;
