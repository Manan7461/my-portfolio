"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { soundCardHover, soundClick, soundSectionEnter } from "@/lib/sound";
import { services } from "@/lib/services";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number>(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: containerRef.current, start: "top 70%", once: true, onEnter: () => soundSectionEnter() });
      if (reduce) return;
      gsap.utils.toArray<HTMLElement>(".svc-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            delay: i * 0.04,
            ease: "expo.out",
            scrollTrigger: { trigger: row, start: "top 92%", once: true },
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const toggle = (i: number) => {
    soundClick();
    setOpen((o) => (o === i ? -1 : i));
  };

  return (
    <section ref={containerRef} id="services" className="w-full bg-background px-5 md:px-[4vw] py-24 md:py-36 relative">
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-[6vw]">
        {/* ── Intro (sticky on desktop) ── */}
        <div className="lg:sticky lg:top-28 self-start flex flex-col items-start gap-2">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">04 · What I build</span>
          <h2
            className="font-heading font-bold text-primary select-text leading-[0.95]"
            style={{ fontSize: "clamp(44px, 6.4vw, 104px)" }}
          >
            What I build.
          </h2>
          <p className="mt-5 max-w-[40ch] font-sans text-[16px] md:text-[18px] leading-[1.6] text-muted select-text">
            Six disciplines, one goal:{" "}
            <em className="font-accent italic text-primary text-[1.15em]">products that perform.</em> Pick a discipline
            to see what it covers, or open it for the full process.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <a
              href="#contact"
              onClick={() => soundClick()}
              className="group inline-flex items-center gap-3 rounded-full bg-primary text-background pl-5 pr-1.5 py-1.5 font-heading font-medium text-[14px] hover:bg-accent hover:text-onaccent transition-colors duration-300"
            >
              Start a project
              <span className="grid place-items-center w-9 h-9 rounded-full bg-background text-primary transition-transform duration-300 group-hover:rotate-45">
                ↗
              </span>
            </a>
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary/50">
              ({pad(services.length)}) Disciplines
            </span>
          </div>
        </div>

        {/* ── Accordion ── */}
        <div className="border-t border-primary/15">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.slug} className="svc-row border-b border-primary/15">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  onMouseEnter={() => soundCardHover()}
                  aria-expanded={isOpen}
                  aria-controls={`svc-panel-${i}`}
                  className="group w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 md:gap-6 py-6 md:py-8 text-left"
                >
                  <span
                    className={`font-heading text-[22px] md:text-[26px] leading-none transition-colors duration-300 ${
                      isOpen ? "text-accent" : "text-primary/30 group-hover:text-accent"
                    }`}
                    aria-hidden
                  >
                    ↳
                  </span>
                  <span className="min-w-0 flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-6">
                    <span
                      className="font-heading font-semibold text-primary leading-[1.02] tracking-[-0.04em] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:group-hover:translate-x-2"
                      style={{ fontSize: "clamp(26px, 3.2vw, 50px)" }}
                    >
                      {s.name}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-primary/45">
                      ({s.num}) {s.title}
                    </span>
                  </span>
                  <span
                    className={`relative grid place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full border transition-colors duration-300 ${
                      isOpen ? "bg-primary border-primary text-background" : "border-primary/20 text-primary group-hover:border-primary"
                    }`}
                    aria-hidden
                  >
                    <span className={`absolute w-3.5 h-[1.5px] bg-current transition-transform duration-500`} />
                    <span
                      className={`absolute w-3.5 h-[1.5px] bg-current transition-transform duration-500 ${isOpen ? "rotate-0" : "rotate-90"}`}
                    />
                  </span>
                </button>

                {/* Smooth height via grid rows */}
                <div
                  id={`svc-panel-${i}`}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`pl-[38px] md:pl-[50px] pb-8 md:pb-10 grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 md:gap-10 transition-[opacity,transform] duration-700 ${
                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                      }`}
                    >
                      <div>
                        <p className="font-accent italic text-[22px] md:text-[26px] leading-tight text-primary/75">{s.tagline}</p>
                        <p className="mt-3 font-sans text-[15px] md:text-[16px] leading-[1.65] text-muted max-w-[50ch] select-text">
                          {s.summary}
                        </p>
                        <Link
                          href={`/${s.slug}`}
                          scroll={false}
                          onClick={() => soundClick()}
                          tabIndex={isOpen ? 0 : -1}
                          className="group mt-6 inline-flex items-center gap-2 font-heading font-medium text-[15px] text-primary"
                        >
                          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1.5px] bg-left-bottom bg-no-repeat group-hover:bg-[length:0%_1.5px] transition-[background-size] duration-500 pb-0.5">
                            Explore the full process
                          </span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </Link>
                      </div>
                      <ul className="flex flex-col">
                        {s.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-3 py-2.5 border-t border-primary/10 first:border-t-0 md:first:border-t">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            <span className="font-sans text-[14px] md:text-[15px] font-medium text-primary">{h}</span>
                          </li>
                        ))}
                        {s.capabilities.slice(0, 3).map((c) => (
                          <li key={c.title} className="flex items-center gap-3 py-2.5 border-t border-primary/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/25 shrink-0" />
                            <span className="font-sans text-[14px] md:text-[15px] text-primary/70">{c.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
