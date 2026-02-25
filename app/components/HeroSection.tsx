"use client";

import { motion } from "motion/react";
import { Star, ExternalLink, ChevronRight } from "lucide-react";

export interface AgentScoreBreakdown {
  capability: number;  // 0..10
  reliability: number; // 0..10
  testability: number; // 0..10
  domainFit: number;   // 0..10
  efficiency: number;  // 0..10
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  score: number; // overall 0..10 (표시용)
  rank: number;
  category: string;
  url?: string;

  breakdown?: AgentScoreBreakdown;
}

interface AgentCardProps {
  agent: Agent;
  index: number;
}

const LABELS: Array<keyof AgentScoreBreakdown> = [
  "capability",
  "reliability",
  "testability",
  "domainFit",
  "efficiency",
];

const LABEL_NAMES: Record<keyof AgentScoreBreakdown, string> = {
  capability: "Capability",
  reliability: "Reliability",
  testability: "Testability",
  domainFit: "Domain fit",
  efficiency: "Efficiency",
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function toUnit(v10: number) {
  return clamp01(v10 / 10);
}

function defaultBreakdownFromScore(score: number): AgentScoreBreakdown {
  const s = Math.max(0, Math.min(10, score));
  return {
    capability: s,
    reliability: Math.max(0, Math.min(10, s - 0.4)),
    testability: Math.max(0, Math.min(10, s - 0.8)),
    domainFit: Math.max(0, Math.min(10, s - 0.2)),
    efficiency: Math.max(0, Math.min(10, s - 1.2)),
  };
}

function topReasons(b: AgentScoreBreakdown) {
  const arr = Object.entries(b) as Array<[keyof AgentScoreBreakdown, number]>;
  arr.sort((a, b) => b[1] - a[1]);
  const top = arr.slice(0, 2);


  const parts = top.map(([k, v]) => `${LABEL_NAMES[k]} ${v.toFixed(1)}`);
  return parts.join(" · ");
}

function whyGoodText(b: AgentScoreBreakdown) {
  const arr = Object.entries(b) as Array<[keyof AgentScoreBreakdown, number]>;
  arr.sort((a, b) => b[1] - a[1]);
  const [k1, v1] = arr[0];
  const [k2, v2] = arr[1];
  const [kLow, vLow] = arr[arr.length - 1];

  return `Strong on ${LABEL_NAMES[k1]} (${v1.toFixed(
    1
  )}) and ${LABEL_NAMES[k2]} (${v2.toFixed(
    1
  )}), with the main trade-off in ${LABEL_NAMES[kLow]} (${vLow.toFixed(1)}).`;
}

function MedalBadge({ rank }: { rank: number }) {
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

  if (medal) {
    return <span className="text-2xl leading-none">{medal}</span>;
  }

  return (
    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
      <span className="text-xs font-bold text-neutral-600">#{rank}</span>
    </div>
  );
}

function Radar({
  breakdown,
  size = 120,
}: {
  breakdown: AgentScoreBreakdown;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38; 
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const angles = LABELS.map((_, i) => (-Math.PI / 2) + (i * (2 * Math.PI)) / LABELS.length);

  const axisPoints = angles.map((a) => ({
    x: cx + radius * Math.cos(a),
    y: cy + radius * Math.sin(a),
  }));

  const values = LABELS.map((k) => toUnit(breakdown[k]));
  const polyPoints = angles
    .map((a, i) => {
      const r = radius * values[i];
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      return `${x},${y}`;
    })
    .join(" ");

  const gridPolys = levels.map((lvl) => {
    const pts = angles
      .map((a) => {
        const r = radius * lvl;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        return `${x},${y}`;
      })
      .join(" ");
    return pts;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* grid polygons */}
      {gridPolys.map((pts, idx) => (
        <polygon
          key={idx}
          points={pts}
          fill="none"
          stroke="rgba(0,0,0,0.10)"
          strokeWidth="1"
        />
      ))}

      {/* axes */}
      {axisPoints.map((p, idx) => (
        <line
          key={idx}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="1"
        />
      ))}

      {/* value polygon */}
      <polygon
        points={polyPoints}
        fill="rgba(245, 158, 11, 0.18)"  
        stroke="rgba(245, 158, 11, 0.55)"
        strokeWidth="1.5"
      />

      {/* dots */}
      {angles.map((a, i) => {
        const r = radius * values[i];
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.6"
            fill="rgba(245, 158, 11, 0.9)"
          />
        );
      })}
    </svg>
  );
}

export function AgentCard({ agent, index }: AgentCardProps) {
  const breakdown = agent.breakdown ?? defaultBreakdownFromScore(agent.score);
  const reasonLine = topReasons(breakdown);
  const whyLine = whyGoodText(breakdown);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        type: "spring",
        stiffness: 90,
        damping: 18,
      }}
      className="group"
    >
      {/* Row */}
      <div
        className="relative w-full rounded-2xl border border-neutral-200/70 bg-white/70 backdrop-blur-md
        shadow-sm hover:shadow-lg transition-all duration-300
        px-5 py-5"
      >
        {/* overall */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 bg-amber-50/90 border border-amber-200/60 rounded-full px-3 py-1.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-amber-900">
            {agent.score.toFixed(1)}
          </span>
        </div>

        <div className="flex gap-5">
          {/* left */}
          <div className="pt-1">
            <MedalBadge rank={agent.rank} />
          </div>

          {/* right */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className="text-xl font-semibold truncate"
                style={{ color: "#5D5346" }}
              >
                {agent.rank}. {agent.name}
              </h3>

              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                bg-neutral-100/80 border border-neutral-200/60 text-neutral-700">
                {agent.category}
              </span>
            </div>

            <p className="mt-2 leading-relaxed text-sm" style={{ color: "#5D5346" }}>
              {agent.description}
            </p>

            {/* reason */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-700">
              <span className="font-semibold">Why ranked:</span>
              <span className="text-neutral-600">{reasonLine}</span>
            </div>

            {/* reason */}
            <div className="mt-2 text-sm text-neutral-600">
              {whyLine}
            </div>

            {/* details */}
            {agent.url && (
              <a
                href={agent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:opacity-70 transition"
              >
                <span>View details</span>
                <ExternalLink className="w-4 h-4" />
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}
          </div>

          {/* right part */}
          <div className="hidden md:flex flex-col items-end gap-3 min-w-[220px] pt-8">
            <div className="rounded-xl border border-neutral-200/60 bg-white/60 px-3 py-3">
              <Radar breakdown={breakdown} size={120} />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-700">
              {LABELS.map((k) => (
                <div key={k} className="flex items-center justify-between gap-2">
                  <span className="text-neutral-500">{LABEL_NAMES[k]}</span>
                  <span className="font-semibold">{breakdown[k].toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}