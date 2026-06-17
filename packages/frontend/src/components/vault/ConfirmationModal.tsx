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
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100/50 shadow-sm animate-pulse">
            <AlertTriangle className="h-8 w-8 stroke-[2.2]" />
          </div>
        </div>

        <div className="space-y-1.5 px-2">
          <h4 className="text-base font-black text-slate-900 tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-11 text-xs font-black uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}