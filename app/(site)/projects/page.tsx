import ProjectsGrid from "@/components/ProjectsGrid";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { getCachedPayload } from "@/lib/payload";
import { ProjectFilters } from "@/components/ProjectFilters";
import { DotPattern } from "@/components/DotPattern"; // Make sure your import path matches
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const revalidate = 3600; // revalidate every hour

export const metadata: Metadata = {
  title: "Project Archive",
  description:
    "Browse through a collection of projects by Ryan Beckett, ranging from web development to photography and digital art.",
  alternates: {
    canonical: "/projects",
  },
};

async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string }>;
}) {
  const { tags } = await searchParams;
  const activeTags = tags ? tags.split(",").filter(Boolean) : [];

  const payload = await getCachedPayload();
  const { docs: projects } = await payload.find({
    collection: "projects",
    depth: 0,
    limit: 1000,
  });

  // Extract all unique tags from all projects
  const availableTags = Array.from(
    new Set(
      projects.flatMap(
        (p) => p.tags?.map((t: { label: string }) => t.label) || [],
      ),
    ),
  ).sort() as string[];

  return (
    <DotPattern
      className="radial-purple-translucent bg-transparent"
      baseColor="#3b2856"
      glowColor="#a855f7"
      glowIntensity={1.2}
    >
      <main className="h-full w-full overflow-y-auto overflow-x-hidden text-white relative z-10 pb-16">
        <section className="max-w-6xl flex flex-col md:flex-row md:justify-between md:items-end md:mx-auto mt-12 md:mt-24 gap-8 px-4 md:px-5 lg:px-0 relative z-50">
          <div className="w-full">
            {/* 1. Title - Loads instantly (0ms) */}
            <AnimateOnScroll delay={0} direction="up">
              <h1 className="font-extrabold text-[40px] md:text-[60px] tracking-[-4%] uppercase leading-tight md:leading-18">
                Project Archive
              </h1>
            </AnimateOnScroll>

            {/* 2. Subtitle - Loads shortly after (150ms) */}
            <AnimateOnScroll delay={150} direction="up">
              <p className="font-light tracking-[2%] text-sm max-w-100 mt-2 md:mt-4">
                Some of my past projects, ranging from Web Development to
                Photography. Filter through to find exactly what you&apos;re
                looking for, or get in touch to find out more.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-6 relative w-full md:w-auto">
            {/* 3. Filters - 300ms delay */}
            {projects[0] ? (
              <AnimateOnScroll delay={300} direction="up" className="w-full">
                <ProjectFilters
                  availableTags={availableTags}
                  activeTags={activeTags}
                />
              </AnimateOnScroll>
            ) : (
              ""
            )}

            {/* 4. Button - 450ms delay */}
            <AnimateOnScroll delay={450} direction="up" className="w-full md:w-fit">
              <Link href={"/"} className="w-full md:w-fit" passHref>
                <Button
                  size="lg"
                  variant="refined-outline"
                  iconRight={<Undo2 strokeWidth={2} />}
                  className="w-full md:w-fit"
                >
                  Return to Base
                </Button>
              </Link>
            </AnimateOnScroll>
          </div>
        </section>

        <ProjectsGrid activeTags={activeTags} />
      </main>
      <Footer />
    </DotPattern>
  );
}

export default ProjectsPage;
