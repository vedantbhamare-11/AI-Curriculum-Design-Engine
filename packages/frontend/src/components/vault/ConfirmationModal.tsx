"use JSX";
'use client';

import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm Purge"
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* 📱 MOBILE INSULATION: Adjusted p-6 down to p-5 for a safer fit on tight mobile device aspect ratios */}
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl shadow-2xl p-5 sm:p-6 relative z-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute right-3 top-3 sm:right-4 sm:top-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>

        <div className="flex justify-center pt-2">
          <div className="p-3 text-amber-600 rounded-2xl border border-amber-100 bg-slate-50">
            <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
          </div>
        </div>

        <div className="space-y-1 px-1 sm:px-2">
          <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
            {title}
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 font-semibold leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-1 grid grid-cols-2 gap-2.5 sm:gap-3 text-xs font-black uppercase tracking-wider">
          <button
            type="button"
            onClick={onClose}
            className="h-11 text-slate-500 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-11 text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}