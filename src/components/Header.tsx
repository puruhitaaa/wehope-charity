"use client";

import Link from "next/link";
import Container from "./Container";
import { Button, buttonVariants } from "./ui/button";
import { ny } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Bookmark, Cog, LucideActivitySquare, Menu } from "lucide-react";
import { navLinks } from "@/static/header";
import type { AuthSession } from "@/lib/auth/utils";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { SignOutButton } from "@clerk/nextjs";
import { additionalLinks, defaultLinks } from "@/config/nav";

type THeaderProps = {
  session?: AuthSession["session"];
};

function Header({ session }: THeaderProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const cleanedHref = href
      .replace(/^\/|\/$/g, "")
      .trim()
      .toLowerCase();
    const cleanedPathname = pathname
      .replace(/^\/|\/$/g, "")
      .trim()
      .toLowerCase();

    return cleanedPathname === cleanedHref;
  };

  return (
    <header className="h-14 sticky top-0 w-full z-50 bg-background/50 backdrop-blur">
      <Container className="flex items-center h-full justify-between">
        <Link className="font-bold inline-flex gap-3" href="/">
          <LucideActivitySquare className="text-primary" />
          WeHope
          <span className="sr-only">WeHope Inc</span>
        </Link>

        <nav className="md:flex gap-3 md:gap-6 hidden">
          {navLinks.map((link) => (
            <Link
              className={ny(
                "text-sm font-medium hover:border-primary border-b border-transparent transition-colors ease-out",
                {
                  "text-primary": isActive(link.href),
                  "text-muted-foreground": !isActive(link.href),
                }
              )}
              key={link.id}
              href={link.href}
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="flex gap-3 items-center">
          <div className="md:flex gap-3 items-center hidden">
            <Link
              href="/settings"
              className={buttonVariants({
                size: "icon",
                variant: "outline",
                className: "hidden md:flex",
              })}
            >
              <Cog className="h-5 w-5" />
            </Link>

            {!session ? (
              <Link
                href="/get-started"
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get Started
              </Link>
            ) : (
              <Link
                className={buttonVariants({
                  size: "icon",
                  variant: "outline",
                })}
                href="/bookmarks"
              >
                <Bookmark className="h-7 w-7 text-primary" />
              </Link>
            )}
          </div>

          <Sheet>
            <SheetTrigger
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: ny({ "md:hidden flex": !session }),
              })}
            >
              {!session ? (
                <Menu className="h-6 w-6" />
              ) : (
                <Image
                  alt={session.user.name ?? ""}
                  src={
                    session.user.imageUrl ??
                    "https://utfs.io/f/d065dd6c-5437-4ee9-90c5-ede92e374393-9kys5b.png"
                  }
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
            </SheetTrigger>
            <SheetContent className="w-full md:w-[25vw]">
              <SheetHeader className="sr-only">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  List of available links that can be clicked
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col divide-y divide-muted-foreground">
                <nav className="flex gap-3 flex-col py-2">
                  {navLinks.map((link) => (
                    <Link
                      className={ny(
                        "text-sm font-medium hover:border-primary border-b border-transparent transition-colors ease-out px-4 py-2",
                        {
                          "text-primary border-primary": isActive(link.href),
                          "text-muted-foreground": !isActive(link.href),
                        }
                      )}
                      key={link.id}
                      href={link.href}
                    >
                      {link.title}
                    </Link>
                  ))}

                  {defaultLinks.map((link) => {
                    if (link.href === "/account" && !session) return null;

                    return (
                      <Link
                        className={ny(
                          "text-sm font-medium hover:border-primary border-b border-transparent inline-flex lg:gap-3 gap-1.5 items-center transition-colors ease-out px-4 py-2",
                          {
                            "text-primary border-primary": isActive(link.href),
                            "text-muted-foreground": !isActive(link.href),
                          }
                        )}
                        key={link.title}
                        href={link.href}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.title}
                      </Link>
                    );
                  })}
                </nav>

                {session ? (
                  <>
                    {session.user.metadata?.role === "admin" ||
                    session.user.metadata?.role === "volunteer" ? (
                      <div className="py-2 flex flex-col gap-3">
                        <p className="capitalize text-sm text-muted-foreground">
                          {session.user.metadata.role} actions
                        </p>
                        <nav className="flex gap-3 flex-col">
                          {additionalLinks.map((a) =>
                            a.links.map((link) => (
                              <Link
                                className={ny(
                                  "text-sm font-medium transition-colors ease-out px-4 py-2 bg-secondary inline-flex lg:gap-3 gap-1.5 items-center hover:bg-secondary/80 rounded-lg",
                                  {
                                    "text-primary": isActive(link.href),
                                    "text-muted-foreground": !isActive(
                                      link.href
                                    ),
                                  }
                                )}
                                key={link.title}
                                href={link.href}
                              >
                                <link.icon className="h-5 w-5" />
                                {link.title}
                              </Link>
                            ))
                          )}
                        </nav>
                      </div>
                    ) : null}

                    <div className="py-2">
                      <SignOutButton>
                        <Button className="w-full" variant="destructive">
                          Sign Out
                        </Button>
                      </SignOutButton>
                    </div>
                  </>
                ) : (
                  <div className="py-2">
                    <Link
                      href="/get-started"
                      className={buttonVariants({ className: "w-full" })}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}

export default Header;
