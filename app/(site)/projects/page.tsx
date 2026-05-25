import ProjectsGrid from "@/components/ProjectsGrid";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { getCachedPayload } from "@/lib/payload";
import { ProjectFilters } from "@/components/ProjectFilters";
import { DotPattern } from "@/components/DotPattern"; // Make sure your import path matches
import Footer from "@/components/Footer";

export const revalidate = 3600; // revalidate every hour

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

  // Reusable animation classes to keep the JSX clean
  const animateClasses =
    "animate-in fade-in slide-in-from-bottom-8 ease-out duration-700";

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
            <h1
              className={`font-extrabold text-[40px] md:text-[60px] tracking-[-4%] uppercase leading-tight md:leading-18 ${animateClasses}`}
              style={{ animationDelay: "0ms", animationFillMode: "both" }}
            >
              Project Archive
            </h1>

            {/* 2. Subtitle - Loads shortly after (150ms) */}
            <p
              className={`font-light tracking-[2%] text-sm max-w-100 mt-2 md:mt-4 ${animateClasses}`}
              style={{ animationDelay: "150ms", animationFillMode: "both" }}
            >
              Some of my past projects, ranging from Web Development to
              Photography. Filter through to find exactly what you&apos;re
              looking for, or get in touch to find out more.
            </p>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-6 relative w-full md:w-auto">
            {/* 3. Filters - 300ms delay */}
            {projects[0] ? (
              <div
                className={`${animateClasses} w-full`}
                style={{ animationDelay: "300ms", animationFillMode: "both" }}
              >
                <ProjectFilters
                  availableTags={availableTags}
                  activeTags={activeTags}
                />
              </div>
            ) : (
              ""
            )}

            {/* 4. Button - 450ms delay */}
            <Link
              href={"/"}
              className={`w-full md:w-fit ${animateClasses}`}
              passHref
              style={{ animationDelay: "450ms", animationFillMode: "both" }}
            >
              <Button
                size="lg"
                variant="refined-outline"
                iconRight={<Undo2 strokeWidth={2} />}
                className="w-full md:w-fit"
              >
                Return to Base
              </Button>
            </Link>
          </div>
        </section>

        <ProjectsGrid activeTags={activeTags} />
      </main>
      <Footer />
    </DotPattern>
  );
}

export default ProjectsPage;
