"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

interface GridCardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "large" | "small";
  isFeatured?: boolean;
}

/**
 * GridCard provides a 3D-effect background that scales without distorting
 * its rounded corners. It uses a CSS div for the shape and an SVG filter
 * for the complex shadows and highlights.
 */
export function GridCard({
  children,
  className,
  isFeatured = false,
  variant = "large",
}: GridCardProps) {
  const filterId = useId().replace(/:/g, "");
  const borderRadius =
    variant === "small" ? "rounded-[25px]" : "rounded-[35px]";

  return (
    <div className={cn("relative p-4 shadow-xl z-50", className)}>
      {/* 
          Hidden SVG to define the filter. 
          Using filterUnits="objectBoundingBox" and primitiveUnits="userSpaceOnUse"
          allows the filter to apply to any sized element while keeping 
          blur and offset values in absolute pixels.
      */}
      <svg
        width="0"
        height="0"
        className="absolute pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            {/* 1. Drop Shadow */}
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
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

            {/* 2. Inner Shadow (Highlight Top-Left) */}
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-0.5" dy="-0.8" />
            <feGaussianBlur stdDeviation="0.25" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"
            />
            <feBlend mode="screen" in2="shape" result="effect2_innerShadow" />

            {/* 3. Inner Shadow (Highlight Bottom-Right) */}
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="0.3" dy="0.8" />
            <feGaussianBlur stdDeviation="0.25" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"
            />
            <feBlend
              mode="screen"
              in2="effect2_innerShadow"
              result="effect3_innerShadow"
            />

            {/* 4. Final Soft Blur */}
            <feGaussianBlur
              stdDeviation="0.5"
              result="effect4_foregroundBlur"
            />
          </filter>
        </defs>
      </svg>

      {/* 
          The Background Element.
          Applying the SVG filter to a standard div with border-radius
          ensures the corners remain perfectly round (not elliptical)
          regardless of the card's aspect ratio.
      */}
      <div
        className={cn(
          "absolute inset-0 z-0 bg-[#462F65] pointer-events-none transition-transform duration-300 opacity-80!",
          borderRadius,
        )}
        style={{ filter: `url(#${filterId})` }}
      />

      {/* Content Container */}
      <div
        className={`relative z-10 w-full h-full ${isFeatured && "flex flex-col gap-2"}`}
      >
        {children}
      </div>
    </div>
  );
}
