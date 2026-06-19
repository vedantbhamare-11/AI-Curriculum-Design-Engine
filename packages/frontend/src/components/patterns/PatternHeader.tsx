"use JSX";
'use client';

import React from 'react';
import { Sliders, Plus } from 'lucide-react';

interface PatternHeaderProps {
  onAppendSection: () => void;
  patternCount: number;
}

export function PatternHeader({ onAppendSection, patternCount }: PatternHeaderProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 shadow-sm">
            <Sliders className="h-5 w-5 stroke-[2.5]" />
          </span>
          Blueprint Pattern Customizer
        </h1>
        <p className="text-sm text-slate-500 font-bold max-w-xl">
          Build bespoke exam structures, map structural markings, and supply AI guidelines. Currently maintaining{" "}
          <span className="text-slate-900 font-black bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 text-xs">
            {patternCount} Archetype{patternCount !== 1 ? 's' : ''}
          </span>{" "}
          available across your faculty drop-down pickers.
        </p>
      </div>

      <button 
        type="button"
        onClick={onAppendSection}
        className="h-11 px-5 bg-[#2563EB] hover:bg-blue-700 text-white font-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-sm transition-all duration-200 active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
      >
        <Plus className="h-4 w-4 stroke-[3]" /> Append Section Block
      </button>
    </div>
  );
}