"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { soundBtnHover, soundClick } from "@/lib/sound";

export default function WebEngineeringPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal-text",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background text-primary px-[6vw] pt-32 pb-24 flex flex-col justify-between select-none"
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

      <div className="z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center">
        {/* Back Link */}
        <div className="reveal-text opacity-0 mb-12">
          <Link
            href="/"
            scroll={false}
            onClick={() => soundClick()}
            onMouseEnter={() => soundBtnHover()}
            className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase hover:text-primary transition-colors cursor-none"
          >
            ← Back to Overview
          </Link>
        </div>

        {/* Title */}
        <div className="reveal-text opacity-0 overflow-hidden mb-6">
          <h1
            className="font-heading font-black tracking-tighter uppercase leading-[0.9] text-primary"
            style={{ fontSize: "clamp(48px, 8vw, 110px)" }}
          >
            Web Engineering
          </h1>
        </div>

        {/* Overview Row */}
        <div className="reveal-text opacity-0 grid grid-cols-1 md:grid-cols-[40%_60%] gap-8 md:gap-12 border-t border-borderCustom/60 pt-8 mt-4 select-text">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">
            Capabilities & Stack
          </span>
          <div className="flex flex-col gap-6">
            <p className="font-sans text-[18px] sm:text-[20px] font-medium leading-relaxed text-primary">
              Full-stack website development using modern frameworks. Clean code, fast load times, and search engine optimization from day one.
            </p>
            <p className="font-sans text-[15px] text-muted leading-relaxed">
              I build production-grade web systems focused on speed, modularity, and pixel-perfect design translation. From clean APIs to lightweight static pages, my codebase is optimized for longevity and ease of scale.
            </p>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="reveal-text opacity-0 grid grid-cols-1 md:grid-cols-[40%_60%] gap-8 md:gap-12 border-t border-borderCustom/60 pt-8 mt-12 select-text">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">
            Core Features
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans text-[14px] leading-relaxed text-primary">
            {[
              "Single Page Apps (SPAs)",
              "Server-Side Rendering (SSR)",
              "SEO Optimization & Metadata",
              "Database Integration & Schemas",
              "Performance Tuning & Auditing",
              "Responsive Layout Engineering",
            ].map((cap, idx) => (
              <div key={idx} className="flex items-center gap-3 border border-borderCustom rounded-lg p-4 bg-[#F3F1EB]/60 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-medium">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Monospace Tags */}
        <div className="reveal-text opacity-0 grid grid-cols-1 md:grid-cols-[40%_60%] gap-8 md:gap-12 border-t border-borderCustom/60 pt-8 mt-12 select-text">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">
            Technologies Used
          </span>
          <div className="flex flex-wrap gap-2.5">
            {["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL", "PostgreSQL", "Prisma"].map((tech) => (
              <span
                key={tech}
                className="font-mono text-[10px] tracking-widest text-muted border border-borderCustom rounded-full px-3 py-1 bg-[#F3F1EB]/30 font-bold uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer copyright copy */}
      <div className="reveal-text opacity-0 z-10 w-full max-w-4xl mx-auto border-t border-borderCustom/45 pt-8 mt-16 flex flex-col sm:flex-row justify-between gap-4 font-mono text-[11px] text-muted tracking-wider select-text">
        <span>&copy; {new Date().getFullYear()} Prajapati Manan.</span>
        <span>Designed &amp; built by Prajapati Manan</span>
      </div>
    </div>
  );
}
