"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenisVal, setLenisVal] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Instantiate Lenis with exact settings requested
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.08,
      infinite: false,
    });

    setLenisVal(lenis);

    // Connect Lenis scroll to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP ticker with Lenis requestAnimationFrame
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // Force scroll reset immediately on route change to prevent viewport transition delays
  useEffect(() => {
    if (lenisVal) {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const target = document.querySelector(hash) as HTMLElement | null;
          if (target) {
            lenisVal.scrollTo(target, { immediate: true });
          }
        }, 50);
      } else {
        lenisVal.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname, lenisVal]);

  return (
    <LenisContext.Provider value={lenisVal}>
      {children}
    </LenisContext.Provider>
  );
}
