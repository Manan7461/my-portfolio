"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { soundBtnHover, soundClick, soundSectionEnter } from "@/lib/sound";
import { projects, type Project } from "@/lib/projects";

const pad = (n: number) => String(n).padStart(2, "0");
const NAV_OFFSET = 84;

/** Media inside a card: a looping recording when available, otherwise a drifting still
 *  that flips through the project's screenshots while hovered. */
function CardMedia({ p, hovered }: { p: Project; hovered: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [frame, setFrame] = useState(0);

  // play recordings only while on screen
  useEffect(() => {
    const v = videoRef.current;
    const box = boxRef.current;
    if (!v || !box) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      threshold: 0.2,
    });
    io.observe(box);
    return () => io.disconnect();
  }, []);

  // hover reel for stills
  useEffect(() => {
    if (p.video || !hovered || p.images.length < 2) {
      setFrame(0);
      return;
    }
    setFrame(1);
    const id = setInterval(() => setFrame((f) => (f + 1) % p.images.length), 1100);
    return () => clearInterval(id);
  }, [hovered, p]);

  return (
    <div ref={boxRef} className="absolute inset-0">
      {p.video ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-top"
          src={p.video}
          poster={p.images[0]}
          muted
          loop
          playsInline
          preload="none"
        />
      ) : (
        p.images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === frame ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={i === 0 ? p.title : ""}
              fill
              quality={90}
              sizes="(min-width: 1024px) 75vw, 94vw"
              className="work-drift object-cover object-top"
            />
          </div>
        ))
      )}
    </div>
  );
}

/** Phones & tablets: a tall story-style card, media edge to edge, copy on a dark fade. */
function StoryCard({ p, i, total }: { p: Project; i: number; total: number }) {
  const [name, tagline] = p.title.includes(" – ") ? p.title.split(" – ") : [p.title, ""];
  const grad = `linear-gradient(100deg, ${p.accent}, ${p.accent2})`;
  return (
    <div className="relative shrink-0 snap-center w-[84vw] max-w-[440px]">
      <Link
        href={p.link}
        scroll={false}
        onClick={() => soundClick()}
        className="project-card relative block aspect-[3/4.2] rounded-[26px] overflow-hidden bg-[#111113] border border-white/[0.06]"
        style={{ boxShadow: `0 30px 60px -32px ${p.accent}99` }}
      >
        {/* media fills the top two-thirds, then fades into a clean base for the copy */}
        <div className="absolute inset-x-0 top-0 h-[66%] overflow-hidden" style={{ background: p.color }}>
          <CardMedia p={p} hovered={false} />
        </div>
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0B0C]/70 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-[38%] h-[29%] bg-gradient-to-b from-transparent to-[#111113] pointer-events-none" />
        <div
          className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none opacity-60"
          style={{ background: `radial-gradient(80% 60% at 20% 100%, ${p.accent}26, transparent 70%)` }}
        />

        {/* story progress */}
        <div className="absolute top-3 inset-x-3 flex gap-1" aria-hidden>
          {Array.from({ length: total }).map((_, k) => (
            <span key={k} className="h-[3px] flex-1 rounded-full" style={{ background: k <= i ? "#F1EFEA" : "rgba(241,239,234,0.22)" }} />
          ))}
        </div>
        <span className="absolute top-7 left-3.5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-[#F1EFEA]/85">
          {p.video && <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />}
          {p.id} / {pad(total)}
        </span>

        {/* copy */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: p.accent }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.accent, boxShadow: `0 0 10px ${p.accent}` }} />
            {p.category}
          </span>
          <h3 className="mt-2 font-heading font-semibold text-[#F1EFEA] tracking-[-0.035em] leading-[1.02] text-[30px]">{name}</h3>
          {tagline && (
            <p className="mt-1 font-accent italic text-[18px] leading-tight bg-clip-text text-transparent" style={{ backgroundImage: grad }}>
              {tagline}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#F1EFEA]/55 truncate">
              {p.year} · {p.stack.slice(0, 2).join(" · ")}
            </span>
            <span className="shrink-0 grid place-items-center w-11 h-11 rounded-full text-[#0B0B0C] text-[17px]" style={{ background: grad }}>
              ↗
            </span>
          </div>
        </div>
      </Link>
      {p.live && (
        <a
          href={p.live}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundClick()}
          className="absolute top-6 right-3 z-10 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase font-semibold text-[#0B0B0C]"
          style={{ background: grad }}
        >
          Live ↗
        </a>
      )}
    </div>
  );
}

/** Phones & tablets: horizontal swipe carousel with snap, counter, dots and arrows. */
function MobileCarousel({ total }: { total: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = projects.length + 1; // + closing CTA slide
  const step = () => {
    const first = trackRef.current?.children[0] as HTMLElement | undefined;
    return first ? first.offsetWidth + 12 : 1;
  };
  const onScroll = () => {
    const t = trackRef.current;
    if (t) setActive(Math.min(count - 1, Math.max(0, Math.round(t.scrollLeft / step()))));
  };
  const go = (to: number) => {
    const t = trackRef.current;
    if (!t) return;
    soundClick();
    t.scrollTo({ left: Math.min(count - 1, Math.max(0, to)) * step(), behavior: "smooth" });
  };
  const accent = active < projects.length ? projects[active].accent : "rgb(var(--accent))";

  return (
    <div className="lg:hidden -mx-5 md:-mx-[4vw]">
      <div
        ref={trackRef}
        onScroll={onScroll}
        data-lenis-prevent
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory overscroll-x-contain px-5 md:px-[4vw] pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p, i) => (
          <StoryCard key={p.id} p={p} i={i} total={total} />
        ))}
        <a
          href="#contact"
          onClick={() => soundClick()}
          className="relative shrink-0 snap-center w-[84vw] max-w-[440px] aspect-[3/4.2] rounded-[26px] overflow-hidden bg-surface border border-borderCustom p-6 flex flex-col justify-between"
        >
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted">({pad(total + 1)}) — Next</span>
          <p className="font-heading font-semibold tracking-[-0.04em] leading-[0.95] text-[44px] text-primary">
            Your project
            <br />
            <em className="font-accent italic font-normal text-accent">could be here.</em>
          </p>
          <span className="relative inline-flex items-center justify-between rounded-full bg-accent text-onaccent pl-5 pr-1.5 py-1.5 font-heading font-medium text-[15px]">
            Start a conversation
            <span className="grid place-items-center w-10 h-10 rounded-full bg-[#0B0B0C] text-[#F1EFEA]">↗</span>
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-1/3 -right-1/3 w-[90%] aspect-square rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, rgb(var(--accent)) 0%, transparent 60%)" }}
          />
        </a>
      </div>

      {/* controls */}
      <div className="mt-5 px-5 md:px-[4vw] flex items-center justify-between gap-4">
        <span className="font-mono text-[12px] tracking-[0.16em] text-primary tabular-nums">
          {pad(active + 1)} <span className="text-muted">/ {pad(count)}</span>
        </span>
        <div className="flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: count }).map((_, k) => (
            <span
              key={k}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: k === active ? 22 : 6, background: k === active ? accent : "rgb(var(--fg) / 0.2)" }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d < 0 ? "Previous project" : "Next project"}
              onClick={() => go(active + d)}
              disabled={d < 0 ? active === 0 : active === count - 1}
              className="grid place-items-center w-11 h-11 rounded-full border border-borderCustom text-primary disabled:opacity-30 active:scale-95 transition-transform"
            >
              {d < 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkCard({ p, total }: { p: Project; total: number }) {
  const [hovered, setHovered] = useState(false);
  const cleanTitle = p.title.split(" – ")[0];
  const subtitle = p.title.includes(" – ") ? p.title.split(" – ")[1] : p.category;

  return (
    <div className="work-slot lg:sticky lg:h-[calc(100svh-84px)] flex items-center" style={{ top: NAV_OFFSET }}>
      <div className="relative w-full hidden lg:grid lg:grid-cols-[minmax(130px,1fr)_minmax(0,1040px)_minmax(130px,1fr)] items-center gap-5 lg:gap-8">
        {/* Left meta (desktop) */}
        <div className="work-meta hidden lg:flex flex-col gap-1 justify-self-start">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">Year</span>
          <span className="font-heading font-medium text-[17px] text-primary">{p.year}</span>
          <span className="mt-6 font-mono text-[10px] tracking-[0.18em] uppercase text-muted">Case</span>
          <span className="font-heading font-medium text-[17px] text-primary tabular-nums">
            {p.id} / {pad(total)}
          </span>
        </div>

        {/* Frame */}
        <div className="work-frame relative will-change-transform">
          <Link
            href={p.link}
            scroll={false}
            onClick={() => soundClick()}
            onMouseEnter={() => {
              setHovered(true);
              soundBtnHover();
            }}
            onMouseLeave={() => setHovered(false)}
            className="project-card group relative block w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[min(72vh,700px)] rounded-[22px] md:rounded-[30px] overflow-hidden"
            style={{ background: p.color }}
          >
            <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.035]">
              <CardMedia p={p} hovered={hovered} />
            </div>

            {/* vignette for legibility: dark band on top (overlays sit there) and bottom (copy) */}
            <div className="absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-[#0A0A0A]/70 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]/75 pointer-events-none" />

            {/* Floating glass pill */}
            <div className="absolute top-3 left-3 md:top-5 md:left-1/2 md:-translate-x-1/2 flex items-center gap-2.5 md:gap-3 rounded-full bg-[#0A0A0A]/45 backdrop-blur-xl border border-white/15 pl-1.5 pr-4 py-1.5 text-[#F3F1EB] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] whitespace-nowrap">
              <span className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden bg-white/10 shrink-0">
                <Image src={p.images[0]} alt="" fill sizes="32px" className="object-cover object-left-top" />
              </span>
              <span className="flex items-center gap-2 font-heading font-semibold text-[13px] md:text-[15px] tracking-[-0.01em]">
                {p.video && <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" aria-label="Live recording" />}
                {cleanTitle}
              </span>
              <span className="hidden md:block w-px h-4 bg-white/25" />
              <span className="hidden md:inline font-heading text-[12px] md:text-[13px] text-[#F3F1EB]/80 group-hover:text-accent transition-colors">
                See work ↗
              </span>
            </div>


            {/* Bottom info: description rises on hover (always shown on touch) */}
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 hidden md:flex flex-row items-end justify-between gap-4 text-[#F3F1EB]">
              <div className="max-w-[58ch]">
                <p className="font-heading font-semibold tracking-[-0.035em] leading-[1.02] text-[clamp(24px,2.6vw,42px)]">{subtitle}</p>
                <p className="mt-2 font-sans text-[13px] md:text-[15px] leading-[1.55] text-[#F3F1EB]/75 line-clamp-2 md:max-h-0 md:opacity-0 md:group-hover:max-h-24 md:group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden">
                  {p.shortDesc}
                </p>
              </div>
              <div className="hidden md:flex flex-wrap justify-end gap-1.5 max-w-[42%]">
                {p.stack.slice(0, 4).map((t) => (
                  <span key={t} className="font-mono text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* darkens as the next card covers it */}
            <span aria-hidden className="work-shade absolute inset-0 bg-[#0A0A0A] opacity-0 pointer-events-none" />
          </Link>

          {/* Live link: sibling of the card link (anchors can't nest) */}
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundClick()}
              className="absolute top-3 md:top-5 right-3 md:right-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#F1EFEA] text-[#0B0B0C] px-3.5 py-2 font-mono text-[10px] tracking-[0.14em] uppercase shadow-lg hover:bg-accent transition-colors duration-300"
            >
              Live site ↗
            </a>
          )}
        </div>

        {/* Right meta (desktop) */}
        <div className="work-meta hidden lg:flex flex-col gap-1 justify-self-end text-right">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted">Category</span>
          <span className="font-heading font-medium text-[17px] text-primary">{p.category}</span>
          <span className="mt-6 font-mono text-[10px] tracking-[0.18em] uppercase text-muted">Built with</span>
          <span className="font-heading font-medium text-[15px] text-primary/80">{p.stack.slice(0, 2).join(", ")}</span>
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const total = projects.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: sectionRef.current, start: "top 70%", once: true, onEnter: () => soundSectionEnter() });
      if (reduce) return;

      const mm = gsap.matchMedia();
      // Desktop: the card underneath recedes and dims as the next one slides over it
      mm.add("(min-width: 1024px)", () => {
        const slots = gsap.utils.toArray<HTMLElement>(".work-slot");
        slots.forEach((slot, i) => {
          const next = slots[i + 1];
          if (!next) return;
          const st = { trigger: next, start: "top bottom", end: `top ${NAV_OFFSET}px`, scrub: true };
          gsap.to(slot.querySelector(".work-frame"), { scale: 0.86, yPercent: -4, ease: "none", scrollTrigger: st });
          const shade = slot.querySelector(".work-shade");
          if (shade) gsap.to(shade, { opacity: 0.55, ease: "none", scrollTrigger: st });
          const metas = slot.querySelectorAll(".work-meta");
          if (metas.length) gsap.to(metas, { opacity: 0, ease: "none", scrollTrigger: { ...st, end: "top 45%" } });
        });
      });

      // Every size: cards rise in the first time they enter
      gsap.utils.toArray<HTMLElement>(".work-frame").forEach((frame) => {
        gsap.fromTo(
          frame,
          { y: 80, opacity: 0.001 },
          { y: 0, opacity: 1, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: frame, start: "top 92%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="w-full bg-background px-5 md:px-[4vw] py-24 md:py-36 relative">
      {/* Header */}
      <div className="w-full mb-12 md:mb-20 flex flex-col items-center text-center gap-3">
        <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">05 · The proof</span>
        <h2 className="font-heading font-bold text-primary select-text leading-[0.95]" style={{ fontSize: "clamp(44px, 7vw, 112px)" }}>
          The proof.
        </h2>
        <p className="mt-2 max-w-[44ch] font-sans text-[16px] md:text-[18px] text-muted leading-snug select-text">
          Selected case studies across <em className="font-accent italic text-primary text-[1.15em]">product, brand &amp; AI.</em>
        </p>
        <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary/50">({pad(total)}) Case studies</span>
      </div>

      {/* Phones & tablets: swipe carousel */}
      <MobileCarousel total={total} />

      {/* Desktop: stacking cards */}
      <div className="hidden lg:flex flex-col">
        {projects.map((p) => (
          <WorkCard key={p.id} p={p} total={total} />
        ))}

        {/* CTA */}
        <div className="work-slot lg:sticky lg:h-[calc(100svh-84px)] flex items-center" style={{ top: NAV_OFFSET }}>
          <a
            href="#contact"
            onMouseEnter={() => soundBtnHover()}
            onClick={() => soundClick()}
            className="work-frame group relative mx-auto w-full max-w-[1120px] flex flex-col md:flex-row md:items-end justify-between gap-8 rounded-[22px] md:rounded-[30px] overflow-hidden bg-surface border border-borderCustom text-primary p-8 md:p-14 min-h-[340px] lg:h-[min(72vh,700px)]"
          >
            <div className="flex flex-col justify-between h-full gap-10">
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary/50">
                ({pad(total + 1)}) — Next case study
              </span>
              <p className="font-heading font-semibold tracking-[-0.04em] leading-[0.95] text-[clamp(44px,6vw,104px)]">
                Your project
                <br />
                <em className="font-accent italic font-normal text-accent">could be here.</em>
              </p>
            </div>
            <span className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase shrink-0">
              Start a conversation
              <span className="grid place-items-center w-12 h-12 rounded-full bg-accent text-onaccent text-[18px] transition-transform duration-500 group-hover:rotate-45">
                ↗
              </span>
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-1/2 -right-1/4 w-[80%] aspect-square rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700"
              style={{ background: "radial-gradient(circle, rgb(var(--accent)) 0%, transparent 60%)" }}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
