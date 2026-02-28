// SearchBar — prominent search bar with optional category dropdown
// Used in Header (centre position)

"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center w-full max-w-xl">
      {/* TODO: Category dropdown select + text input + search button */}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products, brands, origins..."
        className="flex-1 h-10 px-4 rounded-l-lg border border-border focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
      />
      <button
        className="h-10 px-4 bg-brand-500 text-white rounded-r-lg hover:bg-brand-600 transition-colors text-sm font-medium"
        aria-label="Search"
      >
        Search
      </button>
    </div>
  );
}
