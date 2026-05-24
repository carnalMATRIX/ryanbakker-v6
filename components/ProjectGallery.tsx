"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Media } from "@/payload-types";
import { Button } from "./ui/button";
import { ChevronRight, X } from "lucide-react";

interface ProjectGalleryProps {
  images?:
    | {
        image: number | Media;
        id?: string | null;
      }[]
    | null;
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!images || images.length === 0) return null;

  const currentImageData = images[currentIndex].image;
  const imageUrl =
    typeof currentImageData === "object" ? currentImageData.url : "";
  const altText =
    typeof currentImageData === "object"
      ? currentImageData.alt
      : "Project image";

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {/* Main Image Container - Added cursor-zoom-in and onClick handler */}
        <div
          className="relative aspect-video lg:aspect-square w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-neutral-800/50 max-h-[400px] md:max-h-[500px] lg:max-h-125 cursor-zoom-in group"
          onClick={() => setIsLightboxOpen(true)}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-cover md:object-contain lg:object-cover p-2 rounded-4xl transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="glass-icon"
            size="icon"
            onClick={prevImage}
            disabled={images.length <= 1}
            className="rotate-180"
          >
            <ChevronRight className="text-[#220B3B]" />
          </Button>

          <span className="text-sm font-medium text-white/60">
            {currentIndex + 1} / {images.length}
          </span>

          <Button
            variant="glass-icon"
            size="icon"
            onClick={nextImage}
            disabled={images.length <= 1}
            className="text-[#220B3B]"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* Fullscreen Lightbox Overlay */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setIsLightboxOpen(false)} // Clicking the background closes it
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 shadow-xl transition-all hover:cursor-pointer"
            aria-label="Close fullscreen image"
          >
            <X size={24} />
          </button>

          {/* Image Container inside Lightbox */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent clicking the image from closing the overlay
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={altText}
                fill
                className="object-contain" // Changed from object-cover to object-contain so nothing gets cropped
                priority
                sizes="100vw"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
