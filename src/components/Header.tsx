"use client";

import Link from "next/link";
import Container from "./Container";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LucideActivitySquare } from "lucide-react";
import { navLinks } from "@/static/header";

function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname.trim().toLowerCase() === href.trim();
  return (
    <header className="h-14 sticky top-0 w-full z-50 bg-background/50 backdrop-blur">
      <Container className="flex items-center h-full justify-between">
        <Link className="font-bold inline-flex gap-3" href="/">
          <LucideActivitySquare className="text-primary" />
          WeHope
          <span className="sr-only">WeHope Inc</span>
        </Link>

        <nav className="flex gap-3 md:gap-6">
          {navLinks.map((link) => (
            <Link
              className={cn(
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

        <Link
          href="/get-started"
          className={buttonVariants({
            size: "sm",
            className: "hidden md:flex",
          })}
        >
          Get Started
        </Link>
      </Container>
    </header>
  );
}

export default Header;
