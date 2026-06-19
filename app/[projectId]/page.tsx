"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import { soundBtnHover, soundClick } from "@/lib/sound";

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const project = projects.find((p) => p.link === `/${projectId}`);

  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeImageIdx === null || !project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveImageIdx((prev) => (prev === 0 ? project.images.length - 1 : prev! - 1));
        soundClick();
      } else if (e.key === "ArrowRight") {
        setActiveImageIdx((prev) => (prev === project.images.length - 1 ? 0 : prev! + 1));
        soundClick();
      } else if (e.key === "Escape") {
        setActiveImageIdx(null);
        soundClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIdx, project]);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F3F1EB] text-[#0A0A0A] px-[6vw] py-20 relative select-none">
      {/* Back to Home Button */}
      <div className="mb-12">
        <Link
          href="/#work"
          scroll={false}
          onMouseEnter={() => soundBtnHover()}
          onClick={() => soundClick()}
          className="inline-flex items-center gap-2 font-mono text-[12px] text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-250 cursor-none relative group pb-1"
        >
          <span>←</span>
          <span>Back to Portfolio</span>
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#0A0A0A] scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </Link>
      </div>

      {/* Project Header Info */}
      <div className="border-b border-[#E0DDD6] pb-8 mb-12">
        <span className="font-mono text-[11px] text-[#D4A853] font-semibold tracking-[0.18em] uppercase block mb-3">
          {project.category}
        </span>
        <h1 className="font-heading font-black leading-tight text-[40px] sm:text-[56px] lg:text-[76px] select-text">
          {project.title}
        </h1>
      </div>

      {/* Two Column Layout (Details and Images) */}
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 w-full">
        
        {/* Left Column: Details & Tech */}
        <div className="flex-1 flex flex-col gap-10 max-w-xl">
          <div>
            <h2 className="font-mono text-[11px] text-[#D4A853] font-semibold uppercase tracking-wider mb-3">
              Overview
            </h2>
            <p className="font-sans text-[16px] leading-[1.8] text-[#6B6B6B] select-text">
              {project.description}
            </p>
          </div>

          <div>
            <h2 className="font-mono text-[11px] text-[#D4A853] font-semibold uppercase tracking-wider mb-3">
              The Solution
            </h2>
            <p className="font-sans text-[16px] leading-[1.8] text-[#6B6B6B] select-text">
              {project.solution}
            </p>
          </div>

          <div>
            <h2 className="font-mono text-[11px] text-[#D4A853] font-semibold uppercase tracking-wider mb-3">
              Key Deliverables
            </h2>
            <div className="flex flex-col gap-2">
              {project.deliverables.map((del, idx) => (
                <div
                  key={idx}
                  className="border border-[#E0DDD6] rounded-lg px-4 py-3 font-sans text-[13.5px] text-[#0A0A0A] select-text bg-[#F3F1EB]/40 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-start gap-3"
                >
                  <span className="text-[#D4A853] font-bold mt-0.5">✓</span>
                  <span>{del}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-mono text-[11px] text-[#D4A853] font-semibold uppercase tracking-wider mb-3">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techUsed.map((tech) => (
                <span
                  key={tech}
                  className="bg-[#0A0A0A] text-[#F3F1EB] font-mono text-[11px] px-3.5 py-1.5 rounded select-text"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.link !== "#" && !project.link.startsWith("/") && (
            <div className="mt-4">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundBtnHover()}
                onClick={() => soundClick()}
                className="inline-flex items-center justify-center h-14 px-8 bg-[#0A0A0A] text-[#F3F1EB] font-heading font-semibold text-[14px] tracking-wide rounded-md hover:bg-[#D4A853] hover:text-[#0A0A0A] transition-all duration-300 cursor-none"
              >
                View Live Project &nbsp;→
              </a>
            </div>
          )}
        </div>

        {/* Right Column: 4 Real Project Images Grid (Click to open Lightbox) */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <h2 className="font-mono text-[11px] text-[#D4A853] font-semibold uppercase tracking-wider border-b border-[#E0DDD6] pb-2">
            Project Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveImageIdx(idx);
                  soundClick();
                }}
                className="aspect-[4/3] relative rounded-lg overflow-hidden border border-borderCustom/40 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:scale-[1.02] transition-transform duration-300 group cursor-none"
              >
                <img
                  src={img}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Image overlay label */}
                <span className="absolute bottom-2 right-2 text-[10px] text-background bg-[#0A0A0A]/70 px-2 py-0.5 rounded font-mono">
                  {idx + 1} / 4
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FULL SCREEN LIGHTBOX */}
      {activeImageIdx !== null && (
        <div
          onClick={() => {
            setActiveImageIdx(null);
            soundClick();
          }}
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center select-none"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setActiveImageIdx(null);
              soundClick();
            }}
            className="absolute top-6 right-6 font-mono text-[#F3F1EB]/80 hover:text-[#D4A853] text-[14px] cursor-none flex items-center gap-1 z-[210] p-4"
          >
            ✕ Close
          </button>

          {/* Left Arrow (Prev) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIdx((prev) => (prev === 0 ? project.images.length - 1 : prev! - 1));
              soundClick();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-[#F3F1EB]/60 hover:text-[#D4A853] hover:scale-110 text-[32px] cursor-none p-4 transition-all duration-200 z-[210]"
          >
            ←
          </button>

          {/* Right Arrow (Next) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIdx((prev) => (prev === project.images.length - 1 ? 0 : prev! + 1));
              soundClick();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-[#F3F1EB]/60 hover:text-[#D4A853] hover:scale-110 text-[32px] cursor-none p-4 transition-all duration-200 z-[210]"
          >
            →
          </button>

          {/* Centered Image */}
          <div className="max-w-[85vw] max-h-[80vh] flex items-center justify-center z-[205]">
            <img
              src={project.images[activeImageIdx]}
              alt={`${project.title} full screen view`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl transition-all duration-300"
            />
          </div>

          {/* Counter Indicator */}
          <div className="absolute bottom-6 font-mono text-[#6B6B6B] text-[12px] z-[210]">
            {activeImageIdx + 1} / {project.images.length}
          </div>
        </div>
      )}

      {/* Footer credits */}
      <footer className="mt-24 border-t border-[#E0DDD6] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-mono text-[11px] text-[#6B6B6B]">
        <span>&copy; {new Date().getFullYear()} Prajapati Manan. All rights reserved.</span>
        <span>Designed &amp; built by Manan · AI-Assisted Engineer</span>
      </footer>
    </main>
  );
}
