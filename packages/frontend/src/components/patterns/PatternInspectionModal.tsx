"use JSX";
'use client';

import React from 'react';
import { X, Sliders, Layers, Sparkles, BookOpen } from 'lucide-react';

interface PatternSection {
  sectionLetter: string;
  sectionType: string;
  instruction: string;
  questionCount: number;
  marksPerQuestion: number;
  aiGuidelines?: string;
}

interface PatternProfile {
  _id: string;
  patternName: string;
  subjectDefault?: string;
  sections: PatternSection[];
}

interface PatternInspectionModalProps {
  pattern: PatternProfile | null;
  onClose: () => void;
}

export function PatternInspectionModal({ pattern, onClose }: PatternInspectionModalProps) {
  if (!pattern) return null;

  const totalQuestions = pattern.sections.reduce((sum, s) => sum + (Number(s.questionCount) || 0), 0);
  const totalMarks = pattern.sections.reduce((sum, s) => sum + ((Number(s.questionCount) || 0) * (Number(s.marksPerQuestion) || 0)), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-2xl bg-white h-[80vh] rounded-3xl shadow-2xl flex flex-col justify-between relative z-10 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header Title Space */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sliders className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-900 truncate pr-4">{pattern.patternName}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Blueprint Archetype Structure • Default: {pattern.subjectDefault || 'General Field'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0">
            <X className="h-4 w-4 stroke-[2.5] text-slate-500" />
          </button>
        </div>

        {/* Evaluation Metrics Aggregate Summary Panel */}
        <div className="bg-slate-900 text-slate-200 px-6 py-3 border-y border-slate-800 flex items-center justify-between text-xs font-bold tracking-wide shrink-0">
          <div className="flex gap-4">
            <div>Sections: <span className="text-indigo-400">{pattern.sections.length}</span></div>
            <div>Total Questions: <span className="text-indigo-400">{totalQuestions}</span></div>
          </div>
          <div>Total Blueprint Weight: <span className="text-emerald-400 font-extrabold">{totalMarks} Marks</span></div>
        </div>

        {/* Scrollable Section Iteration Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
          {pattern.sections.map((sec) => (
            <div key={sec.sectionLetter} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-extrabold text-[10px] rounded-md uppercase tracking-wider">
                  Section {sec.sectionLetter}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                  {sec.questionCount} Questions × {sec.marksPerQuestion}M = <span className="font-black text-slate-900">{sec.questionCount * sec.marksPerQuestion} Marks</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Question Category Type</span>
                <p className="text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">{sec.sectionType}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider block">Directive Instruction Script</span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">{sec.instruction}</p>
              </div>

              {sec.aiGuidelines && (
                <div className="space-y-1 bg-indigo-50/30 border border-indigo-100/40 p-3 rounded-lg">
                  <span className="text-[9px] uppercase font-black text-indigo-600 tracking-wider flex items-center gap-1"><Sparkles className="h-3 w-3" /> Guardrail Processing Rules</span>
                  <p className="text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-line">{sec.aiGuidelines}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer sticky area */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button onClick={onClose} className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95">
            Dismiss Details
          </button>
        </div>

      </div>
    </div>
  );
}