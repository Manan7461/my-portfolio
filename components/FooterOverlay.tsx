"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  isMuted as soundIsMuted,
  setMuted as setSoundMuted,
  soundPop,
  soundClick,
  soundMuteOff,
  soundMuteOn,
} from "@/lib/sound";

interface Milestone {
  time: number;
  text: string;
  duration: number;
  hasLink?: boolean;
}

const MILESTONES: Milestone[] = [
  { time: 60, text: "60 seconds in. Respect.", duration: 5000 },
  { time: 120, text: "2 minutes. You're not just scrolling — you're reading.", duration: 5000 },
  { time: 180, text: "3 minutes deep. Should I just send you my resume instead?", duration: 5000 },
  { time: 300, text: "5 minutes deep. If this was a meeting, it should have been an email by now.", duration: 5000 },
  { time: 600, text: "10 minutes deep! At this point, we're practically dating. Should I introduce you to my localhost?", duration: 5000 },
  { time: 1200, text: "20 minutes. Either you love this or you're stuck. Hope it's the first one.", duration: 5000 },
  { time: 1800, text: "Half an hour. At this point you basically work here.", duration: 5000 },
  { time: 3600, text: "One hour. Okay, this is genuinely impressive. Let's talk →", duration: 8000, hasLink: true }
];

const toastVariants = {
  initial: { opacity: 0, scale: 0.92, y: 12 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 14,
    }
  },
  exit: (customExit: boolean) => ({ 
    opacity: 0, 
    scale: customExit ? 0.8 : 0.95, 
    y: customExit ? 5 : 8,
    transition: {
      duration: customExit ? 0.15 : 0.25,
      ease: "easeIn" as const
    }
  })
};

export default function FooterOverlay() {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [firedMilestones, setFiredMilestones] = useState<number[]>([]);
  const [activeToast, setActiveToast] = useState<Milestone | null>(null);
  
  // Animation states
  const [isGoldPulse, setIsGoldPulse] = useState(false);
  const [sonarActive, setSonarActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [customExit, setCustomExit] = useState(false);

  useEffect(() => {
    // Restore elapsed time from sessionStorage if available
    const savedSeconds = sessionStorage.getItem("elapsed_seconds");
    if (savedSeconds) {
      setSeconds(parseInt(savedSeconds, 10));
    }

    // Restore fired milestones
    const savedFired = sessionStorage.getItem("fired_milestones");
    if (savedFired) {
      try {
        setFiredMilestones(JSON.parse(savedFired));
      } catch {}
    }

    // Start total time tracking timer
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Sync state with sound library isMuted property
    setMuted(soundIsMuted);

    const handleMuteChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setMuted(customEvent.detail);
    };

    window.addEventListener("soundMuteChange", handleMuteChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("soundMuteChange", handleMuteChange);
    };
  }, []);

  // Check and trigger milestones
  useEffect(() => {
    if (seconds <= 0) return;

    sessionStorage.setItem("elapsed_seconds", seconds.toString());

    // Find if there is an eligible milestone that hasn't fired yet
    // Allowing a 3-second window in case of setInterval lagging or tab throttling
    const milestone = MILESTONES.find(
      (m) => seconds >= m.time && seconds < m.time + 3 && !firedMilestones.includes(m.time)
    );

    if (milestone) {
      setFiredMilestones((prev) => {
        const next = [...prev, milestone.time];
        sessionStorage.setItem("fired_milestones", JSON.stringify(next));
        return next;
      });

      // 1. Trigger pill animations ("something's coming" cue)
      setIsGoldPulse(true);
      setSonarActive(true);
      
      // Reset scale after 300ms, while border glow fades over 600ms
      setTimeout(() => {
        setIsGoldPulse(false);
      }, 300);
      
      setTimeout(() => {
        setSonarActive(false);
      }, 600);

      // Play Pop sound
      soundPop();

      // 2. Mount the toast after a 0.3s delay
      setTimeout(() => {
        setCustomExit(false);
        setActiveToast(milestone);
        setShowConfetti(false);

        // Confetti burst for the 60-min milestone after text reveal completes (approx 1s)
        if (milestone.time === 3600) {
          setTimeout(() => {
            setShowConfetti(true);
          }, 1000);
        }
      }, 300);
    }
  }, [seconds, firedMilestones]);

  // Handle toast auto-dismiss
  useEffect(() => {
    if (!activeToast) return;

    const timer = setTimeout(() => {
      setCustomExit(false);
      setActiveToast(null);
    }, activeToast.duration);

    return () => clearTimeout(timer);
  }, [activeToast]);

  // Format seconds as MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMuteToggle = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);

    // Call custom on/off double beep sounds
    if (nextMuted) {
      soundMuteOff();
      setSoundMuted(true);
    } else {
      setSoundMuted(false);
      soundMuteOn();
    }
  };

  // Helper to render word-by-word fade-up stagger animation
  const renderStaggeredText = (text: string) => {
    const words = text.split(" ");
    return (
      <motion.span
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.04
            }
          }
        }}
        initial="initial"
        animate="animate"
        className="inline-block select-text"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }
            }}
            className="inline-block mr-1 select-text"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    );
  };

  return (
    <div
      className="fixed bottom-6 right-[6vw] z-50 select-none pointer-events-none flex flex-col items-end"
    >
      {/* Toast popup */}
      <AnimatePresence custom={customExit}>
        {activeToast && (
          <motion.div
            custom={customExit}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed bottom-24 left-0 right-0 mx-auto w-[90%] max-w-[280px]
              md:absolute md:bottom-[calc(100%+16px)] md:left-auto md:right-0 md:mx-0 md:w-[280px]
              z-[100] rounded-2xl bg-[#F3F1EB] border border-[#E0DDD6]
              shadow-[0_12px_32px_rgba(0,0,0,0.08)] pointer-events-auto"
          >
            {/* Inner Content Wrapper with overflow-hidden to crop the progress bar */}
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              {/* Idle Breathing Animation Wrapper */}
              <motion.div
                animate={{
                  scale: [1, 1.015, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full p-4 pr-8 relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setCustomExit(true);
                    setActiveToast(null);
                    soundClick();
                  }}
                  className="absolute top-2.5 right-2.5 text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors cursor-none text-[11px] px-1 font-sans z-10"
                >
                  ✕
                </button>

                {/* Toast Content */}
                {activeToast.hasLink ? (
                  <div className="flex flex-col items-start gap-1 font-sans text-[13px] text-[#0A0A0A] leading-relaxed">
                    {renderStaggeredText("One hour. Okay, this is genuinely impressive.")}
                    <motion.a
                      href="#contact"
                      onClick={() => {
                        setCustomExit(false);
                        setActiveToast(null);
                        soundClick();
                      }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: [1, 1.05, 1],
                        textShadow: [
                          "0 0 0px rgba(212,168,83,0)",
                          "0 0 8px rgba(212,168,83,0.5)",
                          "0 0 0px rgba(212,168,83,0)"
                        ]
                      }}
                      transition={{
                        opacity: { delay: 0.6, duration: 0.2 },
                        y: { delay: 0.6, duration: 0.2 },
                        scale: {
                          delay: 0.8,
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        },
                        textShadow: {
                          delay: 0.8,
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className="font-bold text-[#D4A853] hover:underline cursor-none inline-block mt-1 z-10"
                    >
                      Let&apos;s talk &nbsp;→
                    </motion.a>
                  </div>
                ) : (
                  <div className="font-sans text-[13px] text-[#0A0A0A] leading-relaxed select-text">
                    {renderStaggeredText(activeToast.text)}
                  </div>
                )}

                {/* Auto-Dismiss Countdown Progress Line */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: activeToast.duration / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-[2px] bg-[#D4A853]"
                />
              </motion.div>
            </div>

            {/* Confetti Burst for 60-min Milestone - Rendered outside overflow-hidden wrapper */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 360) / 8;
                  const distance = 60 + Math.random() * 40; // slightly wider scatter
                  const x = Math.cos((angle * Math.PI) / 180) * distance;
                  const y = Math.sin((angle * Math.PI) / 180) * distance;
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                      animate={{ x, y, scale: 0.3, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#D4A853]"
                      style={{ marginLeft: "-3px", marginTop: "-3px" }}
                    />
                  );
                })}
              </div>
            )}

            {/* Speech bubble pointer (rendered outside overflow-hidden inner wrapper so it's not clipped) */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
              className="hidden md:block absolute bottom-[-6px] right-10 w-3 h-3 bg-[#F3F1EB] border-r border-b border-[#E0DDD6] rotate-45 pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Timer Pill */}
      <motion.div
        initial={{
          scale: 1,
          borderColor: "rgba(224, 221, 214, 0.6)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}
        animate={{
          scale: isGoldPulse ? 1.12 : 1,
          borderColor: isGoldPulse ? "#D4A853" : "rgba(224, 221, 214, 0.6)",
          boxShadow: isGoldPulse 
            ? "0 0 14px rgba(212, 168, 83, 0.6), 0 8px 32px rgba(0,0,0,0.06)" 
            : "0 8px 32px rgba(0,0,0,0.06)",
        }}
        transition={{
          scale: {
            type: "spring",
            stiffness: 300,
            damping: 15,
          },
          borderColor: {
            duration: isGoldPulse ? 0.15 : 0.6,
            ease: "easeOut",
          },
          boxShadow: {
            duration: isGoldPulse ? 0.15 : 0.6,
            ease: "easeOut",
          }
        }}
        className="flex items-center gap-3.5 pointer-events-auto relative
          bg-background/60 backdrop-blur-md border pl-4 pr-1.5 py-1.5 rounded-full
          hover:bg-background/85 transition-[background-color] duration-200"
      >
        {/* Sonar Ping Ring */}
        {sonarActive && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-[#D4A853] pointer-events-none"
          />
        )}

        {/* Timer Display */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted select-text">
          {/* SVG Clock Icon */}
          <svg
            className="w-3.5 h-3.5 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{formatTime(seconds)}</span>
        </div>

        {/* Divider */}
        <span className="w-[1px] h-3 bg-borderCustom/60" />

        {/* Mute Toggle Button */}
        <button
          onClick={handleMuteToggle}
          title={muted ? "Enable sound" : "Mute sound"}
          className={`
            relative w-10 h-10 rounded-full border
            flex items-center justify-center
            transition-all duration-200 group cursor-none
            hover:scale-[1.08]
            ${muted
              ? "bg-transparent border-[#E0DDD6]"
              : "bg-[#0A0A0A] border-[#0A0A0A]"
            }
          `}
        >
          {/* Hover gold ring */}
          <span className="
            absolute inset-0 rounded-full border border-[#D4A853]
            scale-0 opacity-0
            group-hover:scale-110 group-hover:opacity-60
            transition-all duration-[250ms] pointer-events-none
          " />

          {/* Sound ON icon */}
          {!muted && (
            <svg width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="#F3F1EB" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}

          {/* Sound OFF icon */}
          {muted && (
            <svg width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="#6B6B6B" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          )}
        </button>
      </motion.div>
    </div>
  );
}

