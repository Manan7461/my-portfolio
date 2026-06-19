"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { soundCardHover, soundClick, soundSectionEnter } from "@/lib/sound";

interface Service {
  num: string;
  title: string;
  desc: string;
  href: string;
}

const servicesData: Service[] = [
  {
    num: "01",
    title: "Web Engineering",
    desc: "Full-stack website development using modern frameworks. Clean code, fast load times, SEO-ready from day one.",
    href: "/Web-Engineering"
  },
  {
    num: "02",
    title: "Interface Design (UI/UX)",
    desc: "User interfaces that feel intuitive and look exceptional. Research-backed flows with pixel-perfect execution.",
    href: "/Interface-Design"
  },
  {
    num: "03",
    title: "Digital Experience Design",
    desc: "End-to-end web design from wireframe to final visual. Crafted for conversion, built for brand consistency.",
    href: "/Digital-Experience"
  },
  {
    num: "04",
    title: "Visual Identity & Graphics",
    desc: "Brand identity systems, marketing collateral, and graphic design that communicates instantly.",
    href: "/Visual-Identity"
  },
  {
    num: "05",
    title: "Growth & Digital Presence",
    desc: "Strategic social media content, campaign design, and digital brand positioning across platforms.",
    href: "/Growth-Digital-Presence"
  },
  {
    num: "06",
    title: "AI Integration & Agents",
    desc: "Deploying custom AI models, semantic search engines, and agentic reasoning workflows into production apps.",
    href: "/AI-Integration-Agents"
  }
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];

    const ctx = gsap.context(() => {
      // GSAP fade up + translation scroll animation
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 75%",
            toggleActions: "play none none none",
            onEnter: () => soundSectionEnter(),
          }
        }
      );
    }, container);

    // 3D tilt initialization (disabled on mobile/tablet)
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop && cards.length > 0) {
      import("vanilla-tilt").then((module) => {
        const VanillaTilt = module.default;
        cards.forEach((card) => {
          if (card) {
            VanillaTilt.init(card, {
              max: 6,
              glare: true,
              "max-glare": 0.06,
              perspective: 1200,
            });
          }
        });
      });
    }

    return () => {
      ctx.revert();
      // Cleanup tilt instances
      cards.forEach((card) => {
        const tiltCard = card as HTMLAnchorElement & { vanillaTilt?: { destroy: () => void } };
        if (tiltCard && tiltCard.vanillaTilt) {
          tiltCard.vanillaTilt.destroy();
        }
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="services"
      className="w-full bg-background px-[6vw] py-20 md:py-32 flex flex-col items-start relative select-none"
    >
      {/* Label and Headings */}
      <div className="w-full mb-16 flex flex-col items-start gap-2">
        <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">
          04 · WHAT I BUILD.
        </span>
        <h2
          className="font-serif font-bold text-primary select-text leading-tight"
          style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
        >
          What I build.
        </h2>
        <p className="font-sans text-[17px] text-muted mt-2 select-text">
          From pixel to production. From idea to impact.
        </p>
      </div>

      {/* Services Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service, idx) => (
          <Link
            key={idx}
            href={service.href}
            scroll={false}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            onMouseEnter={() => soundCardHover()}
            onClick={() => soundClick()}
            className="group card flex flex-col items-start p-8 bg-background border border-borderCustom rounded-custom service-card-transition select-text cursor-none hover:border-primary w-full transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Top Number */}
            <span
              className="font-mono text-[48px] font-bold text-[#E8E5DF] leading-none transition-colors duration-300 group-hover:text-accent select-none"
              style={{ transform: "translateZ(30px)" }}
            >
              {service.num}
            </span>

            {/* Service Name */}
            <h3
              className="font-serif text-[22px] font-bold text-primary mt-4 leading-tight select-text"
              style={{ transform: "translateZ(40px)" }}
            >
              {service.title}
            </h3>

            {/* Service Description */}
            <p
              className="font-sans text-[14px] text-muted leading-[1.7] mt-3 mb-8 select-text"
              style={{ transform: "translateZ(20px)" }}
            >
              {service.desc}
            </p>

            {/* Arrow Button */}
            <div
              className="mt-auto font-sans text-[20px] text-primary transition-transform duration-300 group-hover:translate-x-2 select-none"
              style={{ transform: "translateZ(50px)" }}
            >
              →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
