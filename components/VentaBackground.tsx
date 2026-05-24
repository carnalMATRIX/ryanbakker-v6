"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    VANTA: any;
    p5: any;
  }
}

interface VantaBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  foreground?: string;
  background?: string;
}

const hexToNumber = (hex: string) => parseInt(hex.replace("#", "0x"), 16);

export function VantaBackground({
  children,
  className,
  foreground = "#2d7cb6",
  background = "#03132d",
}: VantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);
  const [p5Loaded, setP5Loaded] = useState(() => typeof window !== "undefined" && !!window.p5);

  const initVanta = () => {
    if (
      !vantaEffectRef.current &&
      window.VANTA &&
      window.VANTA.TOPOLOGY &&
      vantaRef.current &&
      window.p5
    ) {
      try {
        vantaEffectRef.current = window.VANTA.TOPOLOGY({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: hexToNumber(foreground),
          backgroundColor: hexToNumber(background),
        });
      } catch (error) {
        console.error("Vanta Init error", error);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  // Update colors if props change
  useEffect(() => {
    if (vantaEffectRef.current) {
      vantaEffectRef.current.setOptions({
        color: hexToNumber(foreground),
        backgroundColor: hexToNumber(background),
      });
    }
  }, [foreground, background]);

  // Handle re-initialization if needed (e.g., after scripts load)
  useEffect(() => {
    if (p5Loaded && window.VANTA && window.VANTA.TOPOLOGY) {
      initVanta();
    }
  }, [p5Loaded]);

  return (
    <>
      <Script
        id="p5-bundle"
        src="/scripts/p5.min.js"
        strategy="afterInteractive"
        onLoad={() => setP5Loaded(true)}
      />
      {p5Loaded && (
        <Script
          id="vanta-topology-bundle"
          src="/scripts/vanta.topology.min.js"
          strategy="afterInteractive"
          onLoad={initVanta}
        />
      )}

      <div
        ref={vantaRef}
        className={cn(
          "overflow-hidden",
          children ? "relative w-full min-h-screen" : "block",
          className,
        )}
      >
        {children && (
          <div className="relative z-10 h-full w-full">{children}</div>
        )}
      </div>
    </>
  );
}
