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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl shadow-2xl p-6 relative z-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>

        <div className="flex justify-center pt-2">
          <div className="p-3 text-amber-600 rounded-2xl border border-amber-100 bg-slate-50">
            <AlertTriangle className="h-7 w-7 stroke-[2.5]" />
          </div>
        </div>

        <div className="space-y-1 px-2">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            {title}
          </h4>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2 grid grid-cols-2 gap-3 text-xs font-black uppercase tracking-wider">
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