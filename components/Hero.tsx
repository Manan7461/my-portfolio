"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { soundNavHover, soundCardHover } from "@/lib/sound";
import { useLoader } from "@/components/LoaderContext";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { startAnimation } = useLoader();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      // Words clip in from bottom
      tl.fromTo(
        ".hero-word",
        {
          yPercent: 110,
          clipPath: "inset(0 0 100% 0)",
        },
        {
          yPercent: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 1.0,
          stagger: 0.06,
          ease: "power4.out",
        }
      );

      // Subtitle lines fade up
      tl.fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        },
        0.3
      );

      // Bottom row
      tl.fromTo(
        ".hero-bottom",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power1.out" },
        0.7
      );

      tlRef.current = tl;
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (startAnimation) {
      tlRef.current?.play();
    }
  }, [startAnimation]);
  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col 
        justify-between px-[6vw] pt-28 pb-8 overflow-hidden select-none bg-background"
    >
      {/* Graph paper grid background (5% opacity, #e8e6e0) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e8e6e0 1px, transparent 1px),
            linear-gradient(to bottom, #e8e6e0 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
          opacity: 0.05,
        }}
      />

      {/* ── CENTER: Giant name ── */}
      <div className="flex-1 flex flex-col justify-center">

        {/* Role label above name */}
        <div className="hero-sub opacity-0 mb-6 flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.22em] 
            text-accent uppercase">
            01 · AI-Assisted Engineer
          </span>
          <span className="h-[1px] w-12 bg-accent inline-block" />
        </div>

        {/* Giant name — each word wrapped for clip animation */}
        <h1 className="font-heading font-black leading-[0.9] text-primary overflow-hidden">
          {/* Line 1 */}
          <div className="overflow-hidden">
            <span className="hero-word inline-block select-text" style={{ fontSize: "clamp(64px, 11vw, 160px)" }}>
              Prajapati Manan.
            </span>
          </div>
          {/* Line 2 — lighter weight builds things that matter */}
          <div className="overflow-hidden mt-3 sm:mt-4">
            <span
              className="hero-word inline-block text-primary/70 select-text"
              style={{ fontWeight: 300, fontSize: "clamp(32px, 5.5vw, 80px)" }}
            >
              builds things that matter.
            </span>
          </div>
        </h1>

        {/* Tagline row */}
        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
          <p className="hero-sub opacity-0 font-sans text-[26px] md:text-[34px] font-bold text-primary leading-[1.2] max-w-lg select-text">
            Start a conversation about new business or media inquiries.
          </p>
          {/* Decorative line + year */}
          <div className="hero-sub opacity-0 flex items-center gap-3 self-start md:self-auto pb-2">
            <span className="h-[1px] w-10 bg-[#E0DDD6] inline-block" />
            <span className="font-mono text-[11px] tracking-[0.14em] 
              text-muted uppercase select-text">
              Gujarat, India · 2026
            </span>
          </div>
        </div>

      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="hero-bottom opacity-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">

        {/* Scroll indicator & Stats grouped on the left/center */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {/* Scroll indicator */}
          <div className="flex items-center gap-2 cursor-none" onMouseEnter={() => soundNavHover()}>
            <span className="font-mono text-[11px] tracking-[0.18em] 
              text-muted uppercase">
              Scroll to explore
            </span>
            {/* Bouncing arrow */}
            <span
              className="font-mono text-muted text-[13px]"
              style={{ animation: "bounce 1.6s ease-in-out infinite" }}
            >
              ↓
            </span>
          </div>

          {/* Divider line visible on desktop */}
          <span className="hidden md:inline-block w-[1px] h-3 bg-borderCustom/50" />

          {/* Stats row */}
          <div className="flex items-center gap-6">
            {["20+ Projects", "6 Services", "Open to Work"].map((s) => (
              <span
                key={s}
                onMouseEnter={() => soundCardHover()}
                className="font-mono text-[10px] tracking-[0.14em] 
                  text-muted uppercase select-text cursor-none"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        {/* Empty space on the right to accommodate the floating timer overlay */}
        <div className="hidden lg:block w-36" />

      </div>
    </section>
  );
}
