"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { projects } from "@/lib/projects";
import { soundBtnHover, soundClick } from "@/lib/sound";

const pad = (n: number) => String(n).padStart(2, "0");
const rgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

/** "Frontend (React, Tailwind CSS)" → { k: "Frontend", v: "React, Tailwind CSS" } */
function splitTech(entry: string) {
  const m = entry.match(/^([^(]+)\((.+)\)\s*$/);
  return m ? { k: m[1].trim(), v: m[2].trim() } : { k: entry, v: "" };
}

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const idx = projects.findIndex((p) => p.link === `/${params.projectId}`);
  const project = projects[idx];
  const next = projects[(idx + 1) % projects.length];
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLButtonElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Lightbox keyboard controls
  useEffect(() => {
    if (lightbox === null || !project) return;
    const n = project.images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setLightbox((p) => ((p ?? 0) - 1 + n) % n);
      else if (e.key === "ArrowRight") setLightbox((p) => ((p ?? 0) + 1) % n);
      else if (e.key === "Escape") setLightbox(null);
      else return;
      soundClick();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, project]);

  // Cursor spotlight in the hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--gx", `${e.clientX - r.left}px`);
      hero.style.setProperty("--gy", `${e.clientY - r.top}px`);
    };
    hero.addEventListener("pointermove", onMove);
    return () => hero.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (!project) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pj-hero", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "expo.out", delay: 0.1 });
      gsap.fromTo(".pj-title-line", { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.1, ease: "expo.out", delay: 0.15 });

      // cover: settles into place as you scroll toward it
      gsap.fromTo(
        ".pj-cover",
        { scale: 0.9, yPercent: 6 },
        { scale: 1, yPercent: 0, ease: "none", scrollTrigger: { trigger: ".pj-cover", start: "top bottom", end: "top 25%", scrub: 0.6 } }
      );
      // gallery: wipe reveals
      gsap.utils.toArray<HTMLElement>(".pj-clip").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 8% 18% 8% round 28px)", opacity: 0.4 },
          {
            clipPath: "inset(0% 0% 0% 0% round 20px)",
            opacity: 1,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });
      gsap.utils.toArray<HTMLElement>(".pj-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        );
      });
      // big outlined numbers drift
      gsap.utils.toArray<HTMLElement>(".pj-bignum").forEach((el) => {
        gsap.fromTo(el, { yPercent: 25 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      // colour marquee
      gsap.to(".pj-marquee-track", { xPercent: -50, duration: 26, ease: "none", repeat: -1 });
    }, rootRef);
    return () => ctx.revert();
  }, [project]);

  if (!project) notFound();

  const [name, tagline] = project.title.includes(" – ") ? project.title.split(" – ") : [project.title, project.category];
  const open = (i: number) => {
    setLightbox(i);
    soundClick();
  };
  const onTilt = (e: React.MouseEvent) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * 6, rotateX: -y * 6, duration: 0.6, ease: "power3.out" });
  };
  const offTilt = () => gsap.to(tiltRef.current, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1, 0.5)" });

  const pc = "rgb(var(--pc))";
  const label = "font-mono text-[11px] font-semibold tracking-[0.16em] uppercase text-[rgb(var(--pc))]";
  const gradText = "bg-clip-text text-transparent bg-[linear-gradient(100deg,rgb(var(--pc)),rgb(var(--pc2)))]";
  const meta = [
    { k: "Category", v: project.category },
    { k: "Year", v: project.year },
    { k: "Stack", v: project.stack.slice(0, 3).join(" · ") },
    { k: "Deliverables", v: `${pad(project.deliverables.length)} items` },
  ];
  const marqueeItems = [name, project.category, project.year, ...project.stack.slice(0, 3)];

  return (
    <main
      ref={rootRef}
      className="min-h-screen bg-background text-primary relative select-none overflow-x-clip"
      style={{ ["--pc" as string]: rgb(project.accent), ["--pc2" as string]: rgb(project.accent2) } as React.CSSProperties}
    >
      {/* ── Hero ── */}
      <header ref={heroRef} className="relative overflow-hidden px-5 md:px-[4vw] pt-28 md:pt-36 pb-16 md:pb-20">
        {/* colour field */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="pj-blob-a absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full blur-[110px] opacity-[0.28]" style={{ background: pc }} />
          <div className="pj-blob-b absolute top-[10%] -right-[15%] w-[50vw] h-[50vw] max-w-[760px] max-h-[760px] rounded-full blur-[120px] opacity-[0.22]" style={{ background: "rgb(var(--pc2))" }} />
          <div className="hero-grid-base absolute inset-0" />
          <div
            className="absolute inset-0 hidden [@media(pointer:fine)]:block"
            style={{ background: "radial-gradient(420px circle at var(--gx, -999px) var(--gy, -999px), rgb(var(--pc) / 0.16), transparent 70%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="relative">
          <div className="pj-hero flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.16em] uppercase text-muted">
            <Link
              href="/#work"
              scroll={false}
              onMouseEnter={() => soundBtnHover()}
              onClick={() => soundClick()}
              className="group inline-flex items-center gap-2 hover:text-primary transition-colors"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> All work
            </Link>
            <span>
              Case study {project.id} / {pad(projects.length)}
            </span>
          </div>

          <span className="pj-hero mt-12 md:mt-16 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--pc)/0.4)] bg-[rgb(var(--pc)/0.1)] px-3.5 py-1.5 font-mono text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--pc))]">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: pc, boxShadow: `0 0 12px ${pc}` }} />
            {project.category} · {project.year}
          </span>

          <div className="mt-6 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 lg:gap-[5vw] items-end">
            <h1 className="font-heading font-extrabold leading-[0.95] tracking-[-0.05em] select-text" style={{ fontSize: "clamp(44px, 7vw, 120px)" }}>
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="pj-title-line block">{name}</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <span className={`pj-title-line block font-accent italic font-normal tracking-[-0.02em] text-[0.62em] leading-[1.05] ${gradText}`}>
                  {tagline}
                </span>
              </span>
            </h1>
            <div className="pj-hero flex flex-col gap-6 lg:pb-3">
              <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-primary/70 select-text">{project.shortDesc}</p>
              {project.live && (
                <div className="flex flex-wrap gap-3">
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => soundBtnHover()}
                    onClick={() => soundClick()}
                    className="group inline-flex items-center gap-3 rounded-full pl-5 pr-1.5 py-1.5 font-heading font-medium text-[14px] text-[#0B0B0C] transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ background: `linear-gradient(100deg, ${pc}, rgb(var(--pc2)))`, boxShadow: "0 10px 40px -10px rgb(var(--pc) / 0.6)" }}
                  >
                    View live site
                    <span className="grid place-items-center w-9 h-9 rounded-full bg-[#0B0B0C] text-[#F1EFEA] transition-transform duration-300 group-hover:rotate-45">↗</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          <dl className="pj-hero mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
            {meta.map((m, i) => (
              <div key={m.k} className="relative flex flex-col gap-2 pt-3">
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: i === 0 ? `linear-gradient(90deg, ${pc}, transparent)` : "rgb(var(--fg) / 0.15)" }}
                />
                <dt className="font-mono text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-muted">{m.k}</dt>
                <dd className="font-sans text-[14px] md:text-[15px] font-medium text-primary">{m.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ── Colour marquee band ── */}
      <div className="relative py-6 md:py-10 overflow-hidden" aria-hidden>
        <div className="-rotate-[1.5deg] scale-[1.03] py-3 md:py-4" style={{ background: `linear-gradient(90deg, ${pc}, rgb(var(--pc2)))` }}>
          <div className="pj-marquee-track flex w-max">
            {[0, 1].map((d) => (
              <div key={d} className="flex shrink-0 items-center">
                {[0, 1, 2].flatMap((r) =>
                  marqueeItems.map((t, i) => (
                    <span key={`${d}-${r}-${i}`} className="flex items-center text-[#0B0B0C]">
                      <span className="px-5 md:px-7 font-heading font-bold tracking-[-0.03em] text-[clamp(20px,2.4vw,36px)] whitespace-nowrap">{t}</span>
                      <span className="text-[16px] md:text-[20px]">✦</span>
                    </span>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cover (3D tilt) ── */}
      <div className="px-5 md:px-[4vw] mt-6 md:mt-10 [perspective:1400px]">
        <div className="pj-cover">
          <button
            ref={tiltRef}
            type="button"
            onClick={() => open(0)}
            onMouseMove={onTilt}
            onMouseLeave={offTilt}
            aria-label="Open cover image"
            className="group relative block w-full aspect-[4/3] md:aspect-[16/9] rounded-[22px] md:rounded-[30px] overflow-hidden [transform-style:preserve-3d] will-change-transform"
            style={{ background: project.color, boxShadow: "0 40px 120px -40px rgb(var(--pc) / 0.55), 0 0 0 1px rgb(var(--pc) / 0.25)" }}
          >
            <Image src={project.images[0]} alt={`${project.title} cover`} fill priority quality={92} sizes="92vw" className="object-cover object-top" />
            <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.14)_50%,transparent_70%)] translate-x-[-60%] group-hover:translate-x-[60%] transition-transform duration-[1400ms] ease-out" />
            <span className="absolute bottom-4 right-4 font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full bg-[#0B0B0C]/75 text-[#F1EFEA] backdrop-blur-sm">
              View full size ↗
            </span>
          </button>
        </div>
      </div>

      {/* ── Challenge / Approach ── */}
      <section className="px-5 md:px-[4vw] py-20 md:py-32 flex flex-col gap-20 md:gap-28">
        {[
          { n: "01", tag: "The challenge", text: project.description },
          { n: "02", tag: "The approach", text: project.solution },
        ].map((b) => (
          <div key={b.tag} className="relative grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-5 lg:gap-[5vw]">
            <div className="relative">
              <span
                aria-hidden
                className="pj-bignum block font-heading font-bold leading-none tracking-[-0.06em] text-transparent select-none"
                style={{ fontSize: "clamp(110px, 14vw, 230px)", WebkitTextStroke: "1.5px rgb(var(--pc) / 0.55)" }}
              >
                {b.n}
              </span>
              <span className={`${label} mt-2 block`}>
                ({b.n}) — {b.tag}
              </span>
            </div>
            <p className="pj-reveal font-heading font-medium text-[clamp(22px,2.4vw,38px)] leading-[1.3] tracking-[-0.025em] text-primary/90 lg:pt-10 select-text">
              {b.text}
            </p>
          </div>
        ))}
      </section>

      {/* ── Gallery ── */}
      {project.images.length > 1 && (
        <section className="px-5 md:px-[4vw] pb-20 md:pb-32">
          <div className="pj-reveal flex items-end justify-between gap-4 mb-8 md:mb-12">
            <h2 className="font-heading font-bold tracking-[-0.045em] leading-[0.95] text-[clamp(34px,4.6vw,72px)]">
              Inside the <span className={gradText}>build.</span>
            </h2>
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">({pad(project.images.length - 1)}) Screens</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {project.images.slice(1).map((img, i) => {
              const wide = i === 0;
              return (
                <button
                  key={img}
                  type="button"
                  onClick={() => open(i + 1)}
                  aria-label={`Open screenshot ${i + 2}`}
                  className={`pj-clip group relative block overflow-hidden rounded-[20px] ring-1 ring-[rgb(var(--fg)/0.08)] hover:ring-[rgb(var(--pc)/0.7)] transition-[box-shadow] duration-500 hover:shadow-[0_30px_80px_-30px_rgb(var(--pc)/0.6)] ${
                    wide ? "md:col-span-2 aspect-[4/3] md:aspect-[16/8]" : "aspect-[4/3]"
                  }`}
                  style={{ background: project.color }}
                >
                  <Image
                    src={img}
                    alt={`${project.title} screenshot ${i + 2}`}
                    fill
                    quality={92}
                    sizes={wide ? "92vw" : "(min-width: 768px) 46vw, 92vw"}
                    className="object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
                  />
                  <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.14em] px-2.5 py-1 rounded-full bg-[#0B0B0C]/75 text-[#F1EFEA] backdrop-blur-sm">
                    {pad(i + 2)} / {pad(project.images.length)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Deliverables + tech (colour section) ── */}
      <section className="relative overflow-hidden px-5 md:px-[4vw] py-20 md:py-28 bg-surface border-y border-borderCustom">
        <div aria-hidden className="absolute -top-1/3 -right-1/4 w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-[0.16] pointer-events-none" style={{ background: pc }} />
        <div aria-hidden className="absolute -bottom-1/3 -left-1/4 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.12] pointer-events-none" style={{ background: "rgb(var(--pc2))" }} />
        <div className="relative grid lg:grid-cols-2 gap-16 lg:gap-[6vw]">
          <div className="pj-reveal">
            <span className={label}>(03) — Deliverables</span>
            <ol className="mt-8">
              {project.deliverables.map((d, i) => (
                <li
                  key={d}
                  className="group relative flex items-baseline gap-5 py-4 border-t border-[rgb(var(--fg)/0.1)] last:border-b transition-[padding] duration-500 hover:pl-3"
                >
                  <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[2px] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" style={{ background: pc }} />
                  <span
                    className="shrink-0 grid place-items-center w-7 h-7 rounded-full font-mono text-[10px] text-[#0B0B0C]"
                    style={{ background: `linear-gradient(135deg, ${pc}, rgb(var(--pc2)))` }}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className="font-sans text-[15px] md:text-[17px] leading-snug text-primary/90 select-text">{d}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="pj-reveal">
            <span className={label}>(04) — Built with</span>
            <dl className="mt-8">
              {project.techUsed.map((t) => {
                const { k, v } = splitTech(t);
                return (
                  <div key={t} className="group grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-4 border-t border-[rgb(var(--fg)/0.1)] last:border-b">
                    <dt className="font-heading font-semibold text-[15px] md:text-[17px] transition-colors duration-300 group-hover:text-[rgb(var(--pc))]">{k}</dt>
                    <dd className="font-sans text-[14px] md:text-[15px] text-primary/60 select-text">{v}</dd>
                  </div>
                );
              })}
            </dl>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-full border border-[rgb(var(--pc)/0.35)] bg-[rgb(var(--pc)/0.08)] text-[rgb(var(--pc))]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Next project ── */}
      <section className="px-5 md:px-[4vw] py-16 md:py-24" style={{ ["--nc" as string]: rgb(next.accent) } as React.CSSProperties}>
        <Link
          href={next.link}
          scroll={false}
          onMouseEnter={() => soundBtnHover()}
          onClick={() => soundClick()}
          className="pj-reveal project-card group relative grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6 md:gap-10 items-center rounded-[28px] p-5 md:p-8 border border-borderCustom overflow-hidden"
        >
          <span
            aria-hidden
            className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{ background: "radial-gradient(60% 80% at 20% 50%, rgb(var(--nc) / 0.18), transparent 70%)" }}
          />
          <div className="relative order-2 md:order-1">
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted">Next case study — {next.id}</span>
            <p className="mt-3 font-heading font-bold tracking-[-0.045em] leading-[0.95] text-[clamp(34px,4.6vw,76px)] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-2">
              {next.title.split(" – ")[0]}
            </p>
            <span className="mt-5 inline-flex items-center gap-3 font-heading font-medium text-[15px]">
              <span
                className="grid place-items-center w-11 h-11 rounded-full text-[#0B0B0C] transition-transform duration-500 group-hover:rotate-45"
                style={{ background: "rgb(var(--nc))" }}
              >
                ↗
              </span>
              View project
            </span>
          </div>
          <div className="relative order-1 md:order-2 aspect-[16/10] rounded-[20px] overflow-hidden" style={{ background: next.color }}>
            <Image
              src={next.images[0]}
              alt={next.title}
              fill
              quality={90}
              sizes="(min-width: 768px) 50vw, 92vw"
              className="object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
            />
          </div>
        </Link>

        <footer className="mt-16 pt-8 border-t border-borderCustom flex flex-col sm:flex-row justify-between gap-3 font-mono text-[11px] text-muted tracking-wider">
          <span>&copy; {new Date().getFullYear()} Prajapati Manan. All rights reserved.</span>
          <span>Designed &amp; built by Manan · AI-Assisted Engineer</span>
        </footer>
      </section>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          onClick={() => {
            setLightbox(null);
            soundClick();
          }}
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center"
        >
          <button
            onClick={() => {
              setLightbox(null);
              soundClick();
            }}
            className="absolute top-5 right-5 font-mono text-[#F1EFEA]/80 hover:text-[rgb(var(--pc))] text-[13px] p-4 z-[210]"
          >
            ✕ Close
          </button>
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              aria-label={dir === "prev" ? "Previous image" : "Next image"}
              onClick={(e) => {
                e.stopPropagation();
                const n = project.images.length;
                setLightbox((p) => ((p ?? 0) + (dir === "prev" ? -1 : 1) + n) % n);
                soundClick();
              }}
              className={`absolute ${dir === "prev" ? "left-2 md:left-6" : "right-2 md:right-6"} top-1/2 -translate-y-1/2 text-[#F1EFEA]/60 hover:text-[rgb(var(--pc))] text-[28px] md:text-[32px] p-4 z-[210]`}
            >
              {dir === "prev" ? "←" : "→"}
            </button>
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.images[lightbox]}
            alt={`${project.title} full screen view`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[86vw] max-h-[80vh] object-contain rounded-md"
            style={{ boxShadow: "0 30px 120px -20px rgb(var(--pc) / 0.45)" }}
          />
          <div className="absolute bottom-6 font-mono text-[#F1EFEA]/50 text-[12px]">
            {pad(lightbox + 1)} / {pad(project.images.length)}
          </div>
        </div>
      )}
    </main>
  );
}
