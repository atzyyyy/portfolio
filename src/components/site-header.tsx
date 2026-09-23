"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { navItems, site } from "@/lib/data";

const externalLinks = [
  { label: "GitHub", href: site.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: site.linkedin, Icon: LinkedInIcon },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="#top"
          aria-label={site.name}
          className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {/* the icon is black line art — it needs the light chip behind it */}
            <Image
              src="/icon.png"
              alt=""
              width={285}
              height={285}
              priority
              className="size-9 object-contain rounded-full"
            />

        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-foreground/80 outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {item.label}
            </Link>
          ))}

          <span aria-hidden className="mx-1 h-5 w-px bg-border" />

          {externalLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <Icon />
            </a>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>

          <SheetContent side="right" className="data-[side=right]:w-full max-w-xs">
            <SheetHeader>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-3 pb-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base text-foreground/80 outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex items-center gap-1 border-t border-border/60 p-3">
              {externalLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
