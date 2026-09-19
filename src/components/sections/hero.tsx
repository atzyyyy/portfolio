import Link from "next/link";

import { Memoji } from "@/components/memoji";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { hero, site } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="top-title"
      className="scroll-mt-24 border-b border-border/60"
    >
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <h1
            id="top-title"
            className="font-heading text-4xl font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {site.name}
          </h1>

          <p className="mt-3 text-lg text-foreground/80 sm:text-xl">
            {site.role}
          </p>

          <p className="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground">
            {hero.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#projects"
              className={buttonVariants({ className: "h-11 px-5" })}
            >
              See my work
            </Link>
            <Link
              href="#contact"
              className={buttonVariants({
                variant: "outline",
                className: "h-11 px-5",
              })}
            >
              Get in touch
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2">
            {hero.stack.map((item) => (
              <li key={item}>
                <Badge variant="secondary">{item}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <Memoji />
      </div>
    </section>
  );
}
