import { MailIcon } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { contact, site } from "@/lib/data";

const elsewhere = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    Icon: MailIcon,
  },
  {
    label: "GitHub",
    value: site.github.replace(/^https?:\/\/(www\.)?github\.com\//, "@"),
    href: site.github,
    Icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    value: site.linkedin.replace(
      /^https?:\/\/(www\.)?linkedin\.com\/in\//,
      "@",
    ),
    href: site.linkedin,
    Icon: LinkedInIcon,
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 border-b border-border/60 last:border-b-0"
    >
      <div className="mx-auto grid w-full max-w-5xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <h2
            id="contact-title"
            className="font-heading text-2xl font-medium tracking-tight sm:text-3xl"
          >
            Contact
          </h2>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
            {contact.blurb}
          </p>

          <ContactForm />
        </div>

        <div className="md:pt-2">
          <h3 className="text-sm font-medium text-foreground/80">
            Or reach me directly
          </h3>

          <ul className="mt-4 space-y-3">
            {elsewhere.map(({ label, value, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("mailto:")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="flex items-center gap-3 rounded-md text-foreground/80 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Icon className="size-4 shrink-0 text-dusty-denim" />
                  <span className="text-sm break-all">{value}</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-prose text-sm text-muted-foreground">
            Replies come from my own address, so a reply-all is unnecessary.
          </p>
        </div>
      </div>
    </section>
  );
}
