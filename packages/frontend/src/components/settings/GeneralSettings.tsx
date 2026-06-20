"use JSX";
'use client';

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { School, Layers, User, ShieldCheck, ScrollText } from 'lucide-react';

export function GeneralSettings() {
  const { 
    schoolName, 
    departmentName, 
    teacherName, 
    teacherId, 
    defaultInstructions, 
    gradingScale, 
    updateSettings 
  } = useSettingsStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 🏫 SECTION A: ORGANIZATIONAL METRICS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <School className="h-4 w-4 stroke-[2.5]" /> 1. Institutional Node Hierarchy
          </h3>
          <p className="text-[11px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">Configure identity headers for generated layouts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Campus / School Name
            </label>
            <div className="relative">
              <School className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 stroke-[2.2]" />
              <input
                type="text"
                value={schoolName}
                onChange={(e) => updateSettings({ schoolName: e.target.value })}
                className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                placeholder="e.g., Stanford High School"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Academic Department
            </label>
            <div className="relative">
              <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 stroke-[2.2]" />
              <input
                type="text"
                value={departmentName}
                onChange={(e) => updateSettings({ departmentName: e.target.value })}
                className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                placeholder="e.g., Department of Mathematics"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Lead Educator / Proctor
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 stroke-[2.2]" />
              <input
                type="text"
                value={teacherName}
                onChange={(e) => updateSettings({ teacherName: e.target.value })}
                className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                placeholder="e.g., Dr. Aris Thorne"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Staff ID Token
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 stroke-[2.2]" />
              <input
                type="text"
                value={teacherId}
                onChange={(e) => updateSettings({ teacherId: e.target.value })}
                className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl text-sm font-mono font-black text-slate-700 focus:outline-none placeholder:text-slate-400"
                placeholder="STAFF-ID"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 📝 SECTION B: COMPASS SCHEMA BOILERPLATES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ScrollText className="h-4 w-4 stroke-[2.5]" /> 2. Assessment Blueprint Defaults
          </h3>
          <p className="text-[11px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">Pre-set instructions injected straight into system generators.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Default Paper Instructions Boilerplate
          </label>
          <textarea
            rows={3}
            value={defaultInstructions}
            onChange={(e) => updateSettings({ defaultInstructions: e.target.value })}
            className="w-full p-3.5 border border-slate-200 focus:border-slate-400 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none resize-none placeholder:text-slate-400"
            placeholder="Directions automatically mapped into generated sheet header headers..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Default Grading Scheme Evaluation Scale
          </label>
          <select
            value={gradingScale}
            onChange={(e) => updateSettings({ gradingScale: e.target.value })}
            className="w-full h-11 px-3 border border-slate-200 focus:border-slate-400 rounded-xl text-xs font-black text-slate-900 bg-white focus:outline-none cursor-pointer"
          >
            <option value="Percentage (A-F Standard)">Percentage (A-F Standard)</option>
            <option value="CGPA Scales (10-Point)">CGPA Scales (10-Point)</option>
            <option value="Competency-Based Grades">Competency-Based Grades</option>
          </select>
        </div>
      </div>

    </div>
  );
}