"use JSX";
'use client';

import React, { useState } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { Printer, RotateCcw, Eye, Key } from 'lucide-react';

export default function StepFourPreview() {
  const store = useAssignmentStore();
  const [activeTab, setActiveTab] = useState<'paper' | 'answers'>('paper');

  const paper = store.generatedPaper;

  if (!paper) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 🛠️ Top Bar Action Controller Panel - COMPLETELY HIDDEN ON PRINT */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4 print:hidden">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('paper')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'paper' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Eye className="h-4 w-4" /> Question Paper
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === 'answers' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Key className="h-4 w-4" /> Answer Key
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => store.resetStore()}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Create New"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" /> Print PDF
          </button>
        </div>
      </div>

      {/* 📄 Plain Paper Board Sheet Container - Strips container backgrounds/shadows during print */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden min-h-[800px] print:border-none print:shadow-none print:bg-white print:m-0 print:p-0">
        
        {/* 📘 TAB 1: PURE EXAM QUESTION PAPER VIEW */}
        {activeTab === 'paper' ? (
          <div className="p-12 sm:p-16 max-w-4xl mx-auto space-y-8 font-serif text-slate-900 print:p-0 print:max-w-full">
            
            {/* Standard Clean Exam Header Block - Start directly here on print */}
            <div className="text-center space-y-3 border-b-4 border-slate-900 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900">Assessment Paper</h2>
              <div className="grid grid-cols-2 text-sm font-bold uppercase tracking-wide gap-y-1 pt-2">
                <div className="text-left">Subject: {paper.subject}</div>
                <div className="text-right">Class / Grade: {paper.className}</div>
                <div className="text-left">Total Questions: {paper.totalQuestions}</div>
                <div className="text-right font-black text-slate-900">Max Marks: {paper.totalMarks} Marks</div>
              </div>
            </div>

            {/* AI GREETINGS ARE DROPPED COMPLETELY HERE - NO INTRO GREETING ACCORDING TO REQUIREMENTS */}

            {/* Render Sections Loop */}
            {paper.sections.map((section: any, sIdx: number) => (
              <div key={sIdx} className="space-y-6 pt-2 print:break-inside-avoid-page">
                
                {/* Section Header Divider */}
                <div className="flex items-center gap-4">
                  <div className="h-0.5 bg-slate-900 flex-1 print:bg-black"></div>
                  <h3 className="font-black text-base uppercase tracking-wider text-slate-900">Section {section.sectionLetter}</h3>
                  <div className="h-0.5 bg-slate-900 flex-1 print:bg-black"></div>
                </div>
                
                {/* Structural Instructions Bar */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 print:bg-transparent print:border-none print:p-0">
                  <p className="text-sm font-bold italic text-slate-800 print:text-black">
                    Instructions: {section.instruction}
                  </p>
                </div>

                {/* Questions Block Wrapper */}
                <div className="space-y-6 pl-2">
                  {section.questions.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="space-y-2 print:break-inside-avoid-page">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-base leading-relaxed text-slate-900 print:text-black flex-1">
                          <span className="font-bold mr-2">{qIdx + 1}.</span> {q.text}
                        </p>
                        <span className="text-sm font-bold text-slate-700 whitespace-nowrap print:text-black">
                          ({q.marks} Marks)
                        </span>
                      </div>

                      {/* Render MCQ Choices options cleanly inline if present */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 pl-6 pt-1">
                          {q.options.map((option: string, oIdx: number) => (
                            <div key={oIdx} className="flex items-center gap-3 text-sm text-slate-800 print:text-black">
                              <span className="h-5 w-5 rounded-full border border-slate-900 font-sans flex items-center justify-center text-xs font-bold shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          
          /* 🔑 TAB 2: PURE ANSWER KEY & MARKING SCHEME VIEW */
          <div className="p-12 sm:p-16 max-w-4xl mx-auto space-y-8 font-sans text-slate-900 print:p-0 print:max-w-full">
            <div className="text-center space-y-2 border-b-4 border-slate-900 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900">Answer Key & Marking Scheme</h2>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wide">Subject: {paper.subject} | Class: {paper.className}</p>
            </div>

            <div className="space-y-6">
              {paper.answerKey.map((ans: any, aIdx: number) => (
                <div key={aIdx} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl print:bg-transparent print:border-none print:p-0 print:break-inside-avoid-page">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-black text-sm text-slate-900">Question {ans.questionNumber}:</span>
                  </div>
                  <p className="text-slate-800 print:text-black text-sm leading-relaxed pl-1">
                    {ans.answerText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LOCALHOST FOOTERS AND COMPONENT BRANDING REMOVED COMPLETELY FOR PURE WHITE-LABEL SHEETS */}
    </div>
  );
}