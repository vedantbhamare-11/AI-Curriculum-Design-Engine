"use JSX";
'use client';

import React from 'react';
import { Layers, HelpCircle, Award, Trash2, Sliders } from 'lucide-react';

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

interface PatternCatalogListProps {
  patterns: PatternProfile[];
  onSelectView: (pattern: PatternProfile) => void;
  onStageDelete: (id: string, name: string) => void;
}

export function PatternCatalogList({ patterns, onSelectView, onStageDelete }: PatternCatalogListProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Sliders className="h-4 w-4 text-slate-700 stroke-[2.2]" />
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
          Saved Blueprints Registry
        </h3>
      </div>

      {patterns.length === 0 ? (
        <p className="text-xs font-bold text-slate-400 py-4 text-center">
          No custom patterns saved in your database index yet.
        </p>
      ) : (
        <div className="space-y-2 max-h-120 overflow-y-auto pr-1 scrollbar-none">
          {patterns.map((pat) => {
            const totalQuestions = pat.sections.reduce((sum, s) => sum + (Number(s.questionCount) || 0), 0);
            const totalMarks = pat.sections.reduce((sum, s) => sum + ((Number(s.questionCount) || 0) * (Number(s.marksPerQuestion) || 0)), 0);

            return (
              <div 
                key={pat._id}
                onClick={() => onSelectView(pat)}
                className="p-3 sm:p-3.5 bg-slate-50/60 border border-slate-200 hover:border-slate-300 hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 sm:gap-4 group/item shadow-sm"
              >
                {/* min-w-0 forces the container to respect boundaries so children truncate instead of pushing components out */}
                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="text-xs font-black text-slate-900 truncate group-hover/item:text-slate-900 transition-colors">
                    {pat.patternName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-0.5 whitespace-nowrap"><Layers className="h-3 w-3" /> {pat.sections.length} Sec</span>
                    <span className="flex items-center gap-0.5 whitespace-nowrap"><HelpCircle className="h-3 w-3" /> {totalQuestions} Qs</span>
                    <span className="flex items-center gap-0.5 font-black text-slate-700 whitespace-nowrap"><Award className="h-3 w-3" /> {totalMarks}M</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Stops modal view popup from firing on touch
                    onStageDelete(pat._id, pat.patternName);
                  }}
                  /* 📱 MOBILE FIX: Set opacity-100 on mobile devices and only hide it on md viewports until desktop mouse hover */
                  className="h-8 w-8 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-lg flex items-center justify-center transition-all opacity-100 md:opacity-0 group-hover/item:opacity-100 shrink-0 shadow-sm cursor-pointer"
                  title="Permanently remove blueprint template"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}