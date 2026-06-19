"use JSX";
'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface VaultFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
}

const SUBJECT_BADGES = [
  { id: 'All', label: 'All Fields' },
  { id: 'Science', label: 'Science' },
  { id: 'Mathematics', label: 'Mathematics' },
  { id: 'English Literature', label: 'Literature' },
  { id: 'History', label: 'History' }
];

export function VaultFilters({
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject
}: VaultFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="relative w-full lg:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 stroke-[2.5]" />
        <input
          type="text"
          placeholder="Search vault archives by title or summary keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 focus:border-slate-400 bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold rounded-xl transition-all focus:outline-none"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none snap-x">
        {SUBJECT_BADGES.map(sub => {
          const isActive = selectedSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`h-9 px-4 text-xs font-black uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {sub.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}