"use JSX";
'use client';

import React from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export function FeedbackModal({ isOpen, onClose, type, title, message }: FeedbackModalProps) {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl shadow-2xl p-6 relative z-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>

        <div className="flex justify-center pt-2">
          {isSuccess ? (
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/50 shadow-sm animate-bounce">
              <CheckCircle2 className="h-8 w-8 stroke-[2.2]" />
            </div>
          ) : (
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100/50 shadow-sm animate-shake">
              <AlertCircle className="h-8 w-8 stroke-[2.2]" />
            </div>
          )}
        </div>

        <div className="space-y-1.5 px-2">
          <h4 className="text-base font-black text-slate-900 tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`w-full h-11 text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] shadow-sm ${
              isSuccess 
                ? 'bg-slate-900 text-white hover:bg-slate-800' 
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}