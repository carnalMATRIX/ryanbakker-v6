"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { WaveformIcon } from "./WaveformIcon";
import {
  GitHubLargeIcon,
  LinkedInLargeIcon,
  InstagramLargeIcon,
  SpotifyLargeIcon,
  MusicNoteIcon,
} from "@/constants";
import { AnimateOnScroll } from "./AnimateOnScroll";

interface TopTrack {
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
}

export interface SocialCard {
  platform: "github" | "linkedin" | "instagram" | "spotify";
  title: string;
  link: string;
}

function SocialGallery({ socialCards }: { socialCards?: SocialCard[] | null }) {
  const [topTrack, setTopTrack] = useState<TopTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTrack = async () => {
      try {
        const response = await fetch("/api/spotify/top-track");
        if (response.ok) {
          const data = await response.json();
          setTopTrack(data);
        }
      } catch (error) {
        console.error("Error fetching top track:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTrack();
  }, []);

  const githubCard = socialCards?.find((c) => c.platform === "github");
  const linkedinCard = socialCards?.find((c) => c.platform === "linkedin");
  const instagramCard = socialCards?.find((c) => c.platform === "instagram");
  const spotifyCard = socialCards?.find((c) => c.platform === "spotify");

  return (
    <section className="section-parent py-12 md:py-16">
      <div className="section-child px-4">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <AnimateOnScroll delay={0}>
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#b492f4] block mb-2">
              Digital Footprint
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-sans">
              Where to find me
            </h3>
          </AnimateOnScroll>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* GitHub Card */}
          <AnimateOnScroll className="w-full h-72 md:h-80" delay={50}>
            <a
              href={githubCard?.link || "https://github.com/carnalMATRIX"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full h-full rounded-[24px] md:rounded-[32px] border border-white/10 bg-zinc-900/30 backdrop-blur-md overflow-hidden p-6 md:p-8 flex flex-col justify-between hover:border-white/20 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 hover:z-10 cursor-pointer"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-purple-900/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-0" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">
                    GitHub // Dev
                  </span>
                  <GitHubLargeIcon className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                </div>

                <h5 className="font-sans font-black text-xl md:text-2xl uppercase text-white leading-tight tracking-tight mt-auto group-hover:text-[#b492f4] transition-colors duration-300">
                  {githubCard?.title || "My Developer Personality"}
                </h5>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors duration-300">
                    EXPLORE REPOSITORIES
                  </span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#b492f4] group-hover:text-black group-hover:border-transparent transition-all duration-300 shrink-0">
                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </a>
          </AnimateOnScroll>

          {/* LinkedIn Card */}
          <AnimateOnScroll className="w-full h-72 md:h-80" delay={150}>
            <a
              href={linkedinCard?.link || "https://linkedin.com/in/rd-beckett"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full h-full rounded-[24px] md:rounded-[32px] border border-white/10 bg-zinc-900/30 backdrop-blur-md overflow-hidden p-6 md:p-8 flex flex-col justify-between hover:border-white/20 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 hover:z-10 cursor-pointer"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-blue-900/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-0" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">
                    LinkedIn // Corporate
                  </span>
                  <LinkedInLargeIcon className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                </div>

                <h5 className="font-sans font-black text-xl md:text-2xl uppercase text-white leading-tight tracking-tight mt-auto group-hover:text-[#b492f4] transition-colors duration-300">
                  {linkedinCard?.title || "My corporate Personality"}
                </h5>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors duration-300">
                    CONNECT PROFESSIONALLY
                  </span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#b492f4] group-hover:text-black group-hover:border-transparent transition-all duration-300 shrink-0">
                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </a>
          </AnimateOnScroll>

          {/* Instagram Card */}
          <AnimateOnScroll className="w-full h-72 md:h-80" delay={250}>
            <a
              href={instagramCard?.link || "https://www.instagram.com/rd.beckett/"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full h-full rounded-[24px] md:rounded-[32px] border border-white/10 bg-zinc-900/30 backdrop-blur-md overflow-hidden p-6 md:p-8 flex flex-col justify-between hover:border-white/20 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 hover:z-10 cursor-pointer"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/10 via-orange-500/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-0" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">
                    Instagram // Photography
                  </span>
                  <InstagramLargeIcon className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                </div>

                <h5 className="font-sans font-black text-xl md:text-2xl uppercase text-white leading-tight tracking-tight mt-auto group-hover:text-[#b492f4] transition-colors duration-300">
                  {instagramCard?.title || "My Photographer Personality"}
                </h5>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors duration-300">
                    VIEW PORTFOLIO
                  </span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#b492f4] group-hover:text-black group-hover:border-transparent transition-all duration-300 shrink-0">
                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </a>
          </AnimateOnScroll>

          {/* Spotify Card (Full Width) */}
          <AnimateOnScroll className="md:col-span-3 w-full" delay={150}>
            <div className="relative w-full group overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 bg-zinc-900/30 backdrop-blur-md p-6 md:p-8 lg:p-10 hover:border-white/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-in fade-in">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-green-900/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-0" />

              <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-8 w-full">
                {/* Now Playing Widget */}
                <div className="w-full lg:w-[58%] bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative backdrop-blur-sm justify-between">
                  <WaveformIcon className="absolute top-4 right-4 text-[#1db954]" />

                  {/* Artwork + Info Row */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-zinc-900">
                      {loading ? (
                        <div className="w-full h-full bg-white/5 animate-pulse" />
                      ) : topTrack ? (
                        <Image
                          src={topTrack.albumImageUrl}
                          alt="Album Art"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <MusicNoteIcon className="text-white/20 size-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left self-center sm:self-start pt-2 w-full">
                      <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-[#1db954] block">
                        {topTrack ? "Now Playing" : "Recently Played"}
                      </span>
                      <h6 className="text-white font-black text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight mt-1 truncate">
                        {loading ? "Loading track..." : topTrack?.title || "Spotify Offline"}
                      </h6>
                      <p className="text-zinc-400 text-sm md:text-base truncate">
                        {loading ? "Syncing..." : topTrack?.artist || "Not currently playing"}
                      </p>
                    </div>
                  </div>

                  {/* CTA Row */}
                  {topTrack && (
                    <div className="flex justify-end w-full border-t border-white/5 pt-4 mt-2">
                      <a
                        href={topTrack.songUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-black bg-[#1db954] hover:bg-[#1ed760] px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/15"
                      >
                        Listen on Spotify
                      </a>
                    </div>
                  )}
                </div>

                {/* Spotify Profile Info */}
                <div className="w-full lg:w-[38%] flex flex-col justify-between items-start gap-6 py-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">
                      Spotify // Jamming
                    </span>
                    <SpotifyLargeIcon className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shrink-0" />
                  </div>

                  <h5 className="font-sans font-black text-2xl md:text-3xl uppercase text-white leading-tight tracking-tight text-left">
                    {spotifyCard?.title || "My music personality"}
                  </h5>

                  <a
                    href={
                      spotifyCard?.link ||
                      "https://open.spotify.com/user/31cgbozvcwgbz5xhlpjogd32wiqe?si=55cfba08ec2d4bf0"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto mt-auto"
                  >
                    <button className="group/btn flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black px-8 py-3.5 rounded-full transition-all duration-300 font-bold text-xs tracking-widest uppercase w-full md:w-auto hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] cursor-pointer hover:scale-[1.03] active:scale-95">
                      <span>Follow on Spotify</span>
                      <ArrowUpRight
                        size={16}
                        className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300"
                      />
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

export default SocialGallery;
