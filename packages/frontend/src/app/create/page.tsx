"use JSX";
'use client';

import React from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import UnifiedCreationForm from '@/components/forms/CreateAssignmentForm';
import StepFourPreview from '@/components/preview/AssessmentViewer';
import { Sparkles } from 'lucide-react';

export default function CreateAssignmentPage() {
  const currentStep = useAssignmentStore((state) => state.currentStep);

  if (currentStep === 4) {
    return (
      <div className="w-full min-h-screen bg-white py-4 px-2 sm:px-6">
        <StepFourPreview />
      </div>
    );
  }

  return (
    /* 📱 FLUID PADDING ADAPTATIONS: Shifted from absolute px-6 baseline to a tighter px-4 on mobile devices */
    <div className="w-full min-h-screen bg-slate-50 py-4 px-4 sm:py-8 sm:px-10 lg:px-12 print:hidden text-slate-900 space-y-4 sm:space-y-6">
      <div className="space-y-4 sm:space-y-6">
        
        {/* Banner Title Dashboard Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 sm:gap-3">
              <span className="p-1.5 sm:p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-slate-800">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
              </span>
              AI Assessment Engine Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-bold max-w-2xl leading-relaxed">
              Select saved paper pattern configuration profiles, attach immediate class notes context, and compile custom examination sheets instantly.
            </p>
          </div>
        </div>

        {/* Mount Single Dashboard Workspace */}
        <UnifiedCreationForm />

      </div>
    </div>
  );
}