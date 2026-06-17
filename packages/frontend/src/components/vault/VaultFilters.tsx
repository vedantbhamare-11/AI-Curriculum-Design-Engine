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
  { id: 'All', label: 'All Fields', color: 'bg-slate-900 text-white border-slate-900' },
  { id: 'Science', label: 'Science', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/60' },
  { id: 'Mathematics', label: 'Mathematics', color: 'bg-blue-50 text-indigo-700 border-blue-200 hover:bg-blue-100/60' },
  { id: 'English Literature', label: 'Literature', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/60' },
  { id: 'History', label: 'History', color: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/60' }
];

export function VaultFilters({
  searchQuery,
  setSearchQuery,
  selectedSubject,
  setSelectedSubject
}: VaultFiltersProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="relative w-full lg:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 stroke-[2.5]" />
        <input
          type="text"
          placeholder="Search vault archives by title or summary keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-11 pr-4 bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-indigo-600"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none snap-x">
        {SUBJECT_BADGES.map(sub => {
          const isActive = selectedSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`h-10 px-4 text-xs font-bold rounded-xl border transition-all duration-200 whitespace-nowrap snap-client active:scale-95 ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                  : `bg-white border-slate-200 text-slate-600 hover:border-slate-300 ${sub.color}`
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