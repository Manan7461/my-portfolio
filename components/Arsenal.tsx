"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { soundNavHover, soundSectionEnter } from "@/lib/sound";

interface TechItem {
  name: string;
  slug: string;
  note?: string;
}

interface TechCategory {
  category: string;
  items: TechItem[];
}

const arsenalData: TechCategory[] = [
  {
    category: "Languages",
    items: [
      { name: "HTML5", slug: "html5", note: "semantic markup" },
      { name: "CSS3", slug: "css3", note: "animations · layouts" },
      { name: "JavaScript", slug: "javascript", note: "ES6+" },
      { name: "Python", slug: "python", note: "scripting · AI tools" }
    ]
  },
  {
    category: "Design & UI",
    items: [
      { name: "Figma", slug: "figma", note: "UI/UX · prototyping" },
      { name: "Adobe XD", slug: "adobexd" },
      { name: "Photoshop", slug: "adobephotoshop" },
      { name: "Illustrator", slug: "adobeillustrator" },
      { name: "After Effects", slug: "adobeaftereffects", note: "motion design" }
    ]
  },
  {
    category: "Frontend",
    items: [
      { name: "React", slug: "react", note: "component-driven" },
      { name: "Next.js", slug: "nextdotjs", note: "App Router" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
      { name: "GSAP", slug: "greensock", note: "animations" },
      { name: "Framer Motion", slug: "framermotion" }
    ]
  },
  {
    category: "Backend & Tools",
    items: [
      { name: "Node.js", slug: "nodedotjs" },
      { name: "Git / GitHub", slug: "git" },
      { name: "VS Code", slug: "visualstudiocode" },
      { name: "Vercel", slug: "vercel", note: "deployment" },
      { name: "Figma Dev Mode", slug: "figma" }
    ]
  },
  {
    category: "AI & Productivity",
    items: [
      { name: "Claude AI", slug: "claude", note: "engineering partner" },
      { name: "ChatGPT", slug: "openai", note: "ideation" },
      { name: "Cursor", slug: "cursor", note: "AI-assisted coding" },
      { name: "Midjourney", slug: "midjourney", note: "visual concepts" },
      { name: "Notion AI", slug: "notion" }
    ]
  }
];

const LOCAL_ICONS: Record<string, string> = {
  css3: "/icons/css3.svg",
  adobexd: "/icons/adobexd.svg",
  adobephotoshop: "/icons/adobephotoshop.svg",
  adobeillustrator: "/icons/adobeillustrator.svg",
  adobeaftereffects: "/icons/adobeaftereffects.svg",
  visualstudiocode: "/icons/visualstudiocode.svg",
  openai: "/icons/openai.svg",
  midjourney: "/icons/midjourney.svg",
};

function TechIcon({ item }: { item: TechItem }) {
  const [error, setError] = useState(false);

  // Map slugs dynamically if needed (e.g. framer-motion to framer)
  let slug = item.slug;
  if (slug === "framermotion") {
    slug = "framer";
  }

  // Load colored Simple Icons using local storage or brand CDN
  const src = LOCAL_ICONS[slug] || `https://cdn.simpleicons.org/${slug}`;

  return (
    <div
      onMouseEnter={() => soundNavHover()}
      className="tech-item flex flex-col items-center justify-start p-4 group cursor-none text-center select-none w-full"
    >
      {/* Icon Frame */}
      <div className="w-12 h-12 flex items-center justify-center relative mb-3">
        {!error ? (
          <img
            src={src}
            alt={item.name}
            onError={() => setError(true)}
            className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110 opacity-85 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 border border-borderCustom rounded-custom bg-background flex items-center justify-center font-mono text-[11px] font-bold text-muted transition-transform duration-300 group-hover:scale-110">
            {item.name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Tech Name */}
      <span className="font-sans text-[13px] font-semibold text-primary transition-colors duration-200 group-hover:text-accent select-text">
        {item.name}
      </span>

      {/* Tech Note */}
      {item.note && (
        <span className="font-sans text-[11px] text-muted italic mt-1 leading-normal select-text">
          ({item.note})
        </span>
      )}
    </div>
  );
}

export default function Arsenal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top 75%",
        onEnter: () => soundSectionEnter(),
        once: true,
      });

      const rows = gsap.utils.toArray<HTMLElement>(".category-row");
      rows.forEach((row) => {
        const items = row.querySelectorAll(".tech-item");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none none",
          }
        });

        tl.fromTo(
          row,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power2.out" }
        ).fromTo(
          items,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" },
          "-=0.3"
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="arsenal"
      className="w-full bg-background px-[6vw] py-20 md:py-32 flex flex-col items-start relative select-none"
    >
      {/* Label and Headings */}
      <div className="w-full mb-16 flex flex-col items-start gap-2">
        <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.15em] uppercase">
          06 · THE ARSENAL.
        </span>
        <h2
          className="font-serif font-bold text-primary select-text leading-tight"
          style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
        >
          The arsenal.
        </h2>
        <p className="font-sans text-[17px] text-muted mt-2 select-text">
          Profiled under pressure. Not just installed.
        </p>
      </div>

      {/* Two-Column Ashwin Gupta Stack Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[30%_70%] gap-12 lg:gap-0 items-start">
        {/* Left Column (Sticky on Desktop) */}
        <div className="w-full lg:sticky lg:top-28 flex flex-col items-start z-10 pr-0 lg:pr-8">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-widest uppercase mb-2">
            Arsenal
          </span>
          <span className="font-serif text-[36px] font-bold text-primary leading-tight select-text mb-4">
            Tech Stack
          </span>
          <p className="font-sans text-[14px] text-muted leading-relaxed select-text">
            A hand-picked collection of languages, libraries, and tools I use to design, build, and optimize high-end applications.
          </p>
        </div>

        {/* Right Column (Category Rows) */}
        <div className="w-full flex flex-col gap-0 select-text">
          {arsenalData.map((cat, idx) => (
            <div
              key={idx}
              className="category-row pt-8 pb-10 border-t border-borderCustom flex flex-col md:flex-row gap-6 md:gap-12 w-full"
            >
              {/* Category Label */}
              <div className="row-label w-full md:w-32 flex-shrink-0 font-mono text-[11px] text-accent font-bold tracking-[0.18em] uppercase text-left pt-2">
                {cat.category}
              </div>

              {/* Grid of Tech Items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 flex-grow">
                {cat.items.map((item, itemIdx) => (
                  <TechIcon key={itemIdx} item={item} />
                ))}
              </div>
            </div>
          ))}
          {/* Bottom border to close the stack */}
          <div className="w-full h-[1px] bg-borderCustom" />
        </div>
      </div>
    </section>
  );
}
