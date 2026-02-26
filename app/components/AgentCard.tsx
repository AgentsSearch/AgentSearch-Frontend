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
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {angles.map((a, i) => (
        <line
          key={`axis-${i}`}
          x1={cx}
          y1={cy}
          x2={cx + radius * Math.cos(a)}
          y2={cy + radius * Math.sin(a)}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      ))}
      <polygon
        points={polyPoints}
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      {angles.map((a, i) => {
        const r = radius * values[i];
        return (
          <circle
            key={`dot-${i}`}
            cx={cx + r * Math.cos(a)}
            cy={cy + r * Math.sin(a)}
            r="2.5"
            fill="rgba(255,255,255,0.7)"
          />
        );
      })}
    </svg>
  );
}

export function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const [expanded, setExpanded] = useState(agent.rank === 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className={`rounded-2xl transition-all duration-300 ${
        agent.rank === 1 ? "py-10 px-10" : "py-8 px-8"
      }`}
      style={{
        background: agent.rank === 1
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${
          agent.rank === 1
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.06)"
        }`,
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3
            className={`tracking-tight ${
              agent.rank === 1 ? "text-2xl" : "text-xl"
            }`}
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 200,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {agent.rank}. {agent.name}
          </h3>
          <span
            className="text-sm mt-1 inline-block"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            {agent.category}
          </span>
        </div>

        <div
          className="flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Star className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
          <span
            className="text-sm"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {agent.score.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        <Radar
          breakdown={agent.breakdown}
          size={agent.rank === 1 ? 170 : 140}
        />

        <div className="flex-1">
          <p
            className="text-[15px] leading-relaxed mb-4"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {agent.description}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 text-sm mt-2 hover:opacity-70 transition-opacity duration-300"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {expanded ? "Hide details" : "View details"}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
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
                    <div
                      key={label}
                      className="pt-3"
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex justify-between mb-1.5">
                        <span
                          className="text-sm capitalize"
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {label}
                        </span>
                        <span
                          className="text-sm font-mono"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {agent.breakdown[label].toFixed(1)}
                        </span>
                      </div>
                      {/* Score bar */}
                      <div
                        className="h-[2px] rounded-full overflow-hidden mb-2"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(agent.breakdown[label] / 10) * 100}%`,
                          }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: "rgba(255,255,255,0.25)" }}
                        />
                      </div>
                      <p
                        className="text-xs"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
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
