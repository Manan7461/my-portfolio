"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { soundBtnHover, soundClick, soundSectionEnter } from "@/lib/sound";
import { projects } from "@/lib/projects";

export default function Work() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const scrollContainer = scrollRef.current;
    if (!trigger || !scrollContainer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        scrollContainer,
        { x: 0 },
        {
          x: () => -(scrollContainer.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: trigger,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${scrollContainer.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
            onEnter: () => soundSectionEnter(),
          },
        }
      );
    }, trigger);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} id="work" className="w-full bg-background relative overflow-hidden">
      {/* Pinned horizontal section */}
      <div className="h-screen w-full flex flex-col justify-between py-20 lg:py-24 relative">
        {/* Title / Header Block */}
        <div className="w-full px-[6vw] flex flex-col items-start gap-2">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">
            05 · THE PROOF.
          </span>
          <h2
            className="font-serif font-bold text-primary select-text leading-tight"
            style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
          >
            The proof.
          </h2>
        </div>

        {/* Horizontal Card Track (Holds all 7 projects) */}
        <div 
          ref={scrollRef} 
          className="flex gap-8 px-[6vw] items-center h-[55vh] flex-nowrap"
          style={{ width: "fit-content" }}
        >
          {projects.map((proj) => (
            <Link
              key={proj.id}
              href={proj.link}
              scroll={false}
              onClick={() => soundClick()}
              onMouseEnter={() => soundBtnHover()}
              className="w-[80vw] md:w-[60vw] lg:w-[45vw] max-w-[500px] h-[48vh] min-h-[350px] shrink-0 border border-borderCustom bg-[#F3F1EB]/60 backdrop-blur-sm rounded-custom p-8 flex flex-col justify-between hover:scale-[1.02] hover:border-accent/30 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-none group relative overflow-hidden"
            >
              {/* Top part: project number and name */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-accent font-bold tracking-widest uppercase">
                  {proj.id}
                </span>
                <h3 className="font-heading font-extrabold text-[24px] sm:text-[30px] lg:text-[34px] text-primary group-hover:text-accent transition-colors duration-300 select-text leading-tight mt-1">
                  {proj.title}
                </h3>
              </div>

              {/* Middle part: description */}
              <p className="font-sans text-[14px] sm:text-[15px] text-muted leading-relaxed select-text mt-4 flex-1">
                {proj.shortDesc}
              </p>

              {/* Bottom part: tech tags and link */}
              <div className="flex items-center justify-between gap-4 border-t border-borderCustom/45 pt-6 mt-6">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {proj.stack.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] tracking-widest text-muted uppercase font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[20px] text-primary group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll indicator help text */}
        <div className="w-full px-[6vw] flex items-center justify-between font-mono text-[10px] text-muted tracking-widest uppercase mt-4">
          <span>Scroll to scroll horizontally</span>
          <span className="animate-pulse">→</span>
        </div>
      </div>
    </div>
  );
}
