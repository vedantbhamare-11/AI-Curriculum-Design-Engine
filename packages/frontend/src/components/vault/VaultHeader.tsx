"use JSX";
'use client';

import React from 'react';
import { FolderHeart, UploadCloud } from 'lucide-react';

interface VaultHeaderProps {
  onOpenUpload: () => void;
  documentCount: number;
}

export function VaultHeader({ onOpenUpload, documentCount }: VaultHeaderProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
            <FolderHeart className="h-5 w-5 stroke-[2.5]" />
          </span>
          Reference Context Vault
        </h1>
        <p className="text-sm text-slate-500 font-bold max-w-xl">
          Archive reference textbooks, syllabi, and guidelines. Your active background worker currently indexes{" "}
          <span className="text-slate-900 font-black bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 text-xs">
            {documentCount} Asset{documentCount !== 1 ? 's' : ''}
          </span>{" "}
          available for contextual grounding layout rules parameters.
        </p>
      </div>

      <button 
        onClick={onOpenUpload}
        className="h-11 px-5 bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-sm transition-all duration-200 active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
      >
        <UploadCloud className="h-4 w-4 stroke-[3]" /> Upload Vault Document
      </button>
    </div>
  );
}