/**
 * Single source of truth for site content.
 * TODO: replace every value here with your real details.
 */
export type NavItem = {
  label: string;
  href: string;
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
