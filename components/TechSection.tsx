"use client";

import { STACK_DATA } from "@/constants";
import { AnimateOnScroll } from "./AnimateOnScroll";

function TechSection({
  activeIndex,
  onToggle,
}: {
  activeIndex: number;
  onToggle: (newIndex: number) => void;
}) {
  const activeData = STACK_DATA[activeIndex];

  return (
    <section className="relative w-full py-24 md:py-32 bg-transparent radial-purple border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <AnimateOnScroll delay={0}>
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#b492f4] block mb-2">
              Core Capabilities
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
              Technical Stack
            </h3>
          </AnimateOnScroll>
        </div>

        {/* Tabs Selector */}
        <AnimateOnScroll delay={150} className="w-full">
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {STACK_DATA.map((data, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={data.id}
                  onClick={() => onToggle(index)}
                  className={`px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 border cursor-pointer hover:scale-105 active:scale-95 ${
                    isActive
                      ? "bg-white text-black border-transparent shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/20"
                  }`}
                >
                  {data.name}
                </button>
              );
            })}
          </div>
        </AnimateOnScroll>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {activeData.items.map((item, idx) => {
            const Icon = activeData.icons[idx];
            return (
              <AnimateOnScroll
                key={item}
                delay={idx * 100}
                direction="up"
                className="w-full"
              >
                <div className="group relative w-full rounded-[24px] md:rounded-[32px] border border-white/10 bg-zinc-900/30 backdrop-blur-md p-8 flex flex-col items-center text-center hover:border-white/20 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(180,146,244,0.05)] transition-all duration-500 cursor-pointer h-full justify-center min-h-60">
                  {/* Subtle Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] md:rounded-[32px] z-0" />

                  {/* Icon */}
                  {Icon && (
                    <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                      <Icon className="w-14 h-14 md:w-16 md:h-16" />
                    </div>
                  )}

                  {/* Name */}
                  <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white relative z-10 group-hover:text-[#b492f4] transition-colors duration-300">
                    {item}
                  </h4>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TechSection;
