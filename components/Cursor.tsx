"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [hoverState, setHoverState] = useState<"none" | "interactive" | "project">("none");

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const ringScale = useRef(1);
  const isVisible = useRef(false);
  const hoverStateRef = useRef<"none" | "interactive" | "project">("none");

  useEffect(() => {
    // Check if device supports fine pointer (mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsPointerDevice(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerDevice(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!isPointerDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible.current) {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        isVisible.current = true;
      }
    };

    const onMouseLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      isVisible.current = false;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const projectCard = target.closest(".project-card");
      const interactive = target.closest("a, button, .card");

      let newState: "none" | "interactive" | "project" = "none";
      if (projectCard) {
        newState = "project";
      } else if (interactive) {
        newState = "interactive";
      }

      setHoverState(newState);
      hoverStateRef.current = newState;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseover", onMouseOver);

    let animationFrameId: number;

    const render = () => {
      // Lerp ring position (0.12)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;

      // Lerp ring scale (0.15)
      let targetScale = 1;
      if (hoverStateRef.current === "project") {
        targetScale = 1.8; // scales 40px to 72px
      }
      ringScale.current += (targetScale - ringScale.current) * 0.15;

      // Update dot position (centered, 8px/2 = 4px offset)
      if (dot) {
        dot.style.transform = `translate3d(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px, 0)`;
      }

      // Update ring position (centered, 40px/2 = 20px offset)
      if (ring) {
        ring.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0) scale(${ringScale.current})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPointerDevice]);

  if (!isPointerDevice) return null;

  return (
    <>
      {/* Outer Hollow Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-[1.5px] pointer-events-none z-[9999] opacity-0 transition-colors duration-300 ease-out flex items-center justify-center"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          borderColor: "var(--cursor-ring-color)",
          backgroundColor: hoverState === "interactive" ? "var(--cursor-ring-bg)" : "transparent",
        }}
      >
        {hoverState === "interactive" && (
          <span 
            className="text-[9px] font-mono tracking-[0.1em] font-medium select-none"
            style={{ color: "var(--cursor-text-color)" }}
          >
            OPEN
          </span>
        )}
      </div>

      {/* Inner Filled Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 ${
          hoverState === "interactive" ? "opacity-0" : "opacity-100"
        }`}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          backgroundColor: "var(--cursor-dot-color)",
        }}
      />
    </>
  );
}
