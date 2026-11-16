"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { soundBtnHover, soundClick, soundCardHover, soundSectionEnter } from "@/lib/sound";

function useIST() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/** Live profile card: liquid-chrome film behind a glass ID panel, with a gentle 3D tilt. */
function ProfileCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const time = useIST();

  // play the film only while the card is on screen
  useEffect(() => {
    const v = videoRef.current, card = cardRef.current;
    if (!v || !card) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.15 });
    io.observe(card);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, duration: 0.6, ease: "power3.out" });
  };
  const onLeave = () => gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1, 0.5)" });

  const facts = [
    { k: "Now", v: "Software Engineer @ Cortexloom" },
    { k: "Based", v: "Kadi, Gujarat, India" },
    { k: "Focus", v: "AI products & web apps" },
  ];

  return (
    <div className="w-full max-w-[420px] [perspective:1200px]">
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => soundCardHover()}
        className="group relative w-full aspect-[3/4] rounded-[28px] overflow-hidden border border-borderCustom bg-[#0B0B0C] [transform-style:preserve-3d] will-change-transform shadow-[0_40px_100px_-40px_rgb(var(--accent)/0.45)]"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/video/orb-portrait.webm"
          poster="/video/orb-portrait-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0C]/55 via-transparent to-[#0B0B0C]/80 pointer-events-none" />
        {/* sheen */}
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.10)_50%,transparent_65%)] -translate-x-full group-hover:translate-x-full transition-transform duration-[1400ms] ease-out" />

        {/* top row */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] uppercase text-[#F1EFEA]/85">
          <span className="flex items-center gap-2 rounded-full bg-[#0B0B0C]/45 backdrop-blur-md border border-white/10 px-2.5 py-1">
            <span className="animate-dot-pulse inline-flex h-1.5 w-1.5 rounded-full bg-green-500" /> Available
          </span>
          <span className="tabular-nums">{time ? `${time} IST` : "IST"}</span>
        </div>

        {/* glass ID panel */}
        <div className="absolute inset-x-3 bottom-3 rounded-[20px] bg-[#0B0B0C]/50 backdrop-blur-xl border border-white/10 p-5 text-[#F1EFEA] [transform:translateZ(40px)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-heading font-semibold text-[24px] leading-none tracking-[-0.03em]">Prajapati Manan</p>
              <p className="mt-1.5 font-accent italic text-[17px] text-accent">Full Stack Developer</p>
            </div>
            <span className="shrink-0 grid place-items-center w-9 h-9 rounded-full bg-accent text-onaccent font-heading font-bold text-[13px]">PM</span>
          </div>
          <dl className="mt-4 flex flex-col">
            {facts.map((f) => (
              <div key={f.k} className="grid grid-cols-[64px_1fr] gap-3 py-2 border-t border-white/10">
                <dt className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#F1EFEA]/50 pt-0.5">{f.k}</dt>
                <dd className="font-sans text-[13px] text-[#F1EFEA]/90">{f.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["React", "Next.js", "TypeScript", "Supabase", "Claude AI"].map((t) => (
              <span key={t} className="font-mono text-[9.5px] tracking-[0.1em] uppercase px-2 py-1 rounded-full border border-white/15 bg-white/5 text-[#F1EFEA]/80">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const section = sectionRef.current;

    if (!section || !leftCol || !rightCol) return;

    const ctx = gsap.context(() => {
      // Columns slide in from opposite sides
      gsap.fromTo(
        leftCol,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
            onEnter: () => soundSectionEnter(),
          },
        }
      );

      gsap.fromTo(
        rightCol,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full bg-background px-[6vw] py-20 md:py-32 flex flex-col items-start relative select-none"
    >
      {/* Top Section Dividers and Labels */}
      <div className="w-full mb-12 flex flex-col items-start gap-2">
        <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">
          02 · THE HUMAN.
        </span>
        <h2
          className="font-serif font-bold text-primary select-text leading-tight"
          style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
        >
          About Me
        </h2>
      </div>

      {/* Two-Column Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 lg:gap-16 items-start">
        {/* Left Column - Profile card (replaces the photo) */}
        <div ref={leftColRef} className="opacity-0 flex flex-col items-start w-full">
          <ProfileCard />
          <p className="mt-4 font-mono text-[11px] text-muted tracking-wider uppercase">
            Prajapati Manan · Full Stack Developer
          </p>
        </div>

        {/* Right Column - Text & Stats */}
        <div ref={rightColRef} className="opacity-0 flex flex-col items-start w-full max-w-3xl select-text">
          <p className="font-sans text-[17px] text-primary leading-[1.8] font-medium mb-6">
            I&apos;m Manan Prajapati, an AI-Assisted Full-Stack Developer and Digital Product Builder passionate about transforming ideas into scalable digital experiences.
          </p>

          <p className="font-sans text-[16px] text-muted leading-[1.75] font-normal mb-6">
            I specialize in designing, developing, and deploying modern web applications from concept to production. By combining strong technical foundations with advanced AI workflows, I streamline development, accelerate delivery, and create high-quality solutions without compromising performance, usability, or scalability.
          </p>

          <p className="font-sans text-[16px] text-muted leading-[1.75] font-normal mb-6">
            My expertise spans the entire product lifecycle—from UI/UX design and front-end development to backend architecture, database management, deployment, and optimization. Using technologies like React, Next.js, Node.js, PostgreSQL, Tailwind CSS, and modern AI tools, I build responsive, user-focused applications that solve real business problems.
          </p>

          <p className="font-sans text-[16px] text-muted leading-[1.75] font-normal mb-6">
            Beyond development, I bring experience in digital marketing, branding, and growth strategy, allowing me to create products that not only function beautifully but also drive engagement and business results.
          </p>

          <p className="font-sans text-[16px] text-muted leading-[1.75] font-normal mb-10">
            As the founder of Webestron, I continuously explore emerging technologies, AI-powered workflows, and modern development practices to build future-ready digital products that make a meaningful impact.
          </p>

          {/* Stat Pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              "2+ Years Experience",
              "20+ Projects Delivered",
              "6 Service Verticals"
            ].map((stat, i) => (
              <div
                key={i}
                onMouseEnter={() => soundCardHover()}
                className="border border-borderCustom rounded-full px-5 py-2 flex items-center bg-transparent cursor-none"
              >
                <span className="font-sans text-[14px] font-medium text-primary">
                  {stat}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Link */}
          <a
            href="#services"
            onMouseEnter={() => soundBtnHover()}
            onClick={() => soundClick()}
            className="group relative inline-flex items-center gap-1 font-sans text-[14px] text-primary font-semibold tracking-[0.04em] pb-1 uppercase select-none cursor-none"
          >
            See my work ↓
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary scale-x-0 origin-left transition-transform duration-350 ease-out group-hover:scale-x-100" />
          </a>
        </div>
      </div>
    </section>
  );
}
