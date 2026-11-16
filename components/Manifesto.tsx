"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { soundCardHover } from "@/lib/sound";

/**
 * Words wrapped in *asterisks* render as the italic serif accent.
 */
const STATEMENT =
  "I turn ideas into *fast*, *beautiful* digital products — blending clean engineering, sharp interface design and *AI-driven* workflows so ambitious brands can launch sooner and grow further.";

const STATS = [
  { value: 2, suffix: "+", label: "Years building for the web" },
  { value: 20, suffix: "+", label: "Projects shipped end-to-end" },
  { value: 6, suffix: "", label: "Service verticals, one partner" },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // Flip the custom cursor to light colours while over this dark section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        toggleClass: { targets: document.documentElement, className: "cursor-invert" },
      });

      if (reduce) return;

      // Label + rule
      gsap.fromTo(
        ".mf-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "power3.inOut",
          duration: 1.4,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      // Word-by-word brightness scrub
      gsap.fromTo(
        ".mf-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".mf-statement",
            start: "top 80%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        }
      );

      // Stats rise + count up
      gsap.utils.toArray<HTMLElement>(".mf-stat").forEach((el, i) => {
        const num = el.querySelector<HTMLElement>(".mf-num");
        const target = Number(num?.dataset.value ?? 0);
        const counter = { v: 0 };
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            delay: i * 0.12,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ".mf-stats",
              start: "top 85%",
              onEnter: () => {
                gsap.to(counter, {
                  v: target,
                  duration: 1.8,
                  delay: i * 0.12,
                  ease: "power3.out",
                  onUpdate: () => {
                    if (num) num.textContent = String(Math.round(counter.v));
                  },
                });
              },
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = STATEMENT.split(" ");

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      data-theme="dark"
      className="dark-section grain relative overflow-hidden bg-primary text-background px-[4vw] py-28 md:py-40"
    >
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(var(--accent)) 0%, transparent 60%)" }}
      />

      <div className="relative flex items-center gap-4 mb-12 md:mb-16">
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-accent whitespace-nowrap">
          (00) — Approach
        </span>
        <span className="mf-rule h-px flex-1 bg-background/15 origin-left" />
      </div>

      <p className="mf-statement relative font-heading font-medium leading-[1.08] tracking-[-0.035em] text-[clamp(30px,5.2vw,84px)] max-w-[20ch] md:max-w-none select-text">
        {words.map((w, i) => {
          const accent = /^\*.*\*[.,—]?$/.test(w);
          const clean = w.replace(/\*/g, "");
          return (
            <span key={i} className="mf-word inline-block mr-[0.24em]">
              {accent ? (
                <em className="font-accent italic font-normal text-accent tracking-[-0.01em]">{clean}</em>
              ) : (
                clean
              )}
            </span>
          );
        })}
      </p>

      <div className="mf-stats relative mt-20 md:mt-28 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
        {STATS.map((s) => (
          <div
            key={s.label}
            onMouseEnter={() => soundCardHover()}
            className="mf-stat border-t border-background/15 pt-6"
          >
            <div className="font-heading font-semibold tracking-[-0.05em] leading-none text-[clamp(56px,7vw,112px)]">
              <span className="mf-num tabular-nums" data-value={s.value}>
                {s.value}
              </span>
              <span className="text-accent">{s.suffix}</span>
            </div>
            <p className="mt-3 font-mono text-[11px] tracking-[0.16em] uppercase text-background/55">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
