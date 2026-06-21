"use JSX";
'use client';

import React from 'react';
import { LayoutDashboard, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isSyncing: boolean;
}

export function DashboardHeader({ onRefresh, isSyncing }: DashboardHeaderProps) {
  return (
    /* 📱 SMOOTH FLEX WRAPPING: Adjusted to clean flex-col alignment on phones to handle full width buttons */
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 transition-all duration-300">
      <div className="space-y-1 sm:space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
          <span className="p-1.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-slate-800">
            <LayoutDashboard className="h-4 sm:h-5 sm:w-5 stroke-[2.5]" />
          </span>
          Teacher Workspace Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-xl">
          Platform overview, operational shortcuts, and real-time analytical telemetry tracking logs.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isSyncing}
        className="w-full sm:w-auto h-11 px-5 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
        title="Refresh Server Metrics Feed"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-[#2563EB]' : 'text-slate-500'}`} />
        <span>{isSyncing ? 'Syncing Logs' : 'Refresh Metrics'}</span>
      </button>
    </div>
  );
}