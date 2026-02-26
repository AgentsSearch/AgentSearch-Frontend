"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AgentCard, Agent } from "./components/AgentCard";
import { SearchingAnimation } from "./components/SearchingAnimation";
import { ArrowRight, Search, Layers, Zap, Shield } from "lucide-react";

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "GPT-4 Turbo",
    description:
      "Advanced language model with superior reasoning capabilities. Excels at complex problem-solving, creative writing, and detailed analysis across multiple domains.",
    score: 9.8,
    rank: 1,
    category: "General Purpose",
    url: "https://github.com/AgentsSearch",
    breakdown: {
      capability: 9.9,
      reliability: 9.6,
      testability: 9.2,
      domainFit: 9.7,
      efficiency: 8.8,
    },
  },
  {
    id: "2",
    name: "Claude Opus",
    description:
      "Highly capable AI agent focused on thoughtful responses. Known for excellent instruction following and strong performance in technical tasks.",
    score: 9.5,
    rank: 2,
    category: "General Purpose",
    url: "https://github.com/AgentsSearch",
    breakdown: {
      capability: 9.5,
      reliability: 7.4,
      testability: 9.0,
      domainFit: 8.6,
      efficiency: 7.6,
    },
  },
  {
    id: "3",
    name: "Code Interpreter",
    description:
      "Specialized agent for programming with code execution capabilities. Perfect for debugging, algorithm development, and computational problem solving.",
    score: 9.2,
    rank: 3,
    category: "Development",
    url: "https://github.com/AgentsSearch",
    breakdown: {
      capability: 9.1,
      reliability: 5.9,
      testability: 9.3,
      domainFit: 4.8,
      efficiency: 9.0,
    },
  },
  {
    id: "4",
    name: "Research Pro",
    description:
      "Expert research assistant that excels at gathering and analyzing information from multiple sources. Ideal for academic research.",
    score: 8.9,
    rank: 4,
    category: "Research",
    url: "https://github.com/AgentsSearch",
    breakdown: {
      capability: 8.8,
      reliability: 8.7,
      testability: 6.9,
      domainFit: 5.3,
      efficiency: 6.2,
    },
  },
  {
    id: "5",
    name: "Creative Studio",
    description:
      "Specialized in creative content generation and storytelling. Brings imagination and coherence to fiction and creative projects.",
    score: 8.7,
    rank: 5,
    category: "Creative",
    url: "https://github.com/AgentsSearch",
    breakdown: {
      capability: 7.6,
      reliability: 4.2,
      testability: 1.3,
      domainFit: 8.7,
      efficiency: 2.5,
    },
  },
];

const suggestions = [
  "Code review",
  "Data analysis",
  "Content creation",
  "Research assistant",
];

const placeholderExamples = [
  "an agent for code review",
  "a research assistant",
  "help with data analysis",
  "a creative writing partner",
  "automated testing tools",
];

const ease = [0.25, 0.1, 0, 1] as const;

const features = [
  {
    icon: Layers,
    title: "Deep Comparison",
    description:
      "Evaluate agents across five dimensions — capability, reliability, testability, domain fit, and efficiency.",
  },
  {
    icon: Zap,
    title: "Instant Matching",
    description:
      "Describe your task in natural language. Our engine finds the most compatible agents in seconds.",
  },
  {
    icon: Shield,
    title: "Trusted Rankings",
    description:
      "Every score is backed by transparent breakdowns. No black boxes, no hidden agendas.",
  },
];

function TypingPlaceholder() {
  const [text, setText] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const current = placeholderExamples[exampleIndex];

    if (!isDeleting) {
      if (text.length < current.length) {
        timeoutRef.current = setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          50 + Math.random() * 40
        );
      } else {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (text.length > 0) {
        timeoutRef.current = setTimeout(
          () => setText(text.slice(0, -1)),
          25
        );
      } else {
        setIsDeleting(false);
        setExampleIndex((prev) => (prev + 1) % placeholderExamples.length);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, isDeleting, exampleIndex]);

  return (
    <span style={{ color: "rgba(255,255,255,0.25)" }}>
      {text || "\u00A0"}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        |
      </motion.span>
    </span>
  );
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
  };

  const handleSearchComplete = () => {
    setAgents(mockAgents);
    setIsSearching(false);
    setShowResults(true);
  };

  const handleNewSearch = () => {
    setShowResults(false);
    setAgents([]);
    setSearchQuery("");
  };

  const sortedAgents = [...agents].sort((a, b) => a.rank - b.rank);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080808]">
      <AnimatePresence>
        {isSearching && (
          <SearchingAnimation
            query={searchQuery}
            onComplete={handleSearchComplete}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: isSearching ? 0.3 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {showResults ? (
          /* ═══ RESULTS VIEW ═══ */
          <>
            <header
              className="sticky top-0 z-40 backdrop-blur-xl"
              style={{
                background: "rgba(8, 8, 8, 0.8)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                <button
                  onClick={handleNewSearch}
                  className="text-xl tracking-tight hover:opacity-60 transition-opacity duration-300"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 200,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  AgentSearch
                </button>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="hidden md:block flex-1 max-w-lg mx-12"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for agents..."
                      className="w-full px-5 py-2.5 pr-10 rounded-xl focus:outline-none transition-all duration-300 text-sm"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.8)",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                    <style>{`input::placeholder { color: rgba(255,255,255,0.25) !important; }`}</style>
                    <button
                      type="submit"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2"
                    >
                      <Search className="w-4 h-4 text-white/30" />
                    </button>
                  </div>
                </form>

                <button
                  onClick={handleNewSearch}
                  className="text-sm px-5 py-2 rounded-full hover:bg-white/10 transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  New Search
                </button>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-14 text-center"
              >
                <h2
                  className="text-4xl md:text-5xl mb-4 tracking-[-0.02em]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 200,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Results for{" "}
                  <span style={{ fontStyle: "italic" }}>
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                </h2>
                <p
                  className="text-base"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {agents.length} agents found
                </p>
              </motion.div>

              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col gap-4">
                  {sortedAgents.map((agent, index) => (
                    <AgentCard key={agent.id} agent={agent} index={index} />
                  ))}
                </div>
              </div>
            </main>
          </>
        ) : (
          /* ═══ LANDING / HERO VIEW ═══ */
          <>
            {/* Full-screen background image */}
            <div className="fixed inset-0 z-0">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('/images/hero-bg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center 30%",
                  backgroundRepeat: "no-repeat",
                  animation: "subtle-drift 30s ease-in-out infinite",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.75) 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
                }}
              />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50">
              <div className="max-w-7xl mx-auto px-8 py-7 flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease }}
                >
                  <span
                    className="text-lg tracking-[-0.01em]"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 200,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    AgentSearch
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease }}
                  className="flex items-center gap-8"
                >
                  <span
                    className="hidden md:inline text-sm cursor-pointer hover:opacity-80 transition-opacity duration-300"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    How it works
                  </span>
                  <button
                    className="text-sm px-5 py-2.5 rounded-full backdrop-blur-md hover:bg-white/15 transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.9)",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    Get Started
                  </button>
                </motion.div>
              </div>
            </nav>

            {/* Hero Content */}
            <main className="relative z-10">
              <section className="min-h-screen flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-4xl text-center">
                  {/* Headline */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease }}
                    className="mb-10"
                  >
                    <h1
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.03em]"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 200,
                        color: "rgba(255,255,255,0.95)",
                      }}
                    >
                      Find your true
                      <br />
                      <span style={{ fontStyle: "italic" }}>(tool)</span>{" "}
                      calling
                    </h1>
                  </motion.div>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease }}
                    className="text-base sm:text-lg md:text-xl mb-16 max-w-md mx-auto leading-relaxed"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    Discover, compare, and deploy the perfect AI agent for any
                    task.
                  </motion.p>

                  {/* Search Bar */}
                  <motion.form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearch();
                    }}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease }}
                    className="max-w-xl mx-auto mb-10"
                  >
                    <div className="relative group">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full px-7 py-5 pr-14 rounded-2xl focus:outline-none transition-all duration-500 text-base backdrop-blur-xl"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                          color: "rgba(255,255,255,0.9)",
                          background: isFocused
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.06)",
                          border: `1px solid ${
                            isFocused
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(255,255,255,0.1)"
                          }`,
                          boxShadow: isFocused
                            ? "0 8px 40px rgba(0,0,0,0.3)"
                            : "0 4px 30px rgba(0,0,0,0.15)",
                        }}
                        autoFocus
                      />
                      {/* Animated placeholder */}
                      {!searchQuery && !isFocused && (
                        <div
                          className="absolute left-7 top-1/2 -translate-y-1/2 pointer-events-none text-base"
                          style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                        >
                          <span style={{ color: "rgba(255,255,255,0.25)" }}>
                            Find{" "}
                          </span>
                          <TypingPlaceholder />
                        </div>
                      )}
                      {!searchQuery && isFocused && (
                        <div
                          className="absolute left-7 top-1/2 -translate-y-1/2 pointer-events-none text-base"
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 300,
                            color: "rgba(255,255,255,0.2)",
                          }}
                        >
                          Start typing...
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={!searchQuery.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-300"
                        style={{
                          background: searchQuery.trim()
                            ? "rgba(255,255,255,0.15)"
                            : "rgba(255,255,255,0.04)",
                          cursor: searchQuery.trim()
                            ? "pointer"
                            : "not-allowed",
                        }}
                      >
                        <ArrowRight
                          className="w-4 h-4"
                          style={{
                            color: searchQuery.trim()
                              ? "rgba(255,255,255,0.9)"
                              : "rgba(255,255,255,0.15)",
                          }}
                        />
                      </button>
                    </div>
                  </motion.form>

                  {/* Suggestion Chips */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3"
                  >
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchQuery(suggestion)}
                        className="text-sm px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                          color: "rgba(255,255,255,0.4)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      Learn more
                    </span>
                    <div
                      className="w-[1px] h-6"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
                      }}
                    />
                  </motion.div>
                </motion.div>
              </section>

              {/* ═══ BELOW THE FOLD — Features ═══ */}
              <section
                className="relative py-32 px-6"
                style={{ background: "#080808" }}
              >
                <div className="max-w-5xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease }}
                    className="text-center mb-20"
                  >
                    <h2
                      className="text-3xl md:text-5xl mb-5 tracking-[-0.02em]"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 200,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      How it works
                    </h2>
                    <p
                      className="text-base max-w-md mx-auto"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      Three steps between you and the right agent.
                    </p>
                  </motion.div>

                  <div className="grid md:grid-cols-3 gap-8 md:gap-6">
                    {features.map((feature, i) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.12,
                          ease,
                        }}
                        className="rounded-2xl p-8 group hover:bg-white/[0.03] transition-all duration-500"
                        style={{
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <feature.icon
                            className="w-5 h-5"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                            strokeWidth={1.5}
                          />
                        </div>
                        <h3
                          className="text-lg mb-3"
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 200,
                            color: "rgba(255,255,255,0.85)",
                          }}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 300,
                            color: "rgba(255,255,255,0.35)",
                          }}
                        >
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ═══ Footer ═══ */}
              <footer
                className="py-12 px-6"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  background: "#080808",
                }}
              >
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 200,
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    AgentSearch
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    Built for builders.
                  </span>
                </div>
              </footer>
            </main>
          </>
        )}
      </motion.div>
    </div>
  );
}
