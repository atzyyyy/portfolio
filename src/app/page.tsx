import { Hero } from "@/components/sections/hero";

/**
 * Phases 3–4: placeholder sections so the header's anchor links stay real.
 * Each one is replaced by its own component as it lands.
 */
const sections = [
  {
    id: "experience",
    title: "Experience",
    note: "Phase 3 — timeline rendered from src/lib/data.ts.",
  },
  {
    id: "projects",
    title: "Projects",
    note: "Phase 3 — card grid rendered from src/lib/data.ts.",
  },
  {
    id: "contact",
    title: "Contact",
    note: "Phase 4 — email + message form, Resend Server Action.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-title`}
          className="scroll-mt-24 border-b border-border/60 last:border-b-0"
        >
          <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col justify-center px-4 py-20 sm:px-6">
            <h2
              id={`${section.id}-title`}
              className="font-heading text-2xl font-medium tracking-tight sm:text-3xl"
            >
              {section.title}
            </h2>
            <p className="mt-3 max-w-prose text-sm text-muted-foreground">
              {section.note}
            </p>
          </div>
        </section>
      ))}
    </main>
  );
}
