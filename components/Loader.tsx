"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { soundLoaderTick } from "@/lib/sound";
import { useLenis } from "@/components/LenisProvider";

interface LoaderProps {
  onHeroTrigger?: () => void;
  onLoaderComplete?: () => void;
}

const STATUS = ["Warming up the engine", "Compiling interfaces", "Wiring the AI", "Polishing pixels", "Ready"];

/**
 * Curtain loader: a black panel is wiped from left to right as loading progresses,
 * with a gold edge and a big counter riding that edge. The real hero is revealed beneath it.
 */
export default function Loader({ onHeroTrigger, onLoaderComplete }: LoaderProps) {
  const lenis = useLenis();
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Let the page render underneath — the curtain covers it.
    document.documentElement.classList.remove("loader-active");
    lenis?.stop();
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    let triggered = false;
    const finish = () => {
      document.body.style.overflow = "";
      document.documentElement.classList.add("loader-seen");
      lenis?.start();
      onLoaderComplete?.();
    };
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      onHeroTrigger?.();
    };

    const state = { p: 0 };
    const render = () => {
      root.style.setProperty("--p", String(state.p));
      if (countRef.current) countRef.current.textContent = String(Math.round(state.p)).padStart(3, "0");
      const s = Math.min(STATUS.length - 1, Math.floor((state.p / 100) * (STATUS.length - 1) + 0.0001));
      setStatus((prev) => (prev === s ? prev : s));
      if (state.p >= 55) trigger();
    };

    if (reduce) {
      state.p = 100;
      render();
      const t = setTimeout(() => {
        trigger();
        gsap.to(root, { opacity: 0, duration: 0.4, onComplete: finish });
      }, 300);
      return () => clearTimeout(t);
    }

    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(".ld-edge", { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "expo.inOut" }, 0)
      .fromTo(".ld-count", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: "expo.out" }, 0.25)
      .fromTo(".ld-meta", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.2);

    // Loading "progress" with natural stalls, then the curtain clears off the right edge.
    const steps: [number, number, string][] = [
      [14, 0.35, "power2.out"],
      [31, 0.45, "power3.inOut"],
      [52, 0.5, "power2.inOut"],
      [68, 0.35, "power2.out"],
      [86, 0.5, "power3.inOut"],
      [100, 0.55, "expo.inOut"],
    ];
    let at = 0.75;
    steps.forEach(([to, dur, ease], i) => {
      tl.to(state, { p: to, duration: dur, ease, onUpdate: render }, at);
      tl.call(() => soundLoaderTick(380 + i * 45), [], at + dur);
      at += dur + (i === 1 || i === 3 ? 0.18 : 0.06);
    });
    tl.to(".ld-edge", { opacity: 0, duration: 0.3 }, at - 0.2);

    return () => {
      tl.kill();
      document.body.style.overflow = "";
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis]);

  return (
    <div
      ref={rootRef}
      className="loader-root fixed inset-0 z-[200] pointer-events-none select-none"
      style={{ ["--p" as string]: 0 } as React.CSSProperties}
      aria-hidden
    >
      {/* Curtain (clipped from the left as --p grows) */}
      <div
        className="absolute inset-0 bg-primary pointer-events-auto"
        style={{ clipPath: "inset(0 0 0 calc(var(--p) * 1%))" }}
      >
        <div className="ld-grid absolute inset-0 opacity-60" />

        {/* Fixed corner labels (wiped by the curtain edge) */}
        <div className="ld-meta absolute top-6 left-5 md:left-[4vw] font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-background/55">
          Prajapati Manan
        </div>
        <div className="ld-meta absolute top-6 right-5 md:right-[4vw] font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-background/55">
          Portfolio ©2026
        </div>
        <div className="ld-meta absolute bottom-6 right-5 md:right-[4vw] flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-background/70">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          {STATUS[status]}
        </div>

        {/* Counter riding the edge */}
        <div
          className="absolute bottom-[8vh] md:bottom-[10vh] pl-[3vw] overflow-hidden"
          style={{ left: "calc(var(--p) * 1%)" }}
        >
          <div className="ld-count flex items-start text-background font-heading font-semibold leading-[0.8] tracking-[-0.06em]">
            <span ref={countRef} className="tabular-nums text-[clamp(84px,17vw,260px)]">
              000
            </span>
            <span className="mt-[0.4em] ml-2 font-mono text-[12px] md:text-[14px] tracking-[0.16em] text-accent">%</span>
          </div>
        </div>
      </div>

      {/* Gold edge line */}
      <div
        className="ld-edge absolute top-0 bottom-0 w-[2px] -ml-px bg-accent origin-top shadow-[0_0_24px_4px_rgba(255,107,61,0.55)]"
        style={{ left: "calc(var(--p) * 1%)" }}
      />
    </div>
  );
}
