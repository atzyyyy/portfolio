# Portfolio — Build Plan (compact)

**Status:** Phases 0–5b built, verified and deployed. `data.ts` now carries real content — identity, three real employers, two paid freelance projects — and Resend is configured: `vercel env ls` shows `RESEND_API_KEY` + `CONTACT_TO_EMAIL` as Secrets on Production and Preview, and both sit in `.env.local`. `npm run lint`, `npx tsc --noEmit` and `npm run build` green on the current tree. **Open:** (a) that content is **uncommitted and undeployed** — the production alias still serves the 5b build (`<title>Your Name — …`), and the `vercel --prod` fired 20 minutes ago is stuck at status `UNKNOWN` with no logs (see Phase 5c); (b) `public/memoji.png` still absent, so the deploy shows the monogram circle; (c) delivery through the **deployed** form is still unproven — it cannot have been exercised while the alias serves the pre-credential build. Next: **commit, redeploy, send one real message, phone pass**.

**Waiting on you:** (1) `public/memoji.png` (square, transparent, ≥1024px) — the hero shows a monogram circle until it exists; (2) a call on the stuck deployment: cancel and re-run `vercel --prod`, or diagnose the 20-minute `UNKNOWN` build; (3) one real message through the deployed form once it lands, confirming delivery **and** the Reply-To; (4) a phone pass over the deployed URL.

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

Mapping: `--background` ink-black · `--foreground` alabaster · `--card`/`--popover`/`--muted`/`--accent` prussian-blue · `--primary` alabaster + ink text · `--secondary` dusk-blue + alabaster text · `--muted-foreground` dusty-denim · `--border`/`--input` mix dusk-blue→ink · `--ring` **alabaster** (changed in Phase 5 — see below).

Focus rings: every generated component draws its ring as `ring-ring/50`, and Tailwind resolves that to `color-mix(in oklab, var(--ring) 50%, transparent)`. Dusty-denim at 50% composites to 2.12:1 on ink and 2.06:1 on a card, both under the 3:1 that WCAG 1.4.11 asks of a focus indicator. Alabaster at 50% measures 3.79:1 on ink and 3.66:1 on a card, so the ring token moved to alabaster; the token had to change rather than the call sites, because the `/50` lives inside the generated components.

Contrast (WCAG 2.1 computed): alabaster/ink **13.24** · alabaster/prussian **11.52** · alabaster/dusk **5.41 AA** · dusty/ink **5.11 AA** · dusty/prussian **4.45 — fails normal text** (ok large/bold) · dusk/ink **2.45 fails** · dusty/alabaster **2.59 fails** · ink/dusty **5.11 AA** · alabaster-50%-ring/ink **3.79** (focus indicator, passes non-text) · alabaster-50%-ring/prussian **3.66** (passes non-text) · alabaster-80%/prussian **7.58** (project year, was dusty-denim 4.45 and failed at 12px).

Rules: `dusk-blue` is border/surface only, never text. Muted text on a card = `text-foreground/80` (≥7.5:1) or alabaster, never `text-muted-foreground`. Anything that is text *and* small *and* sits on a card — tags, years, footers — must not use `text-muted-foreground` either; that pair is 4.45:1 and misses the 4.5 floor.

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
17. **A `next dev` server left holding :3000 silently answers `npm run start`.** The port check passes, the page renders, and Lighthouse then scores the dev bundle: 90/96/100/100 with ~240 KiB of "unminified" JS and a `next-devtools` chunk in the waterfall. Confirm which server you are measuring with `lsof -nP -i :3000` (look for `next dev` vs `next-server`), or serve the production build on another port (`PORT=3001 npm run start`) so the dev server keeps its hot reload.
18. **Reading `getComputedStyle(el).boxShadow` immediately after a Tab returns the pre-transition value on any element with `transition-all`** — a 0-width, transparent ring, i.e. a false "no focus indicator" reading. `buttonVariants` uses `transition-all`, plain links use `transition-colors`, which is why only buttons looked broken. Wait ~350ms after the keystroke (or read after the transition ends) before concluding anything about focus styles.
19. **A focus ring that "looks fine" can still fail 1.4.11.** `ring-ring/50` resolves through `color-mix(in oklab, …)`, so the rendered colour is not the token colour; compute the *composited* ratio against the surface behind it. Dusty-denim read as alabaster-calibre on the palette sheet and measured 2.12:1 rendered.
20. **A programmatic `.click()` does not open a Base UI `Sheet` the way a person does.** Focus stayed on `<body>` and Tab walked the page behind the dialog, which reads as a broken focus trap. Dispatching a real event through CDP (`Input.dispatchMouseEvent` with `mousePressed`/`mouseReleased`, `Input.dispatchKeyEvent` for Tab/Escape) fixes the reading and is the only honest way to test focus behaviour: focus then enters the dialog, wraps in both directions, and returns to the trigger on close.

## Phases

| Phase | Work | Done when | Est. |
|---|---|---|---|
| 0 ✅ | tokens, font fix, dark, metadata | utilities resolve | 0.5h |
| 1 ✅ | shadcn components + header + mobile Sheet + anchors | sticks/blurs, anchors land, menu closes at 375px | 1.5h |
| 2 ✅ | hero copy in `data.ts`, `sections/hero.tsx`, `memoji.tsx` (monogram branch until your PNG lands) | verified in Chrome: text-first at 375px, 2 columns at 1280px, avatar square 206x206 / 256x256, CLS 0 — image branch **and** fallback both exercised | 1h |
| 3 ✅ | `data.ts` content + Experience + Projects sections | components verified in Chrome (1/2/3-col grid at sm/md/lg, `rel="noopener"`); **content is still placeholder** — see Notes | 2h |
| 4 ✅ | contact + action + Resend + guards | verified: empty submit blocked by native validation, bogus email rejected inside the action (direct POST returned the field error), honeypot returns success with **no** send, sub-2s submit rejected, 4th submission in an hour rate-limited, missing key renders the `mailto:` fallback. **Mail delivery itself still unproven — needs the keys** | 1.5h |
| 5a ✅ | polish: keyboard pass, focus-ring token + contrast, Lighthouse on the production build | 21 focusables in DOM order, each with a ≥3:1 focus indicator; Lighthouse mobile **99/100/100/100** on the production build; `lint`/`tsc`/`build` green | 1h |
| 5b | deploy: Vercel project + env, live URL checked on a phone | project linked and a production deploy `Ready` at `portfolio-iota-five-kx6zoj4yl0.vercel.app`; **remaining:** the two Resend vars on the project (needs your account) and the phone pass — the vars landed in Phase 5c | 1h |
| 5c ✅ in repo | real content: `site.*`, `experience[]`, `projects[]`, projects copy | three real employers with stack badges and two paid freelance projects render; scaffolding projects hidden behind `featured: false`; `lint`/`tsc`/`build` green. **Not committed, not deployed** — see Phase 5c | 1h |

Total ≈ 9h.

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

- ~~**Content is placeholder.**~~ **Resolved in Phase 5c:** `site.*`, `experience[]` and `projects[]` now hold real values, and the invented employers/metrics are gone. The scaffolding projects stay in `data.ts` behind `featured: false`.
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

## Where we are (Phase 5a — polish done, deploy outstanding)

**Measured on the production build** (`npm run build` → `PORT=3001 npm run start`), Lighthouse mobile against `http://localhost:3001/`, keyboard driven through real CDP Tab/Esc keystrokes. `npm run lint`, `npx tsc --noEmit` and `npm run build` green.

| | State |
|---|---|
| Lighthouse mobile (prod) | performance **99**, accessibility **100**, best-practices **100**, SEO **100** — LCP 2.1 s, TBT 40 ms, CLS 0, FCP 0.8 s. The same page scored 90/96/100/100 earlier purely because a `next dev` server was still holding :3000 (pitfall 17) |
| Keyboard tab-through (1280px) | 21 focusables, DOM order = tab order: skip link → logo → Experience → Projects → Contact → GitHub → LinkedIn → both hero CTAs → card title → card icon links → email input → message textarea → submit → the three contact links, then focus leaves the document. No positive `tabindex`, no unreachable control |
| Focus rings | all 21 report a visible indicator once the transition settles. The token fix moved `--ring` from dusty-denim to alabaster: the rendered `ring-ring/50` composites to **3.79:1** on ink and **3.66:1** on a card, versus **2.12:1** / **2.06:1** before, which failed the 3:1 non-text minimum |
| Nav-link rings | desktop and mobile nav links now carry `outline-none focus-visible:ring-3 focus-visible:ring-ring/50` like the rest of the UI, instead of falling back to the UA outline |
| Card year text | `CardAction` on cards was `text-muted-foreground` — dusty-denim on prussian, **4.45:1**, Lighthouse's only accessibility failure (12 px, normal weight). Now `text-foreground/80` = **7.58:1**; accessibility went 96 → 100 |
| 375px pass | no horizontal overflow, `overflow` false at every step; hamburger is reachable by Tab with a ring; the desktop nav is not in the tab order while hidden |
| 375px Sheet trap — **pass** | verified with a trusted mouse click over CDP `Input.dispatchMouseEvent`; the earlier "unproven" reading came from a programmatic `.click()`, which Base UI does not treat as a gesture. Focus enters the dialog, 8 forward Tabs and 4 Shift+Tabs cycle all six focusables (Experience, Projects, Contact, GitHub, LinkedIn, Close) and wrap without leaving `[role=dialog]`; Esc closes and returns focus to the "Open menu" button; `main` carries `aria-hidden="true"` while open |
| Deploy prep | `metadataBase` plus Open Graph/Twitter metadata in `layout.tsx`, with the absolute base resolved from `NEXT_PUBLIC_SITE_URL`, then `VERCEL_PROJECT_PRODUCTION_URL` (Vercel sets it at build time), then localhost — a deploy gets correct absolute URLs with no configuration. `opengraph-image.tsx` generates the 1200×630 card from `data.ts`; served as `image/png`, prerendered static. Title, description and `og:site_name` now read from `data.ts` instead of being typed a second time |
| Deploy | not started, and not startable from the repo: `vercel` CLI is not installed and there is no logged-in session, and setting `RESEND_API_KEY`/`CONTACT_TO_EMAIL` means handling secrets, which stays with you. Repo is ready: `origin = git@github.com:atzyyyy/portfolio.git` answers over SSH (`git ls-remote` verified), Phase 4 is already pushed, build green |

**Files touched in Phase 5a:** `src/app/globals.css` (`--ring`), `src/components/sections/projects.tsx` (year colour), `src/components/site-header.tsx` (focus rings on both nav lists), `src/app/layout.tsx` (metadata), `src/app/opengraph-image.tsx` (new), `.env.example` (`NEXT_PUBLIC_SITE_URL`), this plan.

### Deploy checklist (Phase 5b)

1. **Linked and deployed.** `vercel` CLI 59.23.2 at `~/.local/bin/vercel`, logged in as `atzyyyy`, repo linked to `atzyyyys-projects/portfolio` (`.vercel/project.json`), production deployment `Ready`. **Still to do:** the two env vars, which need your Resend account — write them into `.env.local` (copy `.env.example`) and they can be pushed to the project for Production and Preview without the values passing through chat: `set -a; . ./.env.local; set +a; for e in production preview; do for k in RESEND_API_KEY CONTACT_TO_EMAIL; do printf '%s' "${!k}" | vercel env add "$k" "$e"; done; done`, then `vercel --prod` to rebuild. `vercel env ls` currently reports *No Environment Variables found*.
2. `vercel --prod`, then check the deployed URL on a phone: sticky header, anchors landing under it, 375px sheet, form submit.
3. Send one real message through the deployed form and confirm delivery plus the Reply-To. Until a domain is verified at resend.com/domains, `from` stays `onboarding@resend.dev` and `to` must be your own Resend account address (pitfall 8).
4. ~~Set `metadataBase` and add an OG image~~ — **done in the repo** (Phase 5b prep). `metadataBase` falls back to `VERCEL_PROJECT_PRODUCTION_URL`, so previews already resolve on the deploy; set `NEXT_PUBLIC_SITE_URL` only when you point a custom domain at it. The generated card reads `site.name`, `site.role`, `hero.tagline` and `hero.stack`, so it tracks `data.ts` with no second copy to maintain. Check the card renders after the deploy with the Facebook Sharing Debugger or `opengraph.xyz`; both cache, so re-scrape after a content change.

**Commit** `6ae46ee` on `master` carries the phase 5a/5b-prep changes, and it is **pushed** (`origin/master` matches). **Checked (Git integration):** `GET /v9/projects/{id}` returns no `link` object and the project has 0 deployment hooks, so the Git integration is **not** connected — a `git push` does **not** deploy, and `vercel --prod` stays mandatory after any content change. Connecting it (`vercel git connect`, or Project → Settings → Git) grants Vercel read access to the GitHub repo and needs your GitHub authorization, so it is left to you. The production deployment in the API (`v6/deployments`, target `production`, state `READY`) reports `source: master`, `sha: 6ae46ee` — it matches the pushed commit.

### Where we are (Phase 5b — deployed, secrets pending)

**Measured against the live production deployment** (`https://portfolio-iota-five-kx6zoj4yl0.vercel.app`, the production alias; `vercel ls` also lists the per-deploy URL `portfolio-pcowcljqx-…`). `npm run lint`, `npx tsc --noEmit` and `npm run build` re-run green on the current tree.

| | State |
|---|---|
| Deploy | `vercel ls` → one deployment, **Ready**, Production, 52s build, user `atzyyyy`. Repo pushed: `master` = `origin/master` = `6ae46ee` |
| Live page | `200` at 1280px and at an emulated 375px, no horizontal overflow, hamburger present, sticky header and anchors intact |
| Metadata on the deploy | `<title>Your Name — …` and the description resolve from `data.ts`; `og:url` = the production alias, `og:image` = `/opengraph-image?34c1abc9…`, which returns **200, `image/png`, 65 KB** — `VERCEL_PROJECT_PRODUCTION_URL` fallback works with no configuration |
| Memoji on the deploy | `document.images.length === 0` and the monogram circle rendered: `public/memoji.png` is absent, so the fallback branch is what ships |
| Live form | Filled and submitted through the browser: generic `role="alert"` "Could not send your message right now. Email me directly instead." plus `mailto:you@example.com` — the missing-key path, exactly as designed, because the project has no env vars |
| Env vars | `vercel env ls` → **No Environment Variables found**; `.env.local` holds only `VERCEL_OIDC_TOKEN`. This is the one thing standing between the live form and real delivery — **resolved in Phase 5c**: both vars are now Secrets on Production and Preview |
| `robots.txt` | `404` — Next serves none; `app/robots.ts` + `app/sitemap.ts` are the smallest fix if you want crawlers and a sitemap. Not in the v1 scope, and SEO already scores 100 |

**Files touched in Phase 5b:** none in the repo — the deploy used the phase 5a commit as-is. This plan file is the only edit since, plus the local `.vercel/project.json` and `.env.local` (both ignored).

**Uncommitted:** the Phase 5b status update to this plan only. Everything else is committed and pushed; there is no `vercel.json`, no CI workflow and no custom domain.

### Where we are (Phase 5c — real content in, Resend wired, deploy still serving the 5b build)

`npm run lint` + `npx tsc --noEmit` + `npm run build` green on the current tree. None of it is committed, none of it is live.

| | State |
|---|---|
| `site.*` | Real and staged: `Fourthram Kaimo` / `FK` / `Full-Stack Developer` / `fourthramkaimo@gmail.com` / `github.com/atzyyyy` / `linkedin.com/in/fourthramkaimo` — metadata, header, contact links and the OG image all read from it |
| `experience[]` | Three real entries replace the two invented ones: **From Here** (Software Engineer / Front End Developer, Oct 2023 — Jul 2026, New Zealand · Remote, 50+ client sites), **Health and Wellness Solutions** (Tech Intern, Jun–Nov 2022, Davao City), **Hayahay!** (Web Development Intern, Jul–Dec 2021, Davao City). Stacks: Nuxt 3 · Sass · Bootstrap · Tailwind CSS · Laravel · Directus / React · Material UI / MongoDB · Express · Angular · Node.js. Only the 50+ sites is a real metric; the rest stayed qualitative rather than invented |
| `projects[]` | Two paid freelance builds lead the grid: **Samuel** (NZ car rental booking) and **Tonic** (client portfolio site, Supabase planned), both Nuxt 3 + Bootstrap + Sass, both deliberately without `href`/`repo` since neither is public. The three scaffolding projects are now `featured: false`, so no `example.com` / `yourhandle` URL renders |
| `projects.tsx` copy | "Things I built to learn something" did not survive paid client work — now "Freelance client work and things I built to learn something: booking flows, marketing sites, and the plumbing that ships them." |
| Resend | `.env.local` holds `RESEND_API_KEY` + `CONTACT_TO_EMAIL` beside `VERCEL_OIDC_TOKEN`; `vercel env ls` lists both as Secret on **Production** and **Preview** (00:25, 2026-09-23). The project no longer has zero env vars |
| Deploy | Carries none of this. The alias still answers `<title>Your Name — …` from the 5b build (`pcowcljqx`, 1d, Ready). A production deploy opened 20m before this note (`3k77cy3wh`) reads **`UNKNOWN`** in `vercel ls`, serves "Deployment is building", and is still `UNKNOWN` 21m in with `vercel inspect --logs` printing nothing |
| Unproven | Delivery + Reply-To through the **deployed** form — the alias serves the pre-credential build, so it cannot have been exercised there. Pitfall 8 still applies: `from` stays `onboarding@resend.dev`, `to` stays the Resend account address until a domain is verified |

**Files touched in Phase 5c:** `src/lib/data.ts`, `src/components/sections/projects.tsx`, this plan. Still missing: `public/memoji.png`.

**Uncommitted:** all of Phase 5c — `data.ts` is `MM` (staged `site.*`, unstaged rest), `projects.tsx` unstaged. The Phase 5b "this plan file is the only edit" line above no longer holds.

**Next, in order:** commit → cancel the stuck `3k77cy3wh` and re-run `vercel --prod` → confirm the alias title and badges change → send one real message through the deployed form, check the inbox and Reply-To → phone pass.
