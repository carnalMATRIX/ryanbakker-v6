import Image from "next/image";
import Link from "next/link";
import { NoProjectsBanner } from "./NoProjectsBanner";

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
    <section className="section-parent py-16 pb-64! md:pb-16 min-h-screen radial-grey text-neutral-950">
      <div className="section-child w-full h-full max-w-7xl lg:max-w-none lg:px-0 mx-auto mb-10 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 w-full">
          <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">
            Project Catalogue
          </h3>
        </div>

        {displayProjects.length > 0 ? (
          <div className="flex flex-row h-[70vh] w-full mt-4">
            {/* Projects List - Expands to fill available space */}
            <ul className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_140px] gap-4 h-full w-full">
              {displayProjects.map((project, index) => {
                // 1. Resolve Featured Image URL
                const featuredImg = project.projectDetails?.featuredImage;
                let imageUrl: string | null | undefined =
                  typeof featuredImg === "string"
                    ? featuredImg
                    : typeof featuredImg === "object" && featuredImg !== null
                      ? (featuredImg as { url?: string | null }).url
                      : undefined;

                // 2. Fallback to first image in gallery if featuredImage is missing
                if (!imageUrl && project.images?.[0]?.image) {
                  const fallbackImg = project.images[0].image;
                  imageUrl =
                    typeof fallbackImg === "string"
                      ? fallbackImg
                      : typeof fallbackImg === "object" && fallbackImg !== null
                        ? (fallbackImg as { url?: string | null }).url
                        : undefined;
                }

                // 3. Ensure the slug exists for the link
                const link = `/projects/${project.projectBehaviour?.slug || "#"}`;

                console.log("Project: ", project);

                return (
                  <li
                    key={project.projectBehaviour?.slug || index}
                    className="group relative flex-1 h-full overflow-hidden cursor-pointer flex flex-col justify-center items-center transition-all duration-500 bg-transparent w-full min-h-50 md:min-h-50vh"
                  >
                    <Link href={link} className="block h-full w-full relative">
                      {/* Background Image logic remains the same */}
                      <div className="absolute inset-0 z-0 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
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
                          className={`absolute inset-0 ${project.projectDetails?.featuredImage ? "bg-black/40" : "bg-[#220B3B]"}`}
                        />
                      </div>
                      {/* 2. Top Right Icon */}
                      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white rounded-full p-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-black"
                        >
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </div>

                      {/* 3. Center Number */}
                      <span className="relative z-10 text-8xl md:text-9xl font-light text-purple-50 md:text-[#220B3B] group-hover:text-white transition-colors duration-500 m-auto w-full h-full text-center flex-col items-center justify-center hidden md:flex md:pb-16">
                        {index + 1}
                      </span>

                      {/* 4. Bottom Text Container */}
                      <div className="absolute md:left-4 bottom-2 left-3 md:bottom-4 lg:bottom-6 lg:left-6 z-10 text-left pr-3">
                        <h5 className="text-xl md:text-2xl font-bold text-white lg:text-transparent group-hover:text-white transition-colors duration-500 line-clamp-3 md:line-clamp-2 tracking-tighter">
                          {project.title}
                        </h5>
                        <p className="hidden md:block text-sm text-transparent group-hover:text-neutral-300 transition-colors duration-500 line-clamp-1 pr-2">
                          {project.projectDetails?.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}

              <li className="lg:h-full md:mt-auto lg:mt-0">
                <Link href="/projects" className="shrink-0 lg:h-full block">
                  <div className="group relative overflow-hidden bg-[#220B3B] max-h-28 md:max-h-max h-full w-full lg:w-35 flex flex-col items-center lg:justify-between lg:py-12 hover:bg-[#341159] transition-colors duration-300">
                    <div className="flex-1 flex ml-10 lg:ml-0 translate-y-3 lg:translate-y-0 lg:items-center lg:justify-center">
                      <h5 className="lg:rotate-90 text-white text-4xl font-semibold whitespace-nowrap tracking-wide translate-y-6 lg:translate-y-0">
                        View All
                      </h5>
                    </div>

                    <svg
                      width="111"
                      height="94"
                      viewBox="0 0 111 94"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="lg:mt-auto self-start -translate-x-6 group-hover:translate-x-6 transition-transform duration-300 ease-in-out -translate-y-2 lg:translate-y-0"
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
              </li>
            </ul>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto mt-10">
            <NoProjectsBanner theme="light" />
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectSection;
