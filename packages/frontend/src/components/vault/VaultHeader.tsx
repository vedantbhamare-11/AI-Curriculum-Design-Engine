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
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100/50">
            <FolderHeart className="h-6 w-6 stroke-[2.2]" />
          </span>
          Reference Context Vault
        </h1>
        <p className="text-sm text-slate-600 font-medium max-w-xl">
          Archive reference textbooks, syllabi, and guidelines. Your active background worker currently indexes{" "}
          <span className="text-indigo-600 font-black bg-indigo-50/60 px-2 py-0.5 rounded-lg border border-indigo-100/30 text-xs">
            {documentCount} Asset{documentCount !== 1 ? 's' : ''}
          </span>{" "}
          available for contextual grounding layer pipelines.
        </p>
      </div>

      <button 
        onClick={onOpenUpload}
        className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2.5 shadow-lg shadow-indigo-100 hover:shadow-indigo-200/50 transition-all duration-200 active:scale-95 shrink-0 self-start sm:self-auto"
      >
        <UploadCloud className="h-4 w-4 stroke-[2.5]" /> Upload Vault Document
      </button>
    </div>
  );
}