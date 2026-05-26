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
  const isIntersectingRef = useRef(true);
  const [p5Loaded, setP5Loaded] = useState(() => typeof window !== "undefined" && !!window.p5);

  // Animation visibility duration limits (freeze after 6s of cumulative visibility)
  const animationTimeRef = useRef(0);
  const lastStartedRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startVantaAnimation = () => {
    if (!vantaEffectRef.current || !vantaEffectRef.current.p5) return;

    const remaining = 6000 - animationTimeRef.current;
    if (remaining <= 0) {
      vantaEffectRef.current.p5.noLoop();
      return;
    }

    vantaEffectRef.current.p5.loop();
    lastStartedRef.current = Date.now();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (vantaEffectRef.current && vantaEffectRef.current.p5) {
        vantaEffectRef.current.p5.noLoop();
      }
      animationTimeRef.current = 6000;
      lastStartedRef.current = null;
      timeoutRef.current = null;
    }, remaining);
  };

  const stopVantaAnimation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (lastStartedRef.current !== null) {
      animationTimeRef.current += Date.now() - lastStartedRef.current;
      lastStartedRef.current = null;
    }

    if (vantaEffectRef.current && vantaEffectRef.current.p5) {
      vantaEffectRef.current.p5.noLoop();
    }
  };

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

        // Handle initial visibility state
        if (isIntersectingRef.current) {
          startVantaAnimation();
        } else {
          stopVantaAnimation();
        }
      } catch (error) {
        console.error("Vanta Init error", error);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  // Intersection Observer to pause Vanta's p5 rendering loop when off-screen
  useEffect(() => {
    const element = vantaRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startVantaAnimation();
        } else {
          stopVantaAnimation();
        }
      },
      { threshold: 0 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

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
