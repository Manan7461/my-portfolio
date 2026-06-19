"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageEntryProps {
  onComplete: () => void;
}

export default function PageEntry({ onComplete }: PageEntryProps) {
  return (
    <motion.div
      initial={{ y: "0%" }}
      animate={{ y: "-100%" }}
      transition={{
        duration: 0.9,
        ease: [0.76, 0, 0.24, 1],
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 bg-primary z-[99999] pointer-events-none"
    />
  );
}
