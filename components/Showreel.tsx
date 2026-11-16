"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const SCENES = [
  { a: "Crafted with", b: "care." },
  { a: "Engineered to", b: "scale." },
  { a: "Built to", b: "think." },
];

/** Original brand film (ember silk → signal waves → neural sphere) that expands to full-bleed on scroll. */
export default function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scene, setScene] = useState(0);

  // keep the caption in step with the film's three scenes
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (!v.duration) return;
      const ph = v.currentTime / v.duration;
      setScene(ph < 1 / 3 ? 0 : ph < 2 / 3 ? 1 : 2);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section) return;

    // Only play while visible
    const io = new IntersectionObserver(
      ([e]) => {
        if (!video) return;
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(section);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
        (c) => {
          const desktop = c.conditions?.desktop;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.8 },
          });
          tl.fromTo(
            ".reel-frame",
            { width: desktop ? "56vw" : "88vw", height: desktop ? "62vh" : "56vh", borderRadius: desktop ? 36 : 24 },
            { width: "100vw", height: "100svh", borderRadius: 0, duration: 1 },
            0
          )
            .fromTo(".reel-video", { scale: 1.25 }, { scale: 1, duration: 1 }, 0)
            .fromTo(".reel-word-l", { xPercent: 0 }, { xPercent: -60, opacity: 0, duration: 0.7 }, 0)
            .fromTo(".reel-word-r", { xPercent: 0 }, { xPercent: 60, opacity: 0, duration: 0.7 }, 0)
            .fromTo(".reel-caption", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.7);
        }
      );
    }, section);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="showreel" className="relative h-[200vh] md:h-[240vh] bg-background">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center justify-center">
        {/* words either side of the frame */}
        <span className="reel-word-l absolute left-[4vw] top-1/2 -translate-y-1/2 z-0 hidden md:block font-heading font-semibold tracking-[-0.05em] text-[clamp(40px,6vw,110px)] text-primary">
          Show
        </span>
        <span className="reel-word-r absolute right-[4vw] top-1/2 -translate-y-1/2 z-0 hidden md:block font-accent italic tracking-[-0.02em] text-[clamp(40px,6vw,110px)] text-primary">
          reel
        </span>

        <div
          className="reel-frame relative z-10 overflow-hidden bg-[#0B0B0C] shadow-[0_40px_120px_-30px_rgba(255,107,61,0.35)]"
          style={{ width: "56vw", height: "62vh", borderRadius: 36 }}
        >
          <video
            ref={videoRef}
            className="reel-video absolute inset-0 w-full h-full object-cover"
            src="/video/reel.webm"
            poster="/video/reel-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-[#0A0A0A]/75 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/65 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 flex items-center justify-between font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#F3F1EB]/85">
            <span className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Brand film
            </span>
            <span>Design · Engineering · AI</span>
          </div>

          <div className="reel-caption absolute bottom-6 left-5 right-5 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-3 text-[#F3F1EB]">
            <p className="relative flex-1 w-full font-heading font-semibold tracking-[-0.04em] leading-[0.95] text-[clamp(30px,4.6vw,76px)] min-h-[1.1em]">
              {SCENES.map((sc, k) => (
                <span
                  key={sc.b}
                  className="absolute left-0 bottom-0 block transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{ opacity: k === scene ? 1 : 0, transform: `translateY(${k === scene ? 0 : 18}px)` }}
                  aria-hidden={k !== scene}
                >
                  {sc.a}{" "}
                  <em className="font-accent italic font-normal text-accent">{sc.b}</em>
                </span>
              ))}
            </p>
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#F3F1EB]/70 tabular-nums">
              0{scene + 1} / 03
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
