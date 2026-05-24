"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  captionClassName?: string;
}

export function ArticleImage({
  src,
  alt,
  width,
  height,
  className,
  captionClassName,
}: ArticleImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="image-wrapper group cursor-zoom-in transition-transform duration-500 ease-out hover:-translate-y-1" onClick={() => setIsOpen(true)}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
          className={cn("block", className)}
        />
        <p className={cn("text-xs font-light italic text-neutral-400 mt-2 transition-colors duration-300 group-hover:text-white text-left", captionClassName)}>
          {alt || "Project image"}
        </p>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 shadow-xl transition-all cursor-pointer"
            aria-label="Close image"
          >
            <X size={24} />
          </button>

          <div 
            className="relative w-full h-full flex items-center justify-center cursor-zoom-out"
          >
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>
          </div>
          
          {/* Mobile landscape support hint/container ensures the image doesn't get cut off */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-widest pointer-events-none md:hidden">
            Tap anywhere to close
          </div>
        </div>
      )}
    </>
  );
}
