"use JSX";
'use client';

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Cpu, Gauge, Binary } from 'lucide-react';

export function AiSettings() {
  const { selectedModel, temperature, maxTokens, updateSettings } = useSettingsStore();

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-slate-400" /> Gemini Inference Engine Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => updateSettings({ selectedModel: e.target.value })}
            className="w-full h-11 px-3 border border-slate-200 focus:border-slate-400 rounded-xl text-xs font-black text-slate-900 bg-white focus:outline-none cursor-pointer"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultralight, Instant Quiz Generation)</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Multimodal Reasoning, Heavy Notes)</option>
          </select>
        </div>

        <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-inner">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-slate-400" /> Temperature Metric: <span className="text-slate-900 font-black font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-xs">{temperature}</span>
            </label>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider bg-white border border-slate-200/60 px-1.5 py-0.5 rounded">
              {temperature <= 0.3 ? 'Deterministic' : 'Creative'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={temperature}
            onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Binary className="h-4 w-4 text-slate-400" /> Max Target Tokens Threshold
          </label>
          <input
            type="number"
            min={512}
            max={8192}
            step={256}
            value={maxTokens}
            onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) || 2048 })}
            className="w-full h-11 px-3.5 border border-slate-200 focus:border-slate-400 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
          />
        </div>

      </div>
    </div>
  );
}