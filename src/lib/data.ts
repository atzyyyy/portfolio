/**
 * Single source of truth for site content.
 * TODO: replace every value here with your real details — the dates, metrics and
 * company/project names below are placeholders that render as if they were true.
 */
export type NavItem = {
  label: string;
  href: string;
};

export type Experience = {
  company: string;
  role: string;
  /** Free text, e.g. "Jan 2024 — Present". */
  period: string;
  location?: string;
  /** 2–4 items. Start each with a verb and a number where you can. */
  bullets: string[];
  /** Optional. Renders as badges under the bullets. */
  stack?: string[];
};

export type Project = {
  title: string;
  /** Aim for two lines at card width. */
  description: string;
  tags: string[];
  /** Live URL. */
  href?: string;
  /** Source URL. */
  repo?: string;
  year?: string;
  /** Set false to keep a project in the data without rendering it. */
  featured?: boolean;
};

export const site: {
  name: string;
  initials: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  /** Optional. Point at a file in public/, e.g. "/resume.pdf". */
  resume?: string;
} = {
  name: "Your Name",
  initials: "YN",
  role: "Frontend & Full-Stack Developer",
  email: "you@example.com",
  github: "https://github.com/yourhandle",
  linkedin: "https://www.linkedin.com/in/yourhandle",
};

export const navItems: NavItem[] = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

/**
 * Hero copy. The tagline is the only place personality shows up — rewrite it in
 * your own voice, keep it under ~160 characters.
 */
export const hero = {
  tagline:
    "Frontend is where I started — fast, accessible interfaces that don't wobble on an old phone. Now I'm climbing the other half: APIs, Postgres, AWS.",
  stack: ["Vue 3", "Nuxt 3", "React", "Next.js", "TypeScript"],
};

export const experience: Experience[] = [
  {
    company: "Northwind Studio",
    role: "Frontend Developer",
    period: "2024 — Present",
    location: "Remote",
    bullets: [
      "Ship Vue 3 and Nuxt 3 interfaces for client storefronts, from Figma hand-off to production deploy.",
      // TODO: real numbers, measured in the field.
      "Cut Largest Contentful Paint from 4.1s to 1.6s on the busiest storefront by shipping next-gen image formats and deferring third-party scripts.",
      "Own the shared component layer: Sass design tokens, accessible form primitives, and the review checklist the team runs before release.",
    ],
    stack: ["Vue 3", "Nuxt 3", "TypeScript", "Sass", "Directus"],
  },
  {
    company: "Acme Digital",
    role: "Junior Web Developer",
    period: "2023 — 2024",
    location: "Manila, PH",
    bullets: [
      "Built CMS-driven pages in Laravel/Twill and wired the REST endpoints the Vue front end consumes.",
      "Moved product search from client-side fuzzy matching to server-side filtering, which cut the support tickets filed against it.",
    ],
    stack: ["Laravel", "Twill", "Vue 3", "REST", "MySQL"],
  },
];

/**
 * Order matters: the grid renders in this order. Projects with `featured: false`
 * stay here without rendering.
 */
export const projects: Project[] = [
  {
    title: "Portfolio",
    description:
      "This site — dark-only design tokens, App Router sections, and a contact form backed by a Resend Server Action with server-side validation.",
    tags: ["Next.js", "React", "Tailwind v4"],
    repo: site.github,
    year: "2026",
    featured: true,
  },
  {
    title: "Storefront front end",
    description:
      "Nuxt 3 catalogue and marketing front end reading from a Directus headless CMS, with prerendered product routes and a Figma-faithful design system.",
    tags: ["Nuxt 3", "Vue 3", "Directus"],
    href: "https://example.com",
    repo: "https://github.com/yourhandle/storefront",
    year: "2025",
    featured: true,
  },
  {
    title: "Supabase auth starter",
    description:
      "Email/password and OAuth flows on Supabase, with Postgres row-level security policies and typed queries shared between server and client.",
    tags: ["Next.js", "Supabase", "Postgres"],
    repo: "https://github.com/yourhandle/supabase-auth-starter",
    year: "2025",
    featured: true,
  },
  {
    title: "Twill CMS API",
    description:
      "Laravel + Twill admin behind a versioned REST API: draft/publish workflow, image transforms, and token auth for the consumer apps.",
    tags: ["Laravel", "Twill", "REST"],
    repo: "https://github.com/yourhandle/twill-api",
    year: "2024",
    featured: true,
  },
  {
    title: "Deploy pipeline",
    description:
      "Dockerfile plus GitHub Actions workflow that lints, tests and ships to AWS on merge, with preview environments per pull request.",
    tags: ["Docker", "GitHub Actions", "AWS"],
    repo: "https://github.com/yourhandle/deploy-pipeline",
    year: "2026",
    featured: false,
  },
  {
    title: "XAUUSD session backtester",
    description:
      "Pine Script strategy that backtests 15-minute momentum entries with fixed risk per trade, exporting stats I use to decide what is worth trading live.",
    tags: ["Pine Script", "Backtesting"],
    year: "2026",
    featured: false,
  },
];

/**
 * Contact section copy. TODO: rewrite in your own voice — this is a default.
 */
export const contact = {
  blurb:
    "Have a role, a project, or a question about something I built? Send a message and it lands in my inbox.",
};
