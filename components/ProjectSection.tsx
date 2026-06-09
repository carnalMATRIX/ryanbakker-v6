"use client";

import Image from "next/image";
import Link from "next/link";
import { NoProjectsBanner } from "./NoProjectsBanner";
import { AnimateOnScroll } from "./AnimateOnScroll";

export interface Project {
  title: string;
  projectBehaviour: {
    slug: string;
    isFeatured?: boolean | null;
    isHighlighted?: boolean | null;
  };
  projectDetails?: {
    description?: string | null;
    overview?: any | null;
    featuredImage?:
      | string
      | number
      | {
          url?: string | null;
          alt?: string | null;
        }
      | null;
  } | null;
  images?:
    | {
        image:
          | string
          | number
          | {
              url?: string | null;
              alt?: string | null;
            }
          | null;
      }[]
    | null;
}

function ProjectSection({
  projects,
}: {
  projects?: Project[] | { docs: Project[] } | null;
}) {
  const displayProjects = Array.isArray(projects)
    ? projects
    : projects?.docs || [];

  return (
    <section className="section-parent py-24 md:py-32 bg-neutral-950 text-white border-t border-white/5 overflow-hidden">
      <div className="section-child w-full h-full max-w-7xl lg:max-w-none lg:px-0 mx-auto">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14 px-4">
          <AnimateOnScroll delay={0}>
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#b492f4] block mb-2">
              Selected Works
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
              Project Catalogue
            </h3>
          </AnimateOnScroll>
        </div>

        {displayProjects.length > 0 ? (
          <div className="flex flex-row h-auto min-h-[50vh] lg:h-[70vh] w-full mt-4 px-4 lg:px-0">
            {/* Projects Grid */}
            <ul className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_140px] gap-6 h-full w-full">
              {displayProjects.map((project, index) => {
                // Resolve Featured Image URL
                const featuredImg = project.projectDetails?.featuredImage;
                let imageUrl: string | null | undefined =
                  typeof featuredImg === "string"
                    ? featuredImg
                    : typeof featuredImg === "object" && featuredImg !== null
                      ? (featuredImg as { url?: string | null }).url
                      : undefined;

                // Fallback to first image in gallery if featuredImage is missing
                if (!imageUrl && project.images?.[0]?.image) {
                  const fallbackImg = project.images[0].image;
                  imageUrl =
                    typeof fallbackImg === "string"
                      ? fallbackImg
                      : typeof fallbackImg === "object" && fallbackImg !== null
                        ? (fallbackImg as { url?: string | null }).url
                        : undefined;
                }

                // Ensure the slug exists for the link
                const link = `/projects/${project.projectBehaviour?.slug || "#"}`;

                return (
                  <li
                    key={project.projectBehaviour?.slug || index}
                    className="group relative flex-1 h-full min-h-[300px] md:min-h-[400px] lg:min-h-0 overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 bg-zinc-900/30 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] cursor-pointer"
                  >
                    <AnimateOnScroll
                      className="w-full h-full"
                      delay={50 * index}
                    >
                      <Link href={link} className="block h-full w-full relative">
                        {/* Background Image Layer */}
                        <div className="absolute inset-0 z-0 opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={
                                typeof featuredImg === "object"
                                  ? featuredImg?.alt || project.title
                                  : project.title
                              }
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          )}
                          <div
                            className={`absolute inset-0 ${project.projectDetails?.featuredImage ? "bg-black/55" : "bg-[#180829]/90"}`}
                          />
                        </div>

                        {/* Top Right Icon */}
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#b492f4] group-hover:text-black group-hover:border-transparent shrink-0">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                          >
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>

                        {/* Center Number Indicator */}
                        <span className="relative z-10 text-8xl md:text-9xl font-black text-white/5 md:text-zinc-800/10 group-hover:text-[#b492f4]/15 transition-colors duration-500 m-auto w-full h-full text-center flex-col items-center justify-center hidden md:flex md:pb-16 select-none font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Bottom Text Container */}
                        <div className="absolute left-6 bottom-6 right-6 z-10 text-left">
                          <h5 className="text-xl md:text-2xl font-black uppercase text-white tracking-tight group-hover:text-[#b492f4] transition-colors duration-300 leading-tight">
                            {project.title}
                          </h5>
                          <p className="hidden md:block text-sm text-zinc-400 font-light group-hover:text-zinc-200 transition-colors duration-300 line-clamp-1 mt-1">
                            {project.projectDetails?.description}
                          </p>
                        </div>
                      </Link>
                    </AnimateOnScroll>
                  </li>
                );
              })}

              <li className="lg:h-full md:mt-auto lg:mt-0">
                <AnimateOnScroll
                  className="w-full h-full"
                  delay={50 * displayProjects.length}
                >
                  <Link href="/projects" className="shrink-0 lg:h-full block">
                    <div className="group relative overflow-hidden bg-[#b492f4]/10 border border-[#b492f4]/20 hover:border-[#b492f4]/40 hover:bg-[#b492f4]/20 rounded-[24px] md:rounded-[32px] max-h-28 md:max-h-screen h-full w-full lg:w-35 flex flex-col items-center lg:justify-between lg:py-12 transition-all duration-300 p-6 md:p-0">
                      <div className="flex-1 flex ml-10 lg:ml-0 translate-y-3 lg:translate-y-0 lg:items-center lg:justify-center">
                        <h5 className="lg:-rotate-90 text-white text-3xl font-black uppercase tracking-widest whitespace-nowrap translate-y-6 lg:translate-y-0 group-hover:text-[#b492f4] transition-colors">
                          View All
                        </h5>
                      </div>

                      <svg
                        width="111"
                        height="94"
                        viewBox="0 0 111 94"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="lg:mt-auto self-start -translate-x-6 group-hover:translate-x-4 transition-transform duration-300 ease-in-out -translate-y-2 lg:translate-y-0 hidden lg:block"
                      >
                        <path
                          d="M2.40089 2.4214C3.61022 1.20097 5.58044 1.19169 6.80095 2.40089L49.5787 44.7897C50.1683 45.374 50.5 46.17 50.5 47C50.5 47.83 50.1683 48.626 49.5787 49.2103L6.80095 91.5991C5.58044 92.8083 3.61022 92.799 2.40089 91.5786C1.19169 90.3581 1.20097 88.3879 2.4214 87.1785L42.9683 47L2.4214 6.82146C1.20097 5.61212 1.1917 3.64191 2.40089 2.4214Z"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M61.4009 2.4214C62.6102 1.20097 64.5804 1.19169 65.8009 2.40089L108.579 44.7897C109.168 45.374 109.5 46.17 109.5 47C109.5 47.83 109.168 48.626 108.579 49.2103L65.8009 91.5991C64.5804 92.8083 62.6102 92.799 61.4009 91.5786C60.1917 90.3581 60.201 88.3879 61.4214 87.1785L101.968 47L61.4214 6.82146C60.201 5.61212 60.1917 3.64191 61.4009 2.4214Z"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>
                </AnimateOnScroll>
              </li>
            </ul>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto mt-10 px-4">
            <NoProjectsBanner theme="dark" />
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectSection;
