"use JSX";
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Wand2, Vault } from 'lucide-react';

export function DashboardGreeting() {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm transition-all duration-300">
      {/* Playful academic design accents - Left margin ink strip */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-school-ink" />
      <div className="absolute right-0 top-0 w-64 h-64 bg-tint-blue rounded-full blur-3xl pointer-events-none opacity-70" />

      <div className="relative z-10 max-w-xl space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-tint-blue rounded-xl border border-blue-100 text-school-ink font-bold text-xs uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> Core Management Dashboard
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-school-navy leading-tight">
            Welcome back to your Assessment Workspace
          </h2>
          <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed">
            Construct schema-validated blueprints, monitor enqueued asynchronous background generation loops, and query grounding manual libraries.
          </p>
        </div>

        <div className="pt-1 flex flex-wrap gap-3">
          <button
            onClick={() => router.push('/create')}
            className="h-11 px-5 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Wand2 className="h-4 w-4" /> Create Assessment
          </button>
          <button
            onClick={() => router.push('/vault')}
            className="h-11 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-school-navy font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Vault className="h-4 w-4 text-slate-500" /> Open Context Vault
          </button>
        </div>
      </div>
    </div>
  );
}