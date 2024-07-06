"use client";

import { SignInButton, useSession } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Heart } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { RouterOutput } from "@/lib/trpc/utils";
import { usePathname } from "next/navigation";
import { ny } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

type TLikeButtonProps = {
  comment: RouterOutput["comments"]["getComments"]["comments"][number];
};

function LikeButton({ comment }: TLikeButtonProps) {
  const { isLoaded, isSignedIn } = useSession();
  const pathname = usePathname();
  const utils = trpc.useUtils();

  const { mutate: toggleLike, isLoading: isLoadingLike } =
    trpc.likes.toggleLike.useMutation({
      onMutate: async () => {
        await utils.comments.getComments.cancel();
        //@ts-ignore
        utils.comments.getComments.setInfiniteData({}, (old) => {
          if (old === undefined) {
            return {
              pages: [],
              pageParams: undefined,
            };
          }

          const newData = old.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) => {
              if (c.id === comment.id) {
                return {
                  ...c,
                  isLiked: !comment.isLiked,
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
      },
      onSettled: () => {
        utils.comments.getComments.refetch();
      },
    });

  const handleLikeClick = () => {
    toggleLike(
      { isLiked: comment.isLiked, commentId: comment.id },
      {
        onSuccess: () => {
          toast.success(
            `Successfully ${comment.isLiked ? "un" : ""}liked a comment.`
          );
        },
        onError: () => {
          toast.error(
            `Failed to ${comment.isLiked ? "un" : ""}like a comment.`
          );
        },
      }
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        {!isSignedIn ? (
          <SignInButton mode="modal" forceRedirectUrl={pathname}>
            <TooltipTrigger
              className={buttonVariants({
                size: "icon",
                variant: "outline",
              })}
              disabled={!isLoaded}
            >
              <Heart className="h-5 w-5 text-pink-500" />
            </TooltipTrigger>
          </SignInButton>
        ) : (
          <TooltipTrigger
            className={buttonVariants({
              size: "icon",
              variant: "outline",
            })}
            disabled={!isLoaded || isLoadingLike}
            onClick={() => handleLikeClick()}
          >
            <Heart
              className={ny("h-5 w-5 text-pink-500", {
                "fill-pink-500": comment.isLiked,
              })}
            />
          </TooltipTrigger>
        )}
        <TooltipContent>
          <p>{!comment.isLiked ? "Like" : "Unlike"} comment</p>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LikeButton;
