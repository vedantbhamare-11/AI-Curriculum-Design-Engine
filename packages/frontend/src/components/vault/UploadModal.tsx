"use JSX";
'use client';

import React, { useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  setTitle: (t: string) => void;
  desc: string;
  setDesc: (d: string) => void;
  subject: string;
  setSubject: (s: string) => void;
  file: File | null;
  setFile: (f: File | null) => void;
  isSubmitting: boolean;
}

export function UploadModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  desc,
  setDesc,
  subject,
  setSubject,
  file,
  setFile,
  isSubmitting
}: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      {/* 📱 MAX HEIGHT SAFELOCK OVERLAY: Enables natural internal container scrolling on small devices */}
      <form onSubmit={onSubmit} className="bg-white border border-slate-200 w-full max-w-xl max-h-[94vh] overflow-y-auto rounded-2xl shadow-2xl p-4 sm:p-6 relative z-10 space-y-4 sm:space-y-5 scrollbar-none">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="p-1.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
              <UploadCloud className="h-4 w-4 stroke-[2.5]" />
            </span>
            Catalog Reference Textbook
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-50 rounded-lg cursor-pointer">
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="space-y-4">
          {/* 📱 METADATA GRID COALESCING: Forms break cleanly down into single inputs on smartphones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Book / Document Title</label>
              <input type="text" required placeholder="e.g., NCERT Grade 10 Science Book" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-11 px-3.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-400 bg-white placeholder:text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Category Field</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full h-11 px-3 border border-slate-200 rounded-xl text-xs font-black text-slate-900 bg-white focus:outline-none focus:border-slate-400 cursor-pointer">
                {['Science', 'Mathematics', 'English Literature', 'History'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Content Summary Target Scope</label>
            <textarea rows={3} required placeholder="Summarize the core chapters or variables covered so you can identify it instantly..." value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 resize-none focus:outline-none focus:border-slate-400 placeholder:text-slate-400" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Binary Document Stream Attachment</label>
            {!file ? (
              <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all space-y-1 group">
                <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-slate-600 mx-auto transition-colors stroke-[2.2]" />
                <p className="text-xs font-black text-slate-700">Select textbook or manual document path</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PDF, TXT or Markdown up to 50MB</p>
                <input type="file" ref={fileInputRef} required onChange={(e) => e.target.files && setFile(e.target.files[0])} accept=".pdf,.txt,.md" className="hidden" />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="h-8 w-12 bg-slate-900 text-white flex items-center justify-center rounded-lg font-black text-[9px] uppercase tracking-wider shrink-0">Asset</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-slate-800 truncate">{file.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{(file.size / (1024 * 1024)).toFixed(2)} MB • Source Ready</p>
                  </div>
                </div>
                <button type="button" onClick={() => setFile(null)} className="p-1 border border-slate-200 text-slate-400 hover:text-red-600 bg-white rounded-lg transition-colors cursor-pointer shrink-0 ml-2"><X className="h-4 w-4" /></button>
              </div>
            )}
          </div>
        </div>

        {/* 📱 FOOTER ACTION STACKING: Forces full width actions links buttons on thin viewport view tracks */}
        <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-2 text-xs font-bold uppercase tracking-wider shrink-0">
          <button type="button" onClick={onClose} className="w-full sm:w-auto h-11 px-5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors cursor-pointer orden-2 sm:order-1">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-11 px-5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 min-w-40 shadow-sm transition-all order-1 sm:order-2">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : 'Confirm Archive'}</button>
        </div>
      </form>
    </div>
  );
}