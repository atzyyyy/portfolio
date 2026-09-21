import { ImageResponse } from "next/og";

import { hero, site } from "@/lib/data";

// Palette mirrors the tokens in globals.css — Satori can't read CSS variables.
const ink = "#0d1b2a";
const prussian = "#1b263b";
const dusk = "#415a77";
const alabaster = "#e0e1dd";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ink,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: alabaster,
              color: ink,
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            {site.initials}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: alabaster }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: -2,
              color: alabaster,
            }}
          >
            {site.role}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#778da9",
            }}
          >
            {hero.tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {hero.stack.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: prussian,
                border: `1px solid ${dusk}`,
                color: alabaster,
                fontSize: 24,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
