import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

import { site } from "@/lib/data";

/**
 * Avatar. Drop a Memoji export in `public/`, highest priority first:
 *
 * - `memoji.webm` + `memoji.mp4` — animated video, wins when either exists.
 *   `memoji-poster.jpg` is used as the poster frame when present. Both are
 *   400x300 on a solid black background. A GIF export is stuck at ~15fps with
 *   browser-quantised frame delays (jittering 60/70ms), so the video copy plays
 *   smoother and is ~15x smaller (264KB vs 2.1MB).
 *   Regenerate from the GIF with FFmpeg (60fps motion-interpolated + WebM):
 *     ffmpeg -i memoji.gif -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:\
 *       me_mode=bidir:vsbmc=1,format=yuv420p" -c:v libx264 -crf 18 \
 *       -preset slow -movflags +faststart -an memoji.mp4
 *     ffmpeg -i memoji.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -an memoji.webm
 * - `memoji.gif` — animated GIF fallback. Served as-is because the Next image
 *   optimizer only keeps a GIF's first frame, so pass `unoptimized`.
 * - `memoji.png` — still: square, transparent background, ≥1024px.
 *
 * Every asset is a 4:3 or square render on a solid black background, so the
 * wrapper is a square, `object-cover` drops the empty side margins, and
 * `mix-blend-lighten` makes the black vanish into the page instead of reading
 * as a black disc. Until one of the files exists this renders a monogram
 * placeholder — never a broken <Image>.
 */
const VIDEO = [
  { src: "/memoji.webm", type: "video/webm" },
  { src: "/memoji.mp4", type: "video/mp4" },
] as const;

const STILL = {
  gif: { src: "/memoji.gif", width: 400, height: 300, unoptimized: true },
  png: { src: "/memoji.png", width: 1024, height: 1024, unoptimized: false },
} as const;

const ROOT = path.join(process.cwd(), "public");

function exists(file: string) {
  return fs.existsSync(path.join(ROOT, file));
}

function pickAsset() {
  const videos = VIDEO.filter((v) => exists(path.basename(v.src)));

  if (videos.length > 0) {
    return {
      kind: "video" as const,
      videos,
      poster: exists("memoji-poster.jpg") ? "/memoji-poster.jpg" : undefined,
    };
  }

  for (const ext of ["gif", "png"] as const) {
    if (exists(`memoji.${ext}`)) {
      return { kind: "still" as const, asset: STILL[ext] };
    }
  }

  return null;
}

export function Memoji() {
  const asset = pickAsset();

  return (
    <div className="relative mx-auto aspect-square w-[70%] max-w-[24rem] sm:w-72 lg:w-96">
      {asset?.kind === "video" ? (
        <video
          // decorative: your name sits right next to it in the h1
          aria-hidden
          width={400}
          height={300}
          poster={asset.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="relative h-full w-full object-cover mix-blend-lighten"
        >
          {asset.videos.map((v) => (
            <source key={v.src} src={v.src} type={v.type} />
          ))}
        </video>
      ) : asset?.kind === "still" ? (
        <Image
          src={asset.asset.src}
          // decorative: your name sits right next to it in the h1
          alt=""
          width={asset.asset.width}
          height={asset.asset.height}
          priority
          unoptimized={asset.asset.unoptimized}
          className="relative h-full w-full object-cover mix-blend-lighten"
        />
      ) : (
        <div
          aria-hidden
          className="relative grid h-full w-full place-items-center rounded-full border border-border bg-card"
        >
          <span className="font-heading text-4xl font-medium text-foreground/70 sm:text-5xl">
            {site.initials}
          </span>
        </div>
      )}
    </div>
  );
}
