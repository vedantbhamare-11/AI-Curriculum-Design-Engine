"use JSX";
'use client';

import React from 'react';
import { Calendar, Layers, FileText, Award, Eye, Trash2, Loader2 } from 'lucide-react';

interface AssignmentRecord {
  _id: string;
  subject: string;
  className: string;
  totalQuestions: number;
  totalMarks: number;
  status: string;
  createdAt: string;
}

interface LibraryCardProps {
  paper: AssignmentRecord;
  isDeleting: boolean;
  onView: (paper: AssignmentRecord) => void;
  onStageDelete: (id: string) => void;
}

export function LibraryCard({ paper, isDeleting, onView, onStageDelete }: LibraryCardProps) {
  return (
    <div 
      className={`bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden h-60 relative group ${
        isDeleting ? 'opacity-40 pointer-events-none scale-[0.99]' : 'opacity-100'
      }`}
    >
      {/* Upper Content Area */}
      <div className="p-5 space-y-4 flex-1">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[10px] rounded-md uppercase tracking-wider">
                {paper.subject}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <Calendar className="h-3 w-3 stroke-[2]" />
                {new Date(paper.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug truncate pt-0.5">
              {paper.subject} Examination Blueprint
            </h3>
          </div>
        </div>

        {/* Structured Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs font-bold text-slate-600">
          <div className="space-y-0.5">
            <div className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Class Grade</div>
            <div className="text-slate-800 uppercase truncate flex items-center justify-center gap-1">
              <Layers className="h-3.5 w-3.5 text-slate-400 stroke-[1.8]" /> {paper.className}
            </div>
          </div>
          <div className="space-y-0.5 border-x border-slate-200">
            <div className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Questions</div>
            <div className="text-slate-800 flex items-center justify-center gap-1">
              <FileText className="h-3.5 w-3.5 text-slate-400 stroke-[1.8]" /> {paper.totalQuestions}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Weight</div>
            <div className="text-indigo-600 font-extrabold flex items-center justify-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-500 stroke-[1.8]" /> {paper.totalMarks}M
            </div>
          </div>
        </div>
      </div>

      {/* 💼 PROFESSIONAL ANCHORED ACTION FOOTER */}
      <div className="bg-slate-50/70 border-t border-slate-100 p-3 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onView(paper)}
          disabled={isDeleting}
          className="flex-1 h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99] shadow-sm"
        >
          <Eye className="h-3.5 w-3.5 stroke-[2.2]" /> 
          View & Print Paper
        </button>
        
        <button
          type="button"
          onClick={() => onStageDelete(paper._id)}
          disabled={isDeleting}
          title="Delete Assessment Permanent Record"
          className="h-9 w-9 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl flex items-center justify-center transition-all active:scale-95 bg-white shadow-sm shrink-0"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
          ) : (
            <Trash2 className="h-3.5 w-3.5 stroke-[2.2]" />
          )}
        </button>
      </div>

    </div>
  );
}