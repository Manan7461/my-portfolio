"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { soundLoaderTick, soundPanelSplit, soundClick } from "@/lib/sound";
import { useLenis } from "@/components/LenisProvider";

interface LoaderProps {
  onHeroTrigger?: () => void;
  onLoaderComplete?: () => void;
}

export default function Loader({ onHeroTrigger, onLoaderComplete }: LoaderProps) {
  const lenis = useLenis();
  const [tagline, setTagline] = useState("INITIALIZING...");
  const [startBreathe, setStartBreathe] = useState(false);
  const [showEnter, setShowEnter] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const enterTriggered = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(pointer: fine)");
      setIsLaptop(mediaQuery.matches);

      const handleMediaChange = (e: MediaQueryListEvent) => {
        setIsLaptop(e.matches);
      };
      mediaQuery.addEventListener("change", handleMediaChange);
      return () => {
        mediaQuery.removeEventListener("change", handleMediaChange);
      };
    }
  }, []);

  const handleEnter = useCallback(() => {
    if (enterTriggered.current) return;
    enterTriggered.current = true;

    // Play click sound
    soundClick();

    document.documentElement.classList.remove("loader-active");

    const exitTl = gsap.timeline({
      onComplete: () => {
        onLoaderComplete?.();
        lenis?.start();
        document.body.style.overflow = "auto";
        document.documentElement.classList.add("loader-seen");
      }
    });

    // ── Launch Forward Exit Sequence ──
    exitTl.to(".loader-center", {
      scale: 1.12,
      opacity: 0,
      duration: 0.35,
      ease: "power2.inOut",
    }, 0);

    // Panel Split whoosh sound at 0.3s
    exitTl.call(() => {
      soundPanelSplit();
    }, [], 0.3);

    // Panels split apart (0.3s - 0.9s)
    exitTl.to(".loader-panel-top", {
      yPercent: -100,
      duration: 0.6,
      ease: "power4.inOut",
    }, 0.3);
    exitTl.to(".loader-panel-bottom", {
      yPercent: 100,
      duration: 0.6,
      ease: "power4.inOut",
    }, 0.3);

    // Scale root for zoom-out depth split feel
    exitTl.fromTo(".loader-root",
      { scale: 1 },
      { scale: 1.15, duration: 0.6, ease: "power4.inOut" },
      0.3
    );

    // Early trigger for Hero and Navbar (starts at 0.6s, which is 0.3s before panels finish)
    exitTl.call(() => {
      onHeroTrigger?.();
    }, [], 0.6);

    // Loader Unmounted
    exitTl.set(".loader-root", { display: "none" }, 0.9);
  }, [onHeroTrigger, onLoaderComplete, lenis]);

  useEffect(() => {
    if (!showEnter) return;

    const handleKeyDown = () => {
      handleEnter();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showEnter, handleEnter]);

  useEffect(() => {
    if (showEnter) {
      gsap.to(".loader-progress-wrap", {
        opacity: 0,
        y: -10,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(".loader-progress-wrap", { display: "none" });
        }
      });
      gsap.fromTo(".loader-enter-wrap",
        { opacity: 0, y: 10, display: "flex" },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [showEnter]);

  useEffect(() => {
    lenis?.stop();
    document.body.style.overflow = "hidden";

    // ── BACKGROUND AMBIENT MOTION ──
    gsap.fromTo(".loader-glow-1",
      { x: "-10vw", y: "-10vh" },
      { x: "30vw", y: "20vh", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" }
    );
    gsap.fromTo(".loader-glow-2",
      { x: "50vw", y: "60vh" },
      { x: "10vw", y: "15vh", duration: 22, repeat: -1, yoyo: true, ease: "sine.inOut" }
    );

    const loadTl = gsap.timeline({
      onComplete: () => {
        setShowEnter(true);
      }
    });

    // ── STAGE 1: "MANAN" Clip-Path Staggered Reveal (0.1s - 0.7s) ──
    loadTl.fromTo(".loader-char",
      {
        yPercent: 110,
        clipPath: "inset(0 0 100% 0)",
      },
      {
        yPercent: 0,
        clipPath: "inset(0 0 0% 0)",
        duration: 0.4,
        stagger: 0.05,
        ease: "power4.out",
      },
      0.1
    );

    // Trigger CSS breathing exactly at 0.7s when letters are fully revealed
    loadTl.call(() => setStartBreathe(true), [], 0.7);

    // Tagline cycling
    loadTl.call(() => setTagline("INITIALIZING..."), [], 0.1);
    loadTl.call(() => setTagline("LOADING THE ARSENAL..."), [], 0.7);
    loadTl.call(() => setTagline("ALMOST THERE..."), [], 1.4);

    // ── STAGE 2: Progress Segments & Ascending Pitch Ticks (0.7s - 2.0s) ──
    // 5 segments of 0.26s each (total 1.3 seconds of filling)
    loadTl.to(".loader-segment-0", { width: "100%", duration: 0.26, ease: "power1.inOut" }, 0.70)
      .call(() => soundLoaderTick(400), [], 0.96);

    loadTl.to(".loader-segment-1", { width: "100%", duration: 0.26, ease: "power1.inOut" }, 0.96)
      .call(() => soundLoaderTick(450), [], 1.22);

    loadTl.to(".loader-segment-2", { width: "100%", duration: 0.26, ease: "power1.inOut" }, 1.22)
      .call(() => soundLoaderTick(500), [], 1.48);

    loadTl.to(".loader-segment-3", { width: "100%", duration: 0.26, ease: "power1.inOut" }, 1.48)
      .call(() => soundLoaderTick(550), [], 1.74);

    loadTl.to(".loader-segment-4", { width: "100%", duration: 0.26, ease: "power1.inOut" }, 1.74)
      .call(() => soundLoaderTick(600), [], 2.00);

    // Sync percentage count up over 0.7s to 2.0s
    loadTl.to({}, {
      duration: 1.3,
      onUpdate: function () {
        const progress = Math.round(this.progress() * 100);
        const el = document.querySelector(".loader-percent");
        if (el) el.textContent = String(progress).padStart(2, "0");
      }
    }, 0.7);

    return () => {
      loadTl.kill();
      lenis?.start();
      document.body.style.overflow = "auto";
    };
  }, [lenis]);

  return (
    <div 
      ref={containerRef}
      className="loader-root fixed inset-0 z-[200] overflow-hidden select-none cursor-none bg-[#0A0A0A]"
      style={{ willChange: "transform" }}
    >
      {/* Background Soft Glow Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 z-0">
        <div 
          className="loader-glow-1 absolute w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.04)_0%,rgba(0,0,0,0)_70%)] blur-[50px]"
          style={{ top: "-10%", left: "-10%" }}
        />
        <div 
          className="loader-glow-2 absolute w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.04)_0%,rgba(0,0,0,0)_70%)] blur-[50px]"
          style={{ bottom: "-10%", right: "-10%" }}
        />
      </div>

      {/* Top and Bottom Black Transition Panels */}
      <div 
        className="loader-panel-top absolute top-0 left-0 right-0 h-1/2 bg-[#0A0A0A] z-10"
        style={{ transform: "translate3d(0, 0%, 0)", willChange: "transform" }}
      />
      <div 
        className="loader-panel-bottom absolute bottom-0 left-0 right-0 h-1/2 bg-[#0A0A0A] z-10"
        style={{ transform: "translate3d(0, 0%, 0)", willChange: "transform" }}
      />

      {/* Center content */}
      <div className="loader-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center w-full max-w-full px-6 pointer-events-none">
        
        {/* Animated Wordmark: MANAN */}
        <div 
          className="loader-logo font-heading font-extrabold text-[#F2F0EB] tracking-[0.03em] select-none leading-none flex flex-row flex-nowrap justify-center whitespace-nowrap"
          style={{ fontSize: "clamp(55px, 16vw, 180px)" }}
        >
          {["M", "A", "N", "A", "N"].map((char, i) => (
            <span key={i} className={`inline-block overflow-hidden relative loader-char-wrap ${startBreathe ? "breathe" : ""}`}>
              <span className="loader-char inline-block" style={{ willChange: "transform" }}>
                {char}
              </span>
            </span>
          ))}
        </div>

        {/* Below the Wordmark: Tagline, Progress Bar & Enter Button */}
        <div className="flex flex-col items-center mt-8 md:mt-12">
          {/* Tagline */}
          <span className="font-mono text-[14px] md:text-[18px] text-[#6B6B6B] tracking-[0.2em] uppercase text-center select-none mb-4">
            {tagline}
          </span>

          <div className="loader-progress-wrap flex flex-col items-center">
            {/* Sequential Progress Segments (5 blocks) */}
            <div className="flex gap-3 justify-center mt-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-[6px] md:w-16 md:h-[8px] bg-[#F2F0EB]/10 rounded-sm overflow-hidden relative">
                  <div 
                    className={`loader-segment-${i} absolute top-0 left-0 h-full bg-[#D4A853] w-0`}
                  />
                </div>
              ))}
            </div>

            {/* Synced Percent Counter */}
            <span className="loader-percent mt-6 font-mono text-[13px] md:text-[16px] text-[#6B6B6B] text-center tracking-[0.15em] select-none">
              00
            </span>
          </div>

          {/* Loader Enter Button (Fades in when progress completes) */}
          <div className="loader-enter-wrap hidden flex-col items-center mt-6">
            <button
              onClick={handleEnter}
              className="px-10 py-4 rounded-full border border-[#F2F0EB]/30 hover:border-[#F2F0EB] text-[#F2F0EB] font-mono text-[15px] md:text-[18px] tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#F2F0EB] hover:text-[#0A0A0A] pointer-events-auto"
            >
              ENTER
            </button>
            {isLaptop && (
              <span className="mt-4 font-mono text-[11px] md:text-[13px] text-[#6B6B6B] tracking-[0.2em] uppercase animate-pulse select-none">
                OR PRESS ANY KEY TO ENTER
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
