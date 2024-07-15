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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientDonationParams,
  NewClientDonationParams,
} from "@/lib/db/schema/donations";
import React, { useEffect, useState } from "react";

type TCauseItemProps = {
  cause:
    | RouterOutput["causes"]["getRecentCauses"][number]
    | RouterOutput["causes"]["getCauses"]["causes"][number]
    | RouterOutput["causes"]["getCauseById"]
    | RouterOutput["bookmarks"]["getBookmarks"]["bookmarks"][number]["cause"];
};

export function BookmarkButton({
  className,
  cause,
  loggedIn,
}: TCauseItemProps & {
  loggedIn: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
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
        } else if (
          pathname.trim().toLowerCase().startsWith("/donations") &&
          pathname.trim().toLowerCase() !== "/donations"
        ) {
          await utils.causes.getCauseById.cancel({ id: cause.id });
          utils.causes.getCauseById.setData({ id: cause.id }, (old) => {
            if (old === undefined) {
              return;
            }

            return {
              ...old,
              isBookmarked: !cause.isBookmarked,
            };
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
        className={ny(
          "m-4 rounded-full border p-2 group-hover:bg-background text-primary to-background/30 from-background border-background bg-gradient-to-r transition-colors",
          className
        )}
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
                toast.success(
                  `${!cause.isBookmarked ? "Added" : "Removed"} a cause ${
                    !cause.isBookmarked ? "to" : "from"
                  } bookmarks`
                );
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

export const DonateButton = ({
  cause,
  loggedIn,
}: TCauseItemProps & { loggedIn: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    mutate: createTransactionToken,
    isLoading: isCreatingTransactionToken,
  } = trpc.midtrans.createTransaction.useMutation();
  const { mutate: createDonation } =
    trpc.donations.createDonation.useMutation();
  const form = useForm<NewClientDonationParams>({
    resolver: zodResolver(clientDonationParams),
    defaultValues: {
      amount: 1000,
      isAnonymous: false,
    },
  });
  const handleSubmit = (values: NewClientDonationParams) => {
    createTransactionToken(values, {
      onError: () => toast.error("Something went wrong."),
      onSuccess: (res) => {
        toast.success("Successfully created a transaction token.");
        setIsModalOpen(false);
        window.snap.pay(res, {
          onSuccess: (result: { transaction_id: string }) => {
            createDonation({
              ...values,
              causeId: cause.id,
              transactionId: result.transaction_id,
            });
            toast.success("Transaction has been completed. Thank you!");
          },
          onError: () => {
            toast.error("Something went wrong confirming the transaction.");
          },
        });
      },
    });
  };

  const amount = form.watch("amount");
  const isAnonymous = form.watch("isAnonymous");

  useEffect(() => {
    const snapSrcUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    const script = document.createElement("script");
    script.src = snapSrcUrl;
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string
    );
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  switch (loggedIn) {
    case true:
      return (
        <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={cause.donationSum >= cause.targetAmount}
            >
              Donate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] divide-y divide-muted-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Support Our Cause
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Your donation will be forwarded to{" "}
                <span className="font-semibold">{cause.title}</span> cause. When
                the cause reaches its target, we will notify you.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 py-3"
                id="client-donation-form"
              >
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
                      <FormLabel>Anonymous Donation?</FormLabel>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          name={field.name}
                          onClick={() =>
                            void form.setValue("isAnonymous", !field.value)
                          }
                          disabled={field.disabled}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {isAnonymous ? (
                  <p className="text-muted-foreground text-sm">
                    Your donation will not be visible to the public.
                  </p>
                ) : null}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Donation Amount</FormLabel>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Rp</span>
                        <FormControl>
                          <Input
                            {...field}
                            min={1000}
                            type="number"
                            onChange={(e) => field.onChange(+e.target.value)}
                            placeholder="Enter amount"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      type="button"
                      disabled={
                        !form.formState.isValid || !form.formState.isDirty
                      }
                    >
                      Donate Now
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You will donate{" "}
                        <span className="font-semibold">
                          {currencyFormat(amount)}
                        </span>{" "}
                        to the cause. Your donation{" "}
                        <span className="font-semibold">
                          will {isAnonymous ? "not" : null}
                        </span>{" "}
                        be visible to the public.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({
                          className: "bg-green-600 hover:bg-green-500",
                        })}
                        form="client-donation-form"
                        type="submit"
                        disabled={isCreatingTransactionToken}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      );
    case false:
      return (
        <SignInButton mode="modal">
          <Button disabled={cause.donationSum >= cause.targetAmount}>
            Donate
          </Button>
        </SignInButton>
      );
    default:
      return null;
  }
};

function CauseItem({ cause }: TCauseItemProps) {
  const { pushToRoute } = useSearchParamsUtil();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useSession();

  return (
    <div className="rounded-xl shadow dark:shadow-none p-4 md:p-6 flex flex-col gap-1.5 lg:gap-3 group">
      <div className="w-auto h-96 relative group overflow-hidden rounded-xl">
        <div className="absolute top-0 flex w-full items-center justify-between z-20">
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

        {isLoaded ? <DonateButton cause={cause} loggedIn={isSignedIn} /> : null}
      </div>
    </div>
  );
}

export default CauseItem;
