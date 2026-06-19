"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { soundBtnHover, soundClick, soundFormSubmit } from "@/lib/sound";

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const budgetRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Form State Lifecycle
  type FormStatus = "idle" | "sending" | "success";
  const [status, setStatus] = useState<FormStatus>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  const [budgetOpen, setBudgetOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  // Dropdown Options
  const budgetOptions = [
    "Under ₹10,000  — Small project",
    "₹10k – ₹30k   — Mid-size project",
    "₹30k – ₹75k   — Large project",
    "₹75k+         — Enterprise / Ongoing",
    "Let's discuss — Custom scope"
  ];

  const serviceOptions = [
    "Web Engineering",
    "Interface Design (UI/UX)",
    "Digital Experience Design",
    "Visual Identity & Graphics",
    "Growth & Digital Presence",
    "Not sure yet — let's talk"
  ];

  // Outside click handler to close dropdown panels
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!budgetRef.current?.contains(e.target as Node)) {
        setBudgetOpen(false);
      }
      if (!serviceRef.current?.contains(e.target as Node)) {
        setServiceOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // GSAP ScrollTrigger & Marquee Animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let marqueeTween: gsap.core.Tween;

    const ctx = gsap.context(() => {
      // Left column slides in from left
      gsap.fromTo(
        leftColRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Right column (form) slides in from right
      gsap.fromTo(
        rightColRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Infinite smooth Marquee scrolling via GSAP
      const marqueeTrack = marqueeRef.current;
      if (marqueeTrack) {
        marqueeTween = gsap.to(marqueeTrack, {
          xPercent: -50,
          ease: "none",
          duration: 60,
          repeat: -1,
        });
      }
    }, section);

    const marqueeTrack = marqueeRef.current;
    const onMouseEnter = () => {
      if (marqueeTween) {
        gsap.to(marqueeTween, { timeScale: 0.2, duration: 0.6, ease: "power1.out" });
      }
    };

    const onMouseLeave = () => {
      if (marqueeTween) {
        gsap.to(marqueeTween, { timeScale: 1.0, duration: 0.6, ease: "power1.out" });
      }
    };

    if (marqueeTrack) {
      marqueeTrack.addEventListener("mouseenter", onMouseEnter);
      marqueeTrack.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      ctx.revert();
      if (marqueeTrack) {
        marqueeTrack.removeEventListener("mouseenter", onMouseEnter);
        marqueeTrack.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, []);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please fill in your name and email address.");
      return;
    }
    
    setStatus("sending");

    const formspreeKey = process.env.NEXT_PUBLIC_FORMSPREE_KEY;
    if (!formspreeKey) {
      // Fallback message if env key is not configured yet
      alert("Formspree key is not configured. Please add NEXT_PUBLIC_FORMSPREE_KEY to your .env.local file.");
      setStatus("idle");
      return;
    }
    
    try {
      const response = await fetch(`https://formspree.io/f/${formspreeKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          budget,
          service,
          message
        })
      });

      if (response.ok) {
        setStatus("success");
        soundFormSubmit();
      } else {
        const data = await response.json();
        alert(data.errors ? data.errors.map((err: { message: string }) => err.message).join(", ") : "Something went wrong. Please try again.");
        setStatus("idle");
      }
    } catch {
      alert("Network error. Please check your internet connection and try again.");
      setStatus("idle");
    }
  };

  // Reset form to idle/empty state
  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setBudget("");
    setService("");
    setMessage("");
    setStatus("idle");
  };

  // Repeatable marquee phrases
  const marqueePhrase = (
    <div className="flex items-center whitespace-nowrap">
      {[...Array(6)].map((_, i) => (
        <span key={i} className="flex items-center">
          <span className="mx-8">LET&apos;S COLLIDE</span>
          <span className="text-[#D4A853]">✦</span>
          <span className="mx-8">THINK. BUILD. OPTIMIZE.</span>
          <span className="text-[#D4A853]">✦</span>
          <span className="mx-8">AVAILABLE FOR WORK</span>
          <span className="text-[#D4A853]">✦</span>
          <span className="mx-8">GET IN TOUCH</span>
          <span className="text-[#D4A853]">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div id="contact" className="relative w-full overflow-hidden bg-background">
      {/* CSS Styles for chevrons, checkmark drawing */}
      <style>{`
        .marquee-track {
          display: flex;
          width: max-content;
        }
        .marquee-wrap {
          overflow: hidden;
          background: #0A0A0A;
          height: 80px;
          display: flex;
          align-items: center;
        }
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
        .checkmark-path {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: drawCheck 0.5s ease-out forwards;
          animation-delay: 0.2s;
        }
      `}</style>

      {/* PART 1 — MARQUEE TICKER BANNER */}
      <div className="marquee-wrap select-none pointer-events-auto border-y border-borderCustom/20">
        <div 
          ref={marqueeRef}
          className="marquee-track font-heading font-extrabold uppercase text-[#F3F1EB] text-[28px] sm:text-[36px] lg:text-[48px]"
        >
          {marqueePhrase}
          {marqueePhrase}
        </div>
      </div>

      {/* PART 2 — MAIN CONTACT SECTION */}
      <section
        ref={sectionRef}
        className="relative px-[6vw] pt-20 pb-16 select-none bg-background"
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #B8B4AC 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.15,
          }}
        />

        {/* Section Label */}
        <div className="w-full flex flex-col items-start gap-2 z-10 relative mb-16">
          <span className="font-mono text-[11px] text-accent font-semibold tracking-[0.18em] uppercase">
            07 · LET&apos;S COLLIDE.
          </span>
        </div>

        {/* Two-Column Layout (stacked on mobile, 50/50 split on desktop) */}
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 w-full z-10 relative mb-20">
          
          {/* LEFT COLUMN: Header + Description + Socials */}
          <div
            ref={leftColRef}
            className="flex-1 flex flex-col items-start max-w-xl"
          >
            <h2 className="font-heading font-black leading-[0.95] text-[#0A0A0A] text-[36px] sm:text-[48px] lg:text-[68px] select-text">
              Let&apos;s build<br />
              something<br />
              real.
            </h2>
            
            <p className="mt-6 font-sans text-[16px] leading-[1.7] text-[#6B6B6B] select-text max-w-md">
              Whether it&apos;s a product, a brand, or an idea that needs a digital form — I&apos;m here for it. Drop your details and I&apos;ll get back within 24 hours.
            </p>

            {/* Social Links Row */}
            <div className="flex flex-wrap items-center gap-6 mt-10 w-full">
              {[
                {
                  name: "GitHub",
                  handle: "github.com/Manan7461",
                  url: "https://github.com/Manan7461",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  ),
                },
                {
                  name: "LinkedIn",
                  handle: "linkedin.com/in/mananprajapati",
                  url: "https://www.linkedin.com/in/mananprajapati/",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  handle: "@_manan001",
                  url: "https://www.instagram.com/_manan001",
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => soundBtnHover()}
                  onClick={() => soundClick()}
                  className="flex items-center gap-2.5 font-sans text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-250 cursor-none relative group pb-1"
                >
                  <span className="text-[#6B6B6B] group-hover:text-[#0A0A0A] transition-colors duration-250">
                    {social.icon}
                  </span>
                  <span>{social.handle}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#0A0A0A] scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </a>
              ))}
            </div>

            {/* Email Address */}
            <div className="mt-8 select-text">
              <a
                href="mailto:work.manan5371@gmail.com"
                onMouseEnter={() => soundBtnHover()}
                onClick={() => soundClick()}
                className="font-mono text-[13px] text-[#0A0A0A] hover:text-[#D4A853] transition-colors duration-200 cursor-none pb-0.5 border-b border-transparent hover:border-[#D4A853]"
              >
                work.manan5371@gmail.com
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form / Success Message */}
          <div
            ref={rightColRef}
            className="flex-1 w-full max-w-xl relative min-h-[520px]"
          >
            {/* FORM VIEW */}
            <form
              onSubmit={handleSubmit}
              className={`transition-all duration-400 transform flex flex-col gap-6 ${
                status === "success"
                  ? "opacity-0 -translate-y-5 pointer-events-none absolute w-full"
                  : "opacity-100 translate-y-0 relative"
              }`}
            >
              {/* [1] Name field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] text-accent font-semibold tracking-wider uppercase">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., John Doe"
                  required
                  disabled={status === "sending"}
                  className="w-full bg-transparent border-b border-[#E0DDD6] focus:border-[#0A0A0A] font-sans text-[16px] text-[#0A0A0A] py-3 placeholder-[#6B6B6B]/50 transition-colors duration-200 outline-none rounded-none shadow-none"
                />
              </div>

              {/* [2] Email field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] text-accent font-semibold tracking-wider uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@yourcompany.com"
                  required
                  disabled={status === "sending"}
                  className="w-full bg-transparent border-b border-[#E0DDD6] focus:border-[#0A0A0A] font-sans text-[16px] text-[#0A0A0A] py-3 placeholder-[#6B6B6B]/50 transition-colors duration-200 outline-none rounded-none shadow-none"
                />
              </div>

              {/* [2.5] Phone Number field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] text-accent font-semibold tracking-wider uppercase">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99999 99999"
                  disabled={status === "sending"}
                  className="w-full bg-transparent border-b border-[#E0DDD6] focus:border-[#0A0A0A] font-sans text-[16px] text-[#0A0A0A] py-3 placeholder-[#6B6B6B]/50 transition-colors duration-200 outline-none rounded-none shadow-none"
                />
              </div>

              {/* [3] Project Budget Dropdown */}
              <div ref={budgetRef} className="flex flex-col gap-1.5 relative">
                <label className="font-mono text-[11px] text-accent font-semibold tracking-wider uppercase">
                  Project Budget
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (status !== "sending") {
                      setBudgetOpen(!budgetOpen);
                      setServiceOpen(false);
                      soundClick();
                    }
                  }}
                  className={`w-full bg-transparent border-b text-left py-3 flex justify-between items-center font-sans text-[16px] transition-colors duration-200 outline-none cursor-none ${
                    budgetOpen ? "border-[#0A0A0A]" : "border-[#E0DDD6]"
                  } ${budget ? "text-[#0A0A0A]" : "text-[#6B6B6B]"}`}
                >
                  <span>{budget || "Select project budget"}</span>
                  <svg
                    className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-300 ${
                      budgetOpen ? "rotate-180 text-[#0A0A0A]" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Options Panel */}
                {budgetOpen && (
                  <div className="absolute top-full left-0 w-full mt-1.5 bg-[#F3F1EB] border border-[#E0DDD6] rounded-lg py-2 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                    {budgetOptions.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setBudget(option);
                          setBudgetOpen(false);
                          soundClick();
                        }}
                        className="w-full text-left px-5 py-3 font-sans text-[14px] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F3F1EB] transition-colors duration-150 flex justify-between items-center cursor-none"
                      >
                        <span>{option}</span>
                        {budget === option && (
                          <span className="text-[#D4A853] font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* [4] Service Needed Dropdown */}
              <div ref={serviceRef} className="flex flex-col gap-1.5 relative">
                <label className="font-mono text-[11px] text-accent font-semibold tracking-wider uppercase">
                  Service Required
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (status !== "sending") {
                      setServiceOpen(!serviceOpen);
                      setBudgetOpen(false);
                      soundClick();
                    }
                  }}
                  className={`w-full bg-transparent border-b text-left py-3 flex justify-between items-center font-sans text-[16px] transition-colors duration-200 outline-none cursor-none ${
                    serviceOpen ? "border-[#0A0A0A]" : "border-[#E0DDD6]"
                  } ${service ? "text-[#0A0A0A]" : "text-[#6B6B6B]"}`}
                >
                  <span>{service || "Select service required"}</span>
                  <svg
                    className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-300 ${
                      serviceOpen ? "rotate-180 text-[#0A0A0A]" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Options Panel */}
                {serviceOpen && (
                  <div className="absolute top-full left-0 w-full mt-1.5 bg-[#F3F1EB] border border-[#E0DDD6] rounded-lg py-2 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                    {serviceOptions.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setService(option);
                          setServiceOpen(false);
                          soundClick();
                        }}
                        className="w-full text-left px-5 py-3 font-sans text-[14px] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F3F1EB] transition-colors duration-150 flex justify-between items-center cursor-none"
                      >
                        <span>{option}</span>
                        {service === option && (
                          <span className="text-[#D4A853] font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* [5] Message field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] text-accent font-semibold tracking-wider uppercase">
                  Tell me about your project
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project, timeline, and any references..."
                  disabled={status === "sending"}
                  className="w-full bg-transparent border-b border-[#E0DDD6] focus:border-[#0A0A0A] font-sans text-[16px] text-[#0A0A0A] py-3 placeholder-[#6B6B6B]/50 transition-colors duration-200 outline-none rounded-none shadow-none min-h-[100px] resize-none"
                />
              </div>

              {/* [6] Submit button */}
              <button
                type="submit"
                onMouseEnter={() => {
                  if (status === "idle") soundBtnHover();
                }}
                disabled={status === "sending"}
                className={`w-full h-14 bg-[#0A0A0A] text-[#F3F1EB] font-heading font-semibold text-[15px] tracking-[0.06em] rounded-md transition-all duration-300 ease-out cursor-none flex items-center justify-center ${
                  status === "sending"
                    ? "animate-pulse pointer-events-none opacity-80"
                    : "hover:bg-[#D4A853] hover:text-[#0A0A0A]"
                }`}
              >
                {status === "sending" ? "Sending..." : "Send it →"}
              </button>
            </form>

            {/* CONFIRMATION UI */}
            <div
              className={`transition-all duration-500 delay-200 transform flex flex-col items-center justify-center text-center p-8 border border-[#E0DDD6] rounded-xl bg-[#F3F1EB]/40 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)] ${
                status === "success"
                  ? "opacity-100 translate-y-0 relative"
                  : "opacity-0 translate-y-5 pointer-events-none absolute w-full"
              }`}
            >
              {/* Checkmark Circle */}
              <div className="w-16 h-16 border-2 border-[#D4A853] rounded-full flex items-center justify-center mb-6">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D4A853"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    className={status === "success" ? "checkmark-path" : ""}
                  />
                </svg>
              </div>

              {/* Success Messages */}
              <h3 className="font-heading font-bold text-[28px] text-[#0A0A0A] mb-2">
                Message received.
              </h3>
              
              <p className="font-sans text-[16px] text-[#6B6B6B] leading-relaxed mb-6 max-w-sm">
                Thanks <span className="font-semibold text-[#0A0A0A]">{name}</span> — I&apos;ll get back to you within 24 hours.
              </p>
              
              <span className="font-mono text-[11px] text-[#B5B0A6] mb-8 block">
                Sent to work.manan5371@gmail.com
              </span>

              {/* Reset Link */}
              <button
                onClick={() => {
                  handleReset();
                  soundClick();
                }}
                className="font-heading font-semibold text-[14px] text-[#0A0A0A] hover:text-[#D4A853] border-b border-[#0A0A0A] hover:border-[#D4A853] transition-colors duration-250 cursor-none pb-0.5"
              >
                Send another →
              </button>
            </div>

          </div>

        </div>

        {/* PART 4 — FOOTER */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#E0DDD6] pt-8 z-10 relative">
          <span className="font-mono text-[11px] text-[#6B6B6B] tracking-wider select-text">
            &copy; {new Date().getFullYear()} Prajapati Manan. All rights reserved.
          </span>
          <span className="font-mono text-[11px] text-[#6B6B6B] tracking-wider select-text">
            Designed &amp; built by Manan · AI-Assisted Engineer
          </span>
        </div>

      </section>
    </div>
  );
}
