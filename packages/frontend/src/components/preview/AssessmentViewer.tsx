"use JSX";
'use client';

import React, { useState } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { Printer, RotateCcw, Eye, Key } from 'lucide-react';

export default function AssessmentViewer() {
  const store = useAssignmentStore();
  const [activeTab, setActiveTab] = useState<'paper' | 'answers'>('paper');

  const paper = store.generatedPaper;

  if (!paper) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* 📱 TOP BAR CONTROLLER: Switches layout direction on mobile to preserve readable spacing */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm gap-3 sm:gap-4 print:hidden">
        <div className="flex bg-slate-50 p-1 border border-slate-200 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('paper')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-9 rounded-lg text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'paper' 
                ? 'bg-white border border-slate-200 text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="h-4 w-4" /> Question Paper
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-9 rounded-lg text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'answers' 
                ? 'bg-white border border-slate-200 text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="h-4 w-4" /> Answer Key
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
          <button
            onClick={() => store.resetStore()}
            className="h-9 w-9 text-slate-400 hover:text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center transition-all shadow-sm cursor-pointer bg-white"
            title="Create New Template"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 h-9 bg-[#2563EB] hover:bg-blue-700 text-white border border-blue-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm whitespace-nowrap"
          >
            <Printer className="h-4 w-4" /> Print PDF
          </button>
        </div>
      </div>

      {/* Plain Paper Board Sheet Container - Drops border vectors during printing passes */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden min-h-125 sm:min-h-200 print:border-none print:shadow-none print:bg-white print:m-0 print:p-0">
        
        {/* TAB 1: PURE EXAM QUESTION PAPER VIEW */}
        {activeTab === 'paper' ? (
          /* 📱 BOARD SHEET RESPONSIVE PADDING: Downsized from p-12 down to an adaptive p-4 sm:p-16 frame layout */
          <div className="p-4 sm:p-12 md:p-16 max-w-4xl mx-auto space-y-6 sm:space-y-8 font-serif text-slate-900 print:p-0 print:max-w-full">
            
            {/* Standard Clean White-Label Exam Header Block */}
            <div className="text-center space-y-3 border-b-4 border-slate-900 pb-4 sm:pb-5">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-slate-900">Assessment Paper</h2>
              
              {/* 📱 INFO HEADER METRICS MATRIX: Swaps grid counts from 1 on mobile to 2 on desktop to prevent clipping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 text-[11px] sm:text-xs font-black uppercase tracking-wider gap-x-4 gap-y-1.5 pt-2 font-sans text-slate-500">
                <div className="text-left">Subject: <span className="text-slate-900">{paper.subject}</span></div>
                <div className="text-left sm:text-right">Class / Grade: <span className="text-slate-900">{paper.className}</span></div>
                <div className="text-left">Total Questions: <span className="text-slate-900">{paper.totalQuestions}</span></div>
                <div className="text-left sm:text-right text-slate-900">Max Marks: <span>{paper.totalMarks} Marks</span></div>
              </div>
            </div>

            {/* Render Sections Loop */}
            {paper.sections.map((section: any, sIdx: number) => (
              <div key={sIdx} className="space-y-4 sm:space-y-5 pt-2 print:break-inside-avoid-page">
                
                {/* Section Header Divider */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-0.5 bg-slate-200 flex-1 print:bg-black"></div>
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900 font-sans">Section {section.sectionLetter}</h3>
                  <div className="h-0.5 bg-slate-200 flex-1 print:bg-black"></div>
                </div>
                
                {/* Structural Instructions Bar */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 print:bg-transparent print:border-none print:p-0">
                  <p className="text-[11px] sm:text-xs font-bold italic text-slate-700 print:text-black font-sans leading-normal">
                    Instructions: {section.instruction}
                  </p>
                </div>

                {/* Questions Block Wrapper */}
                <div className="space-y-5 sm:space-y-6 pl-0.5">
                  {(() => {
                    const activeQuestions = section.questions || [];

                    if (activeQuestions.length === 0) {
                      return (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                          <p className="text-xs font-bold text-slate-400 italic font-sans">
                            No questions generated for this section. Ensure your context grounding file contains readable text parameters.
                          </p>
                        </div>
                      );
                    }

                    return activeQuestions.map((q: any, qIdx: number) => {
                      const targetQuestionText = q.text || q.questionText || q.question_text || q.question || "Untitled Question Statement Block";
                      
                      return (
                        <div key={qIdx} className="space-y-2 print:break-inside-avoid-page">
                          <div className="flex justify-between items-start gap-4 sm:gap-6">
                            <p className="text-sm sm:text-base leading-relaxed text-slate-900 print:text-black flex-1 font-medium">
                              <span className="font-bold mr-1">{qIdx + 1}.</span> {targetQuestionText}
                            </p>
                            <span className="text-[10px] sm:text-xs font-black text-slate-400 whitespace-nowrap print:text-black font-sans uppercase tracking-wide pt-0.5">
                              ({q.marks || q.marksPerQuestion || section.marksPerQuestion || 0}m)
                            </span>
                          </div>

                          {/* 📱 MCQ REFLOW MATRIX: Swaps grid-cols-1 on phones to single columns, shifting to grid-cols-2 under sm break limits */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pl-4 sm:pl-6 pt-1">
                              {q.options.map((option: string, oIdx: number) => (
                                <div key={oIdx} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-800 print:text-black leading-tight">
                                  <span className="h-5 w-5 rounded-lg border border-slate-200 font-sans flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0 bg-slate-50 shadow-inner mt-0.5 print:bg-transparent">
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span className="pt-0.5">{option}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          
          /* TAB 2: PURE ANSWER KEY & MARKING SCHEME VIEW */
          <div className="p-4 sm:p-12 md:p-16 max-w-4xl mx-auto space-y-6 sm:space-y-8 font-sans text-slate-900 print:p-0 print:max-w-full">
            <div className="text-center space-y-2 border-b-4 border-slate-900 pb-4 sm:pb-5">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-slate-900">Answer Key</h2>
              <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider">Subject: {paper.subject} | Class: {paper.className}</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {(() => {
                const activeAnswerKey = paper.answerKey || [];

                if (activeAnswerKey.length === 0) {
                  return (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <p className="text-xs font-bold text-slate-400 italic">
                        No answers mapped for this assessment sheet template configuration.
                      </p>
                    </div>
                  );
                }

                return activeAnswerKey.map((ans: any, aIdx: number) => (
                  <div key={aIdx} className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl print:bg-transparent print:border-none print:p-0 print:break-inside-avoid-page">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-xs text-slate-900 uppercase tracking-wider">Question {ans.questionNumber || (aIdx + 1)}:</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed pl-0.5">
                      {ans.answerText || ans.answer || "No verified solution criteria written."}
                    </p>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}