"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * "Molten Signal" cursor
 * - Idle: a small targeting reticle (four corner ticks + hotspot dot) that spins with speed and settles when still.
 * - Lock-on: the reticle expands into viewfinder brackets around any interactive element, with a tag saying what it does.
 * - Project mode: the droplet swells into a molten "VIEW" disc with a spinning caption ring.
 * - Click: shockwave + ember burst.
 * - A tiny difference-blended dot marks the exact hotspot.
 */

const TRAIL = 7;
const BOX = 300; // size of the goo canvas that follows the head
type Mode = "idle" | "lock" | "project";

const INTERACTIVE = "a, button, [role='button'], summary, label[for], input, textarea, select, .card";

function tagFor(el: Element): string {
  if (el.matches("input, textarea, select")) return "TYPE";
  const a = el.closest("a");
  if (a) {
    const h = a.getAttribute("href") || "";
    if (h.startsWith("mailto:")) return "MAIL ✉";
    if (h.startsWith("tel:")) return "CALL";
    if (a.target === "_blank" || /^https?:/.test(h)) return "VISIT ↗";
    if (h.includes("#")) return "JUMP ↓";
    return "OPEN →";
  }
  return "PRESS";
}

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const gooRef = useRef<SVGSVGElement>(null);
  const circlesRef = useRef<(SVGCircleElement | null)[]>([]);
  const dotRef = useRef<HTMLDivElement>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const set = () => setEnabled(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current!, goo = gooRef.current!, dot = dotRef.current!;
    const brackets = bracketsRef.current!, tag = tagRef.current!, disc = discRef.current!, fx = fxRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mouse = { x: -200, y: -200 };
    const last = { x: -200, y: -200 };
    const head = { x: -200, y: -200 };
    const trail = Array.from({ length: TRAIL }, () => ({ x: -200, y: -200 }));
    const box = { x: -200, y: -200, w: 24, h: 24 }; // current bracket box
    let mode: Mode = "idle";
    let target: Element | null = null;
    let headR = 0;
    let rot = 0;
    let pressed = false;
    let visible = false;
    let raf = 0;

    const show = (v: boolean) => {
      visible = v;
      root.style.opacity = v ? "1" : "0";
    };

    /* ── effects ── */
    const spark = (x: number, y: number, ang: number, dist: number, size: number, dur: number) => {
      const s = document.createElement("span");
      s.className = "mc-spark";
      s.style.width = s.style.height = `${size}px`;
      fx.appendChild(s);
      const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
      s.animate(
        [
          { transform: `translate3d(${x}px, ${y}px, 0) scale(1)`, opacity: 1 },
          { transform: `translate3d(${x + dx}px, ${y + dy}px, 0) scale(0)`, opacity: 0 },
        ],
        { duration: dur, easing: "cubic-bezier(.15,.8,.2,1)" }
      ).onfinish = () => s.remove();
    };
    const shockwave = (x: number, y: number) => {
      const r = document.createElement("span");
      r.className = "mc-wave";
      fx.appendChild(r);
      r.animate(
        [
          { transform: `translate3d(${x - 20}px, ${y - 20}px, 0) scale(0.3)`, opacity: 0.9 },
          { transform: `translate3d(${x - 20}px, ${y - 20}px, 0) scale(2.6)`, opacity: 0 },
        ],
        { duration: 650, easing: "cubic-bezier(.1,.7,.2,1)" }
      ).onfinish = () => r.remove();
      for (let i = 0; i < 10; i++) spark(x, y, (i / 10) * Math.PI * 2 + Math.random() * 0.3, 34 + Math.random() * 26, 3 + Math.random() * 2, 600);
    };

    /* ── input ── */
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        show(true);
        head.x = mouse.x; head.y = mouse.y;
        trail.forEach((t) => { t.x = mouse.x; t.y = mouse.y; });
        box.x = mouse.x - 12; box.y = mouse.y - 12;
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      const card = t.closest(".project-card");
      const hit = card ? null : t.closest(INTERACTIVE);
      const next: Mode = card ? "project" : hit ? "lock" : "idle";
      target = hit;
      if (next !== mode) {
        mode = next;
        root.dataset.mode = mode;
      }
      if (hit) tag.textContent = tagFor(hit);
    };
    const onDown = () => {
      pressed = true;
      if (!reduce) shockwave(mouse.x, mouse.y);
    };
    const onUp = () => (pressed = false);
    const onLeave = () => show(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    /* ── frame loop ── */
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const render = () => {
      const speed = Math.hypot(mouse.x - last.x, mouse.y - last.y);
      last.x = mouse.x; last.y = mouse.y;

      // head + trail (each droplet chases the one ahead of it)
      const hf = mode === "project" ? 0.2 : 0.35;
      head.x = lerp(head.x, mouse.x, reduce ? 1 : hf);
      head.y = lerp(head.y, mouse.y, reduce ? 1 : hf);
      let px = head.x, py = head.y;
      trail.forEach((t, i) => {
        const f = reduce ? 1 : 0.42 - i * 0.035;
        t.x = lerp(t.x, px, f); t.y = lerp(t.y, py, f);
        px = t.x; py = t.y;
      });

      // molten disc only in project mode (+ press squash)
      headR = lerp(headR, (mode === "project" ? 54 : 0) * (pressed ? 0.85 : 1), 0.18);

      // goo canvas follows the head; droplets positioned relative to it (tail clamped)
      goo.style.transform = `translate3d(${head.x - BOX / 2}px, ${head.y - BOX / 2}px, 0)`;
      const c0 = circlesRef.current[0];
      if (c0) { c0.setAttribute("cx", `${BOX / 2}`); c0.setAttribute("cy", `${BOX / 2}`); c0.setAttribute("r", headR.toFixed(2)); }
      trail.forEach((t, i) => {
        const c = circlesRef.current[i + 1];
        if (!c) return;
        const dx = Math.max(-BOX / 2 + 12, Math.min(BOX / 2 - 12, t.x - head.x));
        const dy = Math.max(-BOX / 2 + 12, Math.min(BOX / 2 - 12, t.y - head.y));
        const r = 0; // trail droplets retired; the reticle replaces them
        c.setAttribute("cx", (BOX / 2 + dx).toFixed(2));
        c.setAttribute("cy", (BOX / 2 + dy).toFixed(2));
        c.setAttribute("r", r.toFixed(2));
      });

      // precision dot
      dot.style.transform = `translate3d(${mouse.x - 2}px, ${mouse.y - 2}px, 0)`;

      // project disc
      disc.style.transform = `translate3d(${head.x}px, ${head.y}px, 0) translate(-50%, -50%) scale(${mode === "project" ? 1 : 0.2})`;

      // lock-on brackets: ease the box toward the target's bounds (or collapse onto the pointer)
      const rs = pressed ? 16 : 22; // idle reticle size
      let tx = mouse.x - rs / 2, ty = mouse.y - rs / 2, tw = rs, th = rs;
      if (mode === "lock" && target && target.isConnected) {
        const r = target.getBoundingClientRect();
        const pad = 6;
        tx = r.left - pad; ty = r.top - pad; tw = r.width + pad * 2; th = r.height + pad * 2;
      }
      const bf = reduce ? 1 : 0.24;
      box.x = lerp(box.x, tx, bf); box.y = lerp(box.y, ty, bf);
      box.w = lerp(box.w, tw, bf); box.h = lerp(box.h, th, bf);
      // idle reticle spins with speed and settles when still
      rot = lerp(rot, mode === "idle" && !reduce ? Math.min(speed * 1.6, 90) : 0, 0.12);
      brackets.style.transform = `translate3d(${box.x}px, ${box.y}px, 0) rotate(${rot.toFixed(2)}deg)`;
      brackets.style.setProperty("--c", `${Math.min(12, Math.max(5, Math.min(box.w, box.h) / 3)).toFixed(1)}px`);
      brackets.style.width = `${box.w}px`;
      brackets.style.height = `${box.h}px`;

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} data-mode="idle" className="mc-root pointer-events-none fixed inset-0 z-[9999] opacity-0 transition-opacity duration-300" aria-hidden>
      {/* gooey liquid core + trail */}
      <svg ref={gooRef} className="absolute top-0 left-0 overflow-visible" width={BOX} height={BOX} style={{ transform: "translate3d(-999px,-999px,0)" }}>
        <defs>
          <filter id="mc-goo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <radialGradient id="mc-molten" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FFD2B8" />
            <stop offset="45%" stopColor="rgb(var(--accent))" />
            <stop offset="100%" stopColor="#C2361B" />
          </radialGradient>
        </defs>
        <g filter="url(#mc-goo)" fill="url(#mc-molten)">
          {Array.from({ length: TRAIL + 1 }).map((_, i) => (
            <circle key={i} ref={(el) => { circlesRef.current[i] = el; }} cx={BOX / 2} cy={BOX / 2} r={0} />
          ))}
        </g>
      </svg>

      {/* project disc */}
      <div ref={discRef} className="mc-disc absolute top-0 left-0 w-[112px] h-[112px]">
        <svg viewBox="0 0 156 156" className="absolute inset-[-22px] w-[156px] h-[156px] animate-spin-slow">
          <defs>
            <path id="mc-ring" d="M78,78 m-66,0 a66,66 0 1,1 132,0 a66,66 0 1,1 -132,0" />
          </defs>
          <text className="font-mono" fontSize="8.5" letterSpacing="3" fill="rgb(var(--accent))">
            <textPath href="#mc-ring">CASE STUDY • CASE STUDY • CASE STUDY • </textPath>
          </text>
        </svg>
        <span className="absolute inset-0 grid place-items-center font-mono text-[11px] tracking-[0.2em] text-[#0B0B0C] font-semibold">VIEW ↗</span>
      </div>

      {/* lock-on viewfinder */}
      <div ref={bracketsRef} className="mc-brackets absolute top-0 left-0">
        <i className="mc-b tl" />
        <i className="mc-b tr" />
        <i className="mc-b bl" />
        <i className="mc-b br" />
        <span ref={tagRef} className="mc-tag font-mono">OPEN →</span>
      </div>

      {/* precision hotspot */}
      <div ref={dotRef} className="mc-dot absolute top-0 left-0 w-1 h-1 rounded-full" />

      {/* sparks & shockwaves */}
      <div ref={fxRef} className="absolute inset-0" />
    </div>
  );
}
