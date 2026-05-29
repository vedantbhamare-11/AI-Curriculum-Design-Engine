"use JSX";
'use client';

import React, { useState } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { ArrowRight, BookOpen, GraduationCap, Calendar } from 'lucide-react';

export default function StepOneForm() {
  const store = useAssignmentStore();

  // Local validation state
  const [error, setError] = useState<string | null>(null);

  // Sync local submission with Zustand state tracking
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // Field guard validation check
    if (!store.subject || !store.className || !store.dueDate) {
      setError('Please fill out all general specification fields before proceeding.');
      return;
    }

    setError(null);
    store.setStep(2); // Advance layout stepper to blueprint breakdown configuration
  };

  // Reusable drop options for subject selections
  const subjectsPool = [
    'Science',
    'Mathematics',
    'English Literature',
    'History',
    'Geography',
    'Computer Science'
  ];

  return (
    <form onSubmit={handleNext} className="space-y-6 bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-slate-900">General Assessment Matrix</h3>
        <p className="text-sm text-slate-500">Provide the fundamental academic scope parameters for the AI evaluation framework.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📘 Subject Field Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <BookOpen className="h-4 w-4 text-indigo-500" /> Subject Field
          </label>
          <select
            value={store.subject}
            onChange={(e) => store.updateFormFields({ subject: e.target.value })}
            className="w-full h-11 px-3 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            <option value="">Select Target Subject...</option>
            {subjectsPool.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* 🎓 Target Class / Grade String Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <GraduationCap className="h-4 w-4 text-indigo-500" /> Grade / Class Level
          </label>
          <input
            type="text"
            placeholder="e.g., Grade 8, Class 10-A"
            value={store.className}
            onChange={(e) => store.updateFormFields({ className: e.target.value })}
            className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* 📅 Target Date Picker Input Grid Element */}
        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calendar className="h-4 w-4 text-indigo-500" /> Assessment Due Date
          </label>
          <input
            type="date"
            value={store.dueDate}
            onChange={(e) => store.updateFormFields({ dueDate: e.target.value })}
            className="w-full h-11 px-4 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Action Footer Button Group */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-indigo-100 active:scale-95"
        >
          Configure Blueprint Blueprint <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}