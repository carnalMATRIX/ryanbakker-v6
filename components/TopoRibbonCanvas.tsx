"use client";

import React, { useEffect, useRef } from "react";

/**
 * TopoRibbonCanvas (Simplified & Sharpened)
 *
 * Performance-optimised topographic background featuring:
 * 1. Densely packed, narrow summit to eliminate the "blank circle" effect.
 * 2. Sprawling elongated ridge for an interesting organic shape.
 * 3. Rhythmic breathing and architectural Major/Minor weighting.
 */

const SAMPLES = 500;
const LINE_COUNT = 75;
const STIFFNESS = 0.08;
const DAMPING = 0.8;
const MOUSE_RADIUS = 150;
const BREATH_AMP = 8;
const BREATH_SPEED = 0.0006;

const P = new Uint8Array(512);
const PERM = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
  36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
  75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
  149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
  27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
  92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
  209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
  164, 100, 109, 198, 173, 44, 239, 197, 110, 191, 180, 152, 210, 58, 251, 223,
  183, 121, 222, 47, 81, 67, 72, 172, 9, 122, 103, 102, 221, 12, 111, 125, 82,
  51, 44, 101, 179, 121, 118, 212, 167, 91, 126, 186, 204, 194, 163, 101, 149,
  165, 153, 199, 70, 67, 192, 48, 124, 95, 201, 93, 181, 21, 161, 14, 239, 141,
  92, 210, 133, 159, 186, 208, 233, 252, 232, 21, 177, 56, 191, 164, 73, 107,
  172, 66, 143, 80, 142, 53, 31, 52, 190, 94, 20, 114, 92, 201, 157, 47, 148,
  88, 102, 226, 187, 34, 93, 223, 156, 203, 240, 33, 42, 107, 184, 121, 6, 176,
  5, 108, 7, 12, 39, 114, 126, 252, 82, 30, 209, 67, 196, 141, 49, 178, 158, 16,
  205, 31,
];
for (let i = 0; i < 256; i++) P[i] = P[i + 256] = PERM[i];

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t: number, a: number, b: number) => a + t * (b - a);
const grad = (h: number, x: number, y: number) => {
  const _h = h & 15,
    u = _h < 8 ? x : y,
    v = _h < 4 ? y : _h === 12 || _h === 14 ? x : 0;
  return ((_h & 1) === 0 ? u : -u) + ((_h & 2) === 0 ? v : -v);
};
const noise = (x: number, y: number) => {
  const X = Math.floor(x) & 255,
    Y = Math.floor(y) & 255,
    xf = x - Math.floor(x),
    yf = y - Math.floor(y),
    u = fade(xf),
    v = fade(yf);
  const a = P[X] + Y,
    aa = P[a],
    ab = P[a + 1],
    b = P[X + 1] + Y,
    ba = P[b],
    bb = P[b + 1];
  return lerp(
    v,
    lerp(u, grad(P[aa], xf, yf), grad(P[ba], xf - 1, yf)),
    lerp(u, grad(P[ab], xf, yf - 1), grad(P[bb], xf - 1, yf - 1)),
  );
};
const fbm = (x: number, y: number) => {
  let r = 0,
    a = 0.5,
    f = 1;
  for (let i = 0; i < 4; i++) {
    r += noise(x * f, y * f) * a;
    a *= 0.52;
    f *= 2.1;
  }
  return r;
};

export const TopoRibbonCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const time = useRef(0);
  const paths = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const init = () => {
      const w = window.innerWidth,
        h = window.innerHeight,
        dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const peak = { x: w * 0.72, y: h * 0.5 };
      // Levels distributed to reach 98% of the summit value (100)
      const levels = Array.from(
        { length: LINE_COUNT },
        (_, i) => 2 + Math.pow(i / LINE_COUNT, 1.1) * 96,
      );

      const getField = (x: number, y: number) => {
        const d = Math.sqrt((x - peak.x) ** 2 + (y - peak.y) ** 2);
        const s = Math.min(1, d / 120); // Faster noise re-introduction for tighter summit
        const wx = x + fbm(x * 0.0004, y * 0.0004) * 320 * s,
          wy = y + fbm(y * 0.0004, x * 0.0004) * 320 * s;
        // Aggressive elliptical elongation for interesting shape
        const dist =
          Math.sqrt(((wx - peak.x) * 0.65) ** 2 + ((wy - peak.y) * 1.5) ** 2) +
          fbm(x * 0.0012, y * 0.0012) * 150 * s;
        return 5000 / (dist + 50); // Normalized 0-100 potential
      };

      paths.current = levels.map((lvl, lIdx) => {
        const points = [];
        for (let i = 0; i < SAMPLES; i++) {
          const ang = (i / SAMPLES) * Math.PI * 2;
          let rMin = 0,
            rMax = Math.max(w, h) * 2.5,
            r = 0;
          for (let j = 0; j < 14; j++) {
            r = (rMin + rMax) / 2;
            if (
              getField(peak.x + r * Math.cos(ang), peak.y + r * Math.sin(ang)) >
              lvl
            )
              rMin = r;
            else rMax = r;
          }
          const px = peak.x + r * Math.cos(ang),
            py = peak.y + r * Math.sin(ang);
          const eps = 1,
            dx = (getField(px + eps, py) - getField(px - eps, py)) / 2,
            dy = (getField(px, py + eps) - getField(px, py - eps)) / 2,
            mag = Math.sqrt(dx * dx + dy * dy) || 1;
          points.push({
            ox: px,
            oy: py,
            x: px,
            y: py,
            vx: 0,
            vy: 0,
            gx: dx / mag,
            gy: dy / mag,
          });
        }
        return { points, isMajor: lIdx % 5 === 0, phase: lIdx * 0.35 };
      });
    };
    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("resize", init);
    init();

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      time.current++;
      paths.current.forEach((p) => {
        ctx.strokeStyle = `rgba(180, 146, 244, ${p.isMajor ? 0.65 : 0.3})`;
        ctx.lineWidth = p.isMajor ? 1.4 : 0.7;
        ctx.beginPath();
        p.points.forEach((pt: any, i: number) => {
          const b =
            Math.sin(time.current * BREATH_SPEED + p.phase) * BREATH_AMP;
          const tx = pt.ox + pt.gx * b,
            ty = pt.oy + pt.gy * b;
          const dx = pt.x - mouse.current.x,
            dy = pt.y - mouse.current.y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_RADIUS) {
            const f = ((MOUSE_RADIUS - d) / MOUSE_RADIUS) * 0.4;
            pt.vx += (dx / d) * f;
            pt.vy += (dy / d) * f;
          }
          pt.vx += (tx - pt.x) * STIFFNESS;
          pt.vy += (ty - pt.y) * STIFFNESS;
          pt.vx *= DAMPING;
          pt.vy *= DAMPING;
          pt.x += pt.vx;
          pt.y += pt.vy;
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.stroke();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", init);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none bg-black"
    />
  );
};
