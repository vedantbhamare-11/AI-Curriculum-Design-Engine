"use JSX";
'use client';

import React from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import UnifiedCreationForm from '@/components/forms/CreateAssignmentForm';
import StepFourPreview from '@/components/preview/StepFourPreview';

export default function CreateAssignmentPage() {
  const currentStep = useAssignmentStore((state) => state.currentStep);

  // 💡 HIERARCHICAL REFACTOR: If step equals 4, render the stable Document Viewer canvas wrapper panel sheet natively
  if (currentStep === 4) {
    return (
      <div className="w-full min-h-screen bg-white py-4 px-2 sm:px-6">
        <StepFourPreview />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 py-8 px-6 sm:px-10 lg:px-12 print:hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Banner Title Dashboard Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              AI Assessment Engine Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Select saved paper pattern configuration profiles, upload immediate class notes context, and compile exam sheets instantly.
            </p>
          </div>
        </div>

        {/* Mount Single Dashboard Workspace */}
        <UnifiedCreationForm />

      </div>
    </div>
  );
}