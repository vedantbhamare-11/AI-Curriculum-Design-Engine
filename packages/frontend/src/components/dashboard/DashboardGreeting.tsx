"use JSX";
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Wand2, Vault } from 'lucide-react';

export function DashboardGreeting() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-950/20">
      {/* Dynamic background styling glow loops */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-indigo-300 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 stroke-[2.2]" /> Core Management Dashboard
        </div>
        
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Welcome back to your Assessment Workspace
          </h2>
          <p className="text-slate-300 font-medium text-xs sm:text-sm leading-relaxed">
            Construct schema-validated blueprints, monitor enqueued asynchronous background generation loops, and query grounding manual libraries.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => router.push('/create')}
            className="h-11 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Wand2 className="h-4 w-4" /> Create Assessment
          </button>
          <button
            onClick={() => router.push('/vault')}
            className="h-11 px-5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all active:scale-95"
          >
            <Vault className="h-4 w-4 text-slate-300" /> Open Context Vault
          </button>
        </div>
      </div>
    </div>
  );
}