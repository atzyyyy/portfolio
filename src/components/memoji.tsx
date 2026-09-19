import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

import { site } from "@/lib/data";

/**
 * Static avatar. Drop your Memoji export at `public/memoji.png`:
 * square, transparent background, at least 1024x1024 so it stays crisp on
 * retina. Until that file exists this renders a monogram placeholder — never a
 * broken <Image>.
 */
const ASSET_SIZE = 1024;

export function Memoji() {
  const hasAsset = fs.existsSync(
    path.join(process.cwd(), "public", "memoji.png")
  );

  return (
    <div className="relative mx-auto w-[60%] max-w-[16rem] sm:w-64 lg:w-80">
      {/* soft glow — stops a flat PNG from reading as a sticker */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,var(--dusty-denim),transparent_70%)] opacity-25 blur-2xl"
      />

      {hasAsset ? (
        <Image
          src="/memoji.png"
          // decorative: your name sits right next to it in the h1
          alt=""
          width={ASSET_SIZE}
          height={ASSET_SIZE}
          priority
          className="relative h-auto w-full rounded-full object-contain"
        />
      ) : (
        <div
          aria-hidden
          className="relative grid aspect-square place-items-center rounded-full border border-border bg-card"
        >
          <span className="font-heading text-4xl font-medium text-foreground/70 sm:text-5xl">
            {site.initials}
          </span>
        </div>
      )}
    </div>
  );
}
