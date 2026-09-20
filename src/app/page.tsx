import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Experience />
      <Projects />
      <Contact />
    </main>
  );
}
