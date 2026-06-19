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
      className={`bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden h-60 relative group ${
        isDeleting ? 'opacity-40 pointer-events-none scale-[0.99]' : 'opacity-100'
      }`}
    >
      {/* Upper Content Area */}
      <div className="p-5 space-y-4 flex-1">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 min-w-0 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 font-black text-[10px] rounded-md uppercase tracking-wider">
                {paper.subject}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {new Date(paper.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <h3 className="text-sm font-black text-slate-900 tracking-tight leading-snug truncate pt-0.5">
              {paper.subject} Examination Blueprint
            </h3>
          </div>
        </div>

        {/* Structured Metrics Info Row Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-slate-50 border border-slate-200/60 rounded-xl text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="space-y-0.5">
            <div className="text-[9px] font-black text-slate-400">Class Grade</div>
            <div className="text-slate-800 font-black truncate flex items-center justify-center gap-1 normal-case">
              <Layers className="h-3.5 w-3.5 text-slate-400" /> {paper.className}
            </div>
          </div>
          <div className="space-y-0.5 border-x border-slate-200">
            <div className="text-[9px] font-black text-slate-400">Questions</div>
            <div className="text-slate-800 font-black flex items-center justify-center gap-1 normal-case">
              <FileText className="h-3.5 w-3.5 text-slate-400" /> {paper.totalQuestions}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] font-black text-slate-400">Total Weight</div>
            <div className="text-slate-900 font-black flex items-center justify-center gap-1 normal-case">
              <Award className="h-3.5 w-3.5 text-slate-400" /> {paper.totalMarks}M
            </div>
          </div>
        </div>
      </div>

      {/* Anchored Action Footer Ribbon Links Container */}
      <div className="bg-slate-50/70 border-t border-slate-100 p-3 flex items-center gap-2 shrink-0">
        {/* 💡 FIXED: Replaced standard slate background with your strict branding color template marker */}
        <button
          type="button"
          onClick={() => onView(paper)}
          disabled={isDeleting}
          className="flex-1 h-9 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.99] shadow-sm cursor-pointer border border-blue-600"
        >
          <Eye className="h-3.5 w-3.5 stroke-[2.5]" /> 
          View & Print Paper
        </button>
        
        <button
          type="button"
          onClick={() => onStageDelete(paper._id)}
          disabled={isDeleting}
          title="Delete Assessment Permanent Record"
          className="h-9 w-9 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl flex items-center justify-center transition-all active:scale-95 bg-white shadow-sm shrink-0 cursor-pointer"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-red-600" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

    </div>
  );
}