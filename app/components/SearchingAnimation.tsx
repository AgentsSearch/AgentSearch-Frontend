"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface SearchingAnimationProps {
  query: string;
  onComplete: () => void;
}

const agentTerms = [
  "GPT-4", "Claude", "LLaMA", "Gemini", "Mistral", "Falcon",
  "reasoning", "inference", "processing", "analyzing", "evaluating",
  "neural", "transformer", "attention", "embedding", "token",
  "context", "generation", "completion",
  "zero-shot", "few-shot", "chain-of-thought",
  "tool calling", "function calling",
  "semantic search", "vector db", "ranking",
  "latency", "throughput", "accuracy",
];

const statusMessages = [
  "Initializing search",
  "Scanning agent database",
  "Evaluating capabilities",
  "Calculating compatibility",
  "Ranking results",
];

export function SearchingAnimation({ query, onComplete }: SearchingAnimationProps) {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const statusInterval = setInterval(() => {
      setCurrentStatus((prev) => (prev + 1) % statusMessages.length);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: "rgba(8, 8, 8, 0.97)",
        backdropFilter: "blur(40px)",
      }}
    >
      {/* Floating terms */}
      <div className="absolute inset-0 overflow-hidden">
        {agentTerms.map((term, index) => {
          const randomX = ((index * 37) % 100);
          const randomY = ((index * 53) % 100);
          const randomDuration = 3 + (index % 5);

          return (
            <motion.span
              key={`${term}-${index}`}
              initial={{
                x: `${randomX}vw`,
                y: `${randomY}vh`,
                opacity: 0,
              }}
              animate={{
                opacity: [0, 0.12, 0.08, 0],
                y: [`${randomY}vh`, `${(randomY - 15) % 100}vh`],
              }}
              transition={{
                duration: randomDuration,
                delay: (index * 0.15) % 2,
                repeat: Infinity,
                repeatDelay: (index % 3) + 1,
              }}
              className="absolute whitespace-nowrap select-none"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: `${0.75 + (index % 4) * 0.25}rem`,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {term}
            </motion.span>
          );
        })}
      </div>

      {/* Center content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-md w-full">
          {/* Status text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatus}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mb-10"
            >
              <h2
                className="text-2xl md:text-3xl mb-3 tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 200,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {statusMessages[currentStatus]}
              </h2>
              <p
                className="text-sm"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                &ldquo;{query}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-full max-w-xs mx-auto">
            <div
              className="h-[1px] rounded-full overflow-hidden mb-4"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.4))",
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p
              className="text-xs font-mono"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {progress}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
