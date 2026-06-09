"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Media } from "@/payload-types";
import { AnimateOnScroll } from "./AnimateOnScroll";

export interface Inspiration {
  title: string;
  description: string;
  image: Media | number;
  link: string;
}

function InspoSection({
  inspirations,
}: {
  inspirations?: Inspiration[] | null;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle responsive check & prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
    };

    // Check on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayInspirations = inspirations || [];

  // 3 items + 1 button = 4 on mobile
  // 7 items + 1 button = 8 on md and up
  // Defaulting to 7 for the server render to match desktop first
  const staticCount = mounted && isMobile ? 3 : 7;
  const hasMore = displayInspirations.length > staticCount;

  const staticItems = displayInspirations.slice(0, staticCount);
  const dynamicItems = displayInspirations.slice(staticCount);

  return (
    <section className="section-parent py-24 md:py-32 bg-neutral-950 text-white border-t border-white/5 overflow-hidden">
      <div className="section-child w-full h-full max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <AnimateOnScroll delay={0}>
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#b492f4] block mb-2">
              External Inspiration
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
              Creative Sparks
            </h3>
          </AnimateOnScroll>
        </div>

        {/* Main Container */}
        <div className="flex flex-col h-auto w-full mt-4">
          <motion.ul
            layout
            transition={{ duration: 0.4, ease: "circOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          >
            {/* Always visible static items */}
            {staticItems.map((item, index) => {
              const imageUrl =
                typeof item.image === "object"
                  ? item.image?.url
                  : String(item.image);

              return (
                <li
                  key={`static-${index}`}
                  className="group relative overflow-hidden cursor-pointer flex flex-col justify-center items-center transition-all duration-500 bg-zinc-900/30 border border-white/10 rounded-[24px] md:rounded-[32px] h-60 lg:h-[25vh] hover:border-white/20 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                >
                  <AnimateOnScroll
                    className="w-full h-full"
                    delay={50 * index}
                  >
                    <Link
                      href={item.link}
                      target="_blank"
                      className="w-full h-full flex items-center justify-center relative"
                    >
                      {/* Background Image Layer */}
                      <div className="absolute inset-0 z-0 opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/55" />
                      </div>

                      {/* Top Right Icon */}
                      <div className="absolute top-4 right-4 z-10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#b492f4] group-hover:text-black group-hover:border-transparent shrink-0">
                        <svg
                          width="14"
                          height="14"
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

                      {/* Number Indicator */}
                      <span className="relative z-10 text-7xl font-black text-white/5 md:text-zinc-800/10 group-hover:text-[#b492f4]/15 transition-colors duration-500 select-none font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Bottom Text Container */}
                      <div className="absolute left-6 bottom-6 right-6 z-10 text-left">
                        <h5 className="text-base md:text-lg font-black uppercase text-white tracking-tight group-hover:text-[#b492f4] transition-colors duration-300 leading-tight">
                          {item.title}
                        </h5>
                        <p className="text-xs text-zinc-400 font-light group-hover:text-zinc-200 transition-colors duration-300 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                </li>
              );
            })}

            {/* Dynamic Items - Fade only, cascading effect */}
            <AnimatePresence>
              {isExpanded &&
                dynamicItems.map((item, index) => {
                  const imageUrl =
                    typeof item.image === "object"
                      ? item.image?.url
                      : String(item.image);

                  return (
                    <motion.li
                      key={`dynamic-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: {
                          delay: index * 0.04,
                          duration: 0.4,
                        },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                      className="group relative overflow-hidden cursor-pointer flex flex-col justify-center items-center transition-all duration-500 bg-zinc-900/30 border border-white/10 rounded-[24px] md:rounded-[32px] h-60 lg:h-[25vh] hover:border-white/20 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                    >
                      <Link
                        href={item.link}
                        target="_blank"
                        className="w-full h-full flex items-center justify-center relative"
                      >
                        {/* Background Image Layer */}
                        <div className="absolute inset-0 z-0 opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 25vw"
                              className="object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/55" />
                        </div>

                        {/* Top Right Icon */}
                        <div className="absolute top-4 right-4 z-10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#b492f4] group-hover:text-black group-hover:border-transparent shrink-0">
                          <svg
                            width="14"
                            height="14"
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

                        {/* Number Indicator */}
                        <span className="relative z-10 text-7xl font-black text-white/5 md:text-zinc-800/10 group-hover:text-[#b492f4]/15 transition-colors duration-500 select-none font-mono">
                          {String(index + staticCount + 1).padStart(2, "0")}
                        </span>

                        {/* Bottom Text Container */}
                        <div className="absolute left-6 bottom-6 right-6 z-10 text-left">
                          <h5 className="text-base md:text-lg font-black uppercase text-white tracking-tight group-hover:text-[#b492f4] transition-colors duration-300 leading-tight">
                            {item.title}
                          </h5>
                          <p className="text-xs text-zinc-400 font-light group-hover:text-zinc-200 transition-colors duration-300 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
            </AnimatePresence>

            {/* Persistent Toggle Button */}
            {hasMore && (
              <motion.li
                layout="position"
                key="toggle-button"
                transition={{
                  layout: {
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "group relative overflow-hidden cursor-pointer flex flex-col justify-between p-6 transition-all duration-300 rounded-[24px] md:rounded-[32px] h-60 lg:h-[25vh]",
                  "bg-[#b492f4]/10 border border-[#b492f4]/20 hover:border-[#b492f4]/40 hover:bg-[#b492f4]/20",
                  "lg:col-start-4", // Ensures it's always in the far right column
                )}
              >
                <motion.h5
                  layout="position"
                  className="text-white text-xl font-black uppercase tracking-widest leading-none mt-2"
                >
                  {isExpanded ? "Show Less" : "View More"}
                </motion.h5>

                <motion.div
                  layout="position"
                  className={cn(
                    "flex gap-1 self-end transition-all duration-300 mb-2",
                    isExpanded
                      ? "rotate-180"
                      : "-translate-x-1 group-hover:translate-x-0",
                  )}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 111 94"
                    fill="none"
                    className="text-white opacity-40 group-hover:opacity-100 transition-opacity"
                  >
                    <path
                      d="M2.4 2.4L49.5 44.7C50.1 45.3 50.5 46.1 50.5 47C50.5 47.8 50.1 48.6 49.5 49.2L6.8 91.5"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 111 94"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M2.4 2.4L49.5 44.7C50.1 45.3 50.5 46.1 50.5 47C50.5 47.8 50.1 48.6 49.5 49.2L6.8 91.5"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </motion.li>
            )}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

export default InspoSection;
