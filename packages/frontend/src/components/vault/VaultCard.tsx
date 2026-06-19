"use JSX";
'use client';

import React from 'react';
import { Calendar, Eye, FileText, Trash2 } from 'lucide-react';

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
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden h-60 relative group">
      
      <div className="p-5 flex-1 space-y-3">
        <div className="flex justify-between items-center">
          <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 font-black text-[10px] rounded-md uppercase tracking-wider">
            {doc.subject}
          </span>
          <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
            {doc.fileSizeText}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {doc.title}
          </h3>
          <p className="text-xs text-slate-500 font-semibold line-clamp-3 leading-relaxed">
            {doc.description}
          </p>
        </div>
      </div>

      <div className="px-5 pb-3 flex items-center text-[10px] font-bold text-slate-400 gap-1.5">
        <Calendar className="h-3.5 w-3.5 stroke-[2.2]" />
        Uploaded: {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>

      <div className="bg-slate-50/70 border-t border-slate-100 p-3 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onViewPdf(doc._id, doc.title)}
          className="flex-1 h-9 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-[0.99] shadow-sm cursor-pointer"
        >
          <FileText className="h-3.5 w-3.5" /> View PDF
        </button>
        <button
          type="button"
          onClick={() => onReviseText(doc._id)}
          className="h-9 px-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400" /> Inspect
        </button>
        <button
          type="button"
          onClick={() => onDelete(doc._id, doc.title)}
          title="Delete Document permanently"
          className="h-9 w-9 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
}