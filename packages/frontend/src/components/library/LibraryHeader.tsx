"use JSX";
'use client';

import React from 'react';
import { Library } from 'lucide-react';

interface LibraryHeaderProps {
  paperCount: number;
}

export function LibraryHeader({ paperCount }: LibraryHeaderProps) {
  return (
    /* 📱 RESPONSIVE BOX SCALING: Shifted from default static inner paddings down to a mobile-friendly p-4 shell */
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
      <div className="space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 sm:gap-3">
          <span className="p-1.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
            <Library className="h-4 sm:h-5 sm:w-5 stroke-[2.5]" />
          </span>
          My Library Archive
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-xl">
          Access, review, and reprint your historical curriculum exam records instantly. Currently managing{" "}
          <span className="text-slate-900 font-black bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 text-xs">
            {paperCount} Verified Blueprint{paperCount !== 1 ? 's' : ''}
          </span>{" "}
          inside your faculty database index catalogs.
        </p>
      </div>
    </div>
  );
}