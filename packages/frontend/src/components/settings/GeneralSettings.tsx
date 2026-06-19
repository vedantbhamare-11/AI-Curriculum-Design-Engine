"use JSX";
'use client';

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { School, Layers, User, ShieldCheck, ScrollText, Percent } from 'lucide-react';

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
      
      {/* 🏫 SECTION A: ORGANIZATIONAL ANCHORS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <School className="h-4 w-4 stroke-[2.2]" /> 1. Institutional Node Hierarchy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              Campus / School
            </label>
            <div className="relative">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={schoolName}
                onChange={(e) => updateSettings({ schoolName: e.target.value })}
                className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 focus:border-indigo-600 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                placeholder="e.g., Stanford High School"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              Academic Department
            </label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={departmentName}
                onChange={(e) => updateSettings({ departmentName: e.target.value })}
                className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 focus:border-indigo-600 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                placeholder="e.g., Department of Mathematics"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              Lead Educator / Proctor
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={teacherName}
                onChange={(e) => updateSettings({ teacherName: e.target.value })}
                className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 focus:border-indigo-600 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                placeholder="e.g., Dr. Aris Thorne"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              Staff ID Token
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={teacherId}
                onChange={(e) => updateSettings({ teacherId: e.target.value })}
                className="w-full h-11 pl-10 pr-4 bg-slate-50/60 border border-slate-200 focus:border-indigo-600 rounded-xl text-sm font-mono text-slate-700 focus:outline-none"
                placeholder="STAFF-ID"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 📝 SECTION B: DOCUMENT SCHEMAS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <ScrollText className="h-4 w-4 stroke-[2.2]" /> 2. Assessment Defaults
        </h3>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
            Default Paper Instructions Boilerplate
          </label>
          <textarea
            rows={3}
            value={defaultInstructions}
            onChange={(e) => updateSettings({ defaultInstructions: e.target.value })}
            className="w-full p-3.5 border border-slate-200 focus:border-indigo-600 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none resize-none"
            placeholder="Global directions automatically injected into printable sheets header matrix..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
            Default Grading Scheme Evaluation Scale
          </label>
          <select
            value={gradingScale}
            onChange={(e) => updateSettings({ gradingScale: e.target.value })}
            className="w-full h-11 px-3 border border-slate-200 focus:border-indigo-600 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:outline-none cursor-pointer"
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