"use client";

import { trpc } from "@/lib/trpc/client";
import { Progress } from "../ui/progress";
import { currencyFormat, ny } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { formatDistance } from "date-fns";
import InfiniteScroll from "../InfiniteScroll";
import {
  Link2,
  Loader2,
  MessageCircleMore,
  MoreHorizontal,
  Smile,
  Trash2,
} from "lucide-react";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import LikeButton from "../comments/LikeButton";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useSearchParamsUtil } from "@/hooks/use-search-params";
import { BookmarkButton, DonateButton } from "../causes/CauseItem";
import { useSession } from "@clerk/nextjs";
import { Textarea } from "../ui/textarea";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { type RouterOutput } from "@/lib/trpc/utils";
import { useForm } from "react-hook-form";
import {
  clientCommentParams,
  NewCommentParams,
} from "@/lib/db/schema/comments";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useClickAway, useCopyToClipboard } from "@uidotdev/usehooks";
import data from "@emoji-mart/data";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

type TDonationDetailProps = {
  id: string;
};

type Emoji = {
  id: string;
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
  keywords: string[];
};

const CommentItem = ({
  causeId,
  comment,
  textAreaRef,
}: {
  causeId: string;
  comment: RouterOutput["comments"]["getComments"]["comments"][number];
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  const utils = trpc.useUtils();
  const { isSignedIn, session } = useSession();
  const pathname = usePathname();
  const { createQueryString } = useSearchParamsUtil();
  const { mutate: deleteComment, isLoading: isDeletingComment } =
    trpc.comments.deleteComment.useMutation({
      onMutate: async () => {
        await utils.comments.getComments.cancel();
        const previousComments = utils.comments.getComments.getData();
        if (previousComments) {
          const newComments = previousComments.comments.filter(
            (c) => c.id !== comment.id
          );
          utils.comments.getComments.setInfiniteData({ causeId }, (old) => {
            if (old === undefined) {
              return;
            }
            return {
              ...old,
              comments: newComments,
            };
          });
        }
        return { previousComments };
      },
      onError: (err, _, context) => {
        utils.comments.getComments.setData(
          { causeId },
          context?.previousComments
        );
        toast.error(err.message);
      },
      onSettled: () => {
        utils.comments.getComments.refetch();
      },
    });
  const handleCopyToClipboard = () => {
    copyToClipboard(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}${pathname}?${createQueryString(
        "commentId",
        comment.id
      )}`
    );
    // router.push(
    //   pathname +
    //     "?" +
    //     createQueryString(
    //       "categoryId",
    //       currentValue === categoryId ? "" : currentValue
    //     )
    // );
    toast.info("Comment link copied to clipboard");
  };

  const handleDeleteComment = () => {
    deleteComment(
      { id: comment.id },
      {
        onSuccess: () => {
          toast.success("Comment deleted");
        },
        onError: (err) => {
          toast.error(err.message);
        },
        onSettled: () => {
          setIsDialogOpen(false);
        },
      }
    );
  };

  return (
    <div
      className="flex flex-col gap-3 dark:shadow-none shadow rounded-xl p-4 relative"
      key={comment.id}
    >
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="absolute top-0 right-0 m-4">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Share Comment, Delete Comment, and Cancel</DialogTitle>
            <DialogDescription>
              Share Comment, Delete Comment, or Cancel Dialog Interaction
              Altogether
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 divide-y divide-muted-foreground">
            <div className="flex flex-col gap-1.5 py-4">
              <Button
                className="inline-flex items-center gap-1.5 text-primary"
                variant="secondary"
                disabled={isDeletingComment}
                onClick={() => void handleCopyToClipboard()}
              >
                <Link2 className="w-5 h-5" />
                Share
              </Button>
              {isSignedIn && session.user.id === comment.userId ? (
                <Button
                  className="inline-flex items-center gap-1.5"
                  variant="destructive"
                  onClick={handleDeleteComment}
                  disabled={isDeletingComment}
                >
                  {!isDeletingComment ? (
                    <>
                      <Trash2 className="h-5 w-5" />
                      Delete
                    </>
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                </Button>
              ) : null}
            </div>

            <div className="py-2">
              <DialogClose asChild>
                <Button className="w-full" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col lg:flex-row lg:items-center gap-1.5 lg:gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative shrink-0">
            <Image
              alt={comment.userId}
              className="object-cover rounded-full"
              src={comment.user?.imageUrl!}
              fill
            />
          </div>
          <h6>{comment.user?.name}</h6>
        </div>
        <p className="text-muted-foreground text-sm">
          {formatDistance(comment.createdAt, new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>

      <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary">
        <p>{comment.content}</p>
      </div>

      <div className="gap-1.5 flex flex-col">
        <p className="text-muted-foreground text-sm">
          {comment._count.likes} like
          {comment._count.likes > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-3">
          <LikeButton comment={comment} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => void textAreaRef.current?.focus()}
                >
                  <MessageCircleMore className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reply Comment</p>
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

function DonationDetail({ id }: TDonationDetailProps) {
  const [isTruncated, setIsTruncated] = useState(true);
  const [isPickingEmoji, setIsPickingEmoji] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { isSignedIn } = useSession();
  const { pushToRoute } = useSearchParamsUtil();

  const [page, setPage] = useState(0);
  const { data: cause, isLoading: isLoadingCause } =
    trpc.causes.getCauseById.useQuery({ id });
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingComments,
  } = trpc.comments.getComments.useInfiniteQuery(
    {
      limit: 9,
      causeId: id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const utils = trpc.useUtils();
  const { mutate: createComment, isLoading: isCreatingComment } =
    trpc.comments.createComment.useMutation({
      onMutate: async (values) => {
        await utils.comments.getComments.cancel();

        const previousComments = utils.comments.getComments.getData({
          causeId: id,
          limit: 9,
        });

        if (previousComments) {
          //@ts-ignore
          utils.comments.getComments.setInfiniteData({ causeId: id }, (old) => {
            if (old === undefined) {
              return {
                pages: [],
                pageParams: undefined,
              };
            }

            const withNewData = old.pages.map((page) => ({
              ...page,
              comments: [values, ...page.comments],
            }));

            return {
              ...old,
              pages: withNewData,
            };
          });
        }

        return { previousComments };
      },
      onError: (err, _, context) => {
        utils.comments.getComments.setData(
          { causeId: id },
          context?.previousComments
        );
        toast.error(err.message);
      },
      onSettled: () => {
        utils.comments.getComments.refetch();
      },
    });

  const comments = commentsData?.pages[page]?.comments;

  const form = useForm<NewCommentParams>({
    resolver: zodResolver(clientCommentParams),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = (values: NewCommentParams) => {
    createComment(
      {
        content: values.content,
        causeId: id,
      },
      {
        onSuccess: () => {
          toast.success("Successfully posted a comment!");
          form.reset();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  const handleFetchNextPage = () => {
    fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleBadgeClick = (catId: string) => {
    pushToRoute("/donations", "categoryId", catId);
  };

  const emojiButtonRef = useClickAway(() => {
    setIsPickingEmoji(false);
  });

  const handleEmojiClick = () => {
    setIsPickingEmoji(!isPickingEmoji);
  };

  const handleEmojiSelect = (emoji: Emoji) => {
    form.setValue("content", form.getValues("content") + emoji.native);
  };

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <div className="gap-3 flex flex-col lg:sticky lg:top-0">
        {!isLoadingCause ? (
          cause ? (
            <Carousel
              setApi={setApi}
              className="w-full relative"
              dotsPosition="bottom"
            >
              <BookmarkButton
                className="absolute top-0 right-0 z-10"
                cause={cause}
                loggedIn={isSignedIn ?? false}
              />
              <CarouselContent>
                {cause.media.map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="h-96 w-auto relative">
                      <Image
                        alt={cause.id}
                        src={cause.media[index].url}
                        className="object-cover rounded-lg h-full w-full"
                        fill
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots className="absolute bottom-0 z-10" size="sm" />
              {current !== 1 ? (
                <CarouselPrevious className="absolute left-0 inset-y-0 my-auto ml-4 z-10" />
              ) : null}
              {current < count ? (
                <CarouselNext className="absolute right-0 inset-y-0 my-auto mr-4 z-10" />
              ) : null}
            </Carousel>
          ) : null
        ) : (
          <Skeleton className="h-96 w-auto" />
        )}
        {!isLoadingCause ? (
          cause ? (
            <h5 className="font-semibold text-lg lg:text-2xl">{cause.title}</h5>
          ) : null
        ) : (
          <Skeleton className="w-full h-8" />
        )}
        {!isLoadingCause ? (
          cause ? (
            <>
              <div className="relative max-h-60 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary">
                <p
                  className={ny("text-muted-foreground", {
                    truncate: isTruncated,
                  })}
                >
                  {cause.description}
                </p>
                {isTruncated ? (
                  <button
                    className="absolute block right-0 text-primary inset-y-0 bg-gradient-to-r from-background/90 to-background px-4"
                    onClick={() => setIsTruncated(!isTruncated)}
                  >
                    ...more
                  </button>
                ) : null}
              </div>
              {!isTruncated ? (
                <Badge
                  className="w-fit cursor-pointer"
                  onClick={() => handleBadgeClick(cause.category.id)}
                >
                  {cause.category.name}
                </Badge>
              ) : null}
              {!isTruncated ? (
                <button
                  className="text-primary inset-y-0 border border-primary rounded-lg bg-gradient-to-r from-background/90 to-background px-4 py-2"
                  onClick={() => setIsTruncated(!isTruncated)}
                >
                  less
                </button>
              ) : null}
            </>
          ) : null
        ) : (
          <Skeleton className="h-6 w-full" />
        )}

        {!isLoadingCause ? (
          cause ? (
            <Progress value={cause.ratio} />
          ) : null
        ) : (
          <Skeleton className="h-4 w-full" />
        )}

        <div className="flex flex-col 2xl:items-center 2xl:flex-row 2xl:justify-between 2xl:gap-3 gap-1.5">
          <div className="flex flex-col gap-1.5 w-full">
            {!isLoadingCause ? (
              cause ? (
                <>
                  <p>Reached</p>{" "}
                </>
              ) : null
            ) : (
              <Skeleton className="h-5 w-40" />
            )}
            <div className="flex sm:items-center flex-col sm:flex-row gap-1.5">
              {!isLoadingCause ? (
                cause ? (
                  <>
                    <span className="flex items-center gap-1.5">
                      <p className="font-semibold text-primary truncate">
                        {currencyFormat(cause.donationSum)}
                      </p>
                      /
                    </span>
                    <p className="font-semibold truncate">
                      {currencyFormat(cause.targetAmount)}
                    </p>
                  </>
                ) : null
              ) : (
                <>
                  <Skeleton className="h-6 w-52 sm:w-full" />
                  <Skeleton className="h-6 w-52 sm:hidden" />
                </>
              )}
            </div>
          </div>

          {!isLoadingCause ? (
            cause ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DonateButton
                      loggedIn={isSignedIn ?? false}
                      cause={cause}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Donate to this cause</p>
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null
          ) : (
            <Skeleton className="sm:w-20 w-full h-10" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:overflow-y-auto lg:scrollbar-thin lg:scrollbar-track-transparent lg:scrollbar-thumb-primary">
        {!isLoadingComments ? (
          <h5 className="font-semibold text-lg lg:text-2xl">Comments</h5>
        ) : (
          <Skeleton className="w-32 h-8" />
        )}
        {!isLoadingComments ? (
          comments?.length ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                textAreaRef={textAreaRef}
                comment={comment}
                causeId={id}
              />
            ))
          ) : null
        ) : (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((v) => (
              <Skeleton className="w-full h-44" key={v} />
            ))}
          </div>
        )}

        {!isLoadingComments ? (
          <Form {...form}>
            <form
              className="p-2 sticky bottom-0 bg-background"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="flex flex-col lg:flex-row gap-1.5">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!isSignedIn || isCreatingComment}
                          ref={textAreaRef}
                          className="min-h-10 h-10 max-h-28"
                          placeholder="Add a comment..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-1.5">
                  {form.formState.isDirty && form.formState.isValid ? (
                    <Button
                      className="text-primary hover:text-primary"
                      variant="ghost"
                      type="submit"
                      disabled={isCreatingComment}
                    >
                      Post
                    </Button>
                  ) : null}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      disabled={isCreatingComment || !isSignedIn}
                      onClick={() => void handleEmojiClick()}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                    {isPickingEmoji ? (
                      <div
                        className="absolute top-0 right-0"
                        // @ts-ignore
                        ref={emojiButtonRef}
                      >
                        <Picker
                          data={data}
                          onEmojiSelect={(e: Emoji) =>
                            void handleEmojiSelect(e)
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </form>
          </Form>
        ) : (
          <div className="flex flex-col lg:flex-row gap-1.5">
            <Skeleton className="h-10 w-full" />

            <div className="flex items-center gap-1.5">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        )}
        <InfiniteScroll
          hasMore={hasNextPage ?? false}
          isLoading={isLoadingComments}
          next={handleFetchNextPage}
          threshold={1}
        >
          {hasNextPage && (
            <Loader2 className="my-4 h-8 w-8 animate-spin bg-foreground" />
          )}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default DonationDetail;
