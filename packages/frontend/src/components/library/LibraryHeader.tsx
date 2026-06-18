"use JSX";
'use client';

import React from 'react';
import { Library } from 'lucide-react';

interface LibraryHeaderProps {
  paperCount: number;
}

export function LibraryHeader({ paperCount }: LibraryHeaderProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50">
            <Library className="h-6 w-6 stroke-[2.2]" />
          </span>
          My Library Archive
        </h1>
        <p className="text-sm text-slate-600 font-medium max-w-xl">
          Access, review, and reprint your historical curriculum exam records instantly. Currently managing{" "}
          <span className="text-indigo-600 font-black bg-indigo-50/60 px-2 py-0.5 rounded-lg border border-indigo-100/30 text-xs">
            {paperCount} Verified Blueprint{paperCount !== 1 ? 's' : ''}
          </span>{" "}
          inside your database indices.
        </p>
      </div>
    </div>
  );
}