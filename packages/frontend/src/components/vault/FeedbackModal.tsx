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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* 📱 MOBILE INSULATION: Smoothed padding parameters from p-6 down to p-5 on phones */}
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl shadow-2xl p-5 sm:p-6 relative z-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute right-3 top-3 sm:right-4 sm:top-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>

        <div className="flex justify-center pt-2">
          {isSuccess ? (
            <div className="p-3 text-emerald-600 rounded-2xl border border-emerald-100 bg-slate-50">
              <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
            </div>
          ) : (
            <div className="p-3 text-red-600 rounded-2xl border border-red-100 bg-slate-50">
              <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
            </div>
          )}
        </div>

        <div className="space-y-1 px-1 sm:px-2">
          <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
            {title}
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] shadow-sm bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}