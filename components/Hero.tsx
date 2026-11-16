"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { soundBtnHover, soundClick } from "@/lib/sound";
import { useLoader } from "@/components/LoaderContext";
import { useLenis } from "@/components/LenisProvider";

const ROTATE = ["think", "scale", "convert"];
const HEADLINE_TEXT = "I design & engineer digital products that think, scale & convert.";

const SERVICES = [
  "Web Engineering",
  "Interface Design",
  "AI Integration & Agents",
  "Visual Identity",
  "Digital Experience",
  "Growth & Presence",
];

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useLocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/** Cycles think → scale → convert with a vertical slot animation; width eases to fit each word. */
function Rotator() {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [idx, setIdx] = useState(0);

  // keep the slot exactly as wide as the current word
  useIsoLayoutEffect(() => {
    const fit = () => {
      const w = measureRefs.current[idx]?.offsetWidth;
      if (w && wrapRef.current) wrapRef.current.style.width = `${w}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [idx]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % ROTATE.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      ref={wrapRef}
      className="relative inline-block align-bottom overflow-hidden h-[1.08em] -mb-[0.12em] transition-[width] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
    >
      {ROTATE.map((w, i) => (
        <span
          key={w}
          aria-hidden
          className="hero-rot absolute left-0 top-0 whitespace-nowrap font-accent italic font-normal tracking-[-0.02em] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
          style={{
            transform: `translateY(${i === idx ? 0 : i === (idx + ROTATE.length - 1) % ROTATE.length ? -105 : 105}%)`,
            opacity: i === idx ? 1 : 0,
          }}
        >
          {w}
        </span>
      ))}
      {/* invisible measurers */}
      {ROTATE.map((w, i) => (
        <span
          key={`m-${w}`}
          ref={(el) => {
            measureRefs.current[i] = el;
          }}
          aria-hidden
          className="absolute invisible whitespace-nowrap font-accent italic font-normal tracking-[-0.02em] pointer-events-none"
        >
          {w}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { startAnimation } = useLoader();
  const lenis = useLenis();
  const time = useLocalTime();
  // Laptop/desktop: ember-silk film. Phones: liquid-chrome orb film rendered in portrait (1080x1920) so it stays sharp.
  const [film, setFilm] = useState<"aurora" | "orb-portrait" | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const pick = () => setFilm(mq.matches ? "aurora" : "orb-portrait");
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, []);

  const scrollToId = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    soundClick();
    const el = document.getElementById(id);
    if (el && lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  /* Cursor spotlight on the blueprint grid */
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      grid.style.setProperty("--mx", `${e.clientX - r.left}px`);
      grid.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    section.addEventListener("pointermove", onMove);
    return () => section.removeEventListener("pointermove", onMove);
  }, []);

  /* Intro + scroll choreography */
  useIsoLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      tl.fromTo(".hero-capsule", { width: 0, opacity: 0 }, { width: "1.9em", opacity: 1, duration: 1.4 }, 0)
        .fromTo(".hero-dot", { scale: 0 }, { scale: 1, duration: 0.9, ease: "back.out(3)" }, 0.35)
        .fromTo(".hero-fade", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.08 }, 0.2)
        .fromTo(".hero-marquee", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2 }, 0.5);
      tlRef.current = tl;
      if (reduce) {
        tl.progress(1);
        return;
      }

      const st = { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to(".hero-headline", { yPercent: -18, scale: 0.94, opacity: 0.2, ease: "none", scrollTrigger: st });
      gsap.to(".hero-grid", { yPercent: 14, ease: "none", scrollTrigger: st });
      gsap.to(".hero-film", { yPercent: 22, scale: 1.08, ease: "none", scrollTrigger: st });

      // Velocity-reactive marquee
      const track = marqueeRef.current;
      if (track) {
        const loop = gsap.to(track, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
        let dir = 1;
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (Math.abs(v) > 10) dir = v > 0 ? 1 : -1;
            const boost = 1 + Math.min(Math.abs(v) / 400, 5);
            gsap.to(loop, { timeScale: dir * boost, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: "power2.out" });
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (startAnimation) tlRef.current?.play();
  }, [startAnimation]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col overflow-hidden bg-background select-none"
    >
      {/* Ambient brand film behind everything, veiled so type stays crisp */}
      <div aria-hidden className="hero-film absolute inset-0 pointer-events-none">
        {film && <video
          key={film}
          className={`absolute inset-0 w-full h-full object-cover ${film === "aurora" ? "opacity-80" : "opacity-95"}`}
          src={`/video/${film}.webm`}
          poster={`/video/${film}-poster.jpg`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />}
        <div
          className="absolute inset-0"
          style={{
            background:
              film === "aurora"
                ? "radial-gradient(ellipse 70% 60% at 50% 45%, rgb(var(--bg) / 0.72) 0%, rgb(var(--bg) / 0.45) 55%, rgb(var(--bg) / 0.2) 100%)"
                : "radial-gradient(ellipse 62% 52% at 50% 46%, rgb(var(--bg) / 0.5) 0%, rgb(var(--bg) / 0.25) 60%, rgb(var(--bg) / 0.1) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Blueprint grid + cursor spotlight */}
      <div ref={gridRef} aria-hidden className="hero-grid absolute inset-0 pointer-events-none">
        <div className="hero-grid-base absolute inset-0" />
        <div className="hero-grid-glow absolute inset-0 hidden [@media(pointer:fine)]:block" />
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 md:px-[4vw] pt-28 pb-12 md:pt-32">
        <div className="hero-fade inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-primary/10 bg-background/70 backdrop-blur-sm pl-3 pr-4 py-1.5 font-mono text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-muted">
          <span className="flex items-center gap-2 text-primary">
            <span className="animate-dot-pulse inline-flex h-2 w-2 rounded-full bg-green-500" />
            Available for projects
          </span>
          <span className="hidden sm:inline text-primary/25">/</span>
          <span className="hidden sm:inline">Gujarat, India · {time ? `${time} IST` : "IST"}</span>
        </div>

        <h1
          aria-label={HEADLINE_TEXT}
          className="hero-headline mt-8 md:mt-10 font-heading font-semibold text-primary leading-[0.98] tracking-[-0.055em] text-[clamp(44px,8.4vw,150px)] will-change-transform"
        >
          <span aria-hidden className="block">
            I design &amp; engineer
          </span>
          <span aria-hidden className="block">
            digital
            <span className="hero-capsule relative inline-block align-middle mx-[0.12em] h-[0.74em] w-[1.9em] -mt-[0.12em] rounded-full overflow-hidden bg-[#0B0B0C] ring-1 ring-primary/15 shadow-[0_10px_40px_-8px_rgba(255,107,61,0.45)]">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/video/reel.webm"
                poster="/video/reel-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </span>
            products
          </span>
          <span aria-hidden className="block">
            that <Rotator />
            <span className="hero-dot inline-block w-[0.16em] h-[0.16em] rounded-full bg-accent ml-[0.04em] align-baseline" />
          </span>
        </h1>

        <p className="hero-fade mt-8 md:mt-10 max-w-[44ch] font-sans text-[15px] md:text-[18px] leading-[1.6] text-muted select-text">
          Full Stack Developer building fast, AI-powered web products, from security tools and AI assistants to
          billing systems and marketplaces.
        </p>

        <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#work"
            onClick={scrollToId("work")}
            onMouseEnter={() => soundBtnHover()}
            className="group inline-flex items-center gap-3 rounded-full bg-primary text-background pl-6 pr-1.5 py-1.5 font-heading font-medium text-[15px] hover:bg-accent hover:text-onaccent transition-colors duration-300"
          >
            See the work
            <span className="grid place-items-center w-10 h-10 rounded-full bg-background text-primary transition-transform duration-500 group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
          <a
            href="#contact"
            onClick={scrollToId("contact")}
            onMouseEnter={() => soundBtnHover()}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-6 py-[15px] font-heading font-medium text-[15px] text-primary hover:bg-primary hover:text-background hover:border-primary transition-colors duration-300"
          >
            Let&apos;s talk ↗
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hero-fade relative z-10 px-5 md:px-[4vw] pb-5 grid grid-cols-2 md:grid-cols-3 items-end gap-4 font-mono text-[10px] md:text-[11px] tracking-[0.16em] uppercase text-muted">
        <span>Prajapati Manan — Full Stack Developer</span>
        <span className="hidden md:flex flex-col items-center gap-2">
          Scroll
          <span className="relative block w-px h-10 bg-primary/15 overflow-hidden">
            <span className="hero-scroll-line absolute left-0 top-0 w-px h-1/2 bg-primary" />
          </span>
        </span>
        <span className="text-right">Portfolio ©2026</span>
      </div>

      {/* Services marquee */}
      <div className="hero-marquee relative z-10 border-t border-primary/10 py-3.5 md:py-4 overflow-hidden bg-background">
        <div ref={marqueeRef} className="marquee-track flex w-max will-change-transform">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {SERVICES.concat(SERVICES).map((s, i) => (
                <span key={`${dup}-${i}`} className="flex items-center">
                  <span className="font-heading font-medium text-[clamp(15px,1.6vw,22px)] text-primary px-5 md:px-6 whitespace-nowrap">
                    {s}
                  </span>
                  <span className="text-accent text-[14px]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
