// src/components/common/SearchBar.jsx
import { Search } from 'lucide-react';

export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="mb-8 md:mb-10 w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari resep berdasarkan nama..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-3 pl-12 pr-4 text-slate-700 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg transition-all duration-300 placeholder-slate-400"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>
    </div>
  );
}