"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { soundBtnHover, soundClick, soundCardHover, soundSectionEnter } from "@/lib/sound";

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
        {/* Left Column - Image */}
        <div ref={leftColRef} className="opacity-0 flex flex-col items-start w-full">
          <div className="w-full aspect-[3/4] max-w-[420px] border border-primary rounded-custom overflow-hidden rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500 ease-out bg-neutral-200">
            {/* Portrait Image */}
            <img
              src="/manan_portrait.png"
              alt="Prajapati Manan Portrait"
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted tracking-wider uppercase">
            Prajapati Manan · AI-Assisted Engineer
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
