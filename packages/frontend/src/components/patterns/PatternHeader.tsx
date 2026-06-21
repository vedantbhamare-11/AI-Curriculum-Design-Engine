"use JSX";
'use client';

import React from 'react';
import { Sliders, Plus } from 'lucide-react';

interface PatternHeaderProps {
  onAppendSection: () => void;
  patternCount: number;
}

export default function PatternHeader({ onAppendSection, patternCount }: PatternHeaderProps) {
  return (
    /* 📱 ADAPTIVE WRAPPING LAYOUT: Switches elements from flex-col to flex-row safely across responsive limits */
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 transition-all duration-300">
      <div className="space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 sm:gap-3">
          <span className="p-1.5 sm:p-2 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 shadow-sm">
            <Sliders className="h-4 sm:h-5 sm:w-5 stroke-[2.5]" />
          </span>
          Blueprint Pattern Customizer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-xl">
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
        className="w-full md:w-auto h-11 px-5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-95 shrink-0"
      >
        <Plus className="h-4 w-4 stroke-3" /> Append Section Block
      </button>
    </div>
  );
}