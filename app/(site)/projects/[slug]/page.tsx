import { getCachedPayload } from "@/lib/payload";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink, Undo2 } from "lucide-react";
import { ProjectGallery } from "@/components/ProjectGallery";
import { Project } from "@/payload-types";
import { jsxConverters } from "@/lib/RichTextConverters";
import Footer from "@/components/Footer";
import { ShareButton } from "@/components/ShareButton";
import { VantaBackground } from "@/components/VentaBackground";
import type { Metadata } from "next";

export const revalidate = 3600; // revalidate every hour

export async function generateStaticParams() {
  const payload = await getCachedPayload();
  const { docs: projects } = await payload.find({
    collection: "projects",
    depth: 0,
    limit: 1000,
  });

  return projects.map((project) => ({
    slug: (project as any).projectBehaviour?.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getCachedPayload();

  const { docs: projects } = (await payload.find({
    collection: "projects",
    where: {
      "projectBehaviour.slug": {
        equals: slug,
      },
    },
    limit: 1,
  })) as unknown as { docs: Project[] };

  if (!projects.length) {
    return {};
  }

  const project = projects[0];
  const title = `${project.title} | Ryan Bakker`;
  const description = project.projectDetails?.description || "";
  const hasArticle = !!project.projectArticle;

  const featuredImage = project.projectDetails?.featuredImage;
  const ogImages = [];

  if (featuredImage && typeof featuredImage !== "number") {
    ogImages.push({
      url: featuredImage.url || "",
      width: featuredImage.width || 1200,
      height: featuredImage.height || 630,
      alt: featuredImage.alt || project.title,
    });
  } else if (project.images && project.images.length > 0) {
    const firstImage = project.images[0].image;
    if (typeof firstImage !== "number") {
      ogImages.push({
        url: firstImage.url || "",
        width: firstImage.width || 1200,
        height: firstImage.height || 630,
        alt: firstImage.alt || project.title,
      });
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/projects/${slug}`,
      siteName: "Ryan Bakker",
      images: ogImages,
      type: hasArticle ? "article" : "website",
      ...(hasArticle
        ? {
            publishedTime: project.createdAt,
            modifiedTime: project.updatedAt,
            authors: ["Ryan Bakker"],
            section: "Projects",
            tags: project.tags?.map((t) => t.label).filter(Boolean) as string[],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
  };
}

export default async function ProjectSinglePage({ params }: PageProps) {
  const { slug } = await params;
  const payload = await getCachedPayload();

  const { docs: projects } = (await payload.find({
    collection: "projects",
    where: {
      "projectBehaviour.slug": {
        equals: slug,
      },
    },
    limit: 1,
  })) as unknown as { docs: Project[] };

  if (!projects.length) {
    notFound();
  }

  const project = projects[0];
  const hasArticle = !!project.projectArticle;
  const hasImages = !!project.images?.length;

  return (
    <>
      <main className="relative w-full min-h-screen bg-neutral-900 overflow-x-hidden">
        {/* Ambient background glow to add depth to the top of the page */}
        <div
          className="absolute top-0 left-0 w-full h-300 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle at 50% -20%, rgba(67, 56, 202, 0.25) 0%, rgba(124, 58, 237, 0.15) 40%, transparent 80%)",
          }}
        />

        <section className="mt-8 md:mt-20 z-50 relative px-2 md:px-0">
          <div className="max-w-6xl mx-auto flex flex-col items-start gap-10 px-2 md:px-8 lg:px-0">
            <Link href="/projects" passHref>
              <Button
                variant="refined-outline"
                iconLeft={<Undo2 />}
                className="whitespace-nowrap"
              >
                Back to Project Archive
              </Button>
            </Link>

            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-white font-extrabold text-3xl md:text-[45px] leading-tight tracking-tighter md:leading-12 uppercase line-clamp-6 w-full">
                {project.title}
              </h1>
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
                Published on{" "}
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-4 pt-8 md:pt-12 pb-12 md:pb-18 relative mb-4 px-0 md:px-8 lg:px-0">
            {/* Background elements container that defines the bounds of the purple card */}
            <div className="absolute left-1 md:left-3.75 top-1 md:top-2.5 right-1 md:right-6.25 bottom-1 md:bottom-7.5 pointer-events-none overflow-hidden rounded-[24px] md:rounded-[40px]">
              <VantaBackground
                foreground="#312e81"
                background="#0A0C24"
                className="absolute inset-0 -z-10"
              />

              <div
                className="absolute inset-0 z-30 rounded-[24px] md:rounded-[40px]"
                style={{
                  background:
                    "linear-gradient(205deg, rgba(215, 142, 255, 0.5) 0%, rgba(179, 122, 240, 0.4) 3.84%, rgba(37, 50, 104, 0.4) 33.65%, rgba(41, 0, 70, 0.6) 72.11%)",
                  filter: "url(#project-bg-filter)",
                }}
              />
            </div>

            <svg width="0" height="0" className="absolute" aria-hidden="true">
              <defs>
                <filter
                  id="project-bg-filter"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                  filterUnits="objectBoundingBox"
                  primitiveUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="5" dy="10" />
                  <feGaussianBlur stdDeviation="10" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="-0.5" dy="-0.8" />
                  <feGaussianBlur stdDeviation="0.25" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"
                  />
                  <feBlend
                    mode="screen"
                    in2="shape"
                    result="effect2_innerShadow"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="0.3" dy="0.8" />
                  <feGaussianBlur stdDeviation="0.25" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"
                  />
                  <feBlend
                    mode="screen"
                    in2="effect2_innerShadow"
                    result="effect3_innerShadow"
                  />
                  <feGaussianBlur
                    stdDeviation="0.5"
                    result="effect4_foregroundBlur"
                  />
                </filter>
              </defs>
            </svg>

            <div
              className={cn(
                "max-w-6xl mx-auto z-50 relative text-white flex flex-col lg:flex-row lg:items-center gap-10 w-full px-4 md:px-8 lg:px-0",
                !hasImages && "items-start",
              )}
            >
              <div
                className={cn(
                  "grid grid-cols-1 w-full gap-x-6 gap-y-8",
                  !hasImages
                    ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-full"
                    : "lg:grid-cols-2 max-w-full lg:max-w-[40%]",
                )}
              >
                <div
                  className={cn(
                    "project-single-cell",
                    !hasImages ? "md:col-span-2 order-1" : "col-span-1",
                  )}
                >
                  <h3>Description</h3>
                  <p>{project.projectDetails?.description}</p>
                </div>

                <div
                  className={cn(
                    "project-single-cell col-span-1",
                    !hasImages && "order-5",
                  )}
                >
                  <h3>Tags</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {project.tags?.map((tag, i) => (
                      <li
                        key={i}
                        className="px-2 py-0.5 bg-white/10 rounded-md text-[10px]"
                      >
                        {tag.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={cn(
                    "project-single-cell col-span-1",
                    !hasImages && "order-2",
                  )}
                >
                  <h3>Technologies</h3>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-neutral-300">
                    {project.technologies?.map((tech, i) => (
                      <li key={i} className="pl-0.5">
                        {tech.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={cn(
                    "project-single-cell col-span-1",
                    !hasImages && "order-3",
                  )}
                >
                  <h3>External Links</h3>
                  <div className="flex flex-col gap-1">
                    {project.externalLinks?.map((link, i) => (
                      <Link
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1 w-fit text-neutral-300 text-sm"
                      >
                        {link.label} <ExternalLink size={12} />
                      </Link>
                    ))}
                  </div>
                </div>

                <div
                  className={cn(
                    "project-single-cell col-span-1 md:col-span-2",
                    !hasImages && "order-4",
                  )}
                >
                  <h3>Overview</h3>
                  <RichText
                    className="project-overview-content text-sm md:text-xs"
                    data={project.projectDetails?.overview as any}
                    converters={jsxConverters}
                  />
                </div>

                <div
                  className={cn(
                    "project-single-cell col-span-1",
                    !hasImages && "order-6",
                  )}
                />
              </div>

              {hasImages && (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center max-w-full lg:max-w-[60%]",
                  )}
                >
                  <ProjectGallery images={project.images} />
                </div>
              )}
            </div>
          </div>

          {hasArticle && project.projectArticle && (
            <article className="max-w-3xl mx-auto px-3 md:px-8 lg:px-0 text-white mb-16 mt-10">
              <div className="flex items-center justify-between max-w-5xl mx-auto">
                <h3 className="text-3xl! font-bold tracking-tight">Article</h3>
                <ShareButton />
              </div>
              <hr className="border-neutral-800 mt-4" />

              <div className="max-w-5xl mx-auto article-content">
                <RichText
                  className="project-article"
                  data={project.projectArticle}
                  converters={jsxConverters}
                />
              </div>
            </article>
          )}
        </section>
      </main>
      <div className="h-20 bg-neutral-950" />
      <Footer />
    </>
  );
}
