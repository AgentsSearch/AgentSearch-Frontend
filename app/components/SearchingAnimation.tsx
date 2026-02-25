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
  "neural network", "transformer", "attention", "embedding", "token",
  "prompt", "context", "response", "generation", "completion",
  "fine-tuning", "zero-shot", "few-shot", "chain-of-thought",
  "task execution", "agent workflow", "tool calling", "function calling",
  "semantic search", "vector database", "similarity score", "ranking",
  "performance metrics", "latency", "throughput", "accuracy", "F1 score"
];

const statusMessages = [
  "Initializing search...",
  "Scanning agent database...",
  "Evaluating capabilities...",
  "Calculating compatibility...",
  "Ranking results..."
];

export function SearchingAnimation({ query, onComplete }: SearchingAnimationProps) {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // Status message rotation
    const statusInterval = setInterval(() => {
      setCurrentStatus(prev => (prev + 1) % statusMessages.length);
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
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-white/95 backdrop-blur-lg overflow-hidden"
    >
      {/* Animated background terms */}
      <div className="absolute inset-0 overflow-hidden">
        {agentTerms.map((term, index) => {
          const randomX = Math.random() * 100;
          const randomY = Math.random() * 100;
          const randomDelay = Math.random() * 0.5;
          const randomDuration = 2 + Math.random() * 3;
          
          return (
            <motion.div
              key={`${term}-${index}`}
              initial={{ 
                x: `${randomX}vw`, 
                y: `${randomY}vh`,
                opacity: 0,
                scale: 0.8
              }}
              animate={{ 
                opacity: [0, 0.4, 0.3, 0],
                scale: [0.8, 1.2, 1, 0.9],
                y: [`${randomY}vh`, `${(randomY - 20) % 100}vh`]
              }}
              transition={{
                duration: randomDuration,
                delay: randomDelay,
                repeat: Infinity,
                repeatDelay: Math.random() * 2
              }}
              className="absolute text-neutral-400 font-mono whitespace-nowrap select-none"
              style={{ 
                fontSize: `${0.8 + Math.random() * 1.2}rem`,
                fontWeight: Math.random() > 0.5 ? 600 : 400
              }}
            >
              {term}
            </motion.div>
          );
        })}
      </div>

      {/* Glitch effect words */}
      {[...Array(15)].map((_, i) => {
        const randomTerm = agentTerms[Math.floor(Math.random() * agentTerms.length)];
        return (
          <motion.div
            key={`glitch-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: [
                `${Math.random() * 100}vw`,
                `${Math.random() * 100}vw`,
              ],
              y: [
                `${Math.random() * 100}vh`,
                `${Math.random() * 100}vh`,
              ]
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              delay: Math.random() * 3,
              repeat: Infinity,
              repeatDelay: Math.random() * 2
            }}
            className="absolute font-bold select-none"
            style={{ 
              fontSize: `${1.5 + Math.random() * 2}rem`,
              color: '#5D5346'
            }}
          >
            {randomTerm}
          </motion.div>
        );
      })}

      {/* Center content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-2xl">
          {/* Main status */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatus}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-light mb-4" style={{ color: '#5D5346' }}>
                {statusMessages[currentStatus]}
              </h2>
              <p className="text-lg text-neutral-600">
                Searching for: <span className="font-medium" style={{ color: '#5D5346' }}>"{query}"</span>
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto">
            <div className="h-1 bg-neutral-200 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(to right, #7D7366, #5D5346)` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-neutral-500 font-mono">{progress}%</p>
          </div>

          {/* Animated dots */}
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-8 flex justify-center gap-2"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-neutral-400 rounded-full"
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </motion.div>
  );
}