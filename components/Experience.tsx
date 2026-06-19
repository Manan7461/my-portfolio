"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { soundBtnHover, soundClick, soundSectionEnter, soundTimelinePing } from "@/lib/sound";

interface TimelineEntry {
  years: string;
  company: string;
  role: string;
  description: string;
  type: "education" | "work" | "internship";
  isCurrent?: boolean;
}

const timelineData: TimelineEntry[] = [
  {
    years: "2024 – Present",
    company: "Ganpat University",
    role: "Bachelor's in Computer Science",
    description: "Focused on web development and software engineering, building strong foundations in front-end technologies, databases, and application architecture.",
    type: "education",
    isCurrent: true,
  },
  {
    years: "Jul 2024 – Aug 2024",
    company: "Orionik Technologies",
    role: "Front-End Developer",
    description: "Built responsive and interactive websites using HTML, CSS, JavaScript, and React. Focused on clean UI, performance, and cross-device compatibility.",
    type: "work",
  },
  {
    years: "2021 – 2024",
    company: "Ganpat University",
    role: "Diploma in Computer science",
    description: "Completed diploma with hands-on training in programming, web technologies, and practical project-based learning..",
    type: "education",
  },
  {
    years: "Jun 2024 – Jul 2024",
    company: "Logic Cube EdHub",
    role: "Front-End Development Intern",
    description: "Designed responsive web pages and enhanced usability through optimized layouts and clean, maintainable code.",
    type: "internship",
  },
  {
    years: "Jun 2023 – Jul 2023",
    company: "Brainy Beam",
    role: "Python & Django Intern",
    description: "Built basic web applications using Django, handled backend logic, database integration, and REST API development.",
    type: "internship",
  }
];

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const ctx = gsap.context(() => {
      // 1. Draw the vertical line on scroll scrub
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "bottom 75%",
            scrub: true,
            onEnter: () => soundSectionEnter(),
          }
        }
      );

      // 2. Reveal each timeline entry as the line reaches it
      const entries = gsap.utils.toArray<HTMLElement>(".timeline-entry");
      entries.forEach((entry) => {
        const dot = entry.querySelector(".timeline-dot");
        const year = entry.querySelector(".timeline-year");
        const content = entry.querySelector(".timeline-content");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => soundTimelinePing(),
          }
        });

        if (dot) {
          tl.from(
            dot,
            { scale: 0, duration: 0.4, ease: "back.out(1.7)" }
          );
        }

        tl.fromTo(
          [year, content],
          { opacity: 0, x: -25 },
          { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" },
          "-=0.25"
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="w-full bg-background px-[6vw] py-20 md:py-32 flex flex-col items-start relative select-none"
    >
      {/* Label and Headings */}
      <div className="w-full mb-16 flex flex-col items-start gap-2">
        <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">
          03 · THE TRAJECTORY.
        </span>
        <h2
          className="font-serif font-bold text-primary select-text leading-tight"
          style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
        >
          The trajectory.
        </h2>
        <p className="font-sans text-[17px] text-muted mt-2">
          Every role shaped the engineer I am now.
        </p>
      </div>

      {/* Two-Column Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[30%_70%] gap-12 lg:gap-0 items-start">
        {/* Left Panel (Sticky) */}
        <div className="w-full lg:sticky lg:top-28 flex flex-col items-start z-10 pr-0 lg:pr-8">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-widest uppercase mb-2">
            Experience
          </span>
          <span className="font-serif text-[48px] font-bold text-primary leading-none mb-10 select-text">
            2026
          </span>
          <a
            href="/Manan_Prajapati_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundClick()}
            onMouseEnter={() => soundBtnHover()}
            className="border border-primary px-[22px] py-[10px] font-sans text-[13px] font-semibold text-primary rounded-[4px] hover:bg-primary hover:text-background transition-colors duration-300 select-none cursor-none"
          >
            Download CV →
          </a>
        </div>

        {/* Right Panel - Timeline */}
        <div className="w-full relative pl-0 md:pl-8">
          {/* Vertical scroll-drawn line */}
          <div
            ref={lineRef}
            className="absolute left-[20px] sm:left-[24px] md:left-[160px] top-0 bottom-0 w-[1px] bg-borderCustom transform origin-top"
            style={{ transform: "scaleY(0)" }}
          />

          {/* Timeline Entries */}
          <div className="flex flex-col w-full relative">
            {timelineData.map((entry, idx) => (
              <div
                key={idx}
                className="timeline-entry relative pl-[56px] sm:pl-[64px] md:pl-[200px] pb-12 last:pb-0 w-full"
              >
                {/* Custom Icon Container centered on the timeline line */}
                <div
                  className="timeline-dot absolute left-[20px] sm:left-[24px] md:left-[160px] top-[10px] -translate-x-1/2 w-8 h-8 rounded-full bg-background border border-borderCustom flex items-center justify-center z-20 transition-transform duration-300 hover:border-accent"
                >
                  {entry.type === "education" ? (
                    <svg
                      className="w-4 h-4 text-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                  ) : entry.type === "work" ? (
                    <svg
                      className="w-4 h-4 text-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                  )}
                </div>

                {/* Floating Year Badge to the left of the dot (Desktop only) */}
                <div className="timeline-year absolute left-0 top-[18px] w-[140px] text-right pr-4 font-mono text-[11px] text-muted select-text hidden md:block">
                  {entry.years}
                </div>

                {/* Content block */}
                <div className="timeline-content select-text">
                  {/* Years Tag (Mobile only) */}
                  <span className="block md:hidden font-mono text-[11px] text-muted tracking-wider mb-2">
                    {entry.years}
                  </span>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-sans text-[15px] font-semibold tracking-[0.08em] uppercase text-primary">
                      {entry.company}
                    </span>
                    {entry.isCurrent && (
                      <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono text-[9px] tracking-[0.06em] uppercase font-bold">
                        Current
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-[22px] italic text-primary mt-1 mb-3">
                    {entry.role}
                  </h4>
                  <p className="font-sans text-[14px] text-muted leading-[1.7] max-w-2xl select-text">
                    {entry.description}
                  </p>

                  {/* Thin divider line below item */}
                  <div className="w-full h-[1px] bg-borderCustom mt-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
