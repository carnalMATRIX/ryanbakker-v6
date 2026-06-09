"use client";

import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";
import { AnimateOnScroll } from "./AnimateOnScroll";

function AboutBento({ data }: { data?: any }) {
  const bentoData = data?.data || {};

  return (
    <div className="section-child w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-12 grid-flow-row-dense text-white gap-6 z-50">
      {/* 3. About Me Header */}
      <AnimateOnScroll
        className="md:col-span-1 md:col-start-1 md:row-span-1 lg:col-span-1 lg:row-span-2 lg:col-start-4 lg:row-start-1"
        delay={50}
        direction="up"
      >
        <div className="flex flex-col justify-end h-full p-6 bg-transparent border border-white/10 rounded-[24px] md:rounded-[32px]">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#b492f4] mb-1">
            Who I Am
          </span>
          <h3 className="text-3xl font-black uppercase tracking-tight text-white leading-none">
            About Me
          </h3>
        </div>
      </AnimateOnScroll>

      {/* 1. Hero Block (Top on mobile, spans both md columns) */}
      <AnimateOnScroll
        className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer md:col-span-2 md:col-start-1 md:row-span-4 lg:col-span-2 lg:row-span-6 lg:col-start-1 lg:row-start-1"
        delay={100}
        direction="up"
      >
        <div className="h-full w-full flex items-end relative overflow-hidden min-h-80 lg:min-h-0 p-6 md:p-8">
          <Image
            src={getMediaUrl(bentoData.aboutHeroImage)}
            alt={bentoData.aboutHeroImage?.alt || "About Hero"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
          <h5 className="text-white relative z-20 text-lg md:text-xl lg:text-2xl tracking-tight border-l-2 border-[#b492f4] pl-4 font-crimson font-semibold leading-relaxed">
            {bentoData.aboutHeroText}
          </h5>
        </div>
      </AnimateOnScroll>

      {/* =========================================
          LEFT COLUMN ITEMS (Middle stack on mobile)
          ========================================= */}

      {/* 7. Cloud Image */}
      <AnimateOnScroll
        className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer md:col-span-1 md:col-start-1 md:row-span-4 lg:col-span-1 lg:row-span-6 lg:col-start-2 lg:row-start-7"
        delay={150}
        direction="up"
      >
        <div className="h-full w-full relative overflow-hidden min-h-60 lg:min-h-0">
          <Image
            src={getMediaUrl(bentoData.aboutDeveloperImage)}
            alt={bentoData.aboutDeveloperImage?.alt || "Developer"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center z-0"
          />
        </div>
      </AnimateOnScroll>

      {/* 6. Developer Text */}
      <AnimateOnScroll
        className="relative bg-zinc-900/30 backdrop-blur-md border border-white/10 rounded-[24px] md:rounded-[32px] p-6 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer md:col-span-1 md:col-start-1 md:row-span-2 lg:col-span-1 lg:row-span-4 lg:col-start-1 lg:row-start-7"
        delay={200}
        direction="up"
      >
        <div className="h-full w-full flex flex-col justify-between gap-4">
          <h4 className="font-bold text-xl uppercase tracking-tight text-white">Developer</h4>
          <p className="text-sm font-light text-zinc-300 leading-relaxed">{bentoData.aboutDeveloperDescription}</p>
        </div>
      </AnimateOnScroll>

      {/* 4. Circle Image (Auckland Skyline) */}
      <AnimateOnScroll
        className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer md:col-span-1 md:col-start-1 md:row-span-4 lg:col-span-1 lg:row-span-6 lg:col-start-3 lg:row-start-4"
        delay={200}
        direction="up"
      >
        <div className="h-full w-full relative overflow-hidden min-h-60 lg:min-h-0">
          <Image
            src={getMediaUrl(bentoData.aboutStudentImage)}
            alt={bentoData.aboutStudentImage?.alt || "Student"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center z-0"
          />
        </div>
      </AnimateOnScroll>

      {/* 8. Self-Development Text */}
      <AnimateOnScroll
        className="relative bg-zinc-900/30 backdrop-blur-md border border-white/10 rounded-[24px] md:rounded-[32px] p-6 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer md:col-span-1 md:col-start-1 md:row-span-2 lg:col-span-1 lg:row-span-3 lg:col-start-3 lg:row-start-10"
        delay={300}
        direction="up"
      >
        <div className="h-full w-full flex flex-col justify-between gap-4">
          <h4 className="font-bold text-xl uppercase tracking-tight text-white">Self-Development</h4>
          <p className="text-sm font-light text-zinc-300 leading-relaxed">{bentoData.aboutSelfDevDescription}</p>
        </div>
      </AnimateOnScroll>

      {/* =========================================
          RIGHT COLUMN ITEMS (Bottom stack on mobile)
          ========================================= */}

      {/* 9. Desert Image */}
      <AnimateOnScroll
        className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer md:col-span-1 md:col-start-2 md:row-span-4 lg:col-span-1 lg:row-span-6 lg:col-start-4 lg:row-start-7"
        delay={250}
        direction="up"
      >
        <div className="h-full w-full relative overflow-hidden min-h-60 lg:min-h-0">
          <Image
            src={getMediaUrl(bentoData.aboutCreativeImage)}
            alt={bentoData.aboutCreativeImage?.alt || "Creative"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center z-0"
          />
        </div>
      </AnimateOnScroll>

      {/* 2. Student Text */}
      <AnimateOnScroll
        className="relative bg-zinc-900/30 backdrop-blur-md border border-white/10 rounded-[24px] md:rounded-[32px] p-6 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer md:col-span-1 md:col-start-2 md:row-span-2 lg:col-span-1 lg:row-span-3 lg:col-start-3 lg:row-start-1"
        delay={150}
        direction="up"
      >
        <div className="h-full w-full flex flex-col justify-between gap-4">
          <h4 className="font-bold text-xl uppercase tracking-tight text-white">Student</h4>
          <p className="text-sm font-light text-zinc-300 leading-relaxed">{bentoData.aboutStudentDescription}</p>
        </div>
      </AnimateOnScroll>

      {/* 10. Small Sunset Image */}
      <AnimateOnScroll
        className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer md:col-span-1 md:col-start-2 md:row-span-2 lg:col-span-1 lg:row-span-2 lg:col-start-1 lg:row-start-11"
        delay={350}
        direction="up"
      >
        <div className="h-full w-full relative overflow-hidden min-h-24 lg:min-h-0">
          <Image
            src={getMediaUrl(bentoData.aboutSmallImage)}
            alt={bentoData.aboutSmallImage?.alt || "Sunset"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center z-0"
          />
        </div>
      </AnimateOnScroll>

      {/* 5. Creative Text */}
      <AnimateOnScroll
        className="relative bg-zinc-900/30 backdrop-blur-md border border-white/10 rounded-[24px] md:rounded-[32px] p-6 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer md:col-span-1 md:col-start-2 md:row-span-2 lg:col-span-1 lg:row-span-4 lg:col-start-4 lg:row-start-3"
        delay={250}
        direction="up"
      >
        <div className="h-full w-full flex flex-col justify-between gap-4">
          <h4 className="font-bold text-xl uppercase tracking-tight text-white">Creative</h4>
          <p className="text-sm font-light text-zinc-300 leading-relaxed">{bentoData.aboutCreativeDescription}</p>
        </div>
      </AnimateOnScroll>
    </div>
  );
}

export default AboutBento;
