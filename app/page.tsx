"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AgentCard, Agent } from "./components/AgentCard";
import { SearchingAnimation } from "./components/SearchingAnimation";
import { Search } from "lucide-react";

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

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <AnimatePresence>
        {isSearching && (
          <SearchingAnimation query={searchQuery} onComplete={handleSearchComplete} />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          y: showResults ? 0 : 0,
          opacity: isSearching ? 0.3 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        {showResults ? (
          <>
            <header className="border-b border-neutral-200/50 backdrop-blur-sm bg-white/80 sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <button
                  onClick={handleNewSearch}
                  className="text-2xl font-light hover:text-neutral-600 transition-colors"
                  style={{ color: "#5D5346" }}
                >
                  AgentSearch
                </button>

                <button
                  onClick={handleNewSearch}
                  className="backdrop-blur-md bg-white/60 border border-white/40 px-4 py-2 rounded-xl hover:bg-white/80 transition-all text-sm font-medium shadow-sm"
                  style={{ color: "#5D5346" }}
                >
                  New Search
                </button>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for agents..."
                      className="w-full px-6 py-4 pr-14 backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:bg-white/80 focus:border-white/60 transition-all duration-300 text-base placeholder:text-neutral-400 shadow-lg"
                      style={{ color: "#5D5346" }}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 backdrop-blur-md rounded-xl transition-all shadow-lg"
                      style={{ backgroundColor: "#5D5346" }}
                    >
                      <Search className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 text-center"
              >
                <h2 className="text-3xl font-light mb-2" style={{ color: "#5D5346" }}>
                  Results for <span className="font-medium">"{searchQuery}"</span>
                </h2>
                <p className="text-neutral-600">{agents.length} agents found</p>
              </motion.div>

              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-4">
                  {sortedAgents.map((agent, index) => (
                    <AgentCard key={agent.id} agent={agent} index={index} />
                  ))}
                </div>
              </div>
            </main>
          </>
        ) : (
          <div className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h1
                  className="text-6xl md:text-7xl font-light mb-4 tracking-tight"
                  style={{ color: "#5D5346" }}
                >
                  Agent Search
                </h1>
                <p className="text-xl text-neutral-600 max-w-xl mx-auto">
                  Find the best AI agents for your task
                </p>
              </motion.div>

              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you need help with?"
                    className="w-full px-8 py-6 pr-16 backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:bg-white/80 focus:border-white/60 transition-all duration-300 text-lg placeholder:text-neutral-400 shadow-xl"
                    style={{ color: "#5D5346" }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 backdrop-blur-md disabled:bg-neutral-300 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg"
                    style={{ backgroundColor: !searchQuery.trim() ? undefined : "#5D5346" }}
                  >
                    <Search className="w-6 h-6 text-white" />
                  </button>
                </div>
              </motion.form>

              
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}