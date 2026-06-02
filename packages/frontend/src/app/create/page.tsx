"use JSX";
'use client';

import React from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { ClipboardList, Settings, Sparkles, FileText } from 'lucide-react';
import StepOneForm from '@/components/forms/StepOneForm';
import StepTwoForm from '@/components/forms/StepTwoForm';
import StepThreeForm from '@/components/forms/StepThreeForm';
import StepFourPreview from '@/components/preview/StepFourPreview';

export default function CreateAssessmentPage() {
  const currentStep = useAssignmentStore((state) => state.currentStep);

  const stepsConfig = [
    { step: 1, label: 'General Info', icon: ClipboardList },
    { step: 2, label: 'Blueprint Configuration', icon: Settings },
    { step: 3, label: 'Review & Run', icon: Sparkles },
    { step: 4, label: 'Document Viewer', icon: FileText },
  ];

  const renderActiveStepComponent = () => {
    switch (currentStep) {
      case 1: return <StepOneForm />;
      case 2: return <StepTwoForm />;
      case 3: return <StepThreeForm />;
      case 4: return <StepFourPreview />;
      default: return <StepOneForm />;
    }
  };

  return (
    /* 🎨 Subdued, unified background workspace to make the unified main panels snap forward */
    <div className="w-full min-h-screen bg-slate-50/70 py-8 px-6 sm:px-10 lg:px-12 print:bg-white print:py-0 print:px-0">
      <div className="max-w-5xl mx-auto print:max-w-full space-y-6">
        
        {/* 🏢 Primary Elevated Main Layout Card Header Workspace */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm print:hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              AI Assessment Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Configure custom blueprints and balance exam sheets step-by-step.
            </p>
          </div>

          {/* 🗺️ Horizontal Interactive Progress Stepper Mini-Stack Inline */}
          <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
            {stepsConfig.map((item, index) => {
              const IconComponent = item.icon;
              const isCompleted = currentStep > item.step;
              const isActive = currentStep === item.step;

              return (
                <div key={item.step} className="flex items-center">
                  <div className="flex items-center gap-2 relative group">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 font-bold text-sm transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isActive
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    {/* Responsive Text Truncation Labels */}
                    <span
                      className={`text-xs font-bold tracking-wide hidden lg:inline-block transition-colors ${
                        isActive ? 'text-indigo-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Interactive Tooltip Hover Elements for smaller displays */}
                    <span className="lg:hidden absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-bold text-[10px] px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm z-50">
                      {item.label}
                    </span>
                  </div>

                  {index < stepsConfig.length - 1 && (
                    <div className="w-4 sm:w-6 md:w-4 lg:w-6 h-0.5 mx-1.5 bg-slate-200/80 rounded" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 🧱 Active Render Form Presentation Canvas Window */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 print:bg-white print:border-none print:shadow-none">
          <div className="transition-all duration-300 transform print:m-0 print:p-0">
            {renderActiveStepComponent()}
          </div>
        </div>

      </div>
    </div>
  );
}