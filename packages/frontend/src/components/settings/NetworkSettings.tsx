"use JSX";
'use client';

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Info, RefreshCw } from 'lucide-react';

export function NetworkSettings() {
  const { resetSettings } = useSettingsStore();

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
        
        <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex items-start gap-3 shadow-inner">
          <Info className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Client-Side Runtime Persistence</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              All system variables are managed securely inside separate local browser storage layers. Saved profile boundaries automatically bundle into creation wizards without making expensive server network round trips.
            </p>
          </div>
        </div>

        {/* 📱 ADAPTIVE SYSTEM RESET FOOTER: Shifts instantly from row to flex-col block elements on mobile phones */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">System Reset Matrix</h4>
            <p className="text-xs text-slate-400 font-semibold">Clear active workspace records and revert back to institutional defaults.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Revert all workspace controls back to default configuration specifications?")) {
                resetSettings();
              }
            }}
            className="w-full sm:w-auto h-10 px-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="h-3.5 w-3.5 stroke-[2.2]" /> Reset Preferences
          </button>
        </div>

      </div>
    </div>
  );
}