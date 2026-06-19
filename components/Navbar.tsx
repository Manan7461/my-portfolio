"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { soundNavHover, soundBtnHover, soundClick } from "@/lib/sound";
import { useLoader } from "@/components/LoaderContext";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/LenisProvider";

const navLinks = [
  { label: "The Human.",      href: "/#about"      },
  { label: "The Trajectory.", href: "/#experience"  },
  { label: "What I Build.",   href: "/#services"    },
  { label: "The Proof.",      href: "/#work"        },
  { label: "The Arsenal.",    href: "/#arsenal"     },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const prevIndexRef = useRef(0);
  const isScrollingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);

  const { startAnimation } = useLoader();
  const pathname = usePathname();
  const lenis = useLenis();

  // Animate in when loader triggers hero/navbar sequence
  useEffect(() => {
    if (!startAnimation) return;
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, [startAnimation]);

  // Border appears on scroll + scroll-to-top detection
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (isScrollingRef.current) return;
      if (window.scrollY < 50) {
        setActiveIndex(-1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection Observer (Scroll Spy) to automatically update active link
  useEffect(() => {
    if (pathname !== "/") {
      setActiveIndex(-1);
      return;
    }

    const sections = [
      document.getElementById("hero"),
      ...navLinks.map((link) => {
        const id = link.href.replace("/#", "");
        return document.getElementById(id);
      })
    ].filter(Boolean) as HTMLElement[];

    sectionsRef.current = sections;

    const observerOptions = {
      root: null,
      rootMargin: "-35% 0px -55% 0px", // Triggers when section occupies viewport center
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (isScrollingRef.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === "hero") {
            setActiveIndex(-1);
          } else {
            const idx = navLinks.findIndex((link) => link.href.endsWith(id));
            if (idx !== -1) {
              setActiveIndex(idx);
            }
          }
        }
      });
    }, observerOptions);

    observerRef.current = observer;

    sections.forEach((sec) => {
      if (sec) observer.observe(sec);
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [pathname]);

  // Springy sliding background animation + Squash & Stretch + Cutout Positioning
  useEffect(() => {
    const activeEl = linkRefs.current[activeIndex];
    const indicator = indicatorRef.current;
    if (activeEl && indicator) {
      const parentLi = activeEl.parentElement;
      if (parentLi) {
        // Ensure the indicator is visible
        gsap.to(indicator, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });

        const updatePosition = () => {
          const targetLeft = parentLi.offsetLeft;
          const targetWidth = parentLi.offsetWidth;
          const targetHeight = parentLi.offsetHeight;
          const targetTop = parentLi.offsetTop;

          // Animate background container using local offsets (immune to scaling/transforms)
          gsap.to(indicator, {
            left: targetLeft,
            width: targetWidth,
            height: targetHeight,
            top: targetTop,
            duration: 0.55,
            ease: "elastic.out(1.05, 0.75)",
            overwrite: "auto",
          });
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);

        // Squash and stretch timeline on the inner element for a liquid sliding feel
        const prevIndex = prevIndexRef.current;
        const direction = activeIndex > prevIndex ? 1 : -1;
        prevIndexRef.current = activeIndex;

        const innerEl = innerRef.current;
        if (innerEl && prevIndex !== activeIndex) {
          gsap.timeline()
            .to(innerEl, {
              scaleX: 1.25,
              scaleY: 0.8,
              skewX: direction * 8,
              duration: 0.15,
              ease: "power2.out",
            })
            .to(innerEl, {
              scaleX: 0.9,
              scaleY: 1.1,
              skewX: -direction * 3,
              duration: 0.15,
              ease: "power2.inOut",
            })
            .to(innerEl, {
              scaleX: 1,
              scaleY: 1,
              skewX: 0,
              duration: 0.4,
              ease: "elastic.out(1.1, 0.6)",
            });
        }

        return () => window.removeEventListener("resize", updatePosition);
      }
    } else if (indicator) {
      // Hide the indicator when in the Hero section (activeIndex === -1)
      gsap.to(indicator, {
        opacity: 0,
        scale: 0.8,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [activeIndex]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, idx: number) => {
    soundClick();
    
    const targetId = href.replace("/#", "");
    const targetEl = document.getElementById(targetId);
    
    if (pathname === "/" && targetEl && lenis) {
      e.preventDefault();
      
      // Temporarily disconnect observer to prevent queueing intermediate intersection events
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      isScrollingRef.current = true;
      setActiveIndex(idx);
      
      lenis.scrollTo(targetEl, {
        duration: 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 4), // ease-out quart
        onComplete: () => {
          isScrollingRef.current = false;
          // Re-observe elements now that we've arrived at the destination section
          if (observerRef.current && sectionsRef.current.length > 0) {
            sectionsRef.current.forEach((sec) => {
              observerRef.current?.observe(sec);
            });
          }
        }
      });
    } else {
      setActiveIndex(idx);
    }
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    soundClick();
    const contactEl = document.getElementById("contact");
    if (pathname === "/" && contactEl && lenis) {
      e.preventDefault();
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      isScrollingRef.current = true;
      setActiveIndex(-1);
      
      lenis.scrollTo(contactEl, {
        duration: 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 4), // ease-out quart
        onComplete: () => {
          isScrollingRef.current = false;
          if (observerRef.current && sectionsRef.current.length > 0) {
            sectionsRef.current.forEach((sec) => {
              observerRef.current?.observe(sec);
            });
          }
        }
      });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{ transform: "translate3d(0, -20px, 0)", opacity: 0 }}
        className={`fixed top-4 left-0 right-0 mx-auto z-50 flex items-center 
          justify-between w-[90%] max-w-5xl px-6 py-2.5 rounded-full transition-[background-color,border-color,box-shadow] duration-300
          ${mobileMenuOpen
            ? "bg-transparent border border-transparent shadow-none"
            : scrolled
              ? "border border-[#E0DDD6] bg-[#F3F1EB]/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
              : "bg-transparent border border-transparent"
          }`}
      >
        {/* Logo: Manan in Cabinet Grotesk 700 */}
        <Link
          href="/"
          scroll={false}
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              if (observerRef.current) {
                observerRef.current.disconnect();
              }
              isScrollingRef.current = true;
              setActiveIndex(-1);
              soundClick();
              if (lenis) {
                lenis.scrollTo(0, {
                  duration: 1.4,
                  easing: (t: number) => 1 - Math.pow(1 - t, 4), // ease-out quart
                  onComplete: () => {
                    isScrollingRef.current = false;
                    if (observerRef.current && sectionsRef.current.length > 0) {
                      sectionsRef.current.forEach((sec) => {
                        observerRef.current?.observe(sec);
                      });
                    }
                  }
                });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => {
                  isScrollingRef.current = false;
                  if (observerRef.current && sectionsRef.current.length > 0) {
                    sectionsRef.current.forEach((sec) => {
                      observerRef.current?.observe(sec);
                    });
                  }
                }, 800);
              }
            } else {
              soundClick();
            }
          }}
          className="font-heading font-bold text-[15px] tracking-[0.08em] 
            text-[#0A0A0A] uppercase cursor-none hover:text-[#D4A853] transition-colors duration-200 z-50 relative ml-2"
        >
          Manan
        </Link>

        {/* Nav Links — Desktop Pill Container */}
        <ul className="hidden md:flex items-center gap-1.5 relative m-0 p-1 rounded-full z-15">
          {/* Elastic sliding indicator */}
          <span
            ref={indicatorRef}
            className="absolute z-10 pointer-events-none"
            style={{
              top: 0,
              left: 0,
              width: 0,
              height: 0,
            }}
          >
            {/* Inner wrapper for squash & stretch */}
            <span
              ref={innerRef}
              className="absolute inset-0 block origin-center"
            >
              {/* Active black pill */}
              <span className="absolute inset-0 bg-[#0A0A0A] rounded-full pointer-events-none" />
            </span>
          </span>

          {navLinks.map((link, idx) => (
            <li key={link.href} className="relative">
              <Link
                ref={(el) => {
                  linkRefs.current[idx] = el;
                }}
                href={link.href}
                scroll={false}
                onMouseEnter={() => soundNavHover()}
                onClick={(e) => handleLinkClick(e, link.href, idx)}
                className={`font-heading font-medium text-[13px] tracking-[0.04em]
                  px-5 py-2.5 rounded-full transition-colors duration-300 cursor-none block relative z-20 ${
                    activeIndex === idx ? "text-[#F3F1EB]" : "text-[#6B6B6B] hover:text-[#0A0A0A]"
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Controls Container (Desktop CTA) */}
        <div className="hidden md:flex items-center gap-6 mr-2">
          {/* CTA Button — Cabinet Grotesk 500 */}
          <Link
            href="/#contact"
            scroll={false}
            onClick={handleContactClick}
            onMouseEnter={() => soundBtnHover()}
            className="flex items-center gap-2 
              border border-[#0A0A0A] rounded-full 
              px-5 py-2 font-heading font-medium text-[13px] tracking-[0.04em] text-[#0A0A0A]
              hover:bg-[#0A0A0A] hover:text-[#F3F1EB] 
              transition-all duration-300 cursor-none"
          >
            Let&apos;s Collide
            <span className="text-[16px]">→</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            soundClick();
          }}
          className="md:hidden flex flex-col gap-[5px] p-2 cursor-none z-50 relative"
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-[1.5px] bg-[#0A0A0A] block transition-transform duration-300 origin-center ${mobileMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`w-5 h-[1.5px] bg-[#0A0A0A] block transition-transform duration-300 origin-center ${mobileMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#F3F1EB] z-40 flex flex-col justify-center px-[6vw] py-24 gap-8 overflow-y-auto">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  scroll={false}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    soundClick();
                  }}
                  className="font-heading font-bold text-[32px] text-[#0A0A0A] hover:text-[#D4A853] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#contact"
            scroll={false}
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleContactClick(e);
            }}
            className="mt-8 flex items-center justify-center gap-2 border border-[#0A0A0A] rounded-full py-4 font-heading font-medium text-[15px] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F3F1EB] transition-all"
          >
            Let&apos;s Collide →
          </Link>
        </div>
      )}
    </>
  );
}
