"use JSX";
'use client';

import React from 'react';
import { Calendar, Eye, FilePlay, Trash2 } from 'lucide-react';

interface VaultDocument {
  _id: string;
  title: string;
  description: string;
  subject: string;
  fileSizeText: string;
  createdAt: string;
}

interface VaultCardProps {
  doc: VaultDocument;
  onViewPdf: (id: string, title: string) => void;
  onReviseText: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}

export function VaultCard({ doc, onViewPdf, onReviseText, onDelete }: VaultCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group h-64">
      
      {/* ✨ GLASSMORPHIC HOVER OVERLAY CONTROL MATRIX */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 flex flex-col items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={() => onViewPdf(doc._id, doc.title)}
          className="h-10 w-44 bg-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-700 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 active:scale-95"
        >
          <FilePlay className="h-4 w-4 stroke-[2.2]" /> View PDF Reader
        </button>
        <button
          type="button"
          onClick={() => onReviseText(doc._id)}
          className="h-10 w-44 bg-white text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-slate-50 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 delay-75 active:scale-95"
        >
          <Eye className="h-4 w-4 text-slate-500 stroke-[2.2]" /> Revise Contents
        </button>
        <button
          type="button"
          onClick={() => onDelete(doc._id, doc.title)}
          className="h-10 w-44 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 delay-100 active:scale-95"
        >
          <Trash2 className="h-4 w-4 stroke-[2.2]" /> Delete Archive
        </button>
      </div>

      <div className="space-y-3.5">
        <div className="flex justify-between items-center">
          <span className="px-2.5 py-0.5 bg-slate-50 text-slate-600 font-extrabold text-[10px] rounded-lg uppercase tracking-wider border border-slate-200/60 shadow-sm">
            {doc.subject}
          </span>
          <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
            {doc.fileSizeText}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
            {doc.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium line-clamp-4 leading-relaxed">
            {doc.description}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 stroke-[2.2]" /> 
          Archived: {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}