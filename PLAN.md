# Portfolio — Build Plan (compact)

**Status:** Phases 0–4 built — `npm run lint`, `npx tsc --noEmit` and `npm run build` green, all four sections plus the contact form verified in Chrome and against the running server. **Open:** (a) `src/lib/data.ts` still holds placeholder employers, dates and metrics — real content is yours to fill; (b) sending is unproven without keys, so the form answers with the mailto fallback today. Next: **Phase 5 — polish + deploy**.

**Waiting on you:** (1) real content for `site.*`, `experience[]`, `projects[]`; (2) `public/memoji.png` (square, transparent, ≥1024px) — the hero shows a monogram circle until it exists; (3) `RESEND_API_KEY` + `CONTACT_TO_EMAIL` in `.env.local` **and in Vercel** — copy `.env.example`; Resend 403s unless `to` is your own account address.

## Stack (verified in repo)

- Next **16.3.4** App Router, React 19, typed routes (`LayoutProps<"/">`)
- Tailwind **v4** — tokens in `globals.css` under `@theme inline`, **no** `tailwind.config.*`
- shadcn CLI **4.21.0**, style **base-nova**, base **@base-ui/react** (Base UI, *not* Radix)
- `cn` from the `cn` npm package, re-exported in `src/lib/utils.ts`
- Generated: `ui/{button,card,input,textarea,field,label,sheet,separator,badge}.tsx`
- Only new dependency in the plan: `resend` (6.28.1)

## Locked decisions

- **D1 Memoji** — static PNG `public/memoji.png`: square, transparent, ≥1024px, cropped tight. Glow + one-shot entrance fade only.
- **D2 Contact** — Resend free tier via Server Action. With **no verified domain**: `from` must be `… <onboarding@resend.dev>` and `to` must be your own Resend account address, else **403**. Visitor email goes in `replyTo`. Verifying a domain later changes only `from`.
- **D3 Theme** — dark only, tokens in `.dark`, `<html class="dark">`. No light mode, no toggle.
- **D4 Content** — typed `src/lib/data.ts`. No CMS, no MDX.

## Tokens (applied)

Palette vars in `:root`, shadcn tokens in `.dark`, exposed to Tailwind via `@theme inline` (`--color-ink-black` → `bg-ink-black`, `text-ink-black`, …).

Mapping: `--background` ink-black · `--foreground` alabaster · `--card`/`--popover`/`--muted`/`--accent` prussian-blue · `--primary` alabaster + ink text · `--secondary` dusk-blue + alabaster text · `--muted-foreground` dusty-denim · `--border`/`--input` mix dusk-blue→ink · `--ring` dusty-denim.

Contrast (WCAG 2.1 computed): alabaster/ink **13.24** · alabaster/prussian **11.52** · alabaster/dusk **5.41 AA** · dusty/ink **5.11 AA** · dusty/prussian **4.45 — fails normal text** (ok large/bold) · dusk/ink **2.45 fails** · dusty/alabaster **2.59 fails** · ink/dusty **5.11 AA**.

Rules: `dusk-blue` is border/surface only, never text. Muted text on a card = `text-foreground/80` (≈11:1) or alabaster, never `text-muted-foreground`.

Phase 0 fix: `globals.css` had `--font-sans: var(--font-sans)` (circular); now `--font-geist-sans`, same for `--font-heading`.

## Files

```
app/layout.tsx              metadata, fonts, class="dark", <SiteHeader/>, footer   (done)
app/page.tsx                composes the 4 sections
app/globals.css             tokens (done)
app/actions/contact.ts      "use server" — validate, spam-guard, Resend
components/site-header.tsx  client — only nav file marked "use client"
components/icons.tsx        GitHub/LinkedIn marks (lucide v1 dropped brand icons)
components/sections/{hero,experience,projects,contact}.tsx
components/contact-form.tsx client useActionState inline status
lib/data.ts                 typed nav / experience / projects
components/ui/*             shadcn-generated only
public/memoji.png           D1 asset
```

Not installing `form` (pulls React Hook Form) or `sonner` (extra provider) for a two-field form.

## Sections

**Header** — monogram + name → `#top`; `hidden md:flex` 4 anchors, `text-sm text-foreground/80 hover:text-foreground`; `< md` lucide `MenuIcon` inside `Sheet`, `SheetClose` on each link. Wrapper: `sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur`. Sections get `scroll-mt-24`. Base UI has no `asChild`: use `render={<Button variant="ghost" size="icon" />}`; links styled as buttons take `buttonVariants({...})` in className.

**Hero** — `section#top` + `scroll-mt-24`, container `max-w-5xl px-4 sm:px-6 py-20 md:py-28`, grid `md:grid-cols-[1.1fr_0.9fr]`, so text comes first on mobile. Copy lives in `data.ts` (`site.name`, `site.role`, `hero.tagline`, `hero.stack`). `h1` name `text-4xl sm:text-5xl lg:text-6xl tracking-tight text-balance`, role `text-lg text-foreground/80`, tagline `text-muted-foreground` (146 chars, dusty-denim on ink = 5.11 AA), CTAs `h-11 px-5` → "See my work" `#projects` (alabaster/ink 13.24) + outline "Get in touch" `#contact`, then `Badge variant="secondary"` pills (dusk-blue/alabaster 5.41 AA).

**Memoji** — `memoji.tsx`, server component. `fs.existsSync(process.cwd()/public/memoji.png)` picks the branch, so a missing asset renders a monogram circle (`aspect-square rounded-full border border-border bg-card` + initials) — never a broken `<Image>`. Image branch: `next/image` with `width/height={1024}`, `priority`, `alt=""` (decorative — the name is adjacent), wrapper `w-[60%] max-w-[16rem] sm:w-64 lg:w-80`, glow `bg-[radial-gradient(circle_at_50%_40%,var(--dusty-denim),transparent_70%)] opacity-25 blur-2xl`. Both branches produce the same box, so swapping the asset in shifts nothing. Deferred to v2: float/tilt, blink swap, pointer parallax (then gate on `prefers-reduced-motion`). Rejected: Lottie, alpha-channel video loops.

**Experience** — data `{company, role, period, location?, bullets[], stack?}`; `<ol>` with `border-l border-border`, dusty-denim dot, role `font-medium text-foreground`, company/period `text-sm text-muted-foreground`. No timeline component; 2–4 bullets starting with a verb and a number where possible. Use `Separator` or `border-l`, not both.

**Projects** — data `{title, description (≤2 lines), tags[], href?, repo?, year?, featured?}`; `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`, shadcn Card parts, `bg-card border-border hover:border-dusty-denim/60` + `group`, footer `Badge variant="secondary"` per tag + ghost icon buttons (`GithubIcon`, `ArrowUpRightIcon`), external links `target="_blank" rel="noopener noreferrer"`. 3–6 projects; extras stay in data behind `featured`. Title-level link overlay `after:absolute inset-0` only if the footer keeps a visible affordance. Thumbnail optional (`aspect-[16/10]`, `object-cover`) — skip if you have no screenshot.

**Contact** — Email `Input type="email"` then Message `Textarea rows={5}`, each in `Field`/`FieldLabel`/`FieldDescription?`/`FieldError` inside `FieldGroup`, plus submit `Button`. Client uses `useActionState`; errors via `FieldError` + `data-invalid`/`aria-invalid`, success as inline `role="status"` block, no toast provider. Server Action re-validates server-side (it is directly POST-able), trims, rejects empty/>2000 chars, then:

```ts
from: process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>",
to: [process.env.CONTACT_TO_EMAIL!],   // your Resend account email
replyTo: email,                        // the visitor
subject: `Portfolio contact from ${email}`,
text: message,                         // plain text; escape anything interpolated
```

Handle `error` explicitly with a generic visitor-facing message, never leak the API error. Missing `RESEND_API_KEY`: log server-side + show `mailto:` fallback. Env (`.env.local` **and Vercel**): `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `RESEND_FROM` — missing in Vercel = deployed 500 while local works. Free tier 3,000/month, 100/day, 10 req/s. Spam guards: honeypot hidden input, min time-to-submit, in-memory IP limit 3/hour (per serverless instance — a speed bump). Also show plain email/GitHub/LinkedIn beside the form. Zero-dep alternative: `fetch("https://api.resend.com/emails", …)` with `Authorization: Bearer *** — same call, loses typed errors.

**Contact as built** — the honeypot is a `sr-only aria-hidden` block named `website` (a person never sees it, a filler bot fills it); `startedAt` lives in a hidden input stamped by a ref+effect after mount, so SSR and hydration markup agree and no-JS posts skip the check instead of failing it. Field errors render inside `Field` with `data-invalid` + `aria-invalid`, and the generic `role="alert"` block shows only when `!state.errors` (a field error already announces itself — two alerts per failure is noise). Sending-disabled states fall back to `site.email`, so a misconfigured deploy is still usable.

## Pitfalls (this repo)

1. **Base UI ≠ Radix** — `render={<Component/>}`, `data-starting-style`/`data-ending-style` replace `data-state`. Check `npx shadcn docs <component>` + `base-ui.com/react/components/<name>.md` before hand-editing generated files.
2. **React 19.2 + Next 16** — `FormData` actions, `useActionState` (not `useFormState`). Read `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` and `02-guides/forms.md` first; AGENTS.md says this version differs from training data.
3. Server Functions are directly POST-able — validate and rate-limit inside the action.
4. Don't hand-roll `ui/*` — generate, then adjust classNames only.
5. No `tailwind.config.ts`; a stray one is dead code.
6. **Tailwind v4 scans markdown** — class names in `PLAN.md` compiled ~5KB of dead CSS into `.next/static/chunks/*.css`. Fixed with `@source not "../../PLAN.md";` in `globals.css`. Any doc-heavy file added later needs the same line.
7. **Sheet width override — solved, and the mechanism matters.** `SheetContent` ships `data-[side=right]:w-3/4` (+ `sm:max-w-sm`). A plain `className="w-full max-w-xs"` **loses**: measured 281px on a 375px viewport, equal specificity, generated rule wins on order. Passing the *same variant* — `className="data-[side=right]:w-full max-w-xs"` — makes `cn` merge-drop the generated `w-3/4` outright → deterministic 320px, verified in the DOM. Use this whenever you must beat a shadcn component's built-in variant.
8. **Resend 403** = recipient other than your own account address without a verified domain. `onboarding@resend.dev` is test-only: verify a domain before sending this link to employers.
9. Delete CRA leftovers in `page.tsx` and the unused `public/*.svg` when sections land.
10. Keep `AGENTS.md`'s generated block intact (`next dev` rewrites it).
11. **lucide-react v1 has no brand icons** — `Github`, `Linkedin`, `Twitter` are gone, not deprecated (`GithubIcon === undefined`). Brand marks live in `src/components/icons.tsx` as inline SVG (path data copied from simple-icons; note simple-icons itself dropped LinkedIn from v14+, so copy from v13 or your own source). Lucide stays for UI icons (`MenuIcon`, `ArrowUpRightIcon`).
12. **A stale `.next/dev/lock` blocks `next dev`.** It reports "Another next dev server is already running" with a PID that no longer exists, and the port shows nothing listening. Delete `.next/dev/lock` and restart; don't go hunting for a phantom process.
13. **A `"use server"` file may only export async functions.** `export const initialContactState` there fails with TS71011. Export the *type* (erased, allowed) and keep the initial state in the client component.
14. **React 19 resets uncontrolled fields after an action runs** — so the form clears on success/failure on its own; don't `useState` every input. Stamping the timestamp/ref state via a state setter inside `useEffect` trips `react-hooks/set-state-in-effect`; write it into the DOM through a ref instead (`ref.current.value = String(Date.now())`, `defaultValue=""`).
15. **Don't hand-encode a direct POST to a Server Action to prove server-side validation.** The `$ACTION_REF_1` + `$ACTION_1:0`/`:1` + `$ACTION_KEY` multipart payload works against the build that rendered the page, then returns "Failed to find Server Action" (500) against a restarted dev server or a later bundle — a protocol artifact, not an app defect. Prove it through the browser's own submit (with `form.noValidate = true` to get past native validation) and read `document.querySelector('[role=alert]')`; that hits the identical server path.
16. **A timing guard and a rate limit returning the same string is untestable by eye.** Give each guard its own message, or you cannot tell which one fired.

## Phases

| Phase | Work | Done when | Est. |
|---|---|---|---|
| 0 ✅ | tokens, font fix, dark, metadata | utilities resolve | 0.5h |
| 1 ✅ | shadcn components + header + mobile Sheet + anchors | sticks/blurs, anchors land, menu closes at 375px | 1.5h |
| 2 ✅ | hero copy in `data.ts`, `sections/hero.tsx`, `memoji.tsx` (monogram branch until your PNG lands) | verified in Chrome: text-first at 375px, 2 columns at 1280px, avatar square 206x206 / 256x256, CLS 0 — image branch **and** fallback both exercised | 1h |
| 3 ✅ | `data.ts` content + Experience + Projects sections | components verified in Chrome (1/2/3-col grid at sm/md/lg, `rel="noopener"`); **content is still placeholder** — see Notes | 2h |
| 4 ✅ | contact + action + Resend + guards | verified: empty submit blocked by native validation, bogus email rejected inside the action (direct POST returned the field error), honeypot returns success with **no** send, sub-2s submit rejected, 4th submission in an hour rate-limited, missing key renders the `mailto:` fallback. **Mail delivery itself still unproven — needs the keys** | 1.5h |
| 5 | polish + deploy | keyboard tab-through, focus rings, Lighthouse mobile ≥95, Vercel env set, live URL checked on phone | 1.5h |

Total ≈ 8h.

## Out of scope v1

Memoji animation, light mode, blog/MDX, CMS (Directus/Supabase), i18n, analytics, project detail pages, contact persistence, auto-reply.

v2 order by learning value: project detail routes → Postgres/Supabase behind projects → contact log table + admin auth → CI, Docker, deploy pipeline.

## Where we are (end of Phase 3)

**Done and verified.** `npm run lint` and `npm run build` green after every phase.

| | State |
|---|---|
| Tokens | 5 palette colors → `:root` vars → `.dark` shadcn tokens → Tailwind utilities (`bg-ink-black`, `text-dusty-denim`…); circular `--font-sans` fixed; `@source not` keeping this file's class names out of the CSS |
| Header | sticky/blurred, logo + desktop nav + Base UI Sheet burger, skip link. Chrome: 320/375/1280px, `role=dialog` named "Navigation", 320px sheet, link tap closes + lands section 31px under the header, Esc closes, first Tab hits the skip link |
| Hero | name/role/tagline + 2 CTAs + 5 stack badges, text-first on mobile, 2 columns at 1280px, CLS 0, no horizontal scroll at 320px |
| Memoji | both branches exercised: with a throwaway 1024px PNG the optimizer served it (attrs 1024x1024, rendered 206→256px square), and with the file absent the monogram circle renders — same box, zero shift. **No placeholder asset shipped** |
| Experience | `<ol>` timeline, `border-l` + 8px dusty-denim dots (measured: dot centre lands on the border line, −4px from the `li` edge, 2px above the `h3` centre), role/period baseline-aligned from `sm` up, verb-led bullets, `Badge variant="secondary"` stack rows |
| Projects | 4 featured cards (2 more sit in `data.ts` behind `featured: false`); 1 col at 375px, 2 at 640/768px, 3 at 1024/1280px, equal row heights, no clipping, no horizontal overflow at 375px; every external link `target="_blank" rel="noopener noreferrer"` with an `aria-label` on icon-only ones |
| Card colours (measured) | card `#1b263b` prussian, tag badges `#415a77` dusk-blue, description alabaster at 80% — the `text-muted-foreground` default on `CardDescription`/`CardFooter` is overridden so nothing drops below 11:1 |
| Files | `globals.css`, `layout.tsx`, `page.tsx`, `components/site-header.tsx`, `components/memoji.tsx`, `components/sections/{hero,experience,projects}.tsx`, `components/icons.tsx`, `lib/data.ts`, `lib/utils.ts`, `components/ui/*` (9 files). `public/*.svg` (create-next-app leftovers) deleted — nothing referenced them |

**Notes on Phase 3**

- **Content is placeholder.** `site.name`/`email`/`github`/`linkedin` are still `"Your Name"` / `you@example.com` / `yourhandle`, and the two experience entries, their dates and the LCP metric are invented to give the layout something to render. Replace them before this link goes anywhere.
- Shape is typed and cheap to extend: `Experience = {company, role, period, location?, bullets[], stack?}`, `Project = {title, description, tags[], href?, repo?, year?, featured?}`. `featured: false` keeps a project in the file without rendering it.
- Card link strategy: no `after:absolute inset-0` title overlay (it would sit on top of the footer's icon buttons); the title is a link only when `href` exists, and the footer carries the GitHub/live affordances.
- `hover:ring-dusty-denim/60` beats the generated `ring-foreground/10` because `Card` uses `ring-1` here, not `border` — same class group, so `cn` merges rather than fighting order (pitfall 7).

## Where we are (end of Phase 4)

**Done and verified in Chrome against a running server**, `npx tsc --noEmit` + `npm run lint` + `npm run build` green.

| | State |
|---|---|
| Contact form | `Input type="email"` + `Textarea rows={5}` in `FieldGroup`, labels bound, `required` + `type=email` for the no-JS path; empty submit → `checkValidity() === false`, "Please fill out this field." |
| Server-side validation | bogus email reaches the action and comes back as `{"status":"error","errors":{"email":"That does not look like a valid email address."}}` with `aria-invalid="true"` and `data-invalid` on the field — measured on a POST that did not come from the form |
| Honeypot | filled `website` field → success state, **0** `[contact]` lines in the server log: the send path is never entered |
| Timing guard | submit inside 2s of mount → "That was submitted too quickly — please try again." |
| Rate limit | 4 submissions from one IP in a row: 3 allowed, 4th → "Too many messages from this connection…" |
| Missing key | no `RESEND_API_KEY` → generic message + `mailto:you@example.com` link, `[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set` logged server-side |
| Right column | mailto + GitHub + LinkedIn from `site.*`, brand marks inline SVG, external links `noopener noreferrer`, dot hues from the palette |
| Files added | `src/app/actions/contact.ts`, `src/components/contact-form.tsx`, `src/components/sections/contact.tsx`, `.env.example` (un-ignored in `.gitignore`); `contact.blurb` in `data.ts`; `resend@6.28.1` |

**Notes on Phase 4**

- **Delivery is the one unproven link.** Everything up to `resend.emails.send` is exercised; a real send needs `RESEND_API_KEY` + `CONTACT_TO_EMAIL`. Test the Reply-To once it lands: reply in the inbox, confirm it reaches the visitor's address.
- The action's guard order is validate → honeypot → timing → rate limit → send, so a validation failure never burns a rate-limit slot (which is what made the tests above repeatable).
- Rate limiting keys on `x-forwarded-for` → `x-real-ip`, per serverless instance, Map pruned past 1000 keys. A speed bump, not a guarantee.
- No new UI dependency: `Field` + `FieldError` + inline `role="status"`/`role="alert"` instead of shadcn `form`/`sonner`.

**Next (Phase 5):** keyboard tab-through and focus rings on the form, Lighthouse mobile ≥95, Vercel env (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`), live URL checked on a phone.

**Uncommitted:** Phases 3–4 changes (new section components, `actions/contact.ts`, `contact-form.tsx`, `data.ts`, `page.tsx`, `.env.example`, `.gitignore`, deleted `public/*.svg`, this file) are staged nowhere — worth a checkpoint commit now that the tree is green.
