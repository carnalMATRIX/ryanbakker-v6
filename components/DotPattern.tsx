"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export interface DotPatternProps {
  className?: string;
  children?: React.ReactNode;
  /** Dot diameter in pixels */
  dotSize?: number;
  /** Gap between dots in pixels */
  gap?: number;
  /** Base dot color (hex) */
  baseColor?: string;
  /** Glow color on hover (hex) */
  glowColor?: string;
  /** Mouse proximity radius for highlighting */
  proximity?: number;
  /** Glow intensity multiplier */
  glowIntensity?: number;
  /** Wave animation speed (0 to disable) */
  waveSpeed?: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

interface Dot {
  x: number;
  y: number;
  baseOpacity: number;
}

export function DotPattern({
  className,
  children,
  dotSize = 2,
  gap = 24,
  baseColor = "#404040",
  glowColor = "#22d3ee",
  proximity = 120,
  glowIntensity = 1,
  waveSpeed = 0, // Disabled by default to prevent idle CPU usage and device heating
}: DotPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);
  const isDrawingRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const glowRgb = useMemo(() => hexToRgb(glowColor), [glowColor]);

  const drawOffscreen = useCallback(() => {
    const offscreenCanvas = offscreenCanvasRef.current;
    const offscreenCtx = offscreenCtxRef.current;
    if (!offscreenCanvas || !offscreenCtx) return;

    const dpr = window.devicePixelRatio || 1;
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width / dpr, offscreenCanvas.height / dpr);

    const radius = dotSize / 2;

    for (const dot of dotsRef.current) {
      offscreenCtx.fillStyle = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${dot.baseOpacity})`;
      offscreenCtx.beginPath();
      offscreenCtx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      offscreenCtx.fill();
    }
  }, [baseRgb, dotSize]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const { x: mx, y: my } = mouseRef.current;
    const proxSq = proximity * proximity;

    if (waveSpeed > 0) {
      const time = (Date.now() - startTimeRef.current) * 0.001 * waveSpeed;

      for (const dot of dotsRef.current) {
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const distSq = dx * dx + dy * dy;

        // Wave animation
        const wave = Math.sin(dot.x * 0.02 + dot.y * 0.02 + time) * 0.5 + 0.5;
        const waveOpacity = dot.baseOpacity + wave * 0.15;
        const waveScale = 1 + wave * 0.2;

        let opacity = waveOpacity;
        let scale = waveScale;
        let r = baseRgb.r;
        let g = baseRgb.g;
        let b = baseRgb.b;
        let glow = 0;

        // Mouse proximity effect
        if (distSq < proxSq) {
          const dist = Math.sqrt(distSq);
          const t = 1 - dist / proximity;
          const easedT = t * t * (3 - 2 * t); // smoothstep

          // Interpolate color
          r = Math.round(baseRgb.r + (glowRgb.r - baseRgb.r) * easedT);
          g = Math.round(baseRgb.g + (glowRgb.g - baseRgb.g) * easedT);
          b = Math.round(baseRgb.b + (glowRgb.b - baseRgb.b) * easedT);

          opacity = Math.min(1, waveOpacity + easedT * 0.7);
          scale = waveScale + easedT * 0.8;
          glow = easedT * glowIntensity;
        }

        const radius = (dotSize / 2) * scale;

        // Draw glow
        if (glow > 0) {
          const gradient = ctx.createRadialGradient(
            dot.x,
            dot.y,
            0,
            dot.x,
            dot.y,
            radius * 4,
          );
          gradient.addColorStop(
            0,
            `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.4})`,
          );
          gradient.addColorStop(
            0.5,
            `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.1})`,
          );
          gradient.addColorStop(
            1,
            `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0)`,
          );
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    } else {
      // Draw pre-rendered static background dots
      if (offscreenCanvasRef.current) {
        ctx.drawImage(offscreenCanvasRef.current, 0, 0, canvas.width / dpr, canvas.height / dpr);
      }

      // Draw only the hovered dots within mouse proximity on top of base dots
      if (mx !== -1000 || my !== -1000) {
        for (const dot of dotsRef.current) {
          const dx = dot.x - mx;
          const dy = dot.y - my;
          const distSq = dx * dx + dy * dy;

          if (distSq < proxSq) {
            const dist = Math.sqrt(distSq);
            const t = 1 - dist / proximity;
            const easedT = t * t * (3 - 2 * t); // smoothstep

            const r = Math.round(baseRgb.r + (glowRgb.r - baseRgb.r) * easedT);
            const g = Math.round(baseRgb.g + (glowRgb.g - baseRgb.g) * easedT);
            const b = Math.round(baseRgb.b + (glowRgb.b - baseRgb.b) * easedT);

            const opacity = Math.min(1, dot.baseOpacity + easedT * 0.7);
            const scale = 1 + easedT * 0.8;
            const glow = easedT * glowIntensity;
            const radius = (dotSize / 2) * scale;

            // Draw glow
            if (glow > 0) {
              const gradient = ctx.createRadialGradient(
                dot.x,
                dot.y,
                0,
                dot.x,
                dot.y,
                radius * 4,
              );
              gradient.addColorStop(
                0,
                `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.4})`,
              );
              gradient.addColorStop(
                0.5,
                `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.1})`,
              );
              gradient.addColorStop(
                1,
                `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0)`,
              );
              ctx.beginPath();
              ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.fill();
            }

            // Draw dot
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fill();
          }
        }
      }
    }
  }, [proximity, baseRgb, glowRgb, dotSize, glowIntensity, waveSpeed]);

  const requestFrame = useCallback(() => {
    if (!isDrawingRef.current) {
      isDrawingRef.current = true;
      animationRef.current = requestAnimationFrame(() => {
        draw();
        isDrawingRef.current = false;
      });
    }
  }, [draw]);

  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    // Setup offscreen canvas
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (offscreenCtx) offscreenCtx.scale(dpr, dpr);

    offscreenCanvasRef.current = offscreenCanvas;
    offscreenCtxRef.current = offscreenCtx;

    const cellSize = dotSize + gap;
    const cols = Math.ceil(rect.width / cellSize) + 1;
    const rows = Math.ceil(rect.height / cellSize) + 1;

    const offsetX = (rect.width - (cols - 1) * cellSize) / 2;
    const offsetY = (rect.height - (rows - 1) * cellSize) / 2;

    const dots: Dot[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: offsetX + col * cellSize,
          y: offsetY + row * cellSize,
          baseOpacity: 0.3 + Math.random() * 0.2,
        });
      }
    }
    dotsRef.current = dots;

    if (waveSpeed === 0) {
      drawOffscreen();
      requestFrame();
    }
  }, [dotSize, gap, waveSpeed, drawOffscreen, requestFrame]);

  useEffect(() => {
    buildGrid();

    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(buildGrid);
    ro.observe(container);

    return () => ro.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (waveSpeed > 0) {
            if (!animationRef.current) {
              animationRef.current = requestAnimationFrame(draw);
            }
          } else {
            requestFrame();
          }
        } else {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
        }
      },
      { threshold: 0 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [draw, requestFrame, waveSpeed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (waveSpeed === 0) {
        requestFrame();
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      if (waveSpeed === 0) {
        requestFrame();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      // Changed from "fixed inset-0" to "relative w-full h-full"
      className={cn(
        "relative overflow-hidden w-full h-full bg-neutral-950",
        className,
      )}
    >
      {/* Added pointer-events-none so canvas doesn't block interactions */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />

      {/* Vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(10,10,10,0.6) 100%)",
        }}
      />

      {/* Content layer */}
      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
}
