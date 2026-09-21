import { ArrowUpRightIcon } from "lucide-react";

import { GitHubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projects } from "@/lib/data";

const shown = projects.filter((project) => project.featured !== false);

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-24 border-b border-border/60"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 md:py-28">
        <h2
          id="projects-title"
          className="font-heading text-2xl font-medium tracking-tight sm:text-3xl"
        >
          Projects
        </h2>
        <p className="mt-3 max-w-prose text-sm text-muted-foreground">
          Things I built to learn something: front ends, an API behind one, and
          the plumbing that ships them.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project) => (
            <li key={project.title}>
              <Card className="h-full transition-shadow ring-foreground/10 hover:ring-dusty-denim/60">
                <CardHeader>
                  <CardTitle>
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm outline-none hover:underline underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </CardTitle>

                  {/* year: dusty-denim on prussian is 4.44:1 — under 4.5 for 12px text */}
                  {project.year ? (
                    <CardAction className="text-xs font-normal text-foreground/80">
                      {project.year}
                    </CardAction>
                  ) : null}

                  <CardDescription className="text-foreground/80">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="mt-auto flex-wrap gap-2 bg-transparent">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}

                  <div className="ml-auto flex items-center gap-1">
                    {project.repo ? (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} source code`}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon-sm",
                        })}
                      >
                        <GitHubIcon />
                      </a>
                    ) : null}

                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live site`}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon-sm",
                        })}
                      >
                        <ArrowUpRightIcon />
                      </a>
                    ) : null}
                  </div>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
