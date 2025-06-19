"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative flex-1 group">
      <div 
        className={`relative rounded-xl ring-1 ring-inset transition-all duration-200 ${
          isFocused 
            ? "ring-yellow-500/50 bg-white shadow-[0_2px_14px_rgba(0,0,0,0.06)]" 
            : "ring-gray-200 bg-gray-50/50 hover:ring-gray-300"
        }`}
      >
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className={`h-4 w-4 transition-colors duration-200 ${
            isFocused ? "text-yellow-500" : "text-gray-400"
          }`} />
        </div>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search surah..."
          className={`border-0 bg-transparent pl-10 h-12 pr-10 placeholder:text-gray-400 
            focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
            isFocused ? "text-gray-900" : "text-gray-600"
          }`}
        />
        <AnimatePresence>
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <Button
                size="icon"
                variant="ghost"
                onClick={handleClear}
                className="h-8 w-8 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Animated focus indicator */}
      <div className="absolute -bottom-[9px] left-2 right-2 h-[2px] overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          className="h-full bg-yellow-500/50 origin-left rounded-full"
        />
      </div>
    </div>
  );
}
