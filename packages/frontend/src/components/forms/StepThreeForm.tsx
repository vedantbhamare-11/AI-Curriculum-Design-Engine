"use JSX";
'use client';

import React, { useState } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { ArrowLeft, Sparkles, Loader2, ListChecks, HelpCircle } from 'lucide-react';

export default function StepThreeForm() {
  const store = useAssignmentStore();
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  // Helper calculation totals to show in summary block
  const totalQuestions = store.questionConfigs.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const totalMarks = store.questionConfigs.reduce((acc, curr) => acc + ((curr.count || 0) * (curr.marksPerQuestion || 0)), 0);

  // Polling helper function to track background worker progress execution state
  const pollGenerationStatus = async (assignmentId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/assignments/${assignmentId}`);
        const data = await res.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          store.updateFormFields({ 
            generationStatus: 'completed',
            generatedPaper: data
          });
          store.setStep(4); // Advance to the document rendering viewer screen layout panel!
        } else if (data.status === 'failed') {
          clearInterval(interval);
          store.updateFormFields({ generationStatus: 'failed' });
          setLoadingMessage('AI structural formatting generation failed. Please try again.');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000); // Poll every 2 seconds
  };

  // Submit form payload structure configuration to our express server pipeline
  const triggerGeneration = async () => {
    try {
      store.updateFormFields({ generationStatus: 'pending' });
      setLoadingMessage('Enqueuing task blueprint configuration criteria inside Redis...');

      const response = await fetch('http://localhost:5001/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: store.subject,
          className: store.className,
          dueDate: store.dueDate,
          additionalInstructions: store.additionalInstructions,
          questionConfigs: store.questionConfigs
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Server rejected creation sequence.');
      }

      // Update store state variables with tracking IDs
      store.updateFormFields({
        assignmentId: result.assignmentId,
        jobId: result.jobId,
        generationStatus: 'processing'
      });

      setLoadingMessage('Gemini Engine is crafting structured questions and answer schemas...');
      
      // Kickoff real-time API status checking
      pollGenerationStatus(result.assignmentId);

    } catch (err: any) {
      console.error(err);
      store.updateFormFields({ generationStatus: 'failed' });
      setLoadingMessage(err.message || 'Network connection pipeline failure.');
    }
  };

  // Render full overlay loader template if actively computing values background worker threads
  if (store.generationStatus === 'pending' || store.generationStatus === 'processing') {
    return (
      <div className="bg-white border border-slate-200 p-12 rounded-xl text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-87.5">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <h3 className="text-lg font-bold text-slate-900 font-sans">Generating Assessment Paper</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto font-medium font-sans bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
          ⚙️ {loadingMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-sans">Review & Custom Scope</h3>
        <p className="text-sm text-slate-500 font-sans">Add granular focus targets before spinning up the Gemini model assembly array.</p>
      </div>

      {store.generationStatus === 'failed' && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium rounded-lg font-sans">
          ❌ {loadingMessage}
        </div>
      )}

      {/* 📝 Additional Topic Focus Instructions input block */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 font-sans">
          <ListChecks className="h-4 w-4 text-indigo-500" /> Custom Instructions & Topic Focus
        </label>
        <textarea
          rows={3}
          placeholder="e.g., Focus heavily on Chapter 4. Ensure question vocabulary level matches a standard intermediate classroom."
          value={store.additionalInstructions}
          onChange={(e) => store.updateFormFields({ additionalInstructions: e.target.value })}
          className="w-full p-4 border border-slate-200 rounded-lg bg-slate-50/50 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-sans"
        />
      </div>

      {/* 📋 Absolute Blueprint Specs Confirmation Grid Block */}
      <div className="border border-slate-200/60 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200/60 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
          Configuration Parameter Summary
        </div>
        <div className="p-4 bg-white grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-sans">
          <div>
            <span className="block text-xs font-semibold text-slate-400 font-sans">Subject Target</span>
            <span className="font-bold text-slate-800 font-sans">{store.subject}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 font-sans">Classroom Grade</span>
            <span className="font-bold text-slate-800 font-sans">{store.className}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 font-sans">Total Items</span>
            <span className="font-bold text-slate-800 font-sans">{totalQuestions} Questions</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 font-sans">Score Weight</span>
            <span className="font-bold text-indigo-600 font-sans">{totalMarks} Maximum Marks</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons Controllers bar panel */}
      <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
        <button
          type="button"
          onClick={() => store.setStep(2)}
          className="h-11 px-5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-lg flex items-center gap-2 transition-all active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <button
          type="button"
          onClick={triggerGeneration}
          className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-emerald-100 active:scale-95"
        >
          <Sparkles className="h-4 w-4" /> Generate Assessment Paper
        </button>
      </div>
    </div>
  );
}