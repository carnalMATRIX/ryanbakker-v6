"use client";

import React from "react";
import { TopoRibbonCanvas } from "./TopoRibbonCanvas";
import { ChevronDown, Folder } from "lucide-react";
import { HERO_SOCIAL_LINKS } from "@/constants";
import Link from "next/link";
import { AnimateOnScroll } from "./AnimateOnScroll";

interface HeroSectionProps {
  data?: any;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const description =
    data?.heroDescription ||
    "A BCIS student based in Auckland, NZ. With a focus on human-computer interaction and artificial intelligence, combined with robust software development and an emphasis on effective project management.";

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col justify-center px-6 md:px-12 lg:px-24">
      {/* Background Layer */}
      <TopoRibbonCanvas />

      <div className="bg-linear-to-tr from-slate-900/40 via-indigo-900/35 md:via-indigo-900/10 to-violet-900/10 h-full w-full absolute left-0 top-0 z-5" />

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start space-y-8 pb-20 mt-16 md:mt-0">
        {/* Text Hierarchy */}
        <div className="w-full">
          <AnimateOnScroll delay={100}>
            <div>
              <p className="text-sm md:text-base font-medium tracking-[0.2em] text-zinc-400 uppercase">
                Hello, I&apos;m
              </p>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-16 md:leading-none uppercase -ml-1.5">
                Ryan Beckett
              </h1>
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll delay={250}>
            <div className="relative mt-4 inline-block">
              {/* Background Layer: White block with // characters knocked out */}
              <div className="bg-indigo-300/80 px-1 py-1.5 mix-blend-screen select-none pointer-events-none ">
                <div className="text-xl md:text-3xl! font-bold uppercase flex flex-col md:flex-row flex-wrap md:items-center gap-x-5 tracking-widest">
                  <p className="flex flex-row items-center gap-5">
                    <span className="text-black block md:hidden font-black tracking-tighter">
                      //
                    </span>
                    Developer
                  </p>
                  <p className="flex flex-row items-center gap-5">
                    <span className="text-black font-black tracking-tighter">
                      //
                    </span>
                    UX Designer
                  </p>
                  <p className="flex flex-row items-center gap-5">
                    <span className="text-black font-black tracking-tighter">
                      //
                    </span>
                    Photographer
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Bio Paragraph */}
        <AnimateOnScroll delay={400}>
          <p className="max-w-xl text-zinc-200 leading-relaxed font-light">
            {description}
          </p>
        </AnimateOnScroll>

        {/* Navigation & Action Bar */}
        <AnimateOnScroll delay={550} className="w-full">
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between pt-20 space-y-8 md:space-y-0">
            {/* Left Utilities (Actions) */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <Link href="/projects" className="w-full md:w-auto">
                <button className="group flex items-center space-x-3 bg-[#b492f4] hover:bg-[#c0a5f9] text-black px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95  cursor-pointer w-full md:w-auto justify-center">
                  <Folder size={18} className="text-black group" />
                  <span className="font-bold text-sm tracking-wider uppercase">
                    View Projects
                  </span>
                </button>
              </Link>

              <Link href="/#continue">
                <button className="group flex items-center space-x-2 text-white hover:text-indigo-300 transition-colors duration-300 cursor-pointer">
                  <span className="font-medium text-sm tracking-wider uppercase w-full md:w-auto">
                    Continue Reading
                  </span>
                  <div className="flex flex-col -space-y-1">
                    <ChevronDown size={16} className="animate-bounce" />
                    <ChevronDown size={16} className="animate-bounce -mt-1.5" />
                  </div>
                </button>
              </Link>
            </div>

            {/* Right Utilities (Socials) */}
            <div className="flex items-center space-x-8 justify-center md:justify-end mt-4 md:mt-0">
              {HERO_SOCIAL_LINKS.map((social) => (
                <SocialLink
                  key={social.label}
                  href={social.href}
                  icon={<social.Icon width={18} height={18} />}
                  label={social.label.toUpperCase()}
                />
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

const SocialLink: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
}> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-all duration-300"
  >
    <div className="opacity-70 group-hover:opacity-100">{icon}</div>
    <span className="hidden md:inline text-[10px] font-bold tracking-[0.2em]">
      {label}
    </span>
  </a>
);
