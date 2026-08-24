"use client";

import { useEffect, useRef, useState } from "react";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 24;
const DEFAULT_OPTIONS = 5;

const PALETTE = [
  "#E05C5C",
  "#E8863C",
  "#E5C04B",
  "#57B65A",
  "#4A7FE0",
  "#8B5CF6",
];

type Option = { label: string; color: string };

function makeOption(index: number): Option {
  return {
    label: `Exercise ${index + 1}`,
    color: PALETTE[index % PALETTE.length],
  };
}

function initialOptions(): Option[] {
  return Array.from({ length: DEFAULT_OPTIONS }, (_, i) => makeOption(i));
}

/** Relative luminance, used to keep segment labels readable on any fill. */
function readableTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const value = parseInt(full, 16);
  if (Number.isNaN(value) || full.length !== 6) return "#ffffff";
  const channels = [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255,
  ].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const luminance =
    0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return luminance > 0.45 ? "#1a1a1a" : "#ffffff";
}

function polar(cx: number, cy: number, r: number, degrees: number) {
  const rad = (degrees * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
}

function segmentPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const [x0, y0] = polar(cx, cy, r, startDeg);
  const [x1, y1] = polar(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
}

function truncate(label: string, max: number) {
  const trimmed = label.trim();
  if (trimmed.length === 0) return "(blank)";
  return trimmed.length > max ? trimmed.slice(0, max - 1) + "…" : trimmed;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
};

const CONFETTI_COUNT = 90;
const CONFETTI_MS = 1900;

/**
 * Bursts confetti from the middle of the given canvas. Returns a cancel
 * function so a fresh spin can interrupt a burst that is still running.
 */
function runConfetti(canvas: HTMLCanvasElement, colors: string[]) {
  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!ctx || width === 0 || height === 0) return () => {};

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const palette = colors.length > 0 ? colors : PALETTE;
  const particles: Particle[] = Array.from(
    { length: CONFETTI_COUNT },
    (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      return {
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 4 + Math.random() * 5,
        color: palette[i % palette.length],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
      };
    },
  );

  const start = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const progress = Math.min((now - start) / CONFETTI_MS, 1);
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

    for (const p of particles) {
      p.vy += 0.16;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    if (progress < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  };

  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    ctx.clearRect(0, 0, width, height);
  };
}

const CX = 100;
const CY = 100;
const R = 94;

const inputClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 transition-colors placeholder:text-neutral-400 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:hover:border-neutral-700";

export default function SpinWheel() {
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [countText, setCountText] = useState(String(DEFAULT_OPTIONS));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const pendingWinner = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stopConfetti = useRef<(() => void) | null>(null);

  const count = options.length;
  const segment = 360 / count;

  useEffect(() => () => stopConfetti.current?.(), []);

  function celebrate() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    stopConfetti.current?.();
    stopConfetti.current = runConfetti(
      canvas,
      options.map((o) => o.color),
    );
  }

  function resize(next: number) {
    setOptions((prev) => {
      if (next === prev.length) return prev;
      if (next < prev.length) return prev.slice(0, next);
      const grown = [...prev];
      for (let i = prev.length; i < next; i++) grown.push(makeOption(i));
      return grown;
    });
    setWinner(null);
  }

  function onCountChange(raw: string) {
    setCountText(raw);
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isNaN(parsed) && parsed >= MIN_OPTIONS && parsed <= MAX_OPTIONS) {
      resize(parsed);
    }
  }

  function updateOption(index: number, patch: Partial<Option>) {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, ...patch } : opt)),
    );
  }

  function spin() {
    if (spinning) return;

    const picked = Math.floor(Math.random() * count);
    // Land the picked segment under the pointer at 12 o'clock, with a little
    // jitter so it does not stop dead center every time.
    const jitter = (Math.random() - 0.5) * segment * 0.7;
    const targetMod =
      (((-(picked * segment + segment / 2 + jitter)) % 360) + 360) % 360;
    const base = rotation + 360 * 5;
    const baseMod = ((base % 360) + 360) % 360;
    const final = base + ((targetMod - baseMod + 360) % 360);

    setWinner(null);
    stopConfetti.current?.();

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setRotation(final);
      setWinner(picked);
      return;
    }

    pendingWinner.current = picked;
    setSpinning(true);
    setRotation(final);
  }

  function onSpinEnd() {
    if (!spinning) return;
    setSpinning(false);
    const picked = pendingWinner.current;
    setWinner(picked);
    pendingWinner.current = null;
    if (picked !== null) celebrate();
  }

  const labelSize = count <= 8 ? 7 : count <= 14 ? 5.5 : 4.5;
  const labelMax = count <= 8 ? 16 : count <= 14 ? 12 : 9;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
      <div>
        <label
          htmlFor="wheel-count"
          className="block text-sm font-medium text-neutral-800 dark:text-neutral-200"
        >
          Number of options ({MIN_OPTIONS}-{MAX_OPTIONS})
        </label>
        <input
          id="wheel-count"
          type="number"
          min={MIN_OPTIONS}
          max={MAX_OPTIONS}
          value={countText}
          onChange={(e) => onCountChange(e.target.value)}
          onBlur={() => setCountText(String(count))}
          className={`mt-2 max-w-[10rem] ${inputClass}`}
        />

        <ul className="mt-6 flex flex-col gap-2">
          {options.map((option, i) => (
            <li key={i} className="flex items-center gap-3">
              <input
                type="color"
                value={option.color}
                onChange={(e) => updateOption(i, { color: e.target.value })}
                aria-label={`Color for option ${i + 1}`}
                className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900"
              />
              <input
                type="text"
                value={option.label}
                onChange={(e) => updateOption(i, { label: e.target.value })}
                aria-label={`Label for option ${i + 1}`}
                className={inputClass}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-sm">
          <div
            className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 -translate-y-1 text-penn-blue-600 dark:text-white"
            style={{
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "18px solid currentColor",
            }}
            aria-hidden
          />
          <div
            onTransitionEnd={onSpinEnd}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
            }}
          >
            <svg
              viewBox="0 0 200 200"
              className="block h-auto w-full drop-shadow-sm"
              role="img"
              aria-label={`Wheel with ${count} options`}
            >
              {options.map((option, i) => {
                const start = i * segment - 90;
                const end = (i + 1) * segment - 90;
                const mid = start + segment / 2;
                const normalized = ((mid % 360) + 360) % 360;
                const flip = normalized > 90 && normalized < 270;
                return (
                  <g key={i}>
                    <path
                      d={segmentPath(CX, CY, R, start, end)}
                      fill={option.color}
                      stroke="#ffffff"
                      strokeWidth={0.75}
                    />
                    <text
                      transform={`rotate(${mid} ${CX} ${CY}) translate(${CX + R * 0.62} ${CY}) rotate(${flip ? 180 : 0})`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={labelSize}
                      fontWeight={600}
                      fill={readableTextColor(option.color)}
                    >
                      {truncate(option.label, labelMax)}
                    </text>
                  </g>
                );
              })}
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute -top-12 left-0 z-20 h-[calc(100%+6rem)] w-full"
            aria-hidden
          />
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="mt-8 inline-flex items-center rounded-md bg-penn-blue-600 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-penn-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-penn-blue-700 dark:hover:bg-neutral-200"
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>

        <p
          aria-live="polite"
          className="mt-5 min-h-[1.75rem] text-center text-base text-neutral-700 dark:text-neutral-300"
        >
          {winner !== null && (
            <>
              Result:{" "}
              <span className="font-semibold text-penn-blue-600 dark:text-white">
                {truncate(options[winner]?.label ?? "", 60)}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
