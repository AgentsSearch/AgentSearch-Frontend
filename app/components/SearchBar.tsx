"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isSearched: boolean;
}

export function SearchBar({ value, onChange, onSearch, isSearched }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What agent are you looking for?"
          className={`w-full px-6 py-5 pr-14 bg-white border border-neutral-200 rounded-2xl
            focus:outline-none focus:border-neutral-400 transition-all duration-300
            text-lg placeholder:text-neutral-400
            ${isSearched ? 'py-4 text-base' : 'py-5 text-lg'}`}
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          disabled={!value.trim()}
        >
          <Search className="w-5 h-5 text-neutral-600" />
        </button>
      </div>
    </form>
  );
}
