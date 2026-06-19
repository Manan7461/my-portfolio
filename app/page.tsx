"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Arsenal from "@/components/Arsenal";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <main className="relative w-full min-h-screen bg-background">
        <Hero />

        <hr className="border-borderCustom border-t w-full" />
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
