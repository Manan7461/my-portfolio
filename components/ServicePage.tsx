"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { soundBtnHover, soundClick } from "@/lib/sound";
import { services, getService } from "@/lib/services";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ServicePage({ slug }: { slug: string }) {
  const service = getService(slug);
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!service) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // which process step is being read
      gsap.utils.toArray<HTMLElement>(".sp-step").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setStep(i),
        });
      });
      if (reduce) return;
      gsap.fromTo(".sp-hero", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "expo.out", delay: 0.1 });
      gsap.fromTo(".sp-num", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.6, ease: "expo.out", delay: 0.2 });
      gsap.utils.toArray<HTMLElement>(".sp-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [service]);

  if (!service) notFound();

  const idx = services.findIndex((s) => s.slug === service.slug);
  const next = services[(idx + 1) % services.length];
  const label = "font-mono text-[11px] text-accent font-semibold tracking-[0.16em] uppercase";

  const facts = [
    { k: "Discipline", v: service.title },
    { k: "Process", v: `${service.process.length} clear steps` },
    { k: "Toolkit", v: `${service.stack.length} core tools` },
    { k: "Status", v: "Open for projects" },
  ];

  return (
    <div ref={rootRef} className="relative min-h-screen bg-background text-primary select-none overflow-x-clip">
      {/* ── Hero ── */}
      <header className="relative px-5 md:px-[4vw] pt-28 md:pt-36 pb-16 md:pb-24">
        {/* outlined watermark number */}
        <span
          aria-hidden
          className="sp-num pointer-events-none absolute right-[2vw] top-16 md:top-20 font-heading font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgb(var(--fg)/0.08)]"
          style={{ fontSize: "clamp(160px, 30vw, 460px)" }}
        >
          {service.num}
        </span>

        <div className="sp-hero relative flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
          <Link
            href="/#services"
            scroll={false}
            onClick={() => soundClick()}
            onMouseEnter={() => soundBtnHover()}
            className="group inline-flex items-center gap-2 hover:text-primary transition-colors"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> All services
          </Link>
          <span>
            {service.num} / {pad(services.length)}
          </span>
        </div>

        <div className="relative mt-14 md:mt-20">
          <span className={`sp-hero block ${label}`}>
            ({service.num}) — {service.title}
          </span>
          <h1
            className="sp-hero mt-4 font-heading font-extrabold leading-[0.92] tracking-[-0.055em] max-w-[14ch]"
            style={{ fontSize: "clamp(52px, 9vw, 150px)" }}
          >
            {service.name}
            <span className="text-accent">.</span>
          </h1>
          <div className="mt-8 md:mt-12 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 lg:gap-[5vw] items-end">
            <p className="sp-hero font-accent italic text-[clamp(26px,2.8vw,44px)] text-primary/60 leading-tight">
              {service.tagline}
            </p>
            <div className="flex flex-col gap-6">
              <p className="sp-hero font-sans text-[17px] md:text-[19px] font-medium leading-[1.55] text-primary select-text">
                {service.lead}
              </p>
              <div className="sp-hero flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  scroll={false}
                  onClick={() => soundClick()}
                  onMouseEnter={() => soundBtnHover()}
                  className="group inline-flex items-center gap-3 rounded-full bg-primary text-background pl-5 pr-1.5 py-1.5 font-heading font-medium text-[14px] hover:bg-accent hover:text-onaccent transition-colors duration-300"
                >
                  Start a project
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-background text-primary transition-transform duration-300 group-hover:rotate-45">
                    ↗
                  </span>
                </Link>
                <a
                  href="#process"
                  onClick={() => soundClick()}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-3 font-heading font-medium text-[14px] hover:border-primary transition-colors"
                >
                  See the process ↓
                </a>
              </div>
            </div>
          </div>
        </div>

        <dl className="sp-hero relative mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
          {facts.map((f) => (
            <div key={f.k} className="flex flex-col gap-2 pt-3 border-t border-primary/15">
              <dt className="font-mono text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-muted">{f.k}</dt>
              <dd className="font-sans text-[14px] md:text-[15px] font-medium text-primary">{f.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ── Approach statement ── */}
      <section className="px-5 md:px-[4vw] py-20 md:py-28 border-t border-primary/10 grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 lg:gap-[5vw]">
        <span className={`sp-reveal ${label}`}>(A) — The approach</span>
        <p className="sp-reveal font-heading font-medium text-[clamp(24px,2.8vw,44px)] leading-[1.22] tracking-[-0.03em] select-text">
          {service.body}
        </p>
      </section>

      {/* ── Process (Weichie-style: sticky heading + detailed steps) ── */}
      <section id="process" className="px-5 md:px-[4vw] py-20 md:py-28 bg-primary text-background scroll-mt-20">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-[6vw]">
          <div className="lg:sticky lg:top-28 self-start">
            <span className={label}>(B) — How we&apos;ll work together</span>
            <h2 className="mt-4 font-heading font-semibold tracking-[-0.045em] leading-[1.02] text-[clamp(32px,3.8vw,60px)]">
              {service.processHeading}
            </h2>
            <ol className="mt-10 hidden lg:flex flex-col">
              {service.process.map((p, i) => (
                <li
                  key={p.title}
                  className={`flex items-center gap-4 py-3 border-t border-background/10 transition-colors duration-500 ${
                    step === i ? "text-background" : "text-background/35"
                  }`}
                >
                  <span className={`font-mono text-[11px] tracking-[0.14em] ${step === i ? "text-accent" : ""}`}>{pad(i + 1)}</span>
                  <span className="font-heading font-medium text-[17px]">{p.title}</span>
                  <span
                    className={`ml-auto h-px bg-accent origin-left transition-transform duration-700 w-16 ${
                      step === i ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col">
            {service.process.map((p, i) => (
              <article key={p.title} className="sp-step sp-reveal py-10 md:py-14 border-t border-background/12 first:border-t-0 first:pt-0">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">Step {pad(i + 1)}</span>
                <h3 className="mt-3 font-heading font-semibold text-[clamp(26px,2.6vw,40px)] tracking-[-0.035em] leading-[1.05]">
                  {p.title}
                </h3>
                <p className="mt-5 font-sans text-[16px] md:text-[18px] leading-[1.7] text-background/70 max-w-[58ch] select-text">
                  {p.desc}
                </p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 font-sans text-[15px] md:text-[16px] text-background/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="px-5 md:px-[4vw] py-20 md:py-28">
        <div className="sp-reveal flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <span className={label}>(C) — What you get</span>
            <h2 className="mt-3 font-heading font-bold tracking-[-0.045em] leading-[0.95] text-[clamp(36px,5vw,76px)]">
              Capabilities
            </h2>
          </div>
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary/50">
            ({pad(service.capabilities.length)}) Areas
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-primary/10">
          {service.capabilities.map((c, i) => (
            <div
              key={c.title}
              className="sp-reveal group relative border-b border-r border-primary/10 p-6 md:p-8 min-h-[210px] flex flex-col justify-between gap-8 overflow-hidden"
            >
              <span className="absolute inset-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-[600ms] ease-[cubic-bezier(0.19,1,0.22,1)]" />
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.14em] text-accent">{pad(i + 1)}</span>
                <span className="w-2 h-2 rounded-full border border-primary/30 group-hover:bg-accent group-hover:border-accent transition-colors duration-500" />
              </div>
              <div className="relative">
                <h3 className="font-heading font-semibold text-[22px] md:text-[24px] tracking-[-0.03em] leading-tight text-primary group-hover:text-background transition-colors duration-500">
                  {c.title}
                </h3>
                <p className="mt-2 font-sans text-[14px] leading-[1.6] text-muted group-hover:text-background/65 transition-colors duration-500 select-text">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Toolkit ── */}
      <section className="px-5 md:px-[4vw] py-16 md:py-20 grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 lg:gap-[5vw] border-y border-primary/10">
        <span className={`sp-reveal ${label}`}>(D) — Toolkit</span>
        <div className="sp-reveal flex flex-wrap gap-2.5">
          {service.stack.map((t) => (
            <span
              key={t}
              className="font-heading font-medium text-[15px] md:text-[17px] px-4 py-2 rounded-full border border-primary/15 hover:bg-primary hover:text-background transition-colors duration-300"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA + next ── */}
      <section className="px-5 md:px-[4vw] pt-20 md:pt-28 pb-16">
        <div className="sp-reveal rounded-[24px] md:rounded-[28px] bg-surface p-8 md:p-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <p className="font-heading font-semibold tracking-[-0.04em] leading-[0.98] text-[clamp(32px,4.4vw,68px)] max-w-[16ch]">
            Have a {service.title.toLowerCase()} project{" "}
            <em className="font-accent italic font-normal text-primary/60">in mind?</em>
          </p>
          <Link
            href="/#contact"
            scroll={false}
            onClick={() => soundClick()}
            onMouseEnter={() => soundBtnHover()}
            className="group shrink-0 inline-flex items-center gap-3 rounded-full bg-primary text-background pl-6 pr-2 py-2 font-heading font-medium text-[15px] hover:bg-accent hover:text-onaccent transition-colors duration-300"
          >
            Let&apos;s talk
            <span className="grid place-items-center w-10 h-10 rounded-full bg-background text-primary transition-transform duration-300 group-hover:rotate-45">↗</span>
          </Link>
        </div>

        <Link
          href={`/${next.slug}`}
          scroll={false}
          onClick={() => soundClick()}
          onMouseEnter={() => soundBtnHover()}
          className="sp-reveal group mt-6 flex items-center justify-between gap-6 border-t border-b border-primary/10 py-8 md:py-10"
        >
          <div>
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
              Next service — ({next.num}) {next.title}
            </span>
            <p className="mt-2 font-heading font-bold tracking-[-0.045em] leading-none text-[clamp(32px,5vw,80px)] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-3">
              {next.name}
            </p>
          </div>
          <span className="grid place-items-center shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full border border-primary/20 text-[22px] group-hover:bg-primary group-hover:text-background transition-colors duration-300">
            →
          </span>
        </Link>

        <div className="mt-10 flex flex-col sm:flex-row justify-between gap-3 font-mono text-[11px] text-muted tracking-wider">
          <span>&copy; {new Date().getFullYear()} Prajapati Manan.</span>
          <span>Designed &amp; built by Prajapati Manan</span>
        </div>
      </section>
    </div>
  );
}
