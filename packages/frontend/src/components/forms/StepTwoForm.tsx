"use JSX";
'use client';

import React, { useState } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { ArrowLeft, ArrowRight, Plus, Trash2, HelpCircle } from 'lucide-react';

export default function StepTwoForm() {
  const store = useAssignmentStore();
  const [error, setError] = useState<string | null>(null);

  // Available question formats matching academic standards
  const questionTypeOptions = [
    'Multiple Choice Questions',
    'Short Questions',
    'Long Questions',
    'Fill in the Blanks',
    'True or False'
  ];

  // Append a new empty rule structure block row
  const addConfigRow = () => {
    store.setQuestionConfigs([
      ...store.questionConfigs,
      { type: 'Multiple Choice Questions', count: 1, marksPerQuestion: 1 }
    ]);
  };

  // Remove a specific structural config row array row block index
  const removeConfigRow = (index: number) => {
    if (store.questionConfigs.length === 1) {
      setError('Your exam blueprint must contain at least one question type definition row.');
      return;
    }
    const updated = store.questionConfigs.filter((_, idx) => idx !== index);
    store.setQuestionConfigs(updated);
  };

  // Modify individual cells inline safely
  const updateRowValue = (index: number, key: 'type' | 'count' | 'marksPerQuestion', value: any) => {
    setError(null);
    const updated = store.questionConfigs.map((row, idx) => {
      if (idx === index) {
        let cleanValue = value;
        if (key === 'count' || key === 'marksPerQuestion') {
          cleanValue = parseInt(value) || 0;
        }
        return { ...row, [key]: cleanValue };
      }
      return row;
    });
    store.setQuestionConfigs(updated);
  };

  // Compute live matrix metadata properties dynamically for layout metrics panels
  const totalQuestions = store.questionConfigs.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const totalMarks = store.questionConfigs.reduce((acc, curr) => acc + ((curr.count || 0) * (curr.marksPerQuestion || 0)), 0);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // Guard evaluation metrics boundaries verification checks
    for (const row of store.questionConfigs) {
      if (row.count <= 0 || row.marksPerQuestion <= 0) {
        setError('All question counts and allocated individual mark points must be positive non-zero integers.');
        return;
      }
    }

    if (totalQuestions <= 0) {
      setError('Total configuration volume sum must contain valid quantitative entries.');
      return;
    }

    setError(null);
    store.setStep(3); // Advance to the confirmation check trigger layout screen
  };

  return (
    <div className="space-y-6 bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-sans">Structure Blueprint</h3>
        <p className="text-sm text-slate-500 font-sans">Draft the exact question distribution mix and point weights allocation metrics grid.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium rounded-lg font-sans">
          ⚠️ {error}
        </div>
      )}

      {/* 📊 Real-Time Matrix Totalizers */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
        <div className="text-center border-r border-slate-200/60 py-2">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">Total Balanced Items</span>
          <span className="text-2xl font-black text-slate-800 tracking-tight font-sans">{totalQuestions}</span>
        </div>
        <div className="text-center py-2">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">Maximum Test Score Summary</span>
          <span className="text-2xl font-black text-indigo-600 tracking-tight font-sans">{totalMarks} Marks</span>
        </div>
      </div>

      {/* Dynamic Data Mapping Row Loop Block */}
      <div className="space-y-3">
        {store.questionConfigs.map((config, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-white border border-slate-100 p-3 rounded-lg hover:border-slate-200/80 transition-all">
            
            {/* Format Drop Choice Select Element */}
            <div className="w-full md:flex-1">
              <label className="block md:hidden text-xs font-bold text-slate-500 mb-1 font-sans">Format Rule Type</label>
              <select
                value={config.type}
                onChange={(e) => updateRowValue(index, 'type', e.target.value)}
                className="w-full h-10 px-2 border border-slate-200 rounded-lg bg-slate-50/50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {questionTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Input Quantities Entry Item Box */}
            <div className="w-full md:w-32">
              <label className="block md:hidden text-xs font-bold text-slate-500 mb-1 font-sans">Item Volume Count</label>
              <input
                type="number"
                min="1"
                placeholder="Count"
                value={config.count || ''}
                onChange={(e) => updateRowValue(index, 'count', e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg bg-slate-50/50 text-sm font-bold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Scale Mark Points Value Cells */}
            <div className="w-full md:w-36">
              <label className="block md:hidden text-xs font-bold text-slate-500 mb-1 font-sans">Points Per Element</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="1"
                  placeholder="Marks"
                  value={config.marksPerQuestion || ''}
                  onChange={(e) => updateRowValue(index, 'marksPerQuestion', e.target.value)}
                  className="w-full h-10 pl-3 pr-8 border border-slate-200 rounded-lg bg-slate-50/50 text-sm font-bold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <span className="absolute right-3 text-xs font-bold text-slate-400 pointer-events-none font-sans">each</span>
              </div>
            </div>

            {/* Row Trash Striker Action */}
            <button
              type="button"
              onClick={() => removeConfigRow(index)}
              className="h-10 w-10 border border-slate-100 hover:border-rose-100 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg flex items-center justify-center transition-all self-end md:self-auto"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Row Generation Line Trigger Addition Panel */}
      <button
        type="button"
        onClick={addConfigRow}
        className="h-10 px-4 border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/40 hover:bg-indigo-50/20 text-indigo-600 font-bold text-sm rounded-lg flex items-center gap-2 transition-all"
      >
        <Plus className="h-4 w-4" /> Add Another Question Type
      </button>

      {/* Navigation Router Footer Controllers Buttons */}
      <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
        <button
          type="button"
          onClick={() => store.setStep(1)}
          className="h-11 px-5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg flex items-center gap-2 transition-all active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-indigo-100 active:scale-95"
        >
          Review Parameters <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}