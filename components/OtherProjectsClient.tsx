"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GridCard } from "./GridCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OtherProjectsClientProps {
  otherProjects: any[];
  activeTags: string[];
}

export function OtherProjectsClient({
  otherProjects,
  activeTags,
}: OtherProjectsClientProps) {
  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

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
    const featuredImage = project.projectDetails?.featuredImage;
    if (featuredImage && typeof featuredImage === "object") {
      return featuredImage.url || "";
    }
    return "";
  };

  return (
    <>
      {otherProjects.slice(0, visibleCount).map((project, index) => (
        <Link
          href={`/projects/${project.projectBehaviour.slug}`}
          passHref
          key={project.id}
          // 1. Dynamic delay: (index % 4) ensures the stagger resets for every new row of 4
          // 2. Fill mode 'both' ensures the cards remain fully invisible until their delay is finished
          style={{
            animationDelay: `${(index % 4) * 150}ms`,
            animationFillMode: "both",
          }}
          // 3. Added the shadcn animate-in classes for a smooth upward fade
          className="col-span-1 row-span-1 block rounded-2xl transition-transform hover:-translate-y-2 ease-out animate-in fade-in slide-in-from-bottom-8 duration-700"
        >
          <GridCard className="overflow-hidden h-78" variant="small">
            {getFeaturedImageUrl(project) && (
              <Image
                src={getFeaturedImageUrl(project)}
                alt={project.title}
                height={500}
                width={500}
                className="object-cover rounded-lg max-h-[50%]"
              />
            )}

            <div className="relative flex flex-col w-full h-full pt-3">
              <h5
                className={`text-lg font-bold leading-6 w-full z-10 ${getFeaturedImageUrl(project) ? "line-clamp-2" : "line-clamp-5"}`}
              >
                {project.title}
              </h5>

              <p className="text-xs opacity-80 leading-tight pt-1.5 line-clamp-1">
                {project.projectDetails?.description}
              </p>

              {renderTags(
                project.tags as { label: string }[],
                "flex-wrap-reverse",
              )}
            </div>
          </GridCard>
        </Link>
      ))}

      {visibleCount < otherProjects.length && (
        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-center pt-8 w-full md:w-fit">
          <Button
            onClick={handleLoadMore}
            size="lg"
            variant="refined-outline"
            className="w-full md:w-fit"
          >
            Load More Projects
          </Button>
        </div>
      )}
    </>
  );
}
