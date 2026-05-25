import { getCachedPayload } from "@/lib/payload";
import { GridCard } from "./GridCard";
import Image from "next/image";
import Link from "next/link";
import { cn, getMediaUrl } from "@/lib/utils";
import { OtherProjectsClient } from "./OtherProjectsClient";
import { NoProjectsBanner } from "./NoProjectsBanner";

interface ProjectsGridProps {
  activeTags: string[];
}

async function ProjectsGrid({ activeTags }: ProjectsGridProps) {
  const payload = await getCachedPayload();
  const { docs: projects } = await payload.find({
    collection: "projects",
    depth: 2,
    limit: 100,
    sort: "-updatedAt",
  });

  // Filter projects based on activeTags (intersection logic)
  const filteredProjects = projects.filter((project) => {
    if (activeTags.length === 0) return true;
    const projectTagLabels = project.tags?.map((t) => t.label) || [];
    return activeTags.every((tag) => projectTagLabels.includes(tag));
  });

  const featuredProject = filteredProjects.find(
    (p) => p.projectBehaviour?.isFeatured,
  );
  const highlightedProjects = filteredProjects
    .filter(
      (p) => p.projectBehaviour?.isHighlighted && p.id !== featuredProject?.id,
    )
    .slice(0, 2);

  const otherProjects = filteredProjects.filter(
    (p) =>
      !p.projectBehaviour?.isFeatured && !p.projectBehaviour?.isHighlighted,
  );

  const renderTags = (
    tags: { label: string }[],
    layoutClasses: string = "flex-wrap",
  ) => {
    if (!tags || tags.length === 0) return null;

    return (
      <ul className={cn("flex gap-1.5 mt-4", layoutClasses)}>
        {tags.map((tag, i) => {
          const isActive = activeTags.includes(tag.label);
          const isFiltering = activeTags.length > 0;

          return (
            <li
              key={i}
              className={cn(
                "px-2 py-0.5 bg-white/10 rounded-md text-[10px] transition-opacity",
                isFiltering && !isActive && "opacity-30 grayscale",
              )}
            >
              {tag.label}
            </li>
          );
        })}
      </ul>
    );
  };

  const getFeaturedImageUrl = (project: any) => {
    return getMediaUrl(project.projectDetails?.featuredImage);
  };

  return (
    <>
      {projects[0] ? (
        <section className="max-w-6xl mx-auto my-16 px-4 md:px-5 lg:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Featured Project */}
            {featuredProject && (
              <Link
                href={`/projects/${featuredProject.projectBehaviour.slug}`}
                passHref
                // 1. Added animate-in classes here
                className="col-span-1 md:col-span-2 row-span-2 h-full transition-transform duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 ease-out"
                // 2. Hardcoded 0ms delay so it loads instantly
                style={{ animationDelay: "0ms", animationFillMode: "both" }}
              >
                <GridCard
                  isFeatured={true}
                  className="overflow-hidden group h-full min-h-110"
                >
                  {getFeaturedImageUrl(featuredProject) && (
                    <>
                      <Image
                        src={getFeaturedImageUrl(featuredProject)}
                        alt={featuredProject.title}
                        width={800}
                        height={600}
                        className="block md:hidden object-cover rounded-3xl w-full h-auto shadow-xl"
                      />
                      <Image
                        src={getFeaturedImageUrl(featuredProject)}
                        alt={featuredProject.title}
                        fill
                        objectPosition="top"
                        className="object-cover rounded-3xl max-h-[60%] md:max-h-[75%] shadow-xl hidden md:block"
                      />
                    </>
                  )}

                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end md:h-full z-10 pb-1.5">
                    <div className="w-full">
                      <h2 className="text-2xl font-bold leading-7 tracking-[-4%] line-clamp-3 pt-2">
                        {featuredProject.title}
                      </h2>
                    </div>

                    <div className="flex justify-start md:justify-end w-full md:w-auto">
                      {renderTags(
                        featuredProject.tags as { label: string }[],
                        "flex-wrap md:flex-wrap-reverse items-start md:items-end justify-start md:justify-end",
                      )}
                    </div>
                  </div>
                </GridCard>
              </Link>
            )}

            {/* Highlighted Projects */}
            {/* 3. Added 'index' parameter to the map function */}
            {highlightedProjects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.projectBehaviour.slug}`}
                // 4. Added animate-in classes here
                className="col-span-1 md:col-span-2 row-span-1 transition-transform hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 ease-out duration-700"
                // 5. Staggered delay: index 0 = 150ms, index 1 = 300ms
                style={{
                  animationDelay: `${(index + 1) * 150}ms`,
                  animationFillMode: "both",
                }}
                passHref
              >
                <GridCard className="overflow-hidden group">
                  {getFeaturedImageUrl(project) && (
                    <>
                      <Image
                        src={getFeaturedImageUrl(project)}
                        alt={project.title}
                        height={300}
                        width={400}
                        className="block md:hidden object-cover md:max-w-[50%]! ml-auto rounded-2xl shadow-xl"
                      />
                      <Image
                        src={getFeaturedImageUrl(project)}
                        alt={project.title}
                        fill
                        className="object-cover md:max-w-[50%]! ml-auto rounded-2xl shadow-xl hidden md:block"
                      />
                    </>
                  )}

                  <div
                    className={`relative flex flex-col mt-3 md:mt-0 md:justify-end h-full z-10 pl-1 pb-2 ${getFeaturedImageUrl(project) ? "md:max-w-[50%]!" : ""}`}
                  >
                    <h3 className="text-2xl font-bold leading-7 tracking-[-4%] line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm opacity-80 font-light pt-2.5">
                      {project.projectDetails?.description}
                    </p>

                    {renderTags(project.tags as { label: string }[])}
                  </div>
                </GridCard>
              </Link>
            ))}

            {/* Delegate the rest of the projects to the interactive client component */}
            <OtherProjectsClient
              otherProjects={otherProjects}
              activeTags={activeTags}
            />
          </div>
        </section>
      ) : (
        <section className="max-w-6xl mx-auto my-10">
          <NoProjectsBanner />
        </section>
      )}
    </>
  );
}

export default ProjectsGrid;
