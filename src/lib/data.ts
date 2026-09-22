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
  name: "Fourthram Kaimo",
  initials: "FK",
  role: "Full-Stack Developer",
  email: "fourthramkaimo@gmail.com",
  github: "https://github.com/atzyyyy",
  linkedin: "https://www.linkedin.com/in/fourthramkaimo",
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
    company: "From Here",
    role: "Web Developer / Front End Developer",
    period: "Oct 2023 — Jul 2026",
    location: "New Zealand · Remote",
    bullets: [
      "Developed and enhanced 50+ production client websites — new pages, defect fixes, and front-end quality improvements across multiple releases.",
      "Documented recurring issues and wrote internal guides for repeat resolutions, improving the handoff between devs and QA.",
      "Collaborated with remote stakeholders in New Zealand and cross-functional teams to prioritize technical improvements and UX fixes.",
      "Delivered feature updates and bug fixes in agile sprint cycles, helping meet release deadlines consistently.",
    ],
    stack: ["Nuxt 3", "Sass", "Bootstrap", "Tailwind CSS", "Laravel", "Directus"],
  },
  {
    company: "Health and Wellness Solutions",
    role: "Tech Intern",
    period: "Jun 2022 — Nov 2022",
    location: "Davao City, PH",
    bullets: [
      "Built reusable React and Material UI components for internal web products.",
      "Resolved usability issues from stakeholder feedback, improving interface consistency and user flow.",
      "Managed tickets and bug triage to help maintain sprint timelines and delivery targets.",
    ],
    stack: ["React", "Material UI"],
  },
  {
    company: "Hayahay!",
    role: "Web Development Intern",
    period: "Jul 2021 — Dec 2021",
    location: "Davao City, PH",
    bullets: [
      "Developed features in a MEAN stack sprint environment for responsive web applications.",
      "Improved cross-device compatibility and accessibility across multiple pages.",
      "Documented reusable fixes and front-end solutions that improved development efficiency.",
    ],
    stack: ["MongoDB", "Express", "Angular", "Node.js"],
  },
];

/**
 * Order matters: the grid renders in this order. Projects with `featured: false`
 * stay here without rendering.
 */
export const projects: Project[] = [
  {
    title: "Samuel — car rental booking",
    description:
      "Freelance build for a New Zealand car rental operator: browse the fleet, pick dates, and send a booking request. Owned front end end to end, from layout to form validation.",
    tags: ["Nuxt 3", "Bootstrap", "Sass"],
    year: "2025",
    featured: true,
  },
  {
    title: "Tonic — client portfolio site",
    description:
      "Freelance portfolio site for a client: responsive marketing pages built from a design hand-off. Next step is moving the content behind a Supabase backend so the client can edit it without a deploy.",
    tags: ["Nuxt 3", "Bootstrap", "Sass"],
    year: "2025",
    featured: true,
  },
];

/**
 * Contact section copy. TODO: rewrite in your own voice — this is a default.
 */
export const contact = {
  blurb:
    "Have a role, a project, or a question about something I built? Send a message and it lands in my inbox.",
};
