import { Badge } from "@/components/ui/badge";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="scroll-mt-24 border-b border-border/60"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 md:py-28">
        <h2
          id="experience-title"
          className="font-heading text-2xl font-medium tracking-tight sm:text-3xl"
        >
          Experience
        </h2>

        <ol className="mt-10 space-y-10 border-l border-border">
          {experience.map((job) => (
            <li key={`${job.company}-${job.role}`} className="relative pl-6">
              <span
                aria-hidden
                className="absolute top-1.5 left-0 size-2 -translate-x-1/2 rounded-full bg-dusty-denim"
              />

              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="font-medium text-foreground">{job.role}</h3>
                <p className="text-sm text-muted-foreground">{job.period}</p>
              </div>

              <p className="mt-0.5 text-sm text-muted-foreground">
                {job.company}
                {job.location ? ` · ${job.location}` : null}
              </p>

              <ul className="mt-3 space-y-2">
                {job.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3 text-sm leading-relaxed text-foreground/80"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1 shrink-0 rounded-full bg-dusty-denim/70"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {job.stack ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {job.stack.map((item) => (
                    <li key={item}>
                      <Badge variant="secondary">{item}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
