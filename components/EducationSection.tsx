import React from "react";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";

export interface EducationItem {
  title: string;
  completionYears: string;
  focus: string;
  providerLogo:
    | string
    | {
        url?: string | null;
        alt?: string | null;
      }
    | null;
  primarySubject: string;
  secondarySubject: string;
  tertiarySubject: string;
  mission: string | React.ReactNode;
}

interface EducationSectionProps {
  quote?: string | null;
  quoteAuthor?: string | null;
  bodyText?: string | React.ReactNode | null;
  items?: EducationItem[] | null;
  extracurricularActivities?: { activityName: string }[] | null;
}

function EducationSection({
  quote,
  quoteAuthor,
  bodyText,
  items,
  extracurricularActivities,
}: EducationSectionProps) {
  const educationItems = items || [];

  return (
    <section className="relative w-full py-24 md:py-32 bg-transparent radial-blue overflow-hidden border-t border-white/5">
      <div className="section-child max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left Column: Context, Quote, Extracurriculars */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-12 lg:h-fit">
          <div className="space-y-3">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#b492f4] block">
              Academic Journey
            </span>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
              Education
            </h3>
          </div>

          {quote && (
            <blockquote className="border-l-2 border-[#b492f4] pl-4 space-y-2">
              <p className="font-crimson text-xl md:text-2xl leading-relaxed text-zinc-100 italic">
                &quot;{quote}&quot;
              </p>
              {quoteAuthor && (
                <cite className="block text-xs md:text-sm font-bold tracking-wider text-zinc-400 uppercase not-italic">
                  — {quoteAuthor}
                </cite>
              )}
            </blockquote>
          )}

          {bodyText && (
            <div className="font-inter text-sm md:text-base leading-relaxed font-light text-zinc-300 space-y-4">
              {bodyText}
            </div>
          )}

          {extracurricularActivities && extracurricularActivities.length > 0 && (
            <div className="pt-8 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Extracurricular
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {extracurricularActivities.map((activity, index) => (
                  <li
                    key={index}
                    className="text-zinc-300 text-sm font-light font-inter flex items-start gap-2.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b492f4] shrink-0 mt-2" />
                    <span>{activity.activityName}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Timeline of Degrees */}
        <div className="lg:col-span-7 space-y-10 lg:space-y-12">
          {educationItems.map((edu, index) => {
            const logoUrl = getMediaUrl(edu.providerLogo);
            return (
              <div
                key={index}
                className="group relative flex flex-col sm:flex-row gap-6 sm:gap-8 pb-10 border-b border-white/10 last:border-0 last:pb-0"
              >
                {/* Timeline Side: Years & Optional Logo */}
                <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-4 sm:w-28 shrink-0">
                  <span className="font-mono text-sm md:text-base font-bold text-[#b492f4]">
                    {edu.completionYears}
                  </span>
                  {logoUrl && (
                    <div className="relative w-24 h-16 bg-white/5 rounded-2xl p-2 flex items-center justify-center border border-white/10 group-hover:border-[#b492f4]/30 group-hover:bg-white/10 transition-all duration-300">
                      <Image
                        src={logoUrl}
                        alt={edu.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}
                </div>

                {/* Content Side: Title, Focus, Subjects, Mission */}
                <div className="flex-1 space-y-5">
                  <div className="space-y-1">
                    <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#b492f4] transition-colors duration-300 leading-snug">
                      {edu.title}
                    </h4>
                    <p className="text-sm md:text-base font-semibold text-zinc-300 italic">
                      Focus: {edu.focus}
                    </p>
                  </div>

                  {/* Subject Badges */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Core Subjects
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {[edu.primarySubject, edu.secondarySubject, edu.tertiarySubject]
                        .filter(Boolean)
                        .map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-xs bg-white/5 border border-white/10 hover:border-[#b492f4]/25 hover:text-white px-3.5 py-1.5 rounded-full text-zinc-300 transition-all duration-300"
                          >
                            {sub}
                          </span>
                        ))}
                    </div>
                  </div>

                  {edu.mission && (
                    <div className="pt-2 space-y-1.5">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Academic Mission
                      </h5>
                      <div className="font-crimson text-lg italic text-zinc-300 leading-relaxed font-light">
                        {edu.mission}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EducationSection;
