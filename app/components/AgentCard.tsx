"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Star, ExternalLink, ChevronDown } from "lucide-react";

export interface AgentScoreBreakdown {
  capability: number;
  reliability: number;
  testability: number;
  domainFit: number;
  efficiency: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  score: number;
  rank: number;
  category: string;
  url?: string;
  breakdown: AgentScoreBreakdown;
}

const LABEL_INFO: Record<keyof AgentScoreBreakdown, string> = {
  capability:
    "Measures raw task-solving ability, reasoning depth, and output quality.",
  reliability:
    "Represents stability, consistency, and predictability of responses.",
  testability:
    "Indicates how measurable, probeable, and verifiable the agent is.",
  domainFit:
    "Shows how well the agent aligns with the requested domain or task.",
  efficiency:
    "Reflects computational cost, speed, and resource efficiency.",
};

const LABELS: Array<keyof AgentScoreBreakdown> = [
  "capability",
  "reliability",
  "testability",
  "domainFit",
  "efficiency",
];

function Radar({
  breakdown,
  size = 150,
}: {
  breakdown: AgentScoreBreakdown;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const levels = [0.25, 0.5, 0.75, 1];

  const angles = LABELS.map(
    (_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / LABELS.length
  );

  const toUnit = (v: number) => Math.max(0, Math.min(1, v / 10));
  const values = LABELS.map((k) => toUnit(breakdown[k]));

  const gridPolys = levels.map((lvl) =>
    angles
      .map((a) => {
        const r = radius * lvl;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      })
      .join(" ")
  );

  const polyPoints = angles
    .map((a, i) => {
      const r = radius * values[i];
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size}>
      {gridPolys.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="1"
        />
      ))}

      <polygon
        points={polyPoints}
        fill="#632c2f25"
        stroke="#632C2F"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const [expanded, setExpanded] = useState(agent.rank === 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border backdrop-blur-md transition-all duration-300
        ${agent.rank === 1 ? "bg-white/90 shadow-md py-10 px-10" : "bg-white/70 py-8 px-8"}
        border-neutral-200/60`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3
            className={`font-semibold tracking-tight ${
              agent.rank === 1 ? "text-3xl" : "text-2xl"
            }`}
            style={{ color: "#5D5346" }}
          >
            {agent.rank}. {agent.name}
          </h3>

          <span className="text-sm text-neutral-500">
            {agent.category}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/60 rounded-full px-4 py-1.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-amber-900">
            {agent.score.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        <Radar breakdown={agent.breakdown} size={agent.rank === 1 ? 170 : 140} />

        <div className="flex-1 text-[15px] leading-relaxed text-neutral-700">
          <p className="mb-4" style={{ color: "#5D5346" }}>
            {agent.description}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 text-sm font-medium mt-2 hover:opacity-70 transition"
            style={{ color: "#5D5346" }}
          >
            {expanded ? "Hide details" : "View details"}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 overflow-hidden"
              >
                <div className="space-y-4">
                  {LABELS.map((label) => (
                    <div key={label} className="border-t border-neutral-200 pt-3">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium capitalize">
                          {label}
                        </span>
                        <span className="text-neutral-500">
                          {agent.breakdown[label].toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">
                        {LABEL_INFO[label]}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}