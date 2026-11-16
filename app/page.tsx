"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import Hero from "@/components/Hero";
import Showreel from "@/components/Showreel";
import Manifesto from "@/components/Manifesto";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Arsenal from "@/components/Arsenal";
import Contact from "@/components/Contact";

const REVEAL_SECTIONS = ["#about", "#experience", "#services", "#work", "#arsenal"];

export default function Home() {
  // Shared, consistent reveal for every section heading + its mono label
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      REVEAL_SECTIONS.forEach((sel) => {
        const section = document.querySelector(sel);
        const heading = section?.querySelector("h2");
        if (!section || !heading) return;
        const label = heading.previousElementSibling;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: heading, start: "top 88%", once: true },
          defaults: { ease: "expo.out" },
        });

        if (label) {
          tl.fromTo(label, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 0);
        }
        tl.fromTo(
          heading,
          { yPercent: 60, opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
          {
            yPercent: 0,
            opacity: 1,
            clipPath: "inset(0% 0% -20% 0%)",
            duration: 1.3,
            clearProps: "clipPath",
          },
          0.05
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <main className="relative w-full min-h-screen bg-background">
        <Hero />
        <Showreel />
        <Manifesto />
        <About />
        <hr className="border-borderCustom border-t w-full" />
        <Experience />
        <hr className="border-borderCustom border-t w-full" />
        <Services />
        <hr className="border-borderCustom border-t w-full" />
        <Work />
        <hr className="border-borderCustom border-t w-full" />
        <Arsenal />
        <hr className="border-borderCustom border-t w-full" />
        <Contact />
      </main>
    </>
  );
}
